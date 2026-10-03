const express = require("express");
const multer = require("multer");
const hasher = require("../services/hasher");
const blockchainService = require("../services/blockchainService");
const { ethers } = require("ethers");

const router = express.Router();
// Multer in-memory storage (privacy-preserving, no files saved on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

/**
 * POST /api/artifacts/register
 * Genesis "Birth Certificate" registration
 */
router.post("/register", upload.single("file"), async (req, res) => {
  try {
    let fileBuffer;
    let fileName = "text-artifact";

    if (req.file) {
      fileBuffer = req.file.buffer;
      fileName = req.file.originalname;
    } else if (req.body.content) {
      fileBuffer = Buffer.from(req.body.content, "utf8");
      fileName = req.body.title || "raw-text-prompt";
    } else {
      return res.status(400).json({ error: "Missing file or text content to register" });
    }

    const {
      aiModel = "Custom Generative Model",
      applicationName = "Direct Registration",
      creator = "",
      isOracleAttested = "false",
      secretPrompt = "",
      userSalt = ""
    } = req.body;

    // 1. Compute exact cryptographic hash & perceptual hash
    const exactHash = hasher.computeExactFileHash(fileBuffer);
    const perceptualHash = hasher.computePerceptualHash(fileBuffer);

    // 2. Compute privacy-preserving prompt commitment (if prompt provided)
    let promptCommitment = ethers.ZeroHash;
    let generatedSalt = null;
    if (secretPrompt && secretPrompt.trim() !== "") {
      const pc = hasher.computePromptCommitment(secretPrompt, userSalt);
      promptCommitment = pc.commitment;
      generatedSalt = pc.salt;
    }

    // 3. Register on blockchain
    const result = await blockchainService.registerGenesis({
      fileHash: exactHash.bytes32,
      perceptualHash,
      promptCommitment,
      aiModel,
      applicationName,
      metadataURI: JSON.stringify({ fileName, fileSize: fileBuffer.length }),
      isOracleAttested: isOracleAttested === "true" || isOracleAttested === true,
      creatorAddress: creator
    });

    res.json({
      success: true,
      message: "Genesis Artifact successfully registered on ModelLedger",
      fileHash: exactHash.bytes32,
      sha256Hex: exactHash.hex,
      perceptualHash,
      promptCommitment,
      salt: generatedSalt,
      receipt: result
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/artifacts/transform
 * Chain of Custody downstream transformation
 */
router.post("/transform", upload.single("file"), async (req, res) => {
  try {
    let fileBuffer;
    if (req.file) {
      fileBuffer = req.file.buffer;
    } else if (req.body.content) {
      fileBuffer = Buffer.from(req.body.content, "utf8");
    } else {
      return res.status(400).json({ error: "Missing modified file or content" });
    }

    const {
      parentHash,
      actionType = "AI_UPSCALE",
      applicationName = "Post-Processing Tool",
      metadata = ""
    } = req.body;

    if (!parentHash) {
      return res.status(400).json({ error: "Missing parentHash for transformation chain" });
    }

    const exactHash = hasher.computeExactFileHash(fileBuffer);
    const perceptualHash = hasher.computePerceptualHash(fileBuffer);

    const result = await blockchainService.logTransformation({
      newHash: exactHash.bytes32,
      parentHash,
      perceptualHash,
      actionType,
      applicationName,
      metadataURI: metadata || JSON.stringify({ fileSize: fileBuffer.length })
    });

    res.json({
      success: true,
      message: `Transformation '${actionType}' appended to provenance chain`,
      newHash: exactHash.bytes32,
      parentHash,
      receipt: result
    });
  } catch (err) {
    console.error("Transform error:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/artifacts/verify
 * Public verification & tamper audit
 */
router.post("/verify", upload.single("file"), async (req, res) => {
  try {
    let fileBuffer;
    if (req.file) {
      fileBuffer = req.file.buffer;
    } else if (req.body.content) {
      fileBuffer = Buffer.from(req.body.content, "utf8");
    } else if (req.body.hash) {
      // Direct hash audit
      const verification = await blockchainService.verifyArtifact(req.body.hash);
      return res.json({
        fileHash: req.body.hash,
        ...verification
      });
    } else {
      return res.status(400).json({ error: "Upload a file or provide a cryptographic hash to audit" });
    }

    const exactHash = hasher.computeExactFileHash(fileBuffer);
    const perceptualHash = hasher.computePerceptualHash(fileBuffer);

    const verification = await blockchainService.verifyArtifact(exactHash.bytes32);

    res.json({
      fileHash: exactHash.bytes32,
      sha256Hex: exactHash.hex,
      perceptualHash,
      fileSize: fileBuffer.length,
      ...verification
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/artifacts/verify-prompt
 * Privacy-preserving prompt reveal & check
 */
router.post("/verify-prompt", async (req, res) => {
  try {
    const { fileHash, revealedPrompt, salt } = req.body;
    if (!fileHash || !revealedPrompt || !salt) {
      return res.status(400).json({ error: "fileHash, revealedPrompt, and salt are required" });
    }

    const calculatedCommitment = ethers.solidityPackedKeccak256(
      ["string", "bytes32"],
      [revealedPrompt.trim(), salt]
    );

    const verification = await blockchainService.verifyArtifact(fileHash);
    if (!verification.isAuthentic) {
      return res.status(404).json({ error: "Artifact not found on ledger" });
    }

    const storedCommitment = verification.record.promptCommitment;
    const isMatch = storedCommitment.toLowerCase() === calculatedCommitment.toLowerCase();

    res.json({
      isMatch,
      storedCommitment,
      calculatedCommitment,
      message: isMatch
        ? "✅ Cryptographic proof confirmed: Revealed prompt matches the immutable genesis commitment!"
        : "❌ Mismatch: Prompt or salt does not match the on-chain commitment."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/artifacts/dispute
 * Flag fraudulent or tampered claim
 */
router.post("/dispute", async (req, res) => {
  try {
    const { fileHash, reason, disputer } = req.body;
    if (!fileHash || !reason) {
      return res.status(400).json({ error: "fileHash and reason are required" });
    }

    const result = await blockchainService.flagDispute(fileHash, reason, disputer);
    res.json({
      success: true,
      message: "Artifact flagged as DISPUTED on ModelLedger",
      fileHash,
      result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/artifacts/stats
 * Total artifacts & system metrics
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = await blockchainService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

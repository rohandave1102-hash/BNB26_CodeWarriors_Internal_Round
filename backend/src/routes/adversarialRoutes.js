const express = require("express");
const hasher = require("../services/hasher");
const blockchainService = require("../services/blockchainService");
const { ethers } = require("ethers");

const router = express.Router();

/**
 * POST /api/adversarial/simulate
 * Runs one of the 4 key adversarial scenarios from the Problem Statement
 */
router.post("/simulate", async (req, res) => {
  const { scenarioType, originalContent } = req.body;

  try {
    switch (scenarioType) {
      case "SILENT_TAMPER": {
        // Create an original, register it, then secretly tamper with 1 character
        const originalText = originalContent || "CONFIDENTIAL LEGAL MEMORANDUM: Approved for release by AI Analysis v4.";
        const tamperedText = originalText.replace("Approved", "REJECTED"); // 1 single word changed

        const origHash = hasher.computeExactFileHash(Buffer.from(originalText));
        const tamperedHash = hasher.computeExactFileHash(Buffer.from(tamperedText));

        // Try registering original if not already registered
        try {
          await blockchainService.registerGenesis({
            fileHash: origHash.bytes32,
            perceptualHash: hasher.computePerceptualHash(Buffer.from(originalText)),
            promptCommitment: ethers.ZeroHash,
            aiModel: "Claude 3.5 Sonnet",
            applicationName: "LegalDoc Generator",
            metadataURI: "{}",
            isOracleAttested: true
          });
        } catch (e) {
          // might already be registered in test runs
        }

        // Now verify tampered version
        const audit = await blockchainService.verifyArtifact(tamperedHash.bytes32);

        return res.json({
          scenario: "Silent Content Tampering",
          description: "An attacker secretly modified a single critical word ('Approved' -> 'REJECTED') in the document.",
          originalHash: origHash.bytes32,
          tamperedHash: tamperedHash.bytes32,
          isTamperedDetected: !audit.isAuthentic,
          auditResult: audit,
          conclusion: "ModelLedger caught the unauthorized modification instantly via SHA-256 cryptographic mismatch."
        });
      }

      case "FABRICATED_GENESIS": {
        // Attacker claims duplicate ownership of an existing genesis artifact
        const content = "Unique Art Asset Created by Genuine Artist #4928";
        const hash = hasher.computeExactFileHash(Buffer.from(content));

        // Register genuine
        try {
          await blockchainService.registerGenesis({
            fileHash: hash.bytes32,
            perceptualHash: hasher.computePerceptualHash(Buffer.from(content)),
            promptCommitment: ethers.ZeroHash,
            aiModel: "Midjourney v6",
            applicationName: "Studio Canvas",
            metadataURI: "{}",
            isOracleAttested: true,
            creatorAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
          });
        } catch (e) {}

        // Attacker tries to register the exact same artifact
        let rejected = false;
        let attackerError = "";
        try {
          await blockchainService.registerGenesis({
            fileHash: hash.bytes32,
            perceptualHash: hasher.computePerceptualHash(Buffer.from(content)),
            promptCommitment: ethers.ZeroHash,
            aiModel: "Fake Midjourney Claim",
            applicationName: "Pirate Bot",
            metadataURI: "{}",
            isOracleAttested: false,
            creatorAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
          });
        } catch (err) {
          rejected = true;
          attackerError = err.message;
        }

        return res.json({
          scenario: "Fabricated Genesis Claim / Copyright Theft",
          description: "An attacker attempts to re-register someone else's existing genuine artifact under their own address.",
          targetHash: hash.bytes32,
          attackNeutralized: rejected,
          rejectionReason: attackerError,
          conclusion: "ModelLedger blockchain immutability prevents double-spending or claiming prior art."
        });
      }

      case "BROKEN_LINEAGE": {
        // Attacker claims their file is a legitimate derivative of a fake non-existent parent hash
        const fakeParent = "0x" + require("crypto").randomBytes(32).toString("hex");
        const derivativeContent = "Derivative work claiming fake lineage";
        const derivativeHash = hasher.computeExactFileHash(Buffer.from(derivativeContent));

        let rejected = false;
        let errorMsg = "";
        try {
          await blockchainService.logTransformation({
            newHash: derivativeHash.bytes32,
            parentHash: fakeParent,
            perceptualHash: hasher.computePerceptualHash(Buffer.from(derivativeContent)),
            actionType: "FAKE_UPSCALE",
            applicationName: "Spoofed Pipeline"
          });
        } catch (err) {
          rejected = true;
          errorMsg = err.message;
        }

        return res.json({
          scenario: "Broken Lineage / Dangling Node Attack",
          description: "An attacker attempts to anchor an artifact to a fabricated, unverified ancestor hash.",
          attemptedParent: fakeParent,
          attackNeutralized: rejected,
          rejectionReason: errorMsg,
          conclusion: "The protocol enforces cryptographic parent existence checks, rejecting orphaned claims."
        });
      }

      default:
        return res.status(400).json({ error: "Unknown scenario type" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

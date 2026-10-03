const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ModelLedger Smart Contract Test Suite", function () {
  let modelLedger;
  let owner, oracle, creator, attacker;

  const mockFileHash = ethers.keccak256(ethers.toUtf8Bytes("genesis_image_bytes"));
  const mockPerceptualHash = ethers.keccak256(ethers.toUtf8Bytes("phash_10101010"));
  const secretPrompt = "Cyberpunk neon metropolis with flying vehicles";
  const salt = ethers.keccak256(ethers.toUtf8Bytes("secret_creator_salt_123"));
  const promptCommitment = ethers.solidityPackedKeccak256(["string", "bytes32"], [secretPrompt, salt]);

  beforeEach(async function () {
    [owner, oracle, creator, attacker] = await ethers.getSigners();

    const ModelLedger = await ethers.getContractFactory("ModelLedger");
    modelLedger = await ModelLedger.deploy();
    await modelLedger.waitForDeployment();

    // Authorize oracle
    await modelLedger.setOracleStatus(oracle.address, true);
  });

  describe("1. Genesis Registration ('Birth Certificate')", function () {
    it("Should register a self-asserted Genesis artifact when called by regular creator", async function () {
      const tx = await modelLedger.connect(creator).registerGenesis(
        mockFileHash,
        mockPerceptualHash,
        promptCommitment,
        "Midjourney v6",
        "Discord Bot",
        "ipfs://genesis_metadata",
        false
      );
      await tx.wait();

      const record = await modelLedger.records(mockFileHash);
      expect(record.fileHash).to.equal(mockFileHash);
      expect(record.creator).to.equal(creator.address);
      expect(record.aiModel).to.equal("Midjourney v6");
      expect(record.trustTier).to.equal(1); // 1 = SELF_ASSERTED
      expect(record.parentHash).to.equal(ethers.ZeroHash);
    });

    it("Should register as VERIFIED_TRUSTED (Tier 2) when registered via Authorized Oracle", async function () {
      const oracleFileHash = ethers.keccak256(ethers.toUtf8Bytes("dalle3_authentic_image"));
      
      const tx = await modelLedger.connect(oracle).registerGenesis(
        oracleFileHash,
        mockPerceptualHash,
        promptCommitment,
        "DALL-E 3",
        "OpenAI API Gateway",
        "ipfs://dalle3_metadata",
        true
      );
      await tx.wait();

      const record = await modelLedger.records(oracleFileHash);
      expect(record.trustTier).to.equal(2); // 2 = VERIFIED_TRUSTED
      expect(record.issuerOracle).to.equal(oracle.address);
    });

    it("Adversarial: Should REJECT duplicate registration of the exact same hash", async function () {
      await modelLedger.connect(creator).registerGenesis(
        mockFileHash,
        mockPerceptualHash,
        promptCommitment,
        "Midjourney v6",
        "App",
        "uri",
        false
      );

      await expect(
        modelLedger.connect(attacker).registerGenesis(
          mockFileHash,
          mockPerceptualHash,
          promptCommitment,
          "Stolen Claim",
          "Attacker App",
          "uri",
          false
        )
      ).to.be.revertedWith("ModelLedger: Artifact hash already registered");
    });
  });

  describe("2. Multi-System Transformation Logging (Chain of Custody)", function () {
    const transformedHash1 = ethers.keccak256(ethers.toUtf8Bytes("upscaled_image_bytes"));
    const transformedHash2 = ethers.keccak256(ethers.toUtf8Bytes("watermarked_image_bytes"));

    beforeEach(async function () {
      // Register Genesis first
      await modelLedger.connect(creator).registerGenesis(
        mockFileHash,
        mockPerceptualHash,
        promptCommitment,
        "Midjourney v6",
        "Discord",
        "uri",
        false
      );
    });

    it("Should successfully log downstream transformation linked to Genesis parent", async function () {
      const tx = await modelLedger.connect(creator).logTransformation(
        transformedHash1,
        mockFileHash,
        mockPerceptualHash,
        "AI_UPSCALE",
        "Topaz Gigapixel AI",
        "ipfs://upscale_params"
      );
      await tx.wait();

      const childRecord = await modelLedger.records(transformedHash1);
      expect(childRecord.parentHash).to.equal(mockFileHash);
      expect(childRecord.actionType).to.equal("AI_UPSCALE");
      expect(childRecord.applicationName).to.equal("Topaz Gigapixel AI");
    });

    it("Adversarial: Should REJECT transformation claiming a non-existent parent hash", async function () {
      const fakeParentHash = ethers.keccak256(ethers.toUtf8Bytes("non_existent_fake_hash"));

      await expect(
        modelLedger.connect(creator).logTransformation(
          transformedHash1,
          fakeParentHash,
          mockPerceptualHash,
          "EDIT",
          "Tool",
          "uri"
        )
      ).to.be.revertedWith("ModelLedger: Parent artifact not registered");
    });

    it("Should trace complete multi-hop lineage chain (Genesis -> Upscale -> Watermark)", async function () {
      // Step 1: Upscale
      await modelLedger.connect(creator).logTransformation(
        transformedHash1,
        mockFileHash,
        mockPerceptualHash,
        "AI_UPSCALE",
        "Topaz Gigapixel",
        "uri1"
      );

      // Step 2: Watermark
      await modelLedger.connect(creator).logTransformation(
        transformedHash2,
        transformedHash1,
        mockPerceptualHash,
        "WATERMARK",
        "Provenance Signer v1",
        "uri2"
      );

      // Verify Lineage of the latest artifact
      const [exists, currentRecord, lineageChain] = await modelLedger.verifyLineage(transformedHash2);
      expect(exists).to.be.true;
      expect(lineageChain.length).to.equal(3);
      expect(lineageChain[0].fileHash).to.equal(mockFileHash);        // Genesis
      expect(lineageChain[1].fileHash).to.equal(transformedHash1);    // Upscaled
      expect(lineageChain[2].fileHash).to.equal(transformedHash2);    // Final Watermarked
    });
  });

  describe("3. Privacy-Preserving Prompt Commitment", function () {
    it("Should verify genuine prompt + salt matches commitment without on-chain plaintext", async function () {
      await modelLedger.connect(creator).registerGenesis(
        mockFileHash,
        mockPerceptualHash,
        promptCommitment,
        "Claude 3.5 Sonnet",
        "Anthropic App",
        "uri",
        false
      );

      const isValid = await modelLedger.verifyPromptCommitment(mockFileHash, secretPrompt, salt);
      expect(isValid).to.be.true;

      const isFakeValid = await modelLedger.verifyPromptCommitment(mockFileHash, "A fake modified prompt", salt);
      expect(isFakeValid).to.be.false;
    });
  });

  describe("4. Tamper Detection & Dispute Logging", function () {
    it("Should flag an artifact as DISPUTED when challenged", async function () {
      await modelLedger.connect(creator).registerGenesis(
        mockFileHash,
        mockPerceptualHash,
        promptCommitment,
        "Midjourney v6",
        "App",
        "uri",
        false
      );

      await modelLedger.connect(attacker).flagDispute(mockFileHash, "Copyright infringement & stolen prompt claim");
      
      const record = await modelLedger.records(mockFileHash);
      expect(record.trustTier).to.equal(3); // 3 = DISPUTED

      const disputes = await modelLedger.getDisputes(mockFileHash);
      expect(disputes.length).to.equal(1);
      expect(disputes[0].reason).to.equal("Copyright infringement & stolen prompt claim");
    });
  });
});

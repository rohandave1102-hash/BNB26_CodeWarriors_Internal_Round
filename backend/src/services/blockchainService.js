const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

class BlockchainService {
  constructor() {
    this.isContractConnected = false;
    this.contract = null;
    this.signer = null;
    this.provider = null;
    this.contractAddress = null;

    // In-memory fallback ledger (for offline demo mode if node is not running)
    this.fallbackRecords = new Map();
    this.fallbackLineage = new Map();
    this.fallbackDisputes = new Map();

    this.init();
  }

  async checkPortOpen(port = 8545, host = "127.0.0.1") {
    const net = require("net");
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(800);
      socket.on("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });
      socket.on("error", () => {
        socket.destroy();
        resolve(false);
      });
      socket.connect(port, host);
    });
  }

  async init() {
    const configPath = path.join(__dirname, "../config/contractConfig.json");
    if (!fs.existsSync(configPath)) {
      console.log("ℹ️  No contractConfig.json found. Operating in Standalone Cryptographic Mode.");
      return;
    }

    try {
      const isNodeRunning = await this.checkPortOpen(8545, "127.0.0.1");
      if (!isNodeRunning) {
        console.log("ℹ️  Local EVM node (port 8545) is not running.");
        console.log("   👉 To enable on-chain EVM: run 'npx hardhat node' in /blockchain");
        console.log("   👉 Operating seamlessly in Standalone Cryptographic Mode.");
        this.isContractConnected = false;
        return;
      }

      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      this.contractAddress = config.contractAddress;

      const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
      this.provider = new ethers.JsonRpcProvider(rpcUrl, undefined, { staticNetwork: true });

      // Use default account 0 from local node or private key
      const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
      this.signer = new ethers.Wallet(privateKey, this.provider);

      this.contract = new ethers.Contract(this.contractAddress, config.abi, this.signer);
      this.isContractConnected = true;
      console.log(`🔗 Connected on-chain to ModelLedger at ${this.contractAddress}`);
    } catch (err) {
      console.log("ℹ️  Operating in Standalone Cryptographic Mode:", err.message);
      this.isContractConnected = false;
    }
  }

  async registerGenesis({
    fileHash,
    perceptualHash,
    promptCommitment,
    aiModel,
    applicationName,
    metadataURI,
    isOracleAttested,
    creatorAddress
  }) {
    if (this.isContractConnected) {
      try {
        const tx = await this.contract.registerGenesis(
          fileHash,
          perceptualHash,
          promptCommitment,
          aiModel,
          applicationName,
          metadataURI || "",
          Boolean(isOracleAttested)
        );
        const receipt = await tx.wait();
        return {
          success: true,
          mode: "ON_CHAIN",
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          fileHash,
          trustTier: isOracleAttested ? "VERIFIED_TRUSTED" : "SELF_ASSERTED"
        };
      } catch (err) {
        console.error("Contract call failed:", err);
        throw new Error(err.reason || err.message);
      }
    }

    // Standalone Cryptographic Ledger Fallback
    if (this.fallbackRecords.has(fileHash)) {
      throw new Error("ModelLedger: Artifact hash already registered");
    }

    const record = {
      fileHash,
      perceptualHash,
      promptCommitment,
      parentHash: ethers.ZeroHash,
      creator: creatorAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      issuerOracle: isOracleAttested ? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" : ethers.ZeroAddress,
      trustTier: isOracleAttested ? 2 : 1, // 1: SELF_ASSERTED, 2: VERIFIED_TRUSTED
      aiModel,
      actionType: "GENESIS",
      applicationName,
      metadataURI: metadataURI || "",
      timestamp: Math.floor(Date.now() / 1000),
      blockNumber: this.fallbackRecords.size + 1
    };

    this.fallbackRecords.set(fileHash, record);
    this.fallbackLineage.set(fileHash, [record]);

    return {
      success: true,
      mode: "STANDALONE_CRYPTOGRAPHIC",
      transactionHash: "0x" + require("crypto").randomBytes(32).toString("hex"),
      blockNumber: record.blockNumber,
      fileHash,
      trustTier: isOracleAttested ? "VERIFIED_TRUSTED" : "SELF_ASSERTED"
    };
  }

  async logTransformation({
    newHash,
    parentHash,
    perceptualHash,
    actionType,
    applicationName,
    metadataURI
  }) {
    if (this.isContractConnected) {
      try {
        const tx = await this.contract.logTransformation(
          newHash,
          parentHash,
          perceptualHash,
          actionType,
          applicationName,
          metadataURI || ""
        );
        const receipt = await tx.wait();
        return {
          success: true,
          mode: "ON_CHAIN",
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          newHash,
          parentHash
        };
      } catch (err) {
        console.error("Contract call failed:", err);
        throw new Error(err.reason || err.message);
      }
    }

    // Fallback mode
    if (!this.fallbackRecords.has(parentHash)) {
      throw new Error("ModelLedger: Parent artifact not registered");
    }
    if (this.fallbackRecords.has(newHash)) {
      throw new Error("ModelLedger: Transformed hash already exists");
    }

    const parentRecord = this.fallbackRecords.get(parentHash);
    const newRecord = {
      fileHash: newHash,
      perceptualHash,
      promptCommitment: parentRecord.promptCommitment,
      parentHash: parentHash,
      creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      issuerOracle: parentRecord.issuerOracle,
      trustTier: parentRecord.trustTier,
      aiModel: parentRecord.aiModel,
      actionType,
      applicationName,
      metadataURI: metadataURI || "",
      timestamp: Math.floor(Date.now() / 1000),
      blockNumber: this.fallbackRecords.size + 1
    };

    this.fallbackRecords.set(newHash, newRecord);

    const parentLineage = this.fallbackLineage.get(parentHash) || [parentRecord];
    this.fallbackLineage.set(newHash, [...parentLineage, newRecord]);

    return {
      success: true,
      mode: "STANDALONE_CRYPTOGRAPHIC",
      transactionHash: "0x" + require("crypto").randomBytes(32).toString("hex"),
      blockNumber: newRecord.blockNumber,
      newHash,
      parentHash
    };
  }

  async verifyArtifact(fileHash) {
    if (this.isContractConnected) {
      try {
        const [exists, currentRecord, lineageChain] = await this.contract.verifyLineage(fileHash);
        if (!exists) {
          return {
            isAuthentic: false,
            status: "TAMPERED_OR_UNREGISTERED",
            message: "Cryptographic hash does not match any registered artifact or authorized chain."
          };
        }

        const tierNames = ["UNVERIFIED", "SELF_ASSERTED", "VERIFIED_TRUSTED", "DISPUTED"];
        return {
          isAuthentic: true,
          status: tierNames[Number(currentRecord.trustTier)] || "VERIFIED_TRUSTED",
          record: this._formatRecord(currentRecord),
          lineage: lineageChain.map(r => this._formatRecord(r))
        };
      } catch (err) {
        console.error("verifyLineage failed:", err);
      }
    }

    // Fallback mode
    if (!this.fallbackRecords.has(fileHash)) {
      return {
        isAuthentic: false,
        status: "TAMPERED_OR_UNREGISTERED",
        message: "Cryptographic hash does not match any registered artifact or authorized chain."
      };
    }

    const tierNames = ["UNVERIFIED", "SELF_ASSERTED", "VERIFIED_TRUSTED", "DISPUTED"];
    const record = this.fallbackRecords.get(fileHash);
    const lineage = this.fallbackLineage.get(fileHash) || [record];

    return {
      isAuthentic: true,
      status: tierNames[record.trustTier],
      record: this._formatRecord(record),
      lineage: lineage.map(r => this._formatRecord(r))
    };
  }

  async flagDispute(fileHash, reason, disputer) {
    if (this.isContractConnected) {
      const tx = await this.contract.flagDispute(fileHash, reason);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    }

    if (!this.fallbackRecords.has(fileHash)) {
      throw new Error("ModelLedger: Artifact does not exist");
    }
    const record = this.fallbackRecords.get(fileHash);
    record.trustTier = 3; // DISPUTED
    this.fallbackRecords.set(fileHash, record);

    const disputeList = this.fallbackDisputes.get(fileHash) || [];
    disputeList.push({
      fileHash,
      reason,
      disputer: disputer || "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      timestamp: Math.floor(Date.now() / 1000)
    });
    this.fallbackDisputes.set(fileHash, disputeList);

    return { success: true };
  }

  async getStats() {
    let total = 0;
    if (this.isContractConnected) {
      try {
        const count = await this.contract.getTotalArtifacts();
        total = Number(count);
      } catch (e) {
        total = this.fallbackRecords.size;
      }
    } else {
      total = this.fallbackRecords.size;
    }

    return {
      totalArtifacts: total,
      isContractConnected: this.isContractConnected,
      contractAddress: this.contractAddress || "None (Operating Standalone Node)"
    };
  }

  _formatRecord(r) {
    const tierNames = ["UNVERIFIED", "SELF_ASSERTED", "VERIFIED_TRUSTED", "DISPUTED"];
    return {
      fileHash: r.fileHash,
      perceptualHash: r.perceptualHash,
      promptCommitment: r.promptCommitment,
      parentHash: r.parentHash,
      creator: r.creator,
      issuerOracle: r.issuerOracle,
      trustTier: tierNames[Number(r.trustTier)] || "VERIFIED_TRUSTED",
      aiModel: r.aiModel,
      actionType: r.actionType,
      applicationName: r.applicationName,
      metadataURI: r.metadataURI,
      timestamp: Number(r.timestamp),
      blockNumber: Number(r.blockNumber)
    };
  }
}

module.exports = new BlockchainService();

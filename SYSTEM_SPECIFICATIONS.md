# 🛡️ ModelLedger: Complete System Architecture & Specifications

> **BitnBuild 2026 — CodeWarriors Internal Round**  
> **Project Name:** ModelLedger (AI Provenance & Multi-System Trust Protocol)

---

## 📌 1. Project Overview & Core Mission

**ModelLedger** is a decentralized, cryptographic provenance system designed to track the lifecycle of AI-generated content (images, PDFs, documents, audio). It establishes immutable proof of origin, documents multi-step transformations (upscaling, re-encoding, editing), and detects tampered or fraudulent claims without exposing private source files or proprietary prompts.

---

## 🏗️ 2. High-Level Architecture

The system is organized into three decoupled layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite)                    │
│   - Verify & Audit Dropzone (3-Tier Trust Badges)           │
│   - Genesis "Birth Certificate" Minter                      │
│   - Multi-System Transformation Logger                      │
│   - Interactive DAG Blockchain Visual Timeline              │
│   - Adversarial Sandbox Attack Simulator                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST API (Port 5000)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               NODE.JS / EXPRESS.JS BACKEND                  │
│   - Memory Buffer Ingestion (Zero Disk Leaks)               │
│   - Cryptographic Engine (SHA-256 + Perceptual Hashing)     │
│   - Zero-Knowledge Salted Prompt Commitments                │
│   - Ethers.js Smart Contract Relayer + Fallback State       │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON-RPC (Port 8545 / EVM)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             SOLIDITY SMART CONTRACT (EVM)                   │
│   - ModelLedger.sol (Solidity 0.8.24)                       │
│   - 3-Tier Trust Classification (Verified, Self-Asserted)   │
│   - Immutable Append-Only Linked Blocks (parentHash -> hash)│
│   - O(N) On-Chain Reverse Lineage Traversal                 │
│   - Tamper & Dispute Registry                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ⛓️ 3. Blockchain Layer Specifications (`blockchain/`)

### 3.1 Technology Stack & Environment
* **Language:** Solidity `^0.8.24` (EVM target: Paris, optimizer: 200 runs)
* **Framework:** Hardhat `^2.22.10` with `@nomicfoundation/hardhat-toolbox` and `ethers.js v6`
* **Local Development Network:** Hardhat Node (`chainId: 31337`, JSON-RPC at `http://127.0.0.1:8545`)
* **Testnet Portability:** Compatible with BNB Smart Chain Testnet (BSC Testnet), Polygon Amoy, or Ethereum Sepolia without contract modifications.

### 3.2 State Variables & Storage Layout (`ModelLedger.sol`)
```solidity
// Enums
enum TrustTier {
    UNVERIFIED,       // 0: Unknown / Unregistered
    SELF_ASSERTED,    // 1: User-claimed without platform oracle attestation
    VERIFIED_TRUSTED, // 2: Attested by authorized platform oracle / verified chain
    DISPUTED          // 3: Flagged for fraudulent claim or tampered integrity
}

// Core Structs
struct ArtifactRecord {
    bytes32 fileHash;          // SHA-256 exact cryptographic fingerprint (32 bytes)
    bytes32 perceptualHash;    // Visual feature hash (format conversion tolerance)
    bytes32 promptCommitment;  // keccak256(abi.encodePacked(secretPrompt, salt))
    bytes32 parentHash;        // 0x0 for Genesis root; points to ancestor for transformations
    address creator;           // Registrar wallet address
    address issuerOracle;      // Authorized platform oracle (or address(0))
    TrustTier trustTier;       // Trust level (0, 1, 2, or 3)
    string aiModel;            // e.g. "DALL-E 3", "Midjourney v6", "Claude 3.5"
    string actionType;         // "GENESIS", "AI_UPSCALE", "RE_ENCODE", "INPAINT"
    string applicationName;    // e.g. "Topaz Gigapixel AI", "Photoshop Generative Fill"
    string metadataURI;        // Decentralized metadata reference (e.g. IPFS / JSON string)
    uint256 timestamp;         // Proof of existence at block.timestamp
    uint256 blockNumber;       // EVM block number
}

struct DisputeRecord {
    bytes32 fileHash;          // Target artifact hash under dispute
    address disputer;          // Challenger address
    string reason;             // Description of fraud / plagiarism claim
    uint256 timestamp;         // Block timestamp of dispute logging
}

// Storage Mappings
mapping(bytes32 => ArtifactRecord) public records;                 // fileHash => record
mapping(bytes32 => bytes32[]) private transformations;             // parentHash => childHashes[]
mapping(bytes32 => DisputeRecord[]) private disputes;              // fileHash => disputes[]
mapping(address => bool) public authorizedOracles;                 // oracleAddress => isAuthorized
bytes32[] public allArtifactHashes;                                // Global index of all registered hashes
address public owner;                                              // Contract owner (admin)
```

### 3.3 Core Smart Contract Functions & Signatures

#### `registerGenesis`
```solidity
function registerGenesis(
    bytes32 fileHash,
    bytes32 perceptualHash,
    bytes32 promptCommitment,
    string calldata aiModel,
    string calldata applicationName,
    string calldata metadataURI,
    bool isOracleAttested
) external returns (bool);
```
* **Validation:** Requires `fileHash != bytes32(0)` and `records[fileHash].timestamp == 0` (prevents duplicate minting).
* **Trust Level Assignment:** If `isOracleAttested == true` and `authorizedOracles[msg.sender] == true`, sets `trustTier = TrustTier.VERIFIED_TRUSTED`. Otherwise sets `trustTier = TrustTier.SELF_ASSERTED`.
* **Linkage:** Sets `parentHash = bytes32(0)` to designate this as a Root Genesis block.
* **Emits:** `GenesisRegistered(fileHash, creator, aiModel, trustTier, timestamp)`.

#### `logTransformation`
```solidity
function logTransformation(
    bytes32 newHash,
    bytes32 parentHash,
    bytes32 perceptualHash,
    string calldata actionType,
    string calldata applicationName,
    string calldata metadataURI
) external returns (bool);
```
* **Validation:** Requires `parentHash` exists (`records[parentHash].timestamp > 0`), `newHash` is unique, and parent is not `DISPUTED`.
* **DAG Linking:** Appends `newHash` to `transformations[parentHash]` array.
* **Inheritance:** Automatically inherits the root `promptCommitment` and parent `trustTier`.
* **Emits:** `TransformationLogged(newHash, parentHash, actionType, applicationName, tier, timestamp)`.

#### `verifyLineage`
```solidity
function verifyLineage(bytes32 fileHash) external view returns (
    bool exists,
    ArtifactRecord memory currentRecord,
    ArtifactRecord[] memory lineageChain
);
```
* **Traversal:** Zero-gas `view` function. Follows the `parentHash` chain backwards up to depth 20 until Genesis root (`0x0`), and returns the array chronologically `[Genesis, Step 1, Step 2, ..., Current]`.

#### `verifyPromptCommitment`
```solidity
function verifyPromptCommitment(
    bytes32 fileHash,
    string calldata revealedPrompt,
    bytes32 salt
) external view returns (bool);
```
* **Privacy Verification:** Computes `keccak256(abi.encodePacked(revealedPrompt, salt))` on the fly and compares against `records[fileHash].promptCommitment`.

#### `flagDispute`
```solidity
function flagDispute(bytes32 fileHash, string calldata reason) external;
```
* Marks artifact `trustTier = TrustTier.DISPUTED` and records challenger statement.

### 3.4 Future Blockchain Extension Points for Team Members:
* **ERC-721 / ERC-1155 Soulbound Tokens (SBT):** Wrap each verified Genesis block into an untransferable NFT mint for the creator.
* **Multi-Signature Model Oracles:** Allow multiple trusted AI providers (e.g. OpenAI + Anthropic) to vote on authenticity.
* **Merkle Tree Batching:** Batch thousands of file hashes into a single Merkle Root on-chain to minimize transaction costs.

---

## ⚙️ 4. Backend Layer Specifications (`backend/`)

### 4.1 Technology Stack & Structure
* **Runtime:** Node.js v18+ with Express.js (`server.js`) on port `5000`
* **File Uploads:** `multer.memoryStorage()` (files are processed strictly in RAM as `Buffer` objects and garbage-collected; no disk writes)
* **Web3 Library:** `ethers.js v6`
* **Configuration:** Auto-loads address and ABI from `src/config/contractConfig.json` (exported automatically on `npx hardhat run scripts/deploy.js`)

### 4.2 Cryptographic Pipeline (`services/hasher.js`)
1. **SHA-256 Exact Fingerprinting:**
   ```js
   const sha256 = crypto.createHash("sha256").update(fileBuffer).digest("hex");
   const bytes32 = "0x" + sha256; // Format as 32-byte hex for Solidity
   ```
2. **Perceptual Sampling (pHash Simulation):**
   * Divides file buffer into 64 uniform structural slices and computes a digest. This enables detecting format conversions (e.g. PNG to WebP) where visual contents match despite byte-level changes.
3. **Zero-Knowledge Salted Prompt Commitments:**
   ```js
   const salt = crypto.randomBytes(32).toString("hex");
   const commitment = ethers.solidityPackedKeccak256(["string", "bytes32"], [prompt, "0x" + salt]);
   ```

### 4.3 Blockchain Relayer & Failover (`services/blockchainService.js`)
* **Dual Operation Mode:**
  * **On-Chain Mode:** Connects via `ethers.JsonRpcProvider` and `ethers.Wallet` to the EVM node. Signs transactions automatically.
  * **Standalone Fallback Mode:** If the EVM node is offline or during testing, it seamlessly fails over to an in-memory map storing identical structs and lineage traversal so frontend developers never get blocked.

### 4.4 Complete API Endpoint Specifications

#### 1. `POST /api/artifacts/register`
* **Description:** Ingests file/content, hashes it, and mints Genesis block.
* **Content-Type:** `multipart/form-data`
* **Body Parameters:**
  * `file`: Binary file (image, PDF, text, audio).
  * `aiModel`: String (e.g. "DALL-E 3", "Midjourney v6").
  * `applicationName`: String (e.g. "OpenAI API", "Discord Bot").
  * `creator`: String (Wallet address or identifier).
  * `isOracleAttested`: Boolean string ("true" / "false").
  * `secretPrompt`: Optional string (creator prompt to be salt-committed).
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "fileHash": "0xa7876d55...",
    "sha256Hex": "a7876d55...",
    "perceptualHash": "0x3f12...",
    "promptCommitment": "0x89ab...",
    "salt": "0x4e21...",
    "receipt": {
      "mode": "ON_CHAIN",
      "transactionHash": "0x51c2...",
      "blockNumber": 12,
      "trustTier": "VERIFIED_TRUSTED"
    }
  }
  ```

#### 2. `POST /api/artifacts/transform`
* **Description:** Appends a modified derivative to an existing parent block.
* **Content-Type:** `multipart/form-data`
* **Body Parameters:**
  * `file`: Binary file of the transformed asset.
  * `parentHash`: String `0x...` (hash of the ancestor artifact).
  * `actionType`: String (`AI_UPSCALE`, `RE_ENCODE`, `INPAINT_EDIT`, `WATERMARK`).
  * `applicationName`: String (e.g. "Topaz Gigapixel AI").
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "newHash": "0xdc4b...",
    "parentHash": "0xa787...",
    "receipt": {
      "transactionHash": "0x98f1...",
      "blockNumber": 13
    }
  }
  ```

#### 3. `POST /api/artifacts/verify`
* **Description:** Audits any file or hash against the on-chain ledger.
* **Content-Type:** `multipart/form-data` OR `application/json` (with `{ "hash": "0x..." }`)
* **Response (200 OK - Verified):**
  ```json
  {
    "isAuthentic": true,
    "status": "VERIFIED_TRUSTED",
    "fileHash": "0xdc4b...",
    "record": {
      "fileHash": "0xdc4b...",
      "parentHash": "0xa787...",
      "aiModel": "DALL-E 3",
      "actionType": "AI_UPSCALE",
      "applicationName": "Topaz Gigapixel AI",
      "timestamp": 1727967000,
      "blockNumber": 13
    },
    "lineage": [
      { "actionType": "GENESIS", "fileHash": "0xa787...", "applicationName": "OpenAI API" },
      { "actionType": "AI_UPSCALE", "fileHash": "0xdc4b...", "applicationName": "Topaz Gigapixel AI" }
    ]
  }
  ```
* **Response (200 OK - Tampered/Unregistered):**
  ```json
  {
    "isAuthentic": false,
    "status": "TAMPERED_OR_UNREGISTERED",
    "fileHash": "0x8ea4...",
    "message": "Cryptographic hash does not match any registered artifact or authorized chain."
  }
  ```

#### 4. `POST /api/artifacts/verify-prompt`
* **Description:** Verifies revealed secret prompt and salt against stored commitment.
* **Body:** `{ "fileHash": "0x...", "revealedPrompt": "...", "salt": "0x..." }`
* **Response:** `{ "isMatch": true, "storedCommitment": "0x...", "calculatedCommitment": "0x..." }`

#### 5. `POST /api/adversarial/simulate`
* **Description:** Executes live attack scenarios (`SILENT_TAMPER`, `FABRICATED_GENESIS`, `BROKEN_LINEAGE`).

#### 6. `GET /api/artifacts/stats`
* **Description:** Returns `{ "totalArtifacts": 5, "isContractConnected": true, "contractAddress": "0x..." }`.

### 4.5 Future Backend Extension Points for Team Members:
* **Persistent Database Sync:** Hook up Supabase, PostgreSQL (Prisma), or MongoDB to index blockchain events for millisecond search queries.
* **IPFS / Pinata Storage Service:** Add an IPFS upload step in `hasher.js` to store metadata bundles and preview thumbnails.
* **Webhook Notifier:** Trigger webhooks to external publishing platforms when an asset's provenance status is disputed or verified.

---

## 🎨 5. Frontend Layer Specifications (`frontend/`)

### Technology Stack:
* **Framework:** React 18 + Vite (`localhost:3000`)
* **Styling:** Custom Cyber-Defense Dark Design System (`Plus Jakarta Sans` & `JetBrains Mono`)
* **Icons:** `lucide-react`
* **API Client:** Native fetch proxying requests to `/api` $\to$ `http://localhost:5000`

### User Interface Modules:
1. **Verify & Audit (`components/VerifyAudit.jsx`):**
   * Drag-and-drop zone for any candidate artifact or direct hash search.
   * Visual trust badges:
     - 🟢 **Tier 1: Verified Trusted** (platform oracle verified + unbroken chain)
     - 🟡 **Tier 2: Self-Asserted** (unbroken chain, unverified platform oracle)
     - 🔴 **Tier 3: Tampered / Unverified Alert** (hash mismatch or unregistered content)
   * On-chain prompt reveal verification modal.
2. **Register Genesis (`components/RegisterGenesis.jsx`):**
   * Upload original AI asset, select model, specify pipeline.
   * Optional secret prompt input with automatic salt generation.
   * Downloadable Cryptographic Certificate (`.json`).
3. **Log Transformation (`components/LogTransformation.jsx`):**
   * Input `parentHash` + upload transformed variant.
   * Specify modification action (`AI_UPSCALE`, `INPAINT_EDIT`, `RE_ENCODE`, `WATERMARK`).
4. **Visual Blockchain Timeline (`components/VisualTimeline.jsx`):**
   * Interactive connected DAG node viewer showing block numbers, timestamps, tool badges, and cryptographic hashes.
5. **Adversarial Sandbox Lab (`components/AdversarialLab.jsx`):**
   * One-click attack vector simulations for hackathon judges:
     - *Silent Content Tampering* (1-word modification detection).
     - *Fabricated Genesis Claim* (prior art theft / duplicate protection).
     - *Dangling Node / Broken Lineage* (unverified parent rejection).

---

## 🚀 6. Team Quick-Start Guide (Running Locally)

### Prerequisites:
* Node.js v18+ installed

### Terminal 1: Blockchain (Compile & Test)
```bash
cd blockchain
npm install
npx hardhat test          # Runs all 8 unit & adversarial tests
npx hardhat run scripts/deploy.js  # Deploys contract & exports config to backend
```

### Terminal 2: Backend API
```bash
cd backend
npm install
npm run dev               # Starts API on http://localhost:5000
```

### Terminal 3: Frontend UI
```bash
cd frontend
npm install
npm run dev               # Starts UI on http://localhost:3000
```

---

## 🔮 7. Planned Future Enhancements

The team can focus on the following enhancements next:
1. **IPFS / Arweave Decentralized Storage Integration:** Store file metadata and perceptual diff proofs on IPFS / Filecoin.
2. **ERC-721 / ERC-1155 Soulbound Token (SBT) Provenance Badges:** Mint non-transferable provenance tokens representing verifiable authenticity on public testnets.
3. **ZK-SNARK / Zero-Knowledge Proofs (Circom/SnarkJS):** Mathematically prove image transformation steps (e.g. crop bounds or scaling matrix) without revealing the source asset.
4. **Browser Extension / Social Media Overlay:** Instant verification plugin highlighting authentic vs tampered AI images on web platforms.

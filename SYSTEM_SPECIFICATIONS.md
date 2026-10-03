# 🛡️ ModelLedger v2: Master System Architecture & Technical Specifications

> **BitnBuild 2026 — CodeWarriors Internal Round**  
> **Project Name:** ModelLedger Protocol v2  
> **Core Architecture:** Decentralized AI Content Provenance, EVM Blockchain Anchoring, C2PA Content Credentials, LSB Steganography & ELA Forensics  
> **Backend Engine:** Python FastAPI + Web3.py + Pillow + imagehash + httpx  
> **Frontend Stack:** React 18 + Vite + Holographic Obsidian Theme + Supabase Auth  
> **Smart Contract:** Solidity 0.8.24 on Hardhat EVM (EIP-1559 compatible)

---

## 📌 1. Project Overview & Core Mission

**ModelLedger** is a decentralized, cryptographic provenance and multi-model trust protocol designed to solve the critical vulnerabilities of modern AI-generated media:
1. **The C2PA Metadata Stripping Vulnerability:** Mainstream platforms (Twitter/X, Instagram, Discord, WhatsApp) strip all EXIF, XMP, and JUMBF metadata on upload, completely destroying traditional C2PA Content Credentials. ModelLedger solves this using **Least Significant Bit (LSB) Steganographic Watermarking**, encoding on-chain hashes directly into pixel channels so provenance survives compression and platform stripping.
2. **Silent Deepfake Manipulation:** Even 1-bit adversarial modifications alter the cryptographic SHA-256 digest via the avalanche effect. ModelLedger pairs this with **Error Level Analysis (ELA)** and **Perceptual Hashing (pHash)** to visually detect and highlight spliced regions.
3. **Proprietary Prompt Privacy:** Creators cannot safely prove they authored a specific AI generation without exposing trade-secret prompts publicly. ModelLedger implements **Zero-Knowledge Salted Prompt Commitments** (`keccak256(prompt + salt)`), allowing creators to anchor cryptographic proof on-chain without revealing the prompt until dispute resolution.
4. **Attribution Theft & Counterfeit Lineage:** ModelLedger enforces **First-to-Register Single-Mint Locks** and **Merkle DAG Parent Invariants** in the EVM smart contract, preventing adversaries from re-registering existing assets or grafting fake derivatives onto non-existent parent roots.

---

## 🏗️ 2. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       REACT 18 + VITE FRONTEND (Port 3000)                  │
│  • Futuristic Holographic Obsidian Theme with 3D Glassmorphic Cards         │
│  • Cybernetic Cursor Follower + Physics Interpolation                       │
│  • Bottom Floating Island Dock Navigation (6 Modular Views)                 │
│  • Supabase Authentication + 1-Click Role-Based Demo Profiles               │
│  • Interactive System Specs & Instructions Modal Guide                      │
│  • Live Provenance Timeline & Error Level Analysis (ELA) Heatmap Viewer     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST API (JSON & Multipart)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PYTHON FASTAPI BACKEND (Port 5000)                      │
│  • Async Ingestion Engine (`python-multipart`, memory-buffered streaming)   │
│  • Dual-Hash Cryptographic Engine: SHA-256 Digest + 64-bit dHash/pHash      │
│  • Forensic Suite: Error Level Analysis (ELA) with Brightness Amplification │
│  • LSB Steganography Engine: Pixel-Level Provenance Signature Embedding     │
│  • C2PA Manifest Generator: JUMBF/JSON Schema + W3C Verifiable Credentials  │
│  • Decentralized Storage: IPFS Content-Addressed Pinning (Pinata + Fallback)│
│  • Web3.py Contract Relayer with Resilient Standalone Cryptographic State   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ JSON-RPC (Port 8545 / EVM)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOLIDITY SMART CONTRACT (Port 8545)                      │
│  • ModelLedger.sol (Solidity 0.8.24, Hardhat EVM Chain ID: 31337)           │
│  • 3-Tier Cryptographic Trust Classification (Verified, Derived, Disputed)  │
│  • Append-Only Merkle DAG Lineage Graph (parentHash -> childHash)           │
│  • Salted Prompt Commitments: keccak256(revealedPrompt + salt) Verification │
│  • Authorized Platform Oracle Attestation (OpenAI, Midjourney, Anthropic)   │
│  • On-Chain Dispute & Tamper Flagging Registry                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 3. The 18 Industrial Features Implemented

| # | Industry Name | Technical Implementation | Problem Solved |
|---|---|---|---|
| 1 | **SHA-256 Content Digest** | Bitwise cryptographic hash of binary buffer | Bit-flip & silent tamper detection |
| 2 | **Perceptual Hashing (dHash/pHash)** | 64-bit visual frequency gradient matrix | Cross-platform recovery after resizing & lossy compression |
| 3 | **Salted Keccak-256 Prompt Commitment** | `keccak256(prompt + salt)` stored on-chain | Zero-knowledge prompt privacy |
| 4 | **EVM On-Chain Anchoring** | Smart contract transaction on Hardhat node | Immutable, non-repudiable timestamp & ownership proof |
| 5 | **Merkle DAG Lineage Graph** | Directed acyclic graph linking `parentHash` to `newHash` | Multi-step transformation history (upscale, inpaint, style) |
| 6 | **Adversarial Robustness Simulator** | Automated exploit runners testing protocol defenses | Validates mathematical invariants against active attacks |
| 7 | **C2PA Manifest Generation** | Standards-compliant JSON Content Credentials | Interoperability with Adobe Photoshop, Chrome, and C2PA ecosystem |
| 8 | **Hard Binding** | Manifest metadata bound directly inside file data | Ensures credential travels with the asset |
| 9 | **Soft Binding** | Remote manifest indexed by content hash & IPFS CID | Provenance recovery even if internal metadata is removed |
| 10 | **IPFS Content-Addressed Storage** | Pinning original files to IPFS via CIDv0/v1 | Permanent decentralized archival without vendor lock-in |
| 11 | **Steganographic Watermarking** | LSB pixel channel encoding (`ML26::<sig>::END`) | Survives social media EXIF/metadata stripping |
| 12 | **Error Level Analysis (ELA)** | 90% JPEG re-save residual amplification | Visually exposes spliced deepfakes and localized tampering |
| 13 | **Cross-Platform Provenance Recovery** | Hamming distance lookup (threshold ≤ 12 bits) | Re-links stripped social media images to on-chain records |
| 14 | **Provenance Passport (W3C VC)** | Portable cryptographically signed JSON-LD | Offline, independent third-party verification |
| 15 | **On-Chain Dispute Registry** | `flagDispute()` smart contract function | Revocation and counterfeit flagging by verified creators |
| 16 | **Dual-Hash Integrity Verification** | Simultaneous byte-exact + visual fuzzy comparison | Distinguishes lossless compression from malicious alteration |
| 17 | **Role-Based Identity System** | Supabase Auth + Web3 profile delegation | Distinguishes Platform Oracles from Creators and Auditors |
| 18 | **On-Chain Trusted Timestamping** | EVM block timestamps (RFC 3161 equivalent) | Legal proof of existence at a specific block number |

---

## ⛓️ 4. Blockchain & Smart Contract Layer (`blockchain/`)

### 4.1 Contract Architecture (`ModelLedger.sol`)
* **Solidity Version:** `^0.8.24`
* **Address (Local EVM):** `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
* **Deployer Address:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

### 4.2 Core Enums & Data Structures
```solidity
enum TrustTier {
    UNVERIFIED,       // 0: Unknown / Unregistered
    SELF_ASSERTED,    // 1: User-claimed without oracle countersignature
    VERIFIED_TRUSTED, // 2: Countersigned by authorized platform oracle
    DISPUTED          // 3: Flagged for detected tampering or conflicting claim
}

struct ArtifactRecord {
    bytes32 fileHash;          // Exact SHA-256 content digest
    bytes32 perceptualHash;    // 64-bit perceptual hash (dHash/pHash)
    bytes32 promptCommitment;  // keccak256(secretPrompt + salt)
    bytes32 parentHash;        // 0x0 for Genesis root; ancestor hash for child nodes
    address creator;           // Registrar wallet address
    address issuerOracle;      // Countersigning platform oracle address
    TrustTier trustTier;       // Trust level
    string aiModel;            // Generative AI model name
    string actionType;         // "GENESIS", "AI_UPSCALE", "INPAINT", "WATERMARK"
    string applicationName;    // Pipeline / Application name
    string metadataURI;        // ipfs:// CID reference
    uint256 timestamp;         // EVM block timestamp
    uint256 blockNumber;       // EVM block number
}
```

### 4.3 Key Functions
1. `registerGenesis(fileHash, perceptualHash, promptCommitment, aiModel, applicationName, metadataURI, isOracleAttested)`
   * Reverts if `fileHash` is already registered (first-to-register protection).
   * Sets tier to `VERIFIED_TRUSTED` if sent by an authorized oracle, else `SELF_ASSERTED`.
2. `logTransformation(newHash, parentHash, perceptualHash, actionType, applicationName, metadataURI)`
   * Reverts if `parentHash` does not exist on-chain.
   * Reverts if parent artifact is marked `DISPUTED`.
   * Inherits ancestor prompt commitment and appends child node to Merkle DAG.
3. `verifyLineage(fileHash)`
   * Traverses backward from target hash to Genesis root via `parentHash` pointers.
   * Returns `(bool exists, ArtifactRecord currentRecord, ArtifactRecord[] lineageChain)`.
4. `verifyPromptCommitment(fileHash, revealedPrompt, salt)`
   * Computes `keccak256(abi.encodePacked(revealedPrompt, salt))` on-chain.
   * Compares against stored commitment without revealing prompt beforehand.
5. `flagDispute(fileHash, reason)`
   * Demotes artifact to `DISPUTED` and logs on-chain dispute history.

---

## 🐍 5. Python FastAPI Backend Layer (`backend/`)

### 5.1 Directory Layout
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app, lifespan handler, CORS, router mounting
│   ├── config/
│   │   ├── __init__.py
│   │   └── contractConfig.json  # Hardhat contract address & ABI
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── artifacts.py         # Genesis origination, transformations, lineage DAG
│   │   ├── verify.py            # Dual-hash audit, prompt verification, ELA forensics
│   │   ├── watermark.py         # Steganographic LSB pixel embedding & extraction
│   │   ├── ipfs_router.py       # IPFS file pinning & CID lookup
│   │   └── adversarial.py       # Attack playbooks (tamper, duplicate, broken chain)
│   └── services/
│       ├── __init__.py
│       ├── blockchain.py        # Web3.py client + thread-safe in-memory fallback state
│       ├── hasher.py            # SHA-256, perceptual dHash, salted Keccak-256
│       ├── forensics.py         # Error Level Analysis (ELA) heatmap generation
│       ├── stegano_service.py   # LSB pixel steganography encoder & decoder
│       ├── ipfs_service.py      # Pinata IPFS pinning client + deterministic fallback
│       └── c2pa_manifest.py     # C2PA manifest & W3C Verifiable Credential builder
├── pyproject.toml
├── requirements.txt             # fastapi, uvicorn, web3, Pillow, python-multipart, etc.
└── run.py                       # Application runner (uvicorn app.main:app)
```

### 5.2 API REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Platform statistics, total anchored count, engine mode, features |
| `POST` | `/api/artifacts/genesis` | Register Genesis asset, compute hashes, pin IPFS, anchor on-chain |
| `POST` | `/api/artifacts/transform` | Log child transformation to DAG lineage, verify parent on-chain |
| `GET` | `/api/artifacts/{hash}/lineage` | Retrieve full chronological Merkle DAG lineage chain |
| `GET` | `/api/artifacts/{hash}/passport` | Generate downloadable W3C Verifiable Credential ("Provenance Passport") |
| `POST` | `/api/verify` | Perform dual-hash verification (exact SHA-256 + fuzzy pHash + watermark) |
| `POST` | `/api/verify/prompt` | Verify revealed plaintext prompt and salt against on-chain commitment |
| `POST` | `/api/verify/forensics/ela` | Run Error Level Analysis and return base64 difference heatmap |
| `POST` | `/api/watermark/embed` | Ingest image, embed signature into LSB pixels, return watermarked PNG |
| `POST` | `/api/watermark/extract` | Ingest image, extract pixel signature, query on-chain provenance |
| `POST` | `/api/adversarial/simulate-tamper` | Simulate silent 1-bit tampering and return verification verdict |
| `POST` | `/api/adversarial/duplicate-genesis` | Test defense against adversary attempting to re-register existing genesis |
| `POST` | `/api/adversarial/broken-chain` | Test defense against child transformation linking to non-existent parent |
| `POST` | `/api/ipfs/pin` | Pin raw asset to IPFS and return CID and gateway link |

---

## 🎨 6. React Frontend Layer (`frontend/`)

### 6.1 Directory Layout
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Minimalist classy header with node status & auth pill
│   │   ├── FloatingDock.jsx     # Floating bottom island navigation dock (6 routes)
│   │   ├── CyberCursor.jsx      # Cybernetic cursor follower with physics scaling
│   │   ├── DashboardView.jsx    # Analytics dashboard, trust metrics, activity feed
│   │   ├── VerifyView.jsx       # Dual-hash audit, 1-click tamper toggle, ELA viewer
│   │   ├── OriginateView.jsx    # Genesis minting, salted prompt privacy, C2PA export
│   │   ├── TransformView.jsx    # Merkle DAG edit history & parent auto-link demo
│   │   ├── WatermarkView.jsx    # LSB pixel watermark embedder & extractor
│   │   ├── SandboxView.jsx      # Adversarial attack simulator with 3 playbooks
│   │   ├── SpecsGuideModal.jsx  # Interactive specifications & instructions guide
│   │   └── AuthModal.jsx        # Supabase sign-in/up & 1-click demo login profiles
│   ├── services/
│   │   ├── api.js               # Frontend API client for FastAPI backend
│   │   └── supabase.js          # Supabase client with local fallback session storage
│   ├── App.jsx                  # Main router, ambient lights, modal controllers
│   ├── index.css                # Holographic Obsidian design system & animations
│   └── main.jsx                 # React root DOM mounting
├── package.json
└── vite.config.js
```

### 6.2 Visual Aesthetics & User Experience
* **Color Palette:** Holographic Obsidian (`#03030a`), Electric Cyan (`#00f0ff`), Radiant Ultra-Violet (`#8b5cf6`), Laser Bio-Emerald (`#00ff88`), Hot Plasma Magenta (`#ff007f`).
* **Micro-Animations:** Dual-ring physics cursor tracking, `.glass-3d` holographic card edge reflection, confetti explosion on verified authentic assets (`canvas-confetti`).
* **Zero Manual Effort:** Preloaded demo sample cards and a **1-Click "⚡ Inject Silent Tamper" toggle button** that flips buffer bits in memory—no manual hex editing or hashing required.

---

## 🚀 7. Step-by-Step Setup & Execution Instructions

### Prerequisites
* **Node.js** v18+ (tested on Node v20/v22)
* **Python** v3.10+ (tested on Python 3.14)
* **Git** and PowerShell / Bash

### Step 1: Start the Hardhat EVM Node
In Terminal 1:
```bash
cd blockchain
npm install
npx hardhat node
```
*Starts local EVM on port 8545.*

### Step 2: Deploy the Smart Contract
In Terminal 2:
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```
*Deploys `ModelLedger.sol` and automatically writes `contractConfig.json` (address + ABI) to `backend/app/config/`.*

### Step 3: Start the Python FastAPI Backend
In Terminal 3:
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
*FastAPI server starts on port 5000 with interactive Swagger docs at `http://localhost:5000/docs`.*

### Step 4: Start the React Frontend
In Terminal 4:
```bash
cd frontend
npm install
npm run dev
```
*Vite frontend starts at `http://localhost:3000`.*

---

## 🛡️ 8. Adversarial Defense Invariants & Verification Logic

1. **Silent Tamper Invariant:** If `SHA256(file) != storedHash` and `HammingDist(pHash) > 6`, transaction is classified as **Tier 3 (Tampered / Disputed)**.
2. **First-to-Register Invariant:** If `records[fileHash].timestamp > 0`, secondary registration reverts with `"ModelLedger: Artifact hash already registered"`.
3. **DAG Lineage Invariant:** If `records[parentHash].timestamp == 0`, transformation reverts with `"ModelLedger: Parent artifact not registered"`.
4. **Dispute Invariant:** If `records[parentHash].trustTier == DISPUTED`, child transformation reverts with `"ModelLedger: Cannot transform disputed artifact"`.
5. **Zero-Knowledge Invariant:** Verification succeeds if and only if `keccak256(revealedPrompt + salt) == storedPromptCommitment`.

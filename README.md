# 🛡️ ModelLedger: Cryptographic & Blockchain AI Provenance Protocol

**BitnBuild 2026 — CodeWarriors Internal Round**

ModelLedger is a decentralized, blockchain-powered provenance tracking protocol designed to verify the origin, multi-system transformations, and authenticity of AI-generated content (images, PDFs, documents, audio) without exposing private source files or proprietary prompts.

---

## 🌟 Key Architecture & Problem Statement Solutions

| Problem Requirement | ModelLedger Solution |
| :--- | :--- |
| **Provenance Verification** | Cryptographic SHA-256 / Keccak-256 fingerprinting linked to EVM Smart Contracts (`ModelLedger.sol`). |
| **Provenance Trust Tiers** | **Tier 1 (Verified Trusted)**: Platform oracle-signed attestation.<br>**Tier 2 (Self-Asserted)**: Individual user registration.<br>**Tier 3 (Tampered / Disputed)**: Mismatched or fraudulent claims. |
| **Transformation Handling** | Directed Acyclic Graph (DAG) block linking (`parentHash -> currentHash`) with perceptual hash tolerance for format conversions and resizing. |
| **Multi-System Provenance** | Traces multi-hop pipelines (e.g. `DALL-E 3 Genesis -> Topaz 4K Upscale -> Watermark Signer`). |
| **Privacy-Preserving Verification** | Salted on-chain prompt commitments (`keccak256(secretPrompt + salt)`) prove authorship without exposing plaintext prompts. |
| **Adversarial Testing Lab** | Built-in interactive sandbox testing Silent Tamper Attacks, Duplicate Genesis Claims, and Broken Lineage attacks. |

---

## 📁 Repository Structure

```
BNB26_CodeWarriors_Internal_Round/
│
├── blockchain/                         # Step 1: Solidity Smart Contracts & Hardhat
│   ├── contracts/
│   │   └── ModelLedger.sol            # Smart contract (multi-tier trust, lineage, provenance)
│   ├── scripts/
│   │   └── deploy.js                  # Deployment script exporting ABI & address
│   ├── test/
│   │   └── ModelLedger.test.js        # Hardhat unit & adversarial test suite
│   ├── hardhat.config.js              # Hardhat configuration (Solidity 0.8.24)
│   └── package.json
│
├── backend/                            # Step 2: Express.js Cryptographic API & Relayer
│   ├── src/
│   │   ├── server.js                  # Express API server entry
│   │   ├── routes/
│   │   │   ├── artifactRoutes.js      # Register, Transform, Verify routes
│   │   │   └── adversarialRoutes.js   # Live simulation sandbox routes
│   │   ├── services/
│   │   │   ├── hasher.js              # Exact SHA-256 + Perceptual hashing + Salted prompt commitments
│   │   │   └── blockchainService.js   # Ethers.js connector to ModelLedger.sol
│   │   └── config/
│   │       └── contractConfig.js      # Contract address & ABI loader
│   └── package.json
│
└── frontend/                           # Step 3: Modern React (Vite) UI
    ├── src/
    │   ├── App.jsx                    # Navigation, state, view management
    │   ├── index.css                  # Cyber-defense dark theme design system
    │   ├── components/
    │   │   ├── Navbar.jsx             # Network status & live metrics
    │   │   ├── VerifyAudit.jsx        # Audit dropzone with 3-tier trust badges
    │   │   ├── RegisterGenesis.jsx    # Genesis registration & certificate export
    │   │   ├── LogTransformation.jsx  # Multi-system chain of custody logger
    │   │   ├── VisualTimeline.jsx     # Interactive blockchain DAG explorer
    │   │   └── AdversarialLab.jsx     # Live adversarial attack simulation lab
    │   └── services/
    │       └── api.js                 # API communication layer
    ├── package.json
    └── vite.config.js
```

---

## 🚀 How to Run the Complete Stack

### 1. Blockchain (Hardhat EVM Node)
```bash
cd blockchain
npx hardhat test          # Run all automated smart contract tests
npx hardhat node          # Start instant local EVM blockchain (Terminal 1)
npx hardhat run scripts/deploy.js --network localhost  # Deploy contract (Terminal 2)
```

### 2. Backend (Node.js API & Relayer)
```bash
cd backend
npm run dev               # Starts on http://localhost:5000 (Terminal 3)
```

### 3. Frontend (React + Vite)
```bash
cd frontend
npm run dev               # Starts on http://localhost:3000 (Terminal 4)
```

---

## 🛡️ Core Modules

1. **Verify & Audit**: Drop any candidate artifact or paste a hash. If unaltered, returns a glowing **Verified Trusted** badge with the complete chronological lineage. If modified by a single byte, triggers an immediate **Tampered Content Warning**.
2. **Register Genesis**: Mints the root "Birth Certificate" block with origin model, author address, and optional privacy-preserving prompt commitment.
3. **Log Transformation**: Appends downstream modifications (e.g., upscaling, inpainting) linked cryptographically to their parent block.
4. **Adversarial Sandbox**: Demonstrates protocol defenses against silent tamper, front-running claims, and dangling chains.
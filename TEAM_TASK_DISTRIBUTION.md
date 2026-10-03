# 👥 ModelLedger v2: 3-Member Team Task Distribution & Roadmap

> **Hackathon Team:** BitnBuild 2026 — CodeWarriors  
> **Project:** ModelLedger Protocol v2  
> **Architecture:** Solidity EVM + Python FastAPI + React Vite  
> **Goal:** Balanced task allocation across 3 team members with concrete responsibilities, technical deliverables, and innovative feature ownership.

---

## 🎯 Member 1: Blockchain, Smart Contracts & Cryptography Lead

**Primary Focus:** Solidity EVM Contracts, Web3.py Integration, Cryptographic Invariants & On-Chain Security.

### 📌 Core Modules Assigned:
* `blockchain/contracts/ModelLedger.sol`
* `blockchain/scripts/deploy.js`
* `blockchain/test/ModelLedger.test.js`
* `backend/app/services/blockchain.py`
* `backend/app/services/hasher.py`

### 🛠️ Key Responsibilities & Tasks:
1. **Smart Contract Invariant Hardening:**
   * Audit all `require()` statements to ensure zero reentrancy, overflow, or logic flaws in `registerGenesis()`, `logTransformation()`, and `flagDispute()`.
   * Add a `batchRegister()` contract function allowing multiple hashes to be anchored in a single transaction to reduce gas costs.
2. **Oracle Multi-Signature Attestation:**
   * Extend the `authorizedOracles` mapping to support M-of-N multi-sig verification for enterprise AI model providers (e.g., OpenAI + Midjourney countersignature).
3. **Automated Testing Suite:**
   * Maintain comprehensive Hardhat unit tests (`npx hardhat test`) covering:
     * First-to-register revert on duplicate hash.
     * Revert on dangling parent hash.
     * Accurate reverse lineage traversal up to 20 blocks deep.
     * Salted Keccak-256 prompt commitment matching.
4. **Testnet Deployment Preparation:**
   * Configure `hardhat.config.js` for BNB Smart Chain (BSC) Testnet and Polygon Amoy with deployer private keys and RPC URLs.

---

## 🔬 Member 2: Python Backend, Forensics & Storage Lead

**Primary Focus:** FastAPI Asynchronous API, Image Forensics, Steganographic Watermarking & IPFS Cloud Archival.

### 📌 Core Modules Assigned:
* `backend/app/main.py`
* `backend/app/routers/` (`artifacts.py`, `verify.py`, `watermark.py`, `ipfs_router.py`, `adversarial.py`)
* `backend/app/services/forensics.py` (Error Level Analysis)
* `backend/app/services/stegano_service.py` (LSB Pixel Encoder/Decoder)
* `backend/app/services/ipfs_service.py` (Pinata Cloud CAS)
* `backend/app/services/c2pa_manifest.py` (Content Credentials Generator)

### 🛠️ Key Responsibilities & Tasks:
1. **Steganography Robustness Enhancement:**
   * Enhance the LSB pixel watermarking algorithm (`stegano_service.py`) to survive lossy JPEG compression using redundant channel spreading (embedding the hash across multiple RGB bits).
2. **Error Level Analysis (ELA) Tuning:**
   * Calibrate the compression quality and amplification scale in `forensics.py` to highlight localized Photoshop inpainting and deepfake boundary seams.
3. **Live Pinata IPFS Cloud Integration:**
   * Set up a free Pinata account, configure `PINATA_API_KEY` and `PINATA_SECRET_KEY` in `backend/.env`, and test live decentralized file pinning.
4. **C2PA Manifest Compliance:**
   * Ensure generated Content Credentials JSON adheres strictly to the C2PA specification (compatible with Adobe Content Authenticity tools).
5. **FastAPI OpenAPI Documentation:**
   * Annotate Pydantic models and endpoint docstrings so the Swagger UI at `http://localhost:5000/docs` is polished for hackathon judges.

---

## 🎨 Member 3: Frontend UI/UX, Visualizations & Auth Lead

**Primary Focus:** React 18, Vite, Holographic Obsidian Theme, Interactive DAG Lineage Graph & Supabase Auth.

### 📌 Core Modules Assigned:
* `frontend/src/App.jsx`
* `frontend/src/index.css` (Design system, animations, 3D tilt effects, cursor)
* `frontend/src/components/` (`DashboardView.jsx`, `VerifyView.jsx`, `OriginateView.jsx`, `TransformView.jsx`, `WatermarkView.jsx`, `SandboxView.jsx`)
* `frontend/src/components/SpecsGuideModal.jsx` & `AuthModal.jsx`
* `frontend/src/services/api.js` & `frontend/src/services/supabase.js`

### 🛠️ Key Responsibilities & Tasks:
1. **Interactive Merkle DAG Visual Graph:**
   * Build an interactive node-and-edge visual tree (using SVG or HTML5 Canvas) in `TransformView.jsx` and `DashboardView.jsx` showing the Genesis root branching into child transformations.
2. **Supabase Live Project Connection:**
   * Create a free Supabase project, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `frontend/.env`, and test live email/password authentication and user session persistence.
3. **Mobile & Tablet Responsiveness:**
   * Ensure the bottom floating dock (`FloatingDock.jsx`) and 3D glass cards adapt smoothly to smaller screens and mobile viewports.
4. **Demo Polish & Pitch Presentation Flow:**
   * Test the entire end-to-end judge demonstration:
     * 1-Click quick fill specimen in *Originate*.
     * 1-Click tamper toggle in *Verify* (showing instant Tier 3 detection).
     * ELA forensic heatmap preview.
     * Pixel watermark embed and extraction.
     * Adversarial sandbox exploit run.

---

## 📅 Hackathon Execution Timeline

| Phase | Milestone | Responsible |
|---|---|---|
| **Phase 1** | Local EVM Hardhat Node + Smart Contract tests passing | Member 1 |
| **Phase 2** | FastAPI Backend running on-chain with Pillow ELA & Stegano | Member 2 |
| **Phase 3** | React UI with 6 routes, Holographic Obsidian theme & Supabase Auth | Member 3 |
| **Phase 4** | End-to-End Integration Testing & Live Demo Rehearsal | All 3 Members |

---

> *Note: This document can be referenced during development and safely deleted before final project submission if preferred.*

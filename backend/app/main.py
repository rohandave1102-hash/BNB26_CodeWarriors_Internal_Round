"""
ModelLedger v2 — FastAPI Main Application
AI Provenance & Trust Engine with Blockchain + IPFS + C2PA + Steganography
"""

import os
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Import routers
from app.routers import artifacts, verify, adversarial, ipfs_router, watermark
from app.services.blockchain import blockchain_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / Shutdown lifecycle."""
    print("\n" + "=" * 60)
    print("[INIT] ModelLedger v2 - Python FastAPI Provenance Engine")
    print("=" * 60)

    # Attempt connection to Hardhat EVM
    await blockchain_service.connect()

    if blockchain_service.is_connected:
        print(f"[EVM] Connected On-Chain: {blockchain_service.contract_address}")
    else:
        print("[STANDALONE] Operating in Resilient Cryptographic Mode")

    host = os.getenv("HOST", "0.0.0.0")
    port = os.getenv("PORT", "5000")
    print(f"[API] Server: http://{host}:{port}")
    print(f"[DOCS] Interactive Swagger UI: http://localhost:{port}/docs")
    print("=" * 60 + "\n")

    yield

    print("\n[STOP] ModelLedger engine stopping...")

app = FastAPI(
    title="ModelLedger v2",
    description="Decentralized AI Provenance & Multi-Model Trust Engine (EVM + IPFS + C2PA + Steganography)",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hackathon friendly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(artifacts.router, prefix="/api", tags=["Artifacts & Lineage"])
app.include_router(verify.router, prefix="/api", tags=["Dual-Hash Verification & ELA"])
app.include_router(adversarial.router, prefix="/api", tags=["Adversarial Testing Lab"])
app.include_router(ipfs_router.router, prefix="/api", tags=["IPFS Content Storage"])
app.include_router(watermark.router, prefix="/api", tags=["Steganographic Watermarking"])

@app.get("/api/stats")
async def get_stats():
    """Platform statistics & health check."""
    return {
        "totalArtifacts": blockchain_service.total_artifacts,
        "isContractConnected": blockchain_service.is_connected,
        "contractAddress": blockchain_service.contract_address,
        "mode": "on-chain" if blockchain_service.is_connected else "standalone",
        "engine": "FastAPI + Web3.py + C2PA + Stegano",
        "features": [
            "SHA-256 Content Digest",
            "Perceptual Hashing (pHash)",
            "Salted Keccak-256 Prompt Commitment",
            "EVM On-Chain Anchoring",
            "Merkle DAG Lineage",
            "Adversarial Robustness Simulator",
            "Steganographic Watermarking",
            "Error Level Analysis (ELA)",
            "Cross-Platform Provenance Recovery",
            "Provenance Passport (W3C VC)",
            "IPFS Content-Addressed Storage",
            "Dual-Hash Integrity Verification"
        ]
    }

@app.get("/")
async def root():
    return {
        "protocol": "ModelLedger v2",
        "status": "ONLINE",
        "docs": "/docs",
        "version": "2.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import json

from ..services.hasher import compute_sha256, compute_perceptual_hash, hamming_distance
from ..services.blockchain import blockchain_service
from ..services.stegano_service import stegano_service
from ..services.forensics import forensic_service

router = APIRouter()

@router.post("/verify")
async def verify_artifact(
    file: Optional[UploadFile] = File(None),
    file_hash: Optional[str] = Form(None)
):
    """
    Dual-Hash Integrity Verification:
    - Compares exact SHA-256 against on-chain ledger
    - Cross-Platform Provenance Recovery: searches via Perceptual Hash (pHash) if metadata stripped
    - Checks for embedded steganographic watermark
    - Computes trust tier (Tier 1 Verified, Tier 2 Derived/Re-encoded, Tier 3 Tampered)
    """
    contents = None
    if file:
        contents = await file.read()

    if not contents and not file_hash:
        raise HTTPException(status_code=400, detail="Must provide either an uploaded file or file_hash.")

    current_sha = compute_sha256(contents) if contents else file_hash.strip().lower()
    current_phash = compute_perceptual_hash(contents) if contents else ""

    # Check for embedded invisible watermark in pixel channels
    embedded_watermark = None
    if contents:
        embedded_watermark = stegano_service.extract_watermark(contents)

    # 1. Exact lookup
    exact_res = blockchain_service.verify_lineage(current_sha)
    if exact_res.get("exists"):
        current_rec = exact_res.get("currentRecord", {})
        evaluation = forensic_service.evaluate_dual_hash_integrity(
            current_sha=current_sha,
            current_phash=current_phash,
            matched_record=current_rec,
            hamming_dist=0
        )
        return {
            "success": True,
            "status": "EXACT_MATCH",
            "trustTier": evaluation.get("trustTier"),
            "tierLabel": evaluation.get("tierLabel"),
            "verdict": evaluation.get("verdict"),
            "details": evaluation.get("details"),
            "confidence": evaluation.get("confidence"),
            "fileHash": current_sha,
            "perceptualHash": current_phash or current_rec.get("perceptualHash"),
            "embeddedWatermark": embedded_watermark,
            "record": current_rec,
            "lineageChain": exact_res.get("lineageChain", [])
        }

    # 2. Cross-Platform Perceptual Hash Recovery (If stripped by Twitter/Instagram)
    if current_phash:
        phash_match = blockchain_service.find_by_perceptual_hash(current_phash, threshold=12)
        if phash_match:
            matched_rec = phash_match["match"]
            dist = phash_match["hammingDistance"]
            evaluation = forensic_service.evaluate_dual_hash_integrity(
                current_sha=current_sha,
                current_phash=current_phash,
                matched_record=matched_rec,
                hamming_dist=dist
            )
            # Retrieve full ancestor lineage of the matched parent
            parent_lineage = blockchain_service.verify_lineage(matched_rec.get("fileHash", ""))
            return {
                "success": True,
                "status": "PERCEPTUAL_RECOVERY",
                "trustTier": evaluation.get("trustTier"),
                "tierLabel": evaluation.get("tierLabel"),
                "verdict": evaluation.get("verdict"),
                "details": evaluation.get("details"),
                "confidence": evaluation.get("confidence"),
                "fileHash": current_sha,
                "perceptualHash": current_phash,
                "matchedOriginalHash": matched_rec.get("fileHash"),
                "hammingDistance": dist,
                "embeddedWatermark": embedded_watermark,
                "record": matched_rec,
                "lineageChain": parent_lineage.get("lineageChain", [])
            }

    # 3. Unregistered / Tampered
    return {
        "success": False,
        "status": "UNREGISTERED_OR_TAMPERED",
        "trustTier": 3,
        "tierLabel": "Tier 3: Tampered / Disputed",
        "verdict": "INTEGRITY_VIOLATION",
        "confidence": "99.8%",
        "details": "No matching cryptographic genesis record or perceptual fingerprint found in the ledger. Asset is unverified or has undergone unauthorized tampering.",
        "fileHash": current_sha,
        "perceptualHash": current_phash,
        "embeddedWatermark": embedded_watermark,
        "record": None,
        "lineageChain": []
    }

@router.post("/verify/prompt")
async def verify_prompt(
    file_hash: str = Form(...),
    revealed_prompt: str = Form(...),
    salt: str = Form(...)
):
    """
    Zero-Knowledge Prompt Verification:
    Tests revealed prompt + salt against on-chain salted commitment without exposing prompt beforehand.
    """
    is_valid = blockchain_service.verify_prompt(file_hash, revealed_prompt, salt)
    return {
        "success": True,
        "isValid": is_valid,
        "message": "Prompt cryptographically verified against on-chain salted commitment." if is_valid else "Prompt or salt mismatch."
    }

@router.post("/verify/forensics/ela")
async def run_ela_forensics(
    file: UploadFile = File(...)
):
    """
    Performs Error Level Analysis (ELA) on uploaded image.
    Generates difference heatmap highlighting manipulated pixel clusters.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    
    result = forensic_service.run_ela(contents)
    return result

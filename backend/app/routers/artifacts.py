import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from ..services.hasher import compute_sha256, compute_perceptual_hash, compute_prompt_commitment
from ..services.blockchain import blockchain_service
from ..services.ipfs_service import ipfs_service
from ..services.c2pa_manifest import c2pa_service

router = APIRouter()

@router.post("/artifacts/genesis")
async def register_genesis(
    file: UploadFile = File(...),
    ai_model: str = Form("Generative AI Model"),
    application_name: str = Form("Autonomous Generator"),
    prompt: Optional[str] = Form(None),
    salt: Optional[str] = Form(None),
    is_oracle_attested: bool = Form(True)
):
    """
    Originate Genesis AI Creation:
    - Generates SHA-256 Content Digest & Perceptual pHash
    - Computes Salted Keccak-256 Prompt Commitment
    - Pins to IPFS (CAS)
    - Anchors on-chain to Hardhat EVM
    - Generates C2PA Content Credentials Manifest & Provenance Passport
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 1. Hashes
    file_hash = compute_sha256(contents)
    perceptual_hash = compute_perceptual_hash(contents)
    prompt_commitment = compute_prompt_commitment(prompt or "", salt or "")

    # 2. IPFS Storage
    ipfs_res = await ipfs_service.pin_file(contents, file.filename or "genesis.png")
    ipfs_cid = ipfs_res.get("cid", "")

    # 3. C2PA Manifest
    manifest = c2pa_service.generate_manifest(
        file_hash=file_hash,
        perceptual_hash=perceptual_hash,
        ai_model=ai_model,
        creator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action_type="GENESIS",
        ipfs_cid=ipfs_cid
    )
    passport = c2pa_service.generate_verifiable_credential(manifest)

    # 4. On-Chain Anchoring
    chain_res = blockchain_service.register_genesis(
        file_hash=file_hash,
        perceptual_hash=perceptual_hash,
        prompt_commitment=prompt_commitment,
        ai_model=ai_model,
        application_name=application_name,
        metadata_uri=f"ipfs://{ipfs_cid}",
        is_oracle_attested=is_oracle_attested
    )

    return {
        "success": True,
        "message": "Genesis AI artifact successfully registered and anchored on-chain.",
        "fileHash": file_hash,
        "perceptualHash": perceptual_hash,
        "promptCommitment": prompt_commitment,
        "ipfs": ipfs_res,
        "blockchain": chain_res,
        "c2paManifest": manifest,
        "provenancePassport": passport
    }

@router.post("/artifacts/transform")
async def log_transformation(
    file: UploadFile = File(...),
    parent_hash: str = Form(...),
    action_type: str = Form("AI_UPSCALE"),
    application_name: str = Form("Enhancement Pipeline")
):
    """
    Logs downstream transformation:
    - Verifies parent exists on-chain
    - Computes new content hash
    - Appends node to Merkle DAG lineage
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    new_hash = compute_sha256(contents)
    perceptual_hash = compute_perceptual_hash(contents)

    # Verify parent existence
    parent_check = blockchain_service.verify_lineage(parent_hash)
    if not parent_check.get("exists"):
        raise HTTPException(status_code=400, detail=f"Parent hash {parent_hash} not registered.")

    # Pin to IPFS
    ipfs_res = await ipfs_service.pin_file(contents, file.filename or "transformed.png")
    ipfs_cid = ipfs_res.get("cid", "")

    # Blockchain transformation logging
    chain_res = blockchain_service.log_transformation(
        new_hash=new_hash,
        parent_hash=parent_hash,
        perceptual_hash=perceptual_hash,
        action_type=action_type,
        application_name=application_name,
        metadata_uri=f"ipfs://{ipfs_cid}"
    )

    # Manifest
    manifest = c2pa_service.generate_manifest(
        file_hash=new_hash,
        perceptual_hash=perceptual_hash,
        ai_model=application_name,
        creator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action_type=action_type,
        ipfs_cid=ipfs_cid,
        parent_hash=parent_hash
    )
    passport = c2pa_service.generate_verifiable_credential(manifest)

    return {
        "success": True,
        "message": "Transformation successfully logged into DAG lineage chain.",
        "newHash": new_hash,
        "parentHash": parent_hash,
        "perceptualHash": perceptual_hash,
        "ipfs": ipfs_res,
        "blockchain": chain_res,
        "c2paManifest": manifest,
        "provenancePassport": passport
    }

@router.get("/artifacts/{file_hash}/lineage")
async def get_lineage(file_hash: str):
    """Retrieves full Merkle DAG lineage back to Genesis."""
    lineage = blockchain_service.verify_lineage(file_hash)
    if not lineage.get("exists"):
        raise HTTPException(status_code=404, detail="Artifact not registered on ledger.")
    return lineage

@router.get("/artifacts/{file_hash}/passport")
async def get_passport(file_hash: str):
    """Generates a downloadable Provenance Passport."""
    lineage = blockchain_service.verify_lineage(file_hash)
    if not lineage.get("exists"):
        raise HTTPException(status_code=404, detail="Artifact not registered on ledger.")
    rec = lineage.get("currentRecord", {})
    manifest = c2pa_service.generate_manifest(
        file_hash=rec.get("fileHash"),
        perceptual_hash=rec.get("perceptualHash"),
        ai_model=rec.get("aiModel", "Generative AI"),
        creator=rec.get("creator", ""),
        action_type=rec.get("actionType", "GENESIS"),
        parent_hash=rec.get("parentHash", "")
    )
    passport = c2pa_service.generate_verifiable_credential(manifest)
    return passport

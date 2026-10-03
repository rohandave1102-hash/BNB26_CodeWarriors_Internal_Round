from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from ..services.stegano_service import stegano_service
from ..services.blockchain import blockchain_service

router = APIRouter()

@router.post("/watermark/embed")
async def embed_watermark(
    file: UploadFile = File(...),
    secret_text: str = Form(...)
):
    """
    Embeds an invisible LSB watermark into image pixel data.
    The embedded hash survives platform metadata stripping (Twitter/Instagram).
    Returns watermarked PNG binary.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    watermarked_bytes = stegano_service.embed_watermark(contents, secret_text)

    return Response(
        content=watermarked_bytes,
        media_type="image/png",
        headers={"Content-Disposition": f"attachment; filename=watermarked_{file.filename or 'asset'}.png"}
    )

@router.post("/watermark/extract")
async def extract_watermark(file: UploadFile = File(...)):
    """
    Extracts invisible watermark from image and performs automatic provenance lookup.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    extracted_sig = stegano_service.extract_watermark(contents)

    if not extracted_sig:
        return {
            "success": False,
            "hasWatermark": False,
            "message": "No invisible ModelLedger watermark detected in image pixels."
        }

    # If extracted watermark looks like a hash, query ledger
    ledger_audit = blockchain_service.verify_lineage(extracted_sig)

    return {
        "success": True,
        "hasWatermark": True,
        "extractedSignature": extracted_sig,
        "ledgerVerified": ledger_audit.get("exists", False),
        "record": ledger_audit.get("currentRecord"),
        "lineageChain": ledger_audit.get("lineageChain", [])
    }

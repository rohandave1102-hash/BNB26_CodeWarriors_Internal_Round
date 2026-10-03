from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.ipfs_service import ipfs_service

router = APIRouter()

@router.post("/ipfs/pin")
async def pin_to_ipfs(file: UploadFile = File(...)):
    """Pins raw file to IPFS via Pinata or deterministic CAS."""
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    
    result = await ipfs_service.pin_file(contents, file.filename or "asset.png")
    return result

@router.get("/ipfs/{cid}")
async def get_ipfs_info(cid: str):
    """Returns gateway access link for given IPFS CID."""
    return {
        "cid": cid,
        "gatewayUrl": f"https://ipfs.io/ipfs/{cid}",
        "pinataGateway": f"https://gateway.pinata.cloud/ipfs/{cid}"
    }

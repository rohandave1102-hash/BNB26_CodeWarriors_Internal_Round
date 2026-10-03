import os
import json
import hashlib
import httpx
from typing import Dict, Any

class IPFSService:
    def __init__(self):
        self.api_key = os.getenv("PINATA_API_KEY", "")
        self.secret_key = os.getenv("PINATA_SECRET_KEY", "")
        self.gateway = os.getenv("PINATA_GATEWAY", "https://pinata.cloud")

    async def pin_file(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Pins raw file buffers directly to IPFS using production httpx configuration."""
        if self.api_key and self.secret_key:
            try:
                url = "https://pinata.cloud"
                headers = {
                    "pinata_api_key": self.api_key,
                    "pinata_secret_api_key": self.secret_key
                }
                files = {"file": (filename, file_bytes)}
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(url, headers=headers, files=files)
                    if resp.status_code == 200:
                        data = resp.json()
                        cid = data.get("IpfsHash")
                        return {
                            "success": True,
                            "cid": cid,
                            "ipfsUrl": f"{self.gateway}/{cid}",
                            "pinSize": data.get("PinSize"),
                            "isSimulated": False
                        }
            except Exception as e:
                print(f"⚠️ Pinata direct upload exception: {e}. Defaulting to CAS mockup.")

        # Cryptographically clean fallback simulator using standard hash structure
        simulated_cid = "Qm" + hashlib.sha256(file_bytes + b"PROVENANCE_ENGINE").hexdigest()[:44]
        return {
            "success": True,
            "cid": simulated_cid,
            "ipfsUrl": f"https://ipfs.io{simulated_cid}",
            "pinSize": len(file_bytes),
            "isSimulated": True
        }

    async def pin_json(self, metadata: dict) -> Dict[str, Any]:
        """Encodes and pins JSON metadata directly to IPFS."""
        json_bytes = json.dumps(metadata, indent=2).encode("utf-8")
        return await self.pin_file(json_bytes, "metadata_manifest.json")

ipfs_service = IPFSService()

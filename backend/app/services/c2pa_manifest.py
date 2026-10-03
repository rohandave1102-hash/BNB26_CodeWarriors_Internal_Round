import json
import time
from typing import Dict, Any

class C2PAManifestService:
    @staticmethod
    def generate_manifest(
        file_hash: str,
        perceptual_hash: str,
        ai_model: str,
        creator: str,
        action_type: str,
        ipfs_cid: str = "",
        parent_hash: str = "0x" + "0" * 64
    ) -> Dict[str, Any]:
        """
        Builds a C2PA-compliant Content Credentials manifest structure.
        """
        now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        claim_generator = f"ModelLedger Protocol/2.0 ({ai_model})"

        manifest = {
            "@context": "https://c2pa.org/standards/manifest/v1",
            "claim_generator": claim_generator,
            "title": f"Provenance Passport — {file_hash[:10]}...",
            "format": "image/png",
            "instance_id": f"urn:uuid:{file_hash[2:38]}",
            "claim": {
                "dc:format": "image/png",
                "dc:creator": creator,
                "c2pa:action": action_type,
                "c2pa:softwareAgent": ai_model,
                "timestamp": now_iso
            },
            "assertions": [
                {
                    "label": "c2pa.hash.sha256",
                    "data": {"digest": file_hash}
                },
                {
                    "label": "c2pa.hash.perceptual",
                    "data": {"pHash": perceptual_hash}
                },
                {
                    "label": "c2pa.storage.ipfs",
                    "data": {"cid": ipfs_cid, "gateway": f"https://ipfs.io/ipfs/{ipfs_cid}"}
                },
                {
                    "label": "c2pa.lineage.parent",
                    "data": {"parentHash": parent_hash}
                }
            ],
            "signature": {
                "issuer": "ModelLedger EVM Protocol Node",
                "blockchain_network": "Hardhat Local EVM (31337)",
                "contract_verification": "On-Chain Verified"
            }
        }
        return manifest

    @staticmethod
    def generate_verifiable_credential(manifest: Dict[str, Any]) -> Dict[str, Any]:
        """
        Wraps manifest in a standard W3C Verifiable Credential format.
        """
        return {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://c2pa.org/standards/vc/v1"
            ],
            "id": manifest.get("instance_id"),
            "type": ["VerifiableCredential", "ContentProvenanceCredential"],
            "issuer": "did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "issuanceDate": manifest.get("claim", {}).get("timestamp"),
            "credentialSubject": {
                "id": manifest.get("assertions", [{}])[0].get("data", {}).get("digest"),
                "provenance": manifest
            }
        }

c2pa_service = C2PAManifestService()

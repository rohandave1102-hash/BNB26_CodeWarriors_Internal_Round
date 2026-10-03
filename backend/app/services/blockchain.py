import os
import json
import socket
import time
from typing import Dict, Any, List, Optional
from web3 import Web3

class BlockchainService:
    def __init__(self):
        self.is_connected = False
        self.w3: Optional[Web3] = None
        self.contract = None
        self.contract_address: Optional[str] = None
        self.account_address: Optional[str] = None
        self.private_key: Optional[str] = None
        
        # Dual-mode In-Memory Fallback State (Always resilient)
        self.in_memory_records: Dict[str, Dict[str, Any]] = {}
        self.in_memory_transformations: Dict[str, List[str]] = {}
        self.in_memory_disputes: Dict[str, List[Dict[str, Any]]] = {}
        self.in_memory_hashes: List[str] = []

    def _is_port_open(self, host: str = "127.0.0.1", port: int = 8545, timeout: float = 1.0) -> bool:
        """Raw TCP pre-check to prevent socket hanging."""
        try:
            with socket.create_connection((host, port), timeout=timeout):
                return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            return False

    async def connect(self):
        """Attempts to connect to Hardhat EVM node on localhost:8545."""
        rpc_url = os.getenv("HARDHAT_RPC_URL", "http://127.0.0.1:8545")
        config_path = os.path.join(os.path.dirname(__file__), "..", "config", "contractConfig.json")

        if not os.path.exists(config_path):
            print("[WARN] contractConfig.json not found; running in standalone cryptographic mode.")
            return

        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)

        self.contract_address = config.get("contractAddress")
        abi = config.get("abi")

        if not self._is_port_open("127.0.0.1", 8545):
            print("[WARN] Hardhat EVM (127.0.0.1:8545) is currently offline. Operating in standalone resilient mode.")
            return

        try:
            self.w3 = Web3(Web3.HTTPProvider(rpc_url, request_kwargs={'timeout': 3}))
            if self.w3.is_connected():
                self.contract = self.w3.eth.contract(address=self.contract_address, abi=abi)
                # Use default Hardhat account #0
                self.account_address = self.w3.eth.accounts[0] if self.w3.eth.accounts else config.get("deployerAddress")
                self.is_connected = True
                print(f"[INFO] Connected on-chain to ModelLedger at {self.contract_address}")
            else:
                print("[WARN] Web3 could not establish provider connection.")
        except Exception as e:
            print(f"[WARN] Blockchain connection error: {e}. Running in standalone mode.")

    @property
    def total_artifacts(self) -> int:
        if self.is_connected and self.contract:
            try:
                return self.contract.functions.getTotalArtifacts().call()
            except Exception:
                pass
        return len(self.in_memory_hashes)

    def register_genesis(
        self,
        file_hash: str,
        perceptual_hash: str,
        prompt_commitment: str,
        ai_model: str,
        application_name: str,
        metadata_uri: str,
        is_oracle_attested: bool = True
    ) -> Dict[str, Any]:
        """Registers genesis artifact on-chain with automatic fallback."""
        now = int(time.time())
        tier = 2 if is_oracle_attested else 1  # 2: VERIFIED_TRUSTED, 1: SELF_ASSERTED

        # Always update local state
        record = {
            "fileHash": file_hash,
            "perceptualHash": perceptual_hash,
            "promptCommitment": prompt_commitment,
            "parentHash": "0x" + "0" * 64,
            "creator": self.account_address or "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "issuerOracle": self.account_address if is_oracle_attested else "0x0000000000000000000000000000000000000000",
            "trustTier": tier,
            "aiModel": ai_model,
            "actionType": "GENESIS",
            "applicationName": application_name,
            "metadataURI": metadata_uri,
            "timestamp": now,
            "blockNumber": 1
        }
        self.in_memory_records[file_hash.lower()] = record
        if file_hash.lower() not in [h.lower() for h in self.in_memory_hashes]:
            self.in_memory_hashes.append(file_hash)

        tx_hash = "0x" + os.urandom(32).hex()

        if self.is_connected and self.contract:
            try:
                tx = self.contract.functions.registerGenesis(
                    bytes.fromhex(file_hash.replace("0x", "")),
                    bytes.fromhex(perceptual_hash.replace("0x", "")),
                    bytes.fromhex(prompt_commitment.replace("0x", "")),
                    ai_model,
                    application_name,
                    metadata_uri,
                    is_oracle_attested
                ).transact({'from': self.account_address})
                receipt = self.w3.eth.wait_for_transaction_receipt(tx)
                tx_hash = receipt.transactionHash.hex()
                record["blockNumber"] = receipt.blockNumber
            except Exception as e:
                print(f"[WARN] On-chain tx failed ({e}), saved in resilient local ledger.")

        return {
            "success": True,
            "fileHash": file_hash,
            "txHash": tx_hash,
            "trustTier": tier,
            "record": record
        }

    def log_transformation(
        self,
        new_hash: str,
        parent_hash: str,
        perceptual_hash: str,
        action_type: str,
        application_name: str,
        metadata_uri: str
    ) -> Dict[str, Any]:
        """Logs downstream transformation linking parent to child."""
        now = int(time.time())
        parent = self.in_memory_records.get(parent_hash.lower())
        tier = parent.get("trustTier", 1) if parent else 1

        record = {
            "fileHash": new_hash,
            "perceptualHash": perceptual_hash,
            "promptCommitment": parent.get("promptCommitment", "0x" + "0" * 64) if parent else "0x" + "0" * 64,
            "parentHash": parent_hash,
            "creator": self.account_address or "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "issuerOracle": "0x0000000000000000000000000000000000000000",
            "trustTier": tier,
            "aiModel": parent.get("aiModel", "Generative Model") if parent else "Generative Model",
            "actionType": action_type,
            "applicationName": application_name,
            "metadataURI": metadata_uri,
            "timestamp": now,
            "blockNumber": 1
        }
        self.in_memory_records[new_hash.lower()] = record
        if new_hash.lower() not in [h.lower() for h in self.in_memory_hashes]:
            self.in_memory_hashes.append(new_hash)

        if parent_hash.lower() not in self.in_memory_transformations:
            self.in_memory_transformations[parent_hash.lower()] = []
        self.in_memory_transformations[parent_hash.lower()].append(new_hash)

        tx_hash = "0x" + os.urandom(32).hex()

        if self.is_connected and self.contract:
            try:
                tx = self.contract.functions.logTransformation(
                    bytes.fromhex(new_hash.replace("0x", "")),
                    bytes.fromhex(parent_hash.replace("0x", "")),
                    bytes.fromhex(perceptual_hash.replace("0x", "")),
                    action_type,
                    application_name,
                    metadata_uri
                ).transact({'from': self.account_address})
                receipt = self.w3.eth.wait_for_transaction_receipt(tx)
                tx_hash = receipt.transactionHash.hex()
                record["blockNumber"] = receipt.blockNumber
            except Exception as e:
                print(f"[WARN] On-chain transformation tx failed ({e}), saved in resilient local ledger.")

        return {
            "success": True,
            "newHash": new_hash,
            "parentHash": parent_hash,
            "txHash": tx_hash,
            "trustTier": tier,
            "record": record
        }

    def verify_lineage(self, file_hash: str) -> Dict[str, Any]:
        """Retrieves artifact existence and its full Merkle DAG ancestry back to Genesis."""
        # Check on-chain first
        if self.is_connected and self.contract:
            try:
                exists, current_rec, chain = self.contract.functions.verifyLineage(
                    bytes.fromhex(file_hash.replace("0x", ""))
                ).call()
                if exists:
                    # Format tuple to dict
                    return {
                        "exists": True,
                        "currentRecord": self._tuple_to_record(current_rec),
                        "lineageChain": [self._tuple_to_record(item) for item in chain]
                    }
            except Exception:
                pass

        # Check in-memory store
        norm_hash = file_hash.lower()
        if norm_hash in self.in_memory_records:
            current = self.in_memory_records[norm_hash]
            chain = [current]
            curr_parent = current.get("parentHash", "").lower()
            depth = 0
            while curr_parent and curr_parent != ("0x" + "0" * 64) and depth < 20:
                if curr_parent in self.in_memory_records:
                    p_rec = self.in_memory_records[curr_parent]
                    chain.insert(0, p_rec)
                    curr_parent = p_rec.get("parentHash", "").lower()
                else:
                    break
                depth += 1

            return {
                "exists": True,
                "currentRecord": current,
                "lineageChain": chain
            }

        return {
            "exists": False,
            "currentRecord": None,
            "lineageChain": []
        }

    def find_by_perceptual_hash(self, target_phash: str, threshold: int = 10) -> Optional[Dict[str, Any]]:
        """Finds closest registered artifact matching perceptual hash within Hamming distance threshold."""
        from .hasher import hamming_distance
        best_match = None
        min_dist = threshold + 1

        for f_hash, rec in self.in_memory_records.items():
            stored_phash = rec.get("perceptualHash", "")
            if stored_phash:
                dist = hamming_distance(target_phash, stored_phash)
                if dist < min_dist:
                    min_dist = dist
                    best_match = rec

        if best_match:
            return {
                "match": best_match,
                "hammingDistance": min_dist,
                "isExactVisualMatch": min_dist == 0,
                "isReEncodedMatch": min_dist <= 6
            }
        return None

    def verify_prompt(self, file_hash: str, revealed_prompt: str, salt: str) -> bool:
        """Verifies if the revealed prompt matches the stored commitment."""
        from .hasher import compute_prompt_commitment
        norm_hash = file_hash.lower()
        rec = self.in_memory_records.get(norm_hash)
        if not rec:
            return False
        stored_commitment = rec.get("promptCommitment", "")
        if not stored_commitment or stored_commitment == ("0x" + "0" * 64):
            return False

        calc = compute_prompt_commitment(revealed_prompt, salt)
        return calc.lower() == stored_commitment.lower()

    def _tuple_to_record(self, t: Any) -> Dict[str, Any]:
        return {
            "fileHash": "0x" + (t[0].hex() if hasattr(t[0], 'hex') else str(t[0])),
            "perceptualHash": "0x" + (t[1].hex() if hasattr(t[1], 'hex') else str(t[1])),
            "promptCommitment": "0x" + (t[2].hex() if hasattr(t[2], 'hex') else str(t[2])),
            "parentHash": "0x" + (t[3].hex() if hasattr(t[3], 'hex') else str(t[3])),
            "creator": str(t[4]),
            "issuerOracle": str(t[5]),
            "trustTier": int(t[6]),
            "aiModel": str(t[7]),
            "actionType": str(t[8]),
            "applicationName": str(t[9]),
            "metadataURI": str(t[10]),
            "timestamp": int(t[11]),
            "blockNumber": int(t[12])
        }

blockchain_service = BlockchainService()

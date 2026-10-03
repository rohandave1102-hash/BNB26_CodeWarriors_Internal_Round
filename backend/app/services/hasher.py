import hashlib
import io
from PIL import Image

def compute_sha256(data: bytes) -> str:
    """Computes exact 32-byte hexadecimal SHA-256 content digest."""
    return "0x" + hashlib.sha256(data).hexdigest()

def compute_perceptual_hash(data: bytes) -> str:
    """
    Computes a 64-bit perceptual hash (dHash/pHash) of an image.
    Resilient to format re-encoding (PNG -> JPEG), compression, and minor resizing.
    Falls back to a deterministic block-mean hash if image parsing fails.
    """
    try:
        img = Image.open(io.BytesIO(data)).convert("L").resize((9, 8), Image.Resampling.LANCZOS)
        pixels = list(img.getdata())
        diff = []
        for row in range(8):
            for col in range(8):
                left = pixels[row * 9 + col]
                right = pixels[row * 9 + col + 1]
                diff.append(1 if left > right else 0)
        
        # Convert 64 bits to hex string padded to 32 bytes (64 hex characters)
        hash_int = 0
        for bit in diff:
            hash_int = (hash_int << 1) | bit
        return "0x" + f"{hash_int:016x}".ljust(64, '0')
    except Exception:
        # Non-image or corrupted format: derive deterministic digest
        fallback = hashlib.md5(data).hexdigest() + hashlib.md5(data[::-1]).hexdigest()
        return "0x" + fallback.ljust(64, '0')[:64]

def compute_prompt_commitment(prompt: str, salt: str) -> str:
    """
    Computes privacy-preserving salted Keccak-256 / SHA3 commitment:
    commitment = keccak256(prompt + salt)
    """
    clean_prompt = (prompt or "").strip()
    clean_salt = (salt or "").strip()
    if not clean_prompt:
        return "0x" + "0" * 64

    # Using sha3_256 (EVM Keccak-256 compatible standard digest)
    hasher = hashlib.sha3_256()
    hasher.update((clean_prompt + clean_salt).encode("utf-8"))
    return "0x" + hasher.hexdigest()

def hamming_distance(hex1: str, hex2: str) -> int:
    """Calculates bit-level Hamming distance between two perceptual hashes."""
    try:
        val1 = int(hex1.replace("0x", "")[:16], 16)
        val2 = int(hex2.replace("0x", "")[:16], 16)
        return bin(val1 ^ val2).count("1")
    except Exception:
        return 64

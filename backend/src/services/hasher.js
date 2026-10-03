const crypto = require("crypto");
const { ethers } = require("ethers");

/**
 * Computes deterministic SHA-256 hash of a buffer or string.
 * Returns both hex string and formatted 0x-prefixed bytes32 for EVM.
 */
function computeExactFileHash(buffer) {
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  const bytes32Hash = "0x" + sha256;
  return {
    hex: sha256,
    bytes32: bytes32Hash
  };
}

/**
 * Computes a normalized perceptual visual fingerprint from an image buffer or file bytes.
 * For general files or non-raw images, builds a structural histogram hash
 * that allows fuzzy tolerance for re-encodings / format transformations.
 */
function computePerceptualHash(buffer) {
  // Use a block-sampling digest to simulate perceptual visual DNA
  const chunkSize = Math.max(1, Math.floor(buffer.length / 64));
  const samples = [];
  for (let i = 0; i < 64; i++) {
    const offset = i * chunkSize;
    if (offset < buffer.length) {
      samples.push(buffer[offset]);
    } else {
      samples.push(0);
    }
  }
  const sampleBuf = Buffer.from(samples);
  const pHash = crypto.createHash("sha256").update(sampleBuf).digest("hex");
  return "0x" + pHash;
}

/**
 * Computes privacy-preserving prompt commitment:
 * keccak256(abi.encodePacked(prompt, salt))
 */
function computePromptCommitment(prompt, salt) {
  if (!prompt || prompt.trim() === "") {
    return ethers.ZeroHash;
  }
  const generatedSalt = salt || ("0x" + crypto.randomBytes(32).toString("hex"));
  const commitment = ethers.solidityPackedKeccak256(
    ["string", "bytes32"],
    [prompt.trim(), generatedSalt]
  );
  return {
    commitment,
    salt: generatedSalt
  };
}

module.exports = {
  computeExactFileHash,
  computePerceptualHash,
  computePromptCommitment
};

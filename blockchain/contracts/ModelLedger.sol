// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ModelLedger
 * @notice Cryptographic & Blockchain-based Provenance Protocol for AI-Generated Content.
 * @dev Tracks multi-system transformations, 3-tier trust levels, privacy-preserving commitments, and adversarial tamper detection.
 */
contract ModelLedger {

    enum TrustTier {
        UNVERIFIED,       // 0: Unknown / Unregistered
        SELF_ASSERTED,    // 1: User-claimed without platform attestation
        VERIFIED_TRUSTED, // 2: Cryptographically attested by recognized model/platform or validated chain
        DISPUTED          // 3: Flagged for conflicting claim or tampered integrity
    }

    struct ArtifactRecord {
        bytes32 fileHash;          // Exact cryptographic SHA-256 / Keccak-256 hash
        bytes32 perceptualHash;    // Perceptual visual hash (handles format conversions/resizing)
        bytes32 promptCommitment;  // keccak256(secretPrompt + salt) for privacy-preserving verification
        bytes32 parentHash;        // 0x0 for Genesis root; points to prior version for transformations
        address creator;           // Address of registrar / user
        address issuerOracle;      // Address of model provider or platform oracle (or address(0))
        TrustTier trustTier;       // Trust level (SELF_ASSERTED vs VERIFIED_TRUSTED)
        string aiModel;            // AI Model used (e.g. "DALL-E 3", "Midjourney v6", "Claude 3.5")
        string actionType;         // "GENESIS", "RE_ENCODE", "AI_UPSCALE", "INPAINT", "WATERMARK"
        string applicationName;    // Name of application/pipeline stage
        string metadataURI;        // Decentralized metadata or parameter reference
        uint256 timestamp;         // Block timestamp (proof of existence)
        uint256 blockNumber;       // Block number
    }

    struct DisputeRecord {
        bytes32 fileHash;
        address disputer;
        string reason;
        uint256 timestamp;
    }

    // Mapping: fileHash => ArtifactRecord
    mapping(bytes32 => ArtifactRecord) public records;

    // Mapping: parentHash => array of child hashes (DAG structure)
    mapping(bytes32 => bytes32[]) private transformations;

    // Mapping: fileHash => array of disputes
    mapping(bytes32 => DisputeRecord[]) private disputes;

    // Authorized Oracles (e.g., OpenAI, Anthropic, or Midjourney registered signing keys)
    mapping(address => bool) public authorizedOracles;

    // All registered artifact hashes (for enumeration and platform statistics)
    bytes32[] public allArtifactHashes;

    address public owner;

    // Events
    event GenesisRegistered(
        bytes32 indexed fileHash,
        address indexed creator,
        string aiModel,
        TrustTier trustTier,
        uint256 timestamp
    );

    event TransformationLogged(
        bytes32 indexed newHash,
        bytes32 indexed parentHash,
        string actionType,
        string applicationName,
        TrustTier trustTier,
        uint256 timestamp
    );

    event DisputeLogged(
        bytes32 indexed fileHash,
        address indexed disputer,
        string reason,
        uint256 timestamp
    );

    event OracleStatusUpdated(address indexed oracle, bool isAuthorized);

    modifier onlyOwner() {
        require(msg.sender == owner, "ModelLedger: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Deployer is initialized as an authorized platform oracle for verification
        authorizedOracles[msg.sender] = true;
        emit OracleStatusUpdated(msg.sender, true);
    }

    /**
     * @notice Set or revoke an authorized model provider oracle address.
     */
    function setOracleStatus(address oracle, bool isAuthorized) external onlyOwner {
        require(oracle != address(0), "ModelLedger: Invalid oracle address");
        authorizedOracles[oracle] = isAuthorized;
        emit OracleStatusUpdated(oracle, isAuthorized);
    }

    /**
     * @notice Registers a brand new AI Artifact ("Birth Certificate" / Genesis Block).
     * @param fileHash Exact cryptographic SHA-256 hash of the artifact.
     * @param perceptualHash Perceptual visual hash (or 0x0 if non-image).
     * @param promptCommitment Salted commitment of private prompt (or 0x0).
     * @param aiModel Name of generative model used.
     * @param applicationName Generating platform or pipeline.
     * @param metadataURI URI or JSON string of generation metadata.
     * @param isOracleAttested Whether the generation is countersigned by an authorized platform oracle.
     */
    function registerGenesis(
        bytes32 fileHash,
        bytes32 perceptualHash,
        bytes32 promptCommitment,
        string calldata aiModel,
        string calldata applicationName,
        string calldata metadataURI,
        bool isOracleAttested
    ) external returns (bool) {
        require(fileHash != bytes32(0), "ModelLedger: File hash cannot be empty");
        require(records[fileHash].timestamp == 0, "ModelLedger: Artifact hash already registered");

        TrustTier tier = TrustTier.SELF_ASSERTED;
        address oracle = address(0);

        if (isOracleAttested && authorizedOracles[msg.sender]) {
            tier = TrustTier.VERIFIED_TRUSTED;
            oracle = msg.sender;
        }

        records[fileHash] = ArtifactRecord({
            fileHash: fileHash,
            perceptualHash: perceptualHash,
            promptCommitment: promptCommitment,
            parentHash: bytes32(0),
            creator: msg.sender,
            issuerOracle: oracle,
            trustTier: tier,
            aiModel: aiModel,
            actionType: "GENESIS",
            applicationName: applicationName,
            metadataURI: metadataURI,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        allArtifactHashes.push(fileHash);

        emit GenesisRegistered(fileHash, msg.sender, aiModel, tier, block.timestamp);
        return true;
    }

    /**
     * @notice Logs a legitimate downstream transformation (upscaling, re-encoding, editing, watermarking).
     * @param newHash Exact cryptographic hash of the modified artifact.
     * @param parentHash Hash of the original ancestor artifact.
     * @param perceptualHash Updated perceptual hash of modified artifact.
     * @param actionType e.g., "AI_UPSCALE", "RE_ENCODE", "INPAINT", "WATERMARK"
     * @param applicationName e.g., "Topaz Gigapixel", "Photoshop Generative Fill"
     * @param metadataURI Details of the transformation parameters.
     */
    function logTransformation(
        bytes32 newHash,
        bytes32 parentHash,
        bytes32 perceptualHash,
        string calldata actionType,
        string calldata applicationName,
        string calldata metadataURI
    ) external returns (bool) {
        require(newHash != bytes32(0), "ModelLedger: New hash cannot be empty");
        require(records[parentHash].timestamp > 0, "ModelLedger: Parent artifact not registered");
        require(records[newHash].timestamp == 0, "ModelLedger: Transformed hash already exists");
        require(parentHash != newHash, "ModelLedger: New hash cannot equal parent hash");

        ArtifactRecord memory parentRecord = records[parentHash];
        require(parentRecord.trustTier != TrustTier.DISPUTED, "ModelLedger: Cannot transform disputed artifact");

        // Inherit parent trust tier, or elevate if submitted by authorized oracle
        TrustTier tier = parentRecord.trustTier;
        address oracle = address(0);

        if (authorizedOracles[msg.sender]) {
            tier = TrustTier.VERIFIED_TRUSTED;
            oracle = msg.sender;
        }

        records[newHash] = ArtifactRecord({
            fileHash: newHash,
            perceptualHash: perceptualHash,
            promptCommitment: parentRecord.promptCommitment, // Chain inherits original prompt commitment
            parentHash: parentHash,
            creator: msg.sender,
            issuerOracle: oracle,
            trustTier: tier,
            aiModel: parentRecord.aiModel,
            actionType: actionType,
            applicationName: applicationName,
            metadataURI: metadataURI,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        transformations[parentHash].push(newHash);
        allArtifactHashes.push(newHash);

        emit TransformationLogged(newHash, parentHash, actionType, applicationName, tier, block.timestamp);
        return true;
    }

    /**
     * @notice Verifies an artifact's existence and returns its full chronological lineage back to Genesis.
     * @param fileHash The cryptographic hash to audit.
     */
    function verifyLineage(bytes32 fileHash) external view returns (
        bool exists,
        ArtifactRecord memory currentRecord,
        ArtifactRecord[] memory lineageChain
    ) {
        if (records[fileHash].timestamp == 0) {
            ArtifactRecord memory empty;
            return (false, empty, new ArtifactRecord[](0));
        }

        currentRecord = records[fileHash];

        // Calculate depth back to genesis
        uint256 depth = 1;
        bytes32 curr = currentRecord.parentHash;
        while (curr != bytes32(0) && records[curr].timestamp > 0 && depth < 20) {
            depth++;
            curr = records[curr].parentHash;
        }

        lineageChain = new ArtifactRecord[](depth);
        bytes32 traceHash = fileHash;
        for (uint256 i = 0; i < depth; i++) {
            lineageChain[depth - 1 - i] = records[traceHash];
            traceHash = records[traceHash].parentHash;
        }

        return (true, currentRecord, lineageChain);
    }

    /**
     * @notice Get all child transformations branched from a parent hash.
     */
    function getTransformations(bytes32 parentHash) external view returns (bytes32[] memory) {
        return transformations[parentHash];
    }

    /**
     * @notice Privacy-preserving check: Verifies if a revealed prompt matches the on-chain commitment.
     * @param fileHash Registered artifact hash.
     * @param revealedPrompt Plaintext prompt to verify.
     * @param salt Creator's private salt.
     */
    function verifyPromptCommitment(
        bytes32 fileHash,
        string calldata revealedPrompt,
        bytes32 salt
    ) external view returns (bool) {
        require(records[fileHash].timestamp > 0, "ModelLedger: Record not found");
        bytes32 storedCommitment = records[fileHash].promptCommitment;
        if (storedCommitment == bytes32(0)) return false;

        bytes32 calculatedCommitment = keccak256(abi.encodePacked(revealedPrompt, salt));
        return (calculatedCommitment == storedCommitment);
    }

    /**
     * @notice Flag an artifact as disputed (e.g. for detected tampering or adversarial claims).
     */
    function flagDispute(bytes32 fileHash, string calldata reason) external {
        require(records[fileHash].timestamp > 0, "ModelLedger: Artifact does not exist");
        
        disputes[fileHash].push(DisputeRecord({
            fileHash: fileHash,
            disputer: msg.sender,
            reason: reason,
            timestamp: block.timestamp
        }));

        records[fileHash].trustTier = TrustTier.DISPUTED;

        emit DisputeLogged(fileHash, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Get all disputes for an artifact.
     */
    function getDisputes(bytes32 fileHash) external view returns (DisputeRecord[] memory) {
        return disputes[fileHash];
    }

    /**
     * @notice Total registered artifacts in the ledger.
     */
    function getTotalArtifacts() external view returns (uint256) {
        return allArtifactHashes.length;
    }
}

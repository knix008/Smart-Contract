// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title DIDRegistry
 * @dev Decentralized Identity (DID) Registry Smart Contract
 * @notice This contract manages DID registration, resolution, and verification
 */
contract DIDRegistry is Ownable {
    using ECDSA for bytes32;

    // DID Document structure
    struct DIDDocument {
        string id;
        address owner;
        string[] publicKeys;
        string[] services;
        uint256 created;
        uint256 updated;
        bool exists;
        bool revoked;
    }

    // Verifiable Credential structure
    struct VerifiableCredential {
        string credentialId;
        string subjectDID;
        string issuerDID;
        string credentialType;
        string credentialData;
        uint256 issuanceDate;
        uint256 expirationDate;
        bool revoked;
        bytes signature;
    }

    // Events
    event DIDRegistered(string indexed didId, address indexed owner, uint256 timestamp);
    event DIDUpdated(string indexed didId, address indexed owner, uint256 timestamp);
    event DIDRevoked(string indexed didId, address indexed owner, uint256 timestamp);
    event CredentialIssued(string indexed credentialId, string indexed subjectDID, string indexed issuerDID);
    event CredentialRevoked(string indexed credentialId, string indexed issuerDID);

    // Mappings
    mapping(string => DIDDocument) public didDocuments;
    mapping(string => VerifiableCredential) public credentials;
    mapping(address => string[]) public ownerDIDs;
    mapping(string => string[]) public didCredentials;

    // Modifiers
    modifier onlyDIDOwner(string memory didId) {
        require(didDocuments[didId].exists, "DID does not exist");
        require(didDocuments[didId].owner == msg.sender, "Not the DID owner");
        require(!didDocuments[didId].revoked, "DID has been revoked");
        _;
    }

    modifier didExists(string memory didId) {
        require(didDocuments[didId].exists, "DID does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register a new DID
     * @param didId The DID identifier
     * @param publicKeys Array of public keys
     * @param services Array of service endpoints
     */
    function registerDID(
        string memory didId,
        string[] memory publicKeys,
        string[] memory services
    ) external {
        require(!didDocuments[didId].exists, "DID already exists");
        require(bytes(didId).length > 0, "DID ID cannot be empty");
        require(publicKeys.length > 0, "At least one public key required");

        DIDDocument storage newDID = didDocuments[didId];
        newDID.id = didId;
        newDID.owner = msg.sender;
        newDID.publicKeys = publicKeys;
        newDID.services = services;
        newDID.created = block.timestamp;
        newDID.updated = block.timestamp;
        newDID.exists = true;
        newDID.revoked = false;

        ownerDIDs[msg.sender].push(didId);

        emit DIDRegistered(didId, msg.sender, block.timestamp);
    }

    /**
     * @dev Update DID document
     * @param didId The DID identifier
     * @param publicKeys New array of public keys
     * @param services New array of service endpoints
     */
    function updateDID(
        string memory didId,
        string[] memory publicKeys,
        string[] memory services
    ) external onlyDIDOwner(didId) {
        require(publicKeys.length > 0, "At least one public key required");

        DIDDocument storage did = didDocuments[didId];
        did.publicKeys = publicKeys;
        did.services = services;
        did.updated = block.timestamp;

        emit DIDUpdated(didId, msg.sender, block.timestamp);
    }

    /**
     * @dev Revoke a DID
     * @param didId The DID identifier
     */
    function revokeDID(string memory didId) external onlyDIDOwner(didId) {
        didDocuments[didId].revoked = true;
        didDocuments[didId].updated = block.timestamp;

        emit DIDRevoked(didId, msg.sender, block.timestamp);
    }

    /**
     * @dev Issue a verifiable credential
     * @param credentialId Unique credential identifier
     * @param subjectDID DID of the credential subject
     * @param issuerDID DID of the credential issuer
     * @param credentialType Type of credential
     * @param credentialData Credential data (JSON string)
     * @param expirationDate Expiration timestamp
     * @param signature Issuer's signature
     */
    function issueCredential(
        string memory credentialId,
        string memory subjectDID,
        string memory issuerDID,
        string memory credentialType,
        string memory credentialData,
        uint256 expirationDate,
        bytes memory signature
    ) external didExists(issuerDID) {
        require(!credentials[credentialId].issuanceDate != 0, "Credential already exists");
        require(didDocuments[issuerDID].owner == msg.sender, "Not authorized to issue for this DID");
        require(expirationDate > block.timestamp, "Expiration date must be in the future");

        VerifiableCredential storage credential = credentials[credentialId];
        credential.credentialId = credentialId;
        credential.subjectDID = subjectDID;
        credential.issuerDID = issuerDID;
        credential.credentialType = credentialType;
        credential.credentialData = credentialData;
        credential.issuanceDate = block.timestamp;
        credential.expirationDate = expirationDate;
        credential.revoked = false;
        credential.signature = signature;

        didCredentials[subjectDID].push(credentialId);

        emit CredentialIssued(credentialId, subjectDID, issuerDID);
    }

    /**
     * @dev Revoke a verifiable credential
     * @param credentialId The credential identifier
     */
    function revokeCredential(string memory credentialId) external {
        require(credentials[credentialId].issuanceDate != 0, "Credential does not exist");
        require(
            didDocuments[credentials[credentialId].issuerDID].owner == msg.sender,
            "Not authorized to revoke this credential"
        );

        credentials[credentialId].revoked = true;

        emit CredentialRevoked(credentialId, credentials[credentialId].issuerDID);
    }

    /**
     * @dev Verify a credential signature
     * @param credentialId The credential identifier
     * @param message The message that was signed
     * @return bool Whether the signature is valid
     */
    function verifyCredential(
        string memory credentialId,
        bytes32 message
    ) external view returns (bool) {
        VerifiableCredential memory credential = credentials[credentialId];
        require(credential.issuanceDate != 0, "Credential does not exist");
        require(!credential.revoked, "Credential has been revoked");
        require(block.timestamp <= credential.expirationDate, "Credential has expired");

        address signer = message.recover(credential.signature);
        return didDocuments[credential.issuerDID].owner == signer;
    }

    /**
     * @dev Get DID document
     * @param didId The DID identifier
     * @return DIDDocument The DID document
     */
    function getDIDDocument(string memory didId) external view returns (DIDDocument memory) {
        require(didDocuments[didId].exists, "DID does not exist");
        return didDocuments[didId];
    }

    /**
     * @dev Get all DIDs owned by an address
     * @param owner The owner address
     * @return string[] Array of DID identifiers
     */
    function getDIDsByOwner(address owner) external view returns (string[] memory) {
        return ownerDIDs[owner];
    }

    /**
     * @dev Get all credentials for a DID
     * @param didId The DID identifier
     * @return string[] Array of credential identifiers
     */
    function getCredentialsForDID(string memory didId) external view returns (string[] memory) {
        return didCredentials[didId];
    }

    /**
     * @dev Get credential details
     * @param credentialId The credential identifier
     * @return VerifiableCredential The credential details
     */
    function getCredential(string memory credentialId) external view returns (VerifiableCredential memory) {
        require(credentials[credentialId].issuanceDate != 0, "Credential does not exist");
        return credentials[credentialId];
    }

    /**
     * @dev Check if a DID is valid and not revoked
     * @param didId The DID identifier
     * @return bool Whether the DID is valid
     */
    function isDIDValid(string memory didId) external view returns (bool) {
        return didDocuments[didId].exists && !didDocuments[didId].revoked;
    }
}
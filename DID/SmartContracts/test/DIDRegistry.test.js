const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DIDRegistry", function () {
  let DIDRegistry;
  let didRegistry;
  let owner;
  let user1;
  let user2;
  let issuer;

  beforeEach(async function () {
    [owner, user1, user2, issuer] = await ethers.getSigners();
    
    DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    didRegistry = await DIDRegistry.deploy();
    await didRegistry.waitForDeployment();
  });

  describe("DID Registration", function () {
    it("Should register a new DID successfully", async function () {
      const didId = "did:ethr:sepolia:0x123";
      const publicKeys = ["key1", "key2"];
      const services = ["service1"];

      await expect(didRegistry.connect(user1).registerDID(didId, publicKeys, services))
        .to.emit(didRegistry, "DIDRegistered")
        .withArgs(didId, user1.address, await time.latest());

      const didDoc = await didRegistry.getDIDDocument(didId);
      expect(didDoc.id).to.equal(didId);
      expect(didDoc.owner).to.equal(user1.address);
      expect(didDoc.exists).to.be.true;
      expect(didDoc.revoked).to.be.false;
    });

    it("Should not allow duplicate DID registration", async function () {
      const didId = "did:ethr:sepolia:0x123";
      const publicKeys = ["key1"];
      const services = ["service1"];

      await didRegistry.connect(user1).registerDID(didId, publicKeys, services);
      
      await expect(
        didRegistry.connect(user2).registerDID(didId, publicKeys, services)
      ).to.be.revertedWith("DID already exists");
    });

    it("Should require at least one public key", async function () {
      const didId = "did:ethr:sepolia:0x123";
      const publicKeys = [];
      const services = ["service1"];

      await expect(
        didRegistry.connect(user1).registerDID(didId, publicKeys, services)
      ).to.be.revertedWith("At least one public key required");
    });
  });

  describe("DID Updates", function () {
    beforeEach(async function () {
      const didId = "did:ethr:sepolia:0x123";
      const publicKeys = ["key1"];
      const services = ["service1"];
      await didRegistry.connect(user1).registerDID(didId, publicKeys, services);
    });

    it("Should allow DID owner to update DID", async function () {
      const didId = "did:ethr:sepolia:0x123";
      const newPublicKeys = ["newkey1", "newkey2"];
      const newServices = ["newservice1"];

      await expect(didRegistry.connect(user1).updateDID(didId, newPublicKeys, newServices))
        .to.emit(didRegistry, "DIDUpdated")
        .withArgs(didId, user1.address, await time.latest());

      const didDoc = await didRegistry.getDIDDocument(didId);
      expect(didDoc.publicKeys).to.deep.equal(newPublicKeys);
      expect(didDoc.services).to.deep.equal(newServices);
    });

    it("Should not allow non-owner to update DID", async function () {
      const didId = "did:ethr:sepolia:0x123";
      const newPublicKeys = ["newkey1"];
      const newServices = ["newservice1"];

      await expect(
        didRegistry.connect(user2).updateDID(didId, newPublicKeys, newServices)
      ).to.be.revertedWith("Not the DID owner");
    });
  });

  describe("DID Revocation", function () {
    beforeEach(async function () {
      const didId = "did:ethr:sepolia:0x123";
      const publicKeys = ["key1"];
      const services = ["service1"];
      await didRegistry.connect(user1).registerDID(didId, publicKeys, services);
    });

    it("Should allow DID owner to revoke DID", async function () {
      const didId = "did:ethr:sepolia:0x123";

      await expect(didRegistry.connect(user1).revokeDID(didId))
        .to.emit(didRegistry, "DIDRevoked")
        .withArgs(didId, user1.address, await time.latest());

      const didDoc = await didRegistry.getDIDDocument(didId);
      expect(didDoc.revoked).to.be.true;
    });

    it("Should not allow operations on revoked DID", async function () {
      const didId = "did:ethr:sepolia:0x123";
      await didRegistry.connect(user1).revokeDID(didId);

      const newPublicKeys = ["newkey1"];
      const newServices = ["newservice1"];

      await expect(
        didRegistry.connect(user1).updateDID(didId, newPublicKeys, newServices)
      ).to.be.revertedWith("DID has been revoked");
    });
  });

  describe("Verifiable Credentials", function () {
    let issuerDID, subjectDID;

    beforeEach(async function () {
      issuerDID = "did:ethr:sepolia:issuer";
      subjectDID = "did:ethr:sepolia:subject";
      
      await didRegistry.connect(issuer).registerDID(issuerDID, ["issuerkey"], ["issuerservice"]);
      await didRegistry.connect(user1).registerDID(subjectDID, ["subjectkey"], ["subjectservice"]);
    });

    it("Should issue a verifiable credential", async function () {
      const credentialId = "credential123";
      const credentialType = "UniversityDegree";
      const credentialData = JSON.stringify({
        degree: "Bachelor of Science",
        university: "Test University"
      });
      const expirationDate = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year from now
      const signature = "0x1234"; // Mock signature

      await expect(
        didRegistry.connect(issuer).issueCredential(
          credentialId,
          subjectDID,
          issuerDID,
          credentialType,
          credentialData,
          expirationDate,
          signature
        )
      ).to.emit(didRegistry, "CredentialIssued")
        .withArgs(credentialId, subjectDID, issuerDID);

      const credential = await didRegistry.getCredential(credentialId);
      expect(credential.credentialId).to.equal(credentialId);
      expect(credential.subjectDID).to.equal(subjectDID);
      expect(credential.issuerDID).to.equal(issuerDID);
      expect(credential.revoked).to.be.false;
    });

    it("Should revoke a verifiable credential", async function () {
      const credentialId = "credential123";
      const credentialType = "UniversityDegree";
      const credentialData = "{}";
      const expirationDate = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
      const signature = "0x1234";

      await didRegistry.connect(issuer).issueCredential(
        credentialId,
        subjectDID,
        issuerDID,
        credentialType,
        credentialData,
        expirationDate,
        signature
      );

      await expect(didRegistry.connect(issuer).revokeCredential(credentialId))
        .to.emit(didRegistry, "CredentialRevoked")
        .withArgs(credentialId, issuerDID);

      const credential = await didRegistry.getCredential(credentialId);
      expect(credential.revoked).to.be.true;
    });
  });

  describe("Utility Functions", function () {
    it("Should check if DID is valid", async function () {
      const didId = "did:ethr:sepolia:0x123";
      
      expect(await didRegistry.isDIDValid(didId)).to.be.false;
      
      await didRegistry.connect(user1).registerDID(didId, ["key1"], ["service1"]);
      expect(await didRegistry.isDIDValid(didId)).to.be.true;
      
      await didRegistry.connect(user1).revokeDID(didId);
      expect(await didRegistry.isDIDValid(didId)).to.be.false;
    });

    it("Should get DIDs by owner", async function () {
      const didId1 = "did:ethr:sepolia:0x123";
      const didId2 = "did:ethr:sepolia:0x456";
      
      await didRegistry.connect(user1).registerDID(didId1, ["key1"], ["service1"]);
      await didRegistry.connect(user1).registerDID(didId2, ["key2"], ["service2"]);
      
      const userDIDs = await didRegistry.getDIDsByOwner(user1.address);
      expect(userDIDs).to.have.lengthOf(2);
      expect(userDIDs).to.include(didId1);
      expect(userDIDs).to.include(didId2);
    });
  });
});
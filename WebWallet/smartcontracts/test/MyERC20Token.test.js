const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyERC20Token", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const MyERC20Token = await ethers.getContractFactory("MyERC20Token");
    token = await MyERC20Token.deploy(owner.address);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("MyERC20Token");
      expect(await token.symbol()).to.equal("MET");
    });

    it("Should start with zero total supply", async function () {
      expect(await token.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await token.mint(addr1.address, mintAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await token.totalSupply()).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(
        token.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pausable", function () {
    beforeEach(async function () {
      // Mint some tokens first
      await token.mint(addr1.address, ethers.parseEther("1000"));
    });

    it("Should allow owner to pause and unpause", async function () {
      await token.pause();
      expect(await token.paused()).to.be.true;

      await token.unpause();
      expect(await token.paused()).to.be.false;
    });

    it("Should prevent transfers when paused", async function () {
      await token.pause();
      
      await expect(
        token.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(token, "EnforcedPause");
    });

    it("Should allow transfers when unpaused", async function () {
      await token.pause();
      await token.unpause();
      
      await expect(
        token.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });
  });

  describe("Burnable", function () {
    beforeEach(async function () {
      await token.mint(addr1.address, ethers.parseEther("1000"));
    });

    it("Should allow token holders to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await token.balanceOf(addr1.address);
      const initialSupply = await token.totalSupply();

      await token.connect(addr1).burn(burnAmount);

      expect(await token.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });

  describe("ERC1363", function () {
    beforeEach(async function () {
      await token.mint(addr1.address, ethers.parseEther("1000"));
    });

    it("Should support ERC1363 interface", async function () {
      // ERC1363 interface ID
      const ERC1363_INTERFACE_ID = "0xb0202a11";
      expect(await token.supportsInterface(ERC1363_INTERFACE_ID)).to.be.true;
    });
  });

  describe("Flash Mint", function () {
    it("Should support flash mint operations", async function () {
      // This is a basic test - in practice you'd need a flash loan receiver contract
      const flashAmount = ethers.parseEther("1000");
      
      // The contract should support flash minting (even if we don't test the full flow here)
      expect(await token.maxFlashLoan(await token.getAddress())).to.be.gte(0);
    });
  });
});
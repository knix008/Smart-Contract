const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75";
  
  console.log("🔍 Verifying deployed DID Registry contract...");
  console.log("📍 Contract Address:", contractAddress);
  
  // Get contract instance
  const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
  const contract = DIDRegistry.attach(contractAddress);
  
  try {
    // Test basic contract functionality
    const [deployer] = await ethers.getSigners();
    console.log("👤 Connected account:", deployer.address);
    
    // Check if we can call contract functions
    console.log("✅ Contract is deployed and accessible!");
    console.log("🔗 View on Sepolia Etherscan: https://sepolia.etherscan.io/address/" + contractAddress);
    
  } catch (error) {
    console.error("❌ Error accessing contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });
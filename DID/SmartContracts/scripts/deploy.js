const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying DID Registry to Sepolia Testnet...");

  // Get the ContractFactory and Signers
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy DIDRegistry contract
  const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
  console.log("⏳ Deploying DIDRegistry...");
  
  const didRegistry = await DIDRegistry.deploy();
  await didRegistry.waitForDeployment();

  const contractAddress = await didRegistry.getAddress();
  console.log("✅ DIDRegistry deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };

  console.log("📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for block confirmations before verification
  console.log("⏳ Waiting for block confirmations...");
  await didRegistry.deploymentTransaction().wait(6);

  console.log("🎉 Deployment completed successfully!");
  console.log("🔗 Contract Address:", contractAddress);
  console.log("📱 Add this to your .env file:");
  console.log(`DID_REGISTRY_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
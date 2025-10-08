const { ethers } = require("hardhat");

async function checkBalance() {
  console.log("Checking account balance on Sepolia...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Account address:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Current balance:", ethers.formatEther(balance), "ETH");
  
  const gasPrice = await deployer.provider.getFeeData();
  console.log("Current gas price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
  
  // Estimate deployment cost
  const estimatedGas = 500000; // Rough estimate for all contracts
  const estimatedCost = gasPrice.gasPrice * BigInt(estimatedGas);
  console.log("Estimated deployment cost:", ethers.formatEther(estimatedCost), "ETH");
  
  if (balance < estimatedCost) {
    console.log("\n⚠️  Insufficient funds for deployment!");
    console.log("Please get some Sepolia ETH from:");
    console.log("- https://sepoliafaucet.com/");
    console.log("- https://www.infura.io/faucet/sepolia");
    console.log("- https://faucets.chain.link/sepolia");
  } else {
    console.log("\n✅ Sufficient funds for deployment!");
  }
}

checkBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
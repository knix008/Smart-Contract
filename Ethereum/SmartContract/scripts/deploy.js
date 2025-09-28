const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting MyERC20Token deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("⚠️  Warning: Account has no ETH. Make sure the network is running and funded.");
  }
  
  // Deploy the contract
  console.log("📦 Deploying MyERC20Token...");
  const MyERC20Token = await ethers.getContractFactory("MyERC20Token");
  
  // Deploy with the deployer as the initial recipient
  const token = await MyERC20Token.deploy(deployer.address);
  await token.waitForDeployment();
  
  const tokenAddress = await token.getAddress();
  console.log("✅ MyERC20Token deployed to:", tokenAddress);
  
  // Get contract info
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();
  
  console.log("📊 Contract Information:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals.toString());
  console.log("   Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
  
  // Check deployer's balance
  const deployerBalance = await token.balanceOf(deployer.address);
  console.log("💰 Deployer balance:", ethers.formatUnits(deployerBalance, decimals), symbol);
  
  // Save deployment info
  const deploymentInfo = {
    network: "localhost",
    contractAddress: tokenAddress,
    deployer: deployer.address,
    transactionHash: token.deploymentTransaction().hash,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    contractInfo: {
      name,
      symbol,
      decimals: decimals.toString(),
      totalSupply: totalSupply.toString()
    }
  };
  
  const fs = require('fs');
  const path = require('path');
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `deployment-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentFile);
  
  console.log("\n🌐 Network Information:");
  console.log("   RPC URL: http://127.0.0.1:32973");
  console.log("   Chain ID: 585858");
  console.log("   Block Explorer (Dora): http://127.0.0.1:32826");
  console.log("   Block Explorer (Blockscout): http://127.0.0.1:3000");
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📝 You can now interact with your token at:", tokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

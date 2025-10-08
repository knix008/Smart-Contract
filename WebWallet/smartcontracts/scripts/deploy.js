const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment process...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  console.log("\n🔧 Deploying MyERC20Token...");
  const MyERC20Token = await ethers.getContractFactory("MyERC20Token");
  const myERC20Token = await MyERC20Token.deploy(deployer.address);
  await myERC20Token.waitForDeployment();
  
  const tokenAddress = await myERC20Token.getAddress();
  console.log("✅ MyERC20Token deployed to:", tokenAddress);
  
  console.log("\n🪙 Minting initial tokens...");
  const initialSupply = ethers.parseEther("1000000");
  await myERC20Token.mint(deployer.address, initialSupply);
  console.log("✅ Minted", ethers.formatEther(initialSupply), "MET tokens to deployer");

  const tokenName = await myERC20Token.name();
  const tokenSymbol = await myERC20Token.symbol();
  const totalSupply = await myERC20Token.totalSupply();
  const owner = await myERC20Token.owner();

  console.log("\n📋 Contract Information:");
  console.log("=".repeat(50));
  console.log("MyERC20Token:", tokenAddress);
  console.log("Token Name:", tokenName);
  console.log("Token Symbol:", tokenSymbol);
  console.log("Total Supply:", ethers.formatEther(totalSupply), "MET");
  console.log("Owner:", owner);
  
  console.log("\n🎉 Deployment completed successfully!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:");
  console.error(error);
  process.exitCode = 1;
});

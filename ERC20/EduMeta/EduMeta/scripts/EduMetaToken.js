const { ethers } = require("hardhat");
require('dotenv').config()

async function main() {
  const deployerAddr = process.env.ACCOUNT;
  const deployer = await ethers.getSigner(deployerAddr);

  console.log(`Deploying contracts with the account: ${deployer.address}`);
  console.log(`Account balance: ${(await deployer.provider.getBalance(deployerAddr)).toString()}`);

  const EduMetaToken = await ethers.deployContract("EduMetaToken");
  result = await EduMetaToken.waitForDeployment();
  console.log(result);

  console.log(`Congratulations! You have just successfully deployed your soul bound tokens.`);
  console.log(`MyToken contract address is ${EduMetaToken.target}.`);
  console.log(`You can verify on https://public-en-kairos.node.kaia.io/${EduMetaToken.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
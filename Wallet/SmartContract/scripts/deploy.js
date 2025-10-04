const hre = require("hardhat");

async function main() {
  console.log("Deploying MyToken contract...");

  // Get the contract factory
  const MyToken = await hre.ethers.getContractFactory("MyToken");

  // Set initial supply (e.g., 1,000,000 tokens)
  const initialSupply = 1000000;

  // Deploy the contract
  const token = await MyToken.deploy(initialSupply);

  await token.waitForDeployment();

  const address = await token.getAddress();

  console.log(`MyToken deployed to: ${address}`);
  console.log(`Initial supply: ${initialSupply} MTK`);
  console.log(`Deployer address: ${(await hre.ethers.getSigners())[0].address}`);

  // Get token details
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();

  console.log("\nToken Details:");
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Total Supply: ${hre.ethers.formatEther(totalSupply)} ${symbol}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

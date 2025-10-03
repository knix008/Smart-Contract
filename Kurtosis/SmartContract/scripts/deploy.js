import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Deploying MyToken contract...");

  // Validate environment variables
  if (!process.env.RPC_URL) {
    throw new Error("RPC_URL not found in .env file");
  }
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in .env file");
  }

  // Connect to the network
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying with account:", deployer.address);

  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Load the compiled contract
  const artifact = JSON.parse(fs.readFileSync("./artifacts/contracts/MyToken.sol/MyToken.json", "utf8"));

  const MyTokenFactory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const myToken = await MyTokenFactory.deploy(deployer.address);

  await myToken.waitForDeployment();

  const address = await myToken.getAddress();
  console.log("MyToken deployed to:", address);
  console.log("Token name:", await myToken.name());
  console.log("Token symbol:", await myToken.symbol());
  console.log("Total supply:", ethers.formatEther(await myToken.totalSupply()), "MTK");

  // Update .env file with deployed contract address
  const envContent = fs.readFileSync(".env", "utf8");
  const updatedEnv = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${address}`);
  fs.writeFileSync(".env", updatedEnv);
  console.log("\nContract address saved to .env file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

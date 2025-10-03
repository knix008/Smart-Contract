import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("=== Interacting with MyToken Contract ===\n");

  // Validate environment variables
  if (!process.env.RPC_URL) {
    throw new Error("RPC_URL not found in .env file");
  }
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in .env file");
  }
  if (!process.env.CONTRACT_ADDRESS) {
    throw new Error("CONTRACT_ADDRESS not found in .env file. Please deploy the contract first.");
  }

  // Connect to the network
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Contract address from .env
  const contractAddress = process.env.CONTRACT_ADDRESS;

  // Load the contract ABI
  const artifact = JSON.parse(fs.readFileSync("./artifacts/contracts/MyToken.sol/MyToken.json", "utf8"));

  // Connect to the contract
  const myToken = new ethers.Contract(contractAddress, artifact.abi, wallet);

  console.log("Contract Address:", contractAddress);
  console.log("Connected Account:", wallet.address);
  console.log();

  // 1. Check basic token information
  console.log("--- Token Information ---");
  const name = await myToken.name();
  const symbol = await myToken.symbol();
  const decimals = await myToken.decimals();
  const totalSupply = await myToken.totalSupply();

  console.log("Token Name:", name);
  console.log("Token Symbol:", symbol);
  console.log("Decimals:", decimals.toString());
  console.log("Total Supply:", ethers.formatEther(totalSupply), symbol);
  console.log();

  // 2. Check balance of deployer
  console.log("--- Balance Check ---");
  const ownerBalance = await myToken.balanceOf(wallet.address);
  console.log(`Balance of ${wallet.address}:`, ethers.formatEther(ownerBalance), symbol);
  console.log();

  // 3. Transfer tokens to another account
  console.log("--- Token Transfer ---");
  const recipient = "0xE25583099BA105D9ec0A67f5Ae86D90e50036425"; // Second prefunded account
  const transferAmount = ethers.parseEther("1000"); // Transfer 1000 tokens

  console.log(`Transferring ${ethers.formatEther(transferAmount)} ${symbol} to ${recipient}...`);
  const transferTx = await myToken.transfer(recipient, transferAmount);
  console.log("Transaction Hash:", transferTx.hash);

  const transferReceipt = await transferTx.wait();
  console.log("Transaction confirmed in block:", transferReceipt.blockNumber);
  console.log();

  // 4. Check balances after transfer
  console.log("--- Balances After Transfer ---");
  const newOwnerBalance = await myToken.balanceOf(wallet.address);
  const recipientBalance = await myToken.balanceOf(recipient);

  console.log(`Balance of ${wallet.address}:`, ethers.formatEther(newOwnerBalance), symbol);
  console.log(`Balance of ${recipient}:`, ethers.formatEther(recipientBalance), symbol);
  console.log();

  // 5. Approve spending
  console.log("--- Approve Allowance ---");
  const spender = "0x614561D2d143621E126e87831AEF287678B442b8"; // Third prefunded account
  const approveAmount = ethers.parseEther("500");

  console.log(`Approving ${ethers.formatEther(approveAmount)} ${symbol} for ${spender}...`);
  const approveTx = await myToken.approve(spender, approveAmount);
  console.log("Transaction Hash:", approveTx.hash);

  await approveTx.wait();
  console.log("Approval confirmed");
  console.log();

  // 6. Check allowance
  console.log("--- Check Allowance ---");
  const allowance = await myToken.allowance(wallet.address, spender);
  console.log(`Allowance for ${spender}:`, ethers.formatEther(allowance), symbol);
  console.log();

  // 7. Mint new tokens (owner only)
  console.log("--- Minting New Tokens ---");
  const mintAmount = ethers.parseEther("10000");

  console.log(`Minting ${ethers.formatEther(mintAmount)} ${symbol} to ${wallet.address}...`);
  const mintTx = await myToken.mint(wallet.address, mintAmount);
  console.log("Transaction Hash:", mintTx.hash);

  await mintTx.wait();
  console.log("Minting confirmed");
  console.log();

  // 8. Check total supply and balance after minting
  console.log("--- After Minting ---");
  const newTotalSupply = await myToken.totalSupply();
  const finalOwnerBalance = await myToken.balanceOf(wallet.address);

  console.log("New Total Supply:", ethers.formatEther(newTotalSupply), symbol);
  console.log("Owner Balance:", ethers.formatEther(finalOwnerBalance), symbol);
  console.log();

  // 9. Burn tokens
  console.log("--- Burning Tokens ---");
  const burnAmount = ethers.parseEther("5000");

  console.log(`Burning ${ethers.formatEther(burnAmount)} ${symbol}...`);
  const burnTx = await myToken.burn(burnAmount);
  console.log("Transaction Hash:", burnTx.hash);

  await burnTx.wait();
  console.log("Burn confirmed");
  console.log();

  // 10. Final state
  console.log("--- Final State ---");
  const finalTotalSupply = await myToken.totalSupply();
  const veryFinalOwnerBalance = await myToken.balanceOf(wallet.address);

  console.log("Final Total Supply:", ethers.formatEther(finalTotalSupply), symbol);
  console.log("Final Owner Balance:", ethers.formatEther(veryFinalOwnerBalance), symbol);
  console.log();

  console.log("=== All Tests Completed Successfully! ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

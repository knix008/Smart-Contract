import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("=== Prefunded Accounts from Mnemonic ===\n");

  // The mnemonic from network_params.yaml
  const mnemonic = "giant issue aisle success illegal bike spike question tent bar rely arctic volcano long crawl hungry vocal artwork sniff fantasy very lucky have athlete";

  console.log("Mnemonic:", mnemonic);
  console.log("\nDeriving accounts using standard Ethereum derivation path (m/44'/60'/0'/0/x)...\n");

  // Connect to the network
  const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:32776";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  console.log("Connected to:", rpcUrl);
  console.log("\n" + "=".repeat(100) + "\n");

  // Derive first 20 accounts
  for (let i = 0; i < 20; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, path);

    // Get balance from network
    let balance;
    try {
      balance = await provider.getBalance(wallet.address);
    } catch (error) {
      balance = ethers.parseEther("0");
    }

    console.log(`Account #${i}:`);
    console.log(`  Address:     ${wallet.address}`);
    console.log(`  Private Key: ${wallet.privateKey}`);
    console.log(`  Balance:     ${ethers.formatEther(balance)} ETH`);
    console.log(`  Path:        ${path}`);
    console.log();
  }

  console.log("=".repeat(100));
  console.log("\n💡 Tip: Copy any private key above to your .env file to use that account");
  console.log("Example: PRIVATE_KEY=0x...");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

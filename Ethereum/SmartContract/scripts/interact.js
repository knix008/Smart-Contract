const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 MyERC20Token Interaction Script");
  
  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("📝 Using account:", signer.address);
  
  // You can replace this with your deployed contract address
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
  
  if (contractAddress === "0x0000000000000000000000000000000000000000") {
    console.log("❌ Please set CONTRACT_ADDRESS environment variable or update the script");
    console.log("   Example: CONTRACT_ADDRESS=0x1234... npx hardhat run scripts/interact.js --network localhost");
    return;
  }
  
  console.log("📦 Connecting to contract at:", contractAddress);
  
  // Connect to the deployed contract
  const MyERC20Token = await ethers.getContractFactory("MyERC20Token");
  const token = MyERC20Token.attach(contractAddress);
  
  try {
    // Get contract information
    console.log("\n📊 Contract Information:");
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals.toString());
    console.log("   Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
    
    // Check signer's balance
    const balance = await token.balanceOf(signer.address);
    console.log("💰 Your balance:", ethers.formatUnits(balance, decimals), symbol);
    
    // Get network info
    const network = await ethers.provider.getNetwork();
    const blockNumber = await ethers.provider.getBlockNumber();
    
    console.log("\n🌐 Network Information:");
    console.log("   Network:", network.name, `(Chain ID: ${network.chainId})`);
    console.log("   Block Number:", blockNumber);
    
    // Example: Transfer tokens (uncomment to use)
    /*
    const recipient = "0x742d35Cc6634C0532925a3b8D0C0C4C7C4C7C4C7"; // Replace with recipient address
    const amount = ethers.parseUnits("100", decimals); // 100 tokens
    
    console.log(`\n💸 Transferring ${ethers.formatUnits(amount, decimals)} ${symbol} to ${recipient}...`);
    const tx = await token.transfer(recipient, amount);
    await tx.wait();
    console.log("✅ Transfer successful! Transaction hash:", tx.hash);
    */
    
    console.log("\n🎉 Interaction completed successfully!");
    
  } catch (error) {
    console.error("❌ Interaction failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });

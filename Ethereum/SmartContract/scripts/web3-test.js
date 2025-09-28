const { Web3 } = require('web3');

// Contract ABI (simplified for ERC20)
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
];

async function testContract() {
  console.log("🚀 Web3.js Contract Test");
  console.log("========================");

  // Connect to Kurtosis network
  const web3 = new Web3('http://127.0.0.1:32800');
  
  // Contract address
  const contractAddress = "0x78C9506af12dEc8bf37a91b2dadE16D07Ff39Dd2";
  console.log("📦 Contract:", contractAddress);

  // Create contract instance
  const contract = new web3.eth.Contract(ERC20_ABI, contractAddress);

  try {
    console.log("\n🔍 Reading Contract Data:");
    
    // Get token information
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
    const totalSupply = await contract.methods.totalSupply().call();
    
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals);
    console.log("   Total Supply:", web3.utils.fromWei(totalSupply, 'ether'), symbol);

    // Get deployer balance (the account that deployed the contract)
    const deployerAddress = "0xae95d8da9244c37cac0a3e16ba966a8e852bb6d6";
    const balance = await contract.methods.balanceOf(deployerAddress).call();
    
    console.log("   Deployer Balance:", web3.utils.fromWei(balance, 'ether'), symbol);

    // Get current block
    const blockNumber = await web3.eth.getBlockNumber();
    console.log("\n📊 Current Block:", blockNumber);

    // Get contract creation transaction
    console.log("\n🔍 Contract Creation Details:");
    const txHash = "0x7ea46ae9260d6703ff8c60f844e28e27f0cfad852a3b4e1f4866ae90c3e0ece4";
    const tx = await web3.eth.getTransaction(txHash);
    console.log("   Transaction Hash:", txHash);
    console.log("   Block Number:", tx.blockNumber);
    console.log("   Gas Used:", tx.gas);
    console.log("   From:", tx.from);

    console.log("\n🎉 Contract test successful!");
    console.log("💡 Your MyERC20Token is working correctly!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testContract()
  .then(() => {
    console.log("\n✅ Test completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });

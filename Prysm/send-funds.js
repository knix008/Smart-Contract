const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

// Well-known test account (Hardhat account #0)
const testPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const testAccount = web3.eth.accounts.privateKeyToAccount(testPrivateKey);
const testAddress = testAccount.address; // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

console.log('Test Account Address:', testAddress);

async function main() {
  // Check if we need to send funds
  const balance = await web3.eth.getBalance(testAddress);
  console.log('Test Account Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');

  if (balance === '0') {
    console.log('\nNote: This account has no balance.');
    console.log('You need to manually send funds from the pre-funded account:');
    console.log('Pre-funded: 0x123463a4b065722e99115d6c222f267d9cabb524');
    console.log('Send to:', testAddress);
  }
}

main().catch(console.error);

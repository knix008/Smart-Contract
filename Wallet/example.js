const EthereumWallet = require('./wallet');

async function main() {
  const wallet = new EthereumWallet();

  console.log('=== Ethereum Wallet Application ===\n');

  // Example 1: Create a new wallet
  console.log('1. Creating a new wallet...');
  const newWallet = wallet.createWallet();
  console.log('Address:', newWallet.address);
  console.log('Private Key:', newWallet.privateKey);
  console.log('Mnemonic:', newWallet.mnemonic);
  console.log('');

  // Example 2: Import wallet from private key
  console.log('2. Importing wallet from private key...');
  const importedWallet = wallet.importFromPrivateKey(newWallet.privateKey);
  console.log('Imported Address:', importedWallet.address);
  console.log('');

  // Example 3: Connect to Ethereum network (using a public RPC)
  // For production, use your own RPC endpoint (Infura, Alchemy, etc.)
  console.log('3. Connecting to Ethereum network...');
  const rpcUrl = 'https://eth.llamarpc.com'; // Public Ethereum mainnet RPC
  wallet.connectToNetwork(rpcUrl);
  console.log('Connected to network');
  console.log('');

  // Example 4: Check balance
  try {
    console.log('4. Checking balance...');
    const balance = await wallet.getBalance();
    console.log('Balance:', balance, 'ETH');
    console.log('');
  } catch (error) {
    console.error('Error getting balance:', error.message);
    console.log('');
  }

  // Example 5: Check balance of a known address (Vitalik's address)
  try {
    console.log('5. Checking balance of another address...');
    const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    const vitalikBalance = await wallet.getBalanceOf(vitalikAddress);
    console.log('Vitalik\'s Balance:', vitalikBalance, 'ETH');
    console.log('');
  } catch (error) {
    console.error('Error getting balance:', error.message);
    console.log('');
  }

  // Example 6: Get current gas price
  try {
    console.log('6. Getting current gas price...');
    const gasPrice = await wallet.getGasPrice();
    console.log('Gas Price:', gasPrice, 'Gwei');
    console.log('');
  } catch (error) {
    console.error('Error getting gas price:', error.message);
    console.log('');
  }

  // Example 7: Sign a message
  console.log('7. Signing a message...');
  const message = 'Hello, Ethereum!';
  const signature = await wallet.signMessage(message);
  console.log('Message:', message);
  console.log('Signature:', signature);
  console.log('');

  // Example 8: Verify the signature
  console.log('8. Verifying signature...');
  const recoveredAddress = wallet.verifyMessage(message, signature);
  console.log('Recovered Address:', recoveredAddress);
  console.log('Signature valid:', recoveredAddress === wallet.getAddress());
  console.log('');

  // Example 9: Send transaction (commented out for safety)
  /*
  console.log('9. Sending transaction...');
  try {
    const receipt = await wallet.sendTransaction(
      '0xRecipientAddressHere',
      '0.001' // Amount in ETH
    );
    console.log('Transaction successful!');
    console.log('Transaction hash:', receipt.hash);
  } catch (error) {
    console.error('Error sending transaction:', error.message);
  }
  */

  console.log('=== Examples completed ===');
}

main().catch(console.error);

#!/usr/bin/env node

const EthereumWallet = require('./wallet');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

let wallet = new EthereumWallet();
let isConnected = false;

const WALLET_FILE = '.wallet-data.json';

async function saveWallet(data) {
  fs.writeFileSync(WALLET_FILE, JSON.stringify(data, null, 2));
  console.log('\n✓ Wallet saved to', WALLET_FILE);
}

function loadWallet() {
  if (fs.existsSync(WALLET_FILE)) {
    return JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));
  }
  return null;
}

async function createWallet() {
  console.log('\n=== Creating New Wallet ===');
  const newWallet = wallet.createWallet();

  console.log('\n✓ Wallet created successfully!');
  console.log('Address:', newWallet.address);
  console.log('Private Key:', newWallet.privateKey);
  console.log('Mnemonic:', newWallet.mnemonic);

  const save = await question('\nSave wallet to file? (yes/no): ');
  if (save.toLowerCase() === 'yes' || save.toLowerCase() === 'y') {
    await saveWallet(newWallet);
  }

  console.log('\n⚠️  IMPORTANT: Save your private key and mnemonic securely!');
}

async function importWallet() {
  console.log('\n=== Import Wallet ===');
  console.log('1. Import from Private Key');
  console.log('2. Import from Mnemonic');
  console.log('3. Load from file');

  const choice = await question('\nChoose option (1-3): ');

  try {
    if (choice === '1') {
      const privateKey = await question('Enter private key: ');
      const imported = wallet.importFromPrivateKey(privateKey);
      console.log('\n✓ Wallet imported successfully!');
      console.log('Address:', imported.address);

      const save = await question('\nSave wallet to file? (yes/no): ');
      if (save.toLowerCase() === 'yes' || save.toLowerCase() === 'y') {
        await saveWallet({ address: imported.address, privateKey: imported.privateKey });
      }
    } else if (choice === '2') {
      const mnemonic = await question('Enter mnemonic phrase: ');
      const imported = wallet.importFromMnemonic(mnemonic);
      console.log('\n✓ Wallet imported successfully!');
      console.log('Address:', imported.address);

      const save = await question('\nSave wallet to file? (yes/no): ');
      if (save.toLowerCase() === 'yes' || save.toLowerCase() === 'y') {
        await saveWallet(imported);
      }
    } else if (choice === '3') {
      const data = loadWallet();
      if (!data) {
        console.log('\n✗ No saved wallet found!');
        return;
      }
      wallet.importFromPrivateKey(data.privateKey);
      console.log('\n✓ Wallet loaded from file!');
      console.log('Address:', data.address);
    }
  } catch (error) {
    console.error('\n✗ Error importing wallet:', error.message);
  }
}

async function connectNetwork() {
  console.log('\n=== Connect to Network ===');
  console.log('1. Ethereum Mainnet (LlamaRPC)');
  console.log('2. Sepolia Testnet');
  console.log('3. Custom RPC URL');

  const choice = await question('\nChoose option (1-3): ');

  let rpcUrl;
  if (choice === '1') {
    rpcUrl = 'https://eth.llamarpc.com';
  } else if (choice === '2') {
    rpcUrl = 'https://sepolia.infura.io/v3/YOUR_INFURA_ID';
    console.log('\n⚠️  Update with your Infura/Alchemy RPC URL');
    rpcUrl = await question('Enter Sepolia RPC URL: ');
  } else {
    rpcUrl = await question('Enter RPC URL: ');
  }

  try {
    wallet.connectToNetwork(rpcUrl);
    isConnected = true;
    console.log('\n✓ Connected to network!');
  } catch (error) {
    console.error('\n✗ Connection failed:', error.message);
  }
}

async function checkBalance() {
  if (!isConnected) {
    console.log('\n✗ Please connect to network first!');
    return;
  }

  console.log('\n=== Check Balance ===');
  console.log('1. Check my balance');
  console.log('2. Check another address');

  const choice = await question('\nChoose option (1-2): ');

  try {
    if (choice === '1') {
      const balance = await wallet.getBalance();
      console.log('\nBalance:', balance, 'ETH');
    } else {
      const address = await question('Enter address: ');
      const balance = await wallet.getBalanceOf(address);
      console.log('\nBalance:', balance, 'ETH');
    }
  } catch (error) {
    console.error('\n✗ Error:', error.message);
  }
}

async function sendTransaction() {
  if (!isConnected) {
    console.log('\n✗ Please connect to network first!');
    return;
  }

  console.log('\n=== Send Transaction ===');

  try {
    const balance = await wallet.getBalance();
    console.log('Your balance:', balance, 'ETH');

    const toAddress = await question('\nRecipient address: ');
    const amount = await question('Amount (ETH): ');

    const confirm = await question(`\nSend ${amount} ETH to ${toAddress}? (yes/no): `);

    if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
      console.log('\nSending transaction...');
      const receipt = await wallet.sendTransaction(toAddress, amount);
      console.log('\n✓ Transaction successful!');
      console.log('Transaction hash:', receipt.hash);
      console.log('Block number:', receipt.blockNumber);
    } else {
      console.log('\nTransaction cancelled');
    }
  } catch (error) {
    console.error('\n✗ Transaction failed:', error.message);
  }
}

async function signMessage() {
  console.log('\n=== Sign Message ===');

  const message = await question('Enter message to sign: ');

  try {
    const signature = await wallet.signMessage(message);
    console.log('\n✓ Message signed!');
    console.log('Signature:', signature);
  } catch (error) {
    console.error('\n✗ Error:', error.message);
  }
}

async function verifySignature() {
  console.log('\n=== Verify Signature ===');

  const message = await question('Enter original message: ');
  const signature = await question('Enter signature: ');

  try {
    const recoveredAddress = wallet.verifyMessage(message, signature);
    console.log('\n✓ Signature verified!');
    console.log('Signer address:', recoveredAddress);
  } catch (error) {
    console.error('\n✗ Verification failed:', error.message);
  }
}

async function getGasPrice() {
  if (!isConnected) {
    console.log('\n✗ Please connect to network first!');
    return;
  }

  try {
    const gasPrice = await wallet.getGasPrice();
    console.log('\nCurrent gas price:', gasPrice, 'Gwei');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
  }
}

async function showWalletInfo() {
  try {
    const address = wallet.getAddress();
    console.log('\n=== Wallet Information ===');
    console.log('Address:', address);

    if (isConnected) {
      const balance = await wallet.getBalance();
      const txCount = await wallet.getTransactionCount();
      const gasPrice = await wallet.getGasPrice();

      console.log('Balance:', balance, 'ETH');
      console.log('Transaction count:', txCount);
      console.log('Current gas price:', gasPrice, 'Gwei');
    } else {
      console.log('Status: Not connected to network');
    }
  } catch (error) {
    console.error('\n✗ Error:', error.message);
  }
}

async function mainMenu() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║     Ethereum Wallet CLI Manager      ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('\n1.  Create new wallet');
  console.log('2.  Import wallet');
  console.log('3.  Connect to network');
  console.log('4.  Check balance');
  console.log('5.  Send transaction');
  console.log('6.  Sign message');
  console.log('7.  Verify signature');
  console.log('8.  Get gas price');
  console.log('9.  Show wallet info');
  console.log('0.  Exit');

  const choice = await question('\nChoose option (0-9): ');

  switch (choice) {
    case '1':
      await createWallet();
      break;
    case '2':
      await importWallet();
      break;
    case '3':
      await connectNetwork();
      break;
    case '4':
      await checkBalance();
      break;
    case '5':
      await sendTransaction();
      break;
    case '6':
      await signMessage();
      break;
    case '7':
      await verifySignature();
      break;
    case '8':
      await getGasPrice();
      break;
    case '9':
      await showWalletInfo();
      break;
    case '0':
      console.log('\nGoodbye!');
      rl.close();
      process.exit(0);
      break;
    default:
      console.log('\n✗ Invalid option!');
  }

  await mainMenu();
}

// Start the CLI
console.clear();
mainMenu().catch((error) => {
  console.error('Fatal error:', error);
  rl.close();
  process.exit(1);
});

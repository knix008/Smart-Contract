import { ethers } from 'ethers';
import { readFileSync, writeFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const compiled = JSON.parse(readFileSync('./compiled/MyToken.json', 'utf8'));

async function main() {
    // Configure network - use DEFAULT_NETWORK from .env if NETWORK is not set
    const NETWORK = process.env.NETWORK || process.env.DEFAULT_NETWORK || 'local';

    let provider;
    if (process.env.RPC_URL && NETWORK !== 'local') {
        // Use RPC_URL from .env file for custom network configuration
        provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        console.log('Using custom RPC URL from .env:', process.env.RPC_URL);
    } else {
        // Fallback to predefined networks
        switch(NETWORK) {
            case 'sepolia':
                provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
                break;
            case 'mainnet':
                provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
                break;
            default:
                provider = new ethers.JsonRpcProvider('http://localhost:8545');
        }
    }

    // Check if private key is available
    if (!process.env.PRIVATE_KEY) {
        console.error('❌ Error: PRIVATE_KEY not found in .env file');
        console.log('\nPlease add your private key to .env file:');
        console.log('PRIVATE_KEY=0x...');
        process.exit(1);
    }

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log('🚀 Deploying MyToken Contract');
    console.log('================================');
    console.log('Network:', NETWORK);
    console.log('Deployer address:', wallet.address);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log('Balance:', ethers.formatEther(balance), 'ETH');

    if (balance === 0n) {
        console.error('\n❌ Error: Insufficient balance for deployment');
        console.log('Please fund your wallet with ETH first');
        process.exit(1);
    }

    // Create contract factory
    const factory = new ethers.ContractFactory(
        compiled.abi,
        compiled.bytecode,
        wallet
    );

    // Get constructor arguments from .env file
    const initialOwner = process.env.MYTOKEN_INITIAL_OWNER || wallet.address;

    console.log('\n📝 Contract Info:');
    console.log('Name: MyToken (MTK)');
    console.log('Initial Owner:', initialOwner);
    console.log('Features: ERC20, Burnable, Pausable, Permit, FlashMint, ERC1363');

    // Deploy contract
    console.log('\n⏳ Deploying...');
    const contract = await factory.deploy(initialOwner);

    console.log('Transaction sent! Hash:', contract.deploymentTransaction().hash);
    console.log('Waiting for confirmation...');

    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log('\n✅ Deployment Successful!');
    console.log('================================');
    console.log('Contract Address:', address);
    console.log('Transaction Hash:', contract.deploymentTransaction().hash);
    console.log('Block Number:', contract.deploymentTransaction().blockNumber);

    // Save deployment info
    const deploymentInfo = {
        network: NETWORK,
        contractName: 'MyToken',
        contractAddress: address,
        deployer: wallet.address,
        transactionHash: contract.deploymentTransaction().hash,
        blockNumber: contract.deploymentTransaction().blockNumber,
        timestamp: new Date().toISOString()
    };

    const deploymentFile = `deployment-${NETWORK}-${Date.now()}.json`;
    writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log('\n💾 Deployment info saved to:', deploymentFile);

    // Verify contract on explorer (instructions)
    if (NETWORK === 'sepolia' || NETWORK === 'mainnet') {
        const explorerUrl = NETWORK === 'sepolia'
            ? `https://sepolia.etherscan.io/address/${address}`
            : `https://etherscan.io/address/${address}`;

        console.log('\n🔍 View on Explorer:');
        console.log(explorerUrl);
    }

    console.log('\n📋 Next Steps:');
    console.log('1. Save the contract address:', address);
    console.log('2. Verify the contract on Etherscan (if mainnet/testnet)');
    console.log('3. Interact with your contract using the address');
}

main().catch((error) => {
    console.error('\n❌ Deployment Failed:');
    console.error(error.message);
    process.exit(1);
});

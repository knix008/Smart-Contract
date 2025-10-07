import { ethers } from 'ethers';
import { readFileSync, writeFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const compiled = JSON.parse(readFileSync('./compiled/SimpleToken.json', 'utf8'));

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

    console.log('🚀 Deploying SimpleToken Contract');
    console.log('=================================');
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
    const tokenName = process.env.SIMPLETOKEN_NAME || 'MyToken';
    const tokenSymbol = process.env.SIMPLETOKEN_SYMBOL || 'MTK';
    const initialSupply = process.env.SIMPLETOKEN_INITIAL_SUPPLY || '1000000';

    console.log('\n📝 Contract Info:');
    console.log('Name:', tokenName);
    console.log('Symbol:', tokenSymbol);
    console.log('Initial Supply:', initialSupply);

    // Deploy contract
    console.log('\n⏳ Deploying...');
    const contract = await factory.deploy(tokenName, tokenSymbol, initialSupply);

    console.log('Transaction sent! Hash:', contract.deploymentTransaction().hash);
    console.log('Waiting for confirmation...');

    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log('\n✅ Deployment Successful!');
    console.log('==========================');
    console.log('Contract Address:', address);
    console.log('Transaction Hash:', contract.deploymentTransaction().hash);
    console.log('Block Number:', contract.deploymentTransaction().blockNumber);

    // Save deployment info
    const deploymentInfo = {
        network: NETWORK,
        contractName: 'SimpleToken',
        contractAddress: address,
        transactionHash: contract.deploymentTransaction().hash,
        blockNumber: contract.deploymentTransaction().blockNumber,
        deployer: wallet.address,
        timestamp: new Date().toISOString(),
        constructorArgs: {
            name: tokenName,
            symbol: tokenSymbol,
            initialSupply: initialSupply
        }
    };

    // Write deployment info to file
    const filename = `deployment-simpletoken-${NETWORK}-${Date.now()}.json`;
    writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

    console.log('\n📄 Deployment info saved to:', filename);

    console.log('\n🎉 SimpleToken deployment completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify the contract on Etherscan (if on mainnet/testnet)');
    console.log('2. Update your frontend with the contract address');
    console.log('3. Test contract functions');

    process.exit(0);
}

main().catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
});
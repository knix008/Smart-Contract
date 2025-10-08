import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Account Balance and Network Information
 * This script tests basic account functionality using .env configuration
 */

async function testAccountBalance() {
    console.log('🧪 Account Balance Test');
    console.log('======================');

    // Validate required environment variables
    if (!process.env.ACCOUNT_ADDRESS) {
        console.error('❌ ACCOUNT_ADDRESS not found in .env');
        return false;
    }

    if (!process.env.RPC_URL) {
        console.error('❌ RPC_URL not found in .env');
        return false;
    }

    console.log('📋 Test Configuration:');
    console.log('Address:', process.env.ACCOUNT_ADDRESS);
    console.log('RPC URL:', process.env.RPC_URL);
    console.log('Network:', process.env.DEFAULT_NETWORK || 'not set');
    console.log('');

    try {
        // Initialize provider
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        
        console.log('🔍 Testing Network Connection...');
        const network = await provider.getNetwork();
        console.log('✅ Connected to network:', network.name || 'Unknown');
        console.log('✅ Chain ID:', network.chainId.toString());
        
        console.log('\n💰 Testing Balance Check...');
        const balance = await provider.getBalance(process.env.ACCOUNT_ADDRESS);
        const ethBalance = ethers.formatEther(balance);
        console.log('✅ ETH Balance:', ethBalance, 'ETH');

        // Check if balance is sufficient for transactions
        const minBalance = 0.001; // Minimum recommended balance
        if (parseFloat(ethBalance) < minBalance) {
            console.log('⚠️  Low balance warning: You may need more ETH for transactions');
            console.log('💡 For Sepolia testnet, get free ETH from:');
            console.log('   • https://faucets.chain.link/sepolia');
            console.log('   • https://sepoliafaucet.com');
        } else {
            console.log('✅ Sufficient balance for transactions');
        }

        console.log('\n📊 Additional Network Info...');
        const blockNumber = await provider.getBlockNumber();
        console.log('✅ Current block number:', blockNumber);

        const gasPrice = await provider.getFeeData();
        console.log('✅ Current gas price:', ethers.formatUnits(gasPrice.gasPrice, 'gwei'), 'gwei');

        console.log('\n🎉 Account balance test completed successfully!');
        return true;

    } catch (error) {
        console.error('❌ Account balance test failed:', error.message);
        return false;
    }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
    testAccountBalance()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

export { testAccountBalance };
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Network Connectivity and Configuration
 * This script tests RPC connection and network health
 */

async function testNetworkConnectivity() {
    console.log('🧪 Network Connectivity Test');
    console.log('============================');

    if (!process.env.RPC_URL) {
        console.error('❌ RPC_URL not found in .env');
        return false;
    }

    console.log('📋 Test Configuration:');
    console.log('RPC URL:', process.env.RPC_URL);
    console.log('Expected Network:', process.env.DEFAULT_NETWORK || 'not specified');
    console.log('');

    try {
        console.log('🔍 Testing RPC connection...');
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

        // Test 1: Basic connectivity
        console.log('📡 Testing basic connectivity...');
        const blockNumber = await provider.getBlockNumber();
        console.log('✅ Connected! Current block:', blockNumber);

        // Test 2: Network information
        console.log('\n🌐 Testing network information...');
        const network = await provider.getNetwork();
        console.log('✅ Network name:', network.name || 'Unknown');
        console.log('✅ Chain ID:', network.chainId.toString());

        // Verify expected network
        if (process.env.DEFAULT_NETWORK) {
            const expectedNetworks = {
                'sepolia': 11155111,
                'mainnet': 1,
                'goerli': 5,
                'polygon': 137,
                'local': 31337
            };
            
            const expectedChainId = expectedNetworks[process.env.DEFAULT_NETWORK.toLowerCase()];
            if (expectedChainId && network.chainId !== BigInt(expectedChainId)) {
                console.log('⚠️  Network mismatch!');
                console.log('   Expected:', process.env.DEFAULT_NETWORK, '(Chain ID:', expectedChainId + ')');
                console.log('   Actual:', network.name, '(Chain ID:', network.chainId.toString() + ')');
            } else {
                console.log('✅ Network matches expected configuration');
            }
        }

        // Test 3: Gas information
        console.log('\n⛽ Testing gas information...');
        const feeData = await provider.getFeeData();
        console.log('✅ Gas price:', ethers.formatUnits(feeData.gasPrice, 'gwei'), 'gwei');
        if (feeData.maxFeePerGas) {
            console.log('✅ Max fee per gas:', ethers.formatUnits(feeData.maxFeePerGas, 'gwei'), 'gwei');
        }
        if (feeData.maxPriorityFeePerGas) {
            console.log('✅ Max priority fee:', ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'), 'gwei');
        }

        // Test 4: Block information
        console.log('\n📦 Testing block information...');
        const latestBlock = await provider.getBlock('latest');
        console.log('✅ Latest block number:', latestBlock.number);
        console.log('✅ Block timestamp:', new Date(latestBlock.timestamp * 1000).toISOString());
        console.log('✅ Block hash:', latestBlock.hash);
        console.log('✅ Transactions in block:', latestBlock.transactions.length);

        // Test 5: Response time
        console.log('\n⏱️  Testing response time...');
        const startTime = Date.now();
        await provider.getBlockNumber();
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log('✅ Response time:', responseTime, 'ms');

        if (responseTime > 5000) {
            console.log('⚠️  Slow response time detected (>5s)');
        } else if (responseTime > 2000) {
            console.log('⚠️  Moderate response time (>2s)');
        } else {
            console.log('✅ Good response time (<2s)');
        }

        // Test 6: Multiple calls stability
        console.log('\n🔄 Testing connection stability...');
        const promises = [];
        for (let i = 0; i < 5; i++) {
            promises.push(provider.getBlockNumber());
        }
        
        const results = await Promise.all(promises);
        const uniqueBlocks = new Set(results);
        console.log('✅ Multiple calls successful');
        console.log('✅ Block numbers received:', Array.from(uniqueBlocks).join(', '));

        console.log('\n🎉 Network connectivity test completed successfully!');
        return true;

    } catch (error) {
        console.error('❌ Network connectivity test failed:', error.message);
        
        // Provide troubleshooting hints
        console.log('\n💡 Troubleshooting hints:');
        console.log('• Check if RPC_URL is correct in .env file');
        console.log('• Verify internet connection');
        console.log('• Check if RPC provider is operational');
        console.log('• Try a different RPC endpoint');
        
        return false;
    }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
    testNetworkConnectivity()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

export { testNetworkConnectivity };
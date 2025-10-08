import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Contract Deployment Process
 * This script tests the deployment of smart contracts
 */

async function testContractDeployment(contractType = 'MyToken') {
    console.log(`🧪 Contract Deployment Test - ${contractType}`);
    console.log('=====================================');

    // Validate required environment variables
    const requiredVars = ['RPC_URL', 'PRIVATE_KEY'];
    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            console.error(`❌ ${varName} not found in .env`);
            return false;
        }
    }

    console.log('📋 Test Configuration:');
    console.log('Contract Type:', contractType);
    console.log('RPC URL:', process.env.RPC_URL);
    console.log('Deployer Address:', process.env.ACCOUNT_ADDRESS);
    console.log('');

    try {
        // Initialize provider and wallet
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        console.log('🔍 Testing deployment prerequisites...');
        
        // Check wallet balance
        const balance = await provider.getBalance(wallet.address);
        const ethBalance = ethers.formatEther(balance);
        console.log('✅ Deployer ETH balance:', ethBalance, 'ETH');

        if (parseFloat(ethBalance) < 0.001) {
            console.error('❌ Insufficient ETH balance for deployment');
            console.log('💡 You need at least 0.001 ETH for gas fees');
            return false;
        }

        // Load contract ABI and bytecode
        console.log(`\n📖 Loading ${contractType} contract...`);
        let contractData;
        let constructorArgs = [];

        try {
            if (contractType === 'MyToken') {
                contractData = JSON.parse(readFileSync('./compiled/MyToken.json', 'utf8'));
                constructorArgs = [process.env.MYTOKEN_INITIAL_OWNER || wallet.address];
            } else if (contractType === 'SimpleToken') {
                contractData = JSON.parse(readFileSync('./compiled/SimpleToken.json', 'utf8'));
                constructorArgs = [
                    process.env.SIMPLETOKEN_NAME || 'TestToken',
                    process.env.SIMPLETOKEN_SYMBOL || 'TEST',
                    process.env.SIMPLETOKEN_INITIAL_SUPPLY || '1000000'
                ];
            } else {
                throw new Error(`Unsupported contract type: ${contractType}`);
            }

            console.log('✅ Contract ABI loaded');
            console.log('✅ Contract bytecode loaded');
            console.log('✅ Constructor args:', constructorArgs);
        } catch (error) {
            console.error('❌ Failed to load contract files:', error.message);
            console.log('💡 Run: npm run compile:erc20 or npm run compile:simple');
            return false;
        }

        // Estimate deployment gas
        console.log('\n⛽ Estimating deployment gas...');
        try {
            const factory = new ethers.ContractFactory(contractData.abi, contractData.bytecode, wallet);
            const gasEstimate = await factory.getDeployTransaction(...constructorArgs).then(tx => 
                provider.estimateGas(tx)
            );
            console.log('✅ Estimated deployment gas:', gasEstimate.toString());

            const gasPrice = await provider.getFeeData();
            const estimatedCost = gasEstimate * gasPrice.gasPrice;
            console.log('✅ Estimated deployment cost:', ethers.formatEther(estimatedCost), 'ETH');
        } catch (error) {
            console.error('❌ Gas estimation failed:', error.message);
            return false;
        }

        // Note: We're not actually deploying in this test to avoid spending gas
        console.log('\n📝 Deployment Test Results:');
        console.log('✅ Contract files are valid and loadable');
        console.log('✅ Wallet has sufficient balance');
        console.log('✅ Gas estimation successful');
        console.log('✅ Constructor arguments properly formatted');
        console.log('');
        console.log('💡 To perform actual deployment, run:');
        if (contractType === 'MyToken') {
            console.log('   npm run deploy');
        } else {
            console.log('   npm run deploy:simple');
        }

        console.log('\n🎉 Deployment test completed successfully!');
        return true;

    } catch (error) {
        console.error('❌ Deployment test failed:', error.message);
        return false;
    }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
    const contractType = process.argv[2] || 'MyToken';
    testContractDeployment(contractType)
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

export { testContractDeployment };
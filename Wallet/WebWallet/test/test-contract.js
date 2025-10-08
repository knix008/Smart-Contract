import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Deployed Contract Functionality
 * This script tests interaction with deployed smart contracts
 */

async function testDeployedContract() {
    console.log('🧪 Deployed Contract Test');
    console.log('=========================');

    // Validate required environment variables
    const requiredVars = ['CONTRACT_ADDRESS', 'RPC_URL', 'PRIVATE_KEY'];
    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            console.error(`❌ ${varName} not found in .env`);
            return false;
        }
    }

    console.log('📋 Test Configuration:');
    console.log('Contract Address:', process.env.CONTRACT_ADDRESS);
    console.log('RPC URL:', process.env.RPC_URL);
    console.log('Wallet Address:', process.env.ACCOUNT_ADDRESS);
    console.log('');

    try {
        // Initialize provider and wallet
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        console.log('🔍 Testing Contract Connection...');
        
        // Try to load contract ABI
        let contractAbi;
        let contractName;
        
        try {
            const myTokenCompiled = JSON.parse(readFileSync('./compiled/MyToken.json', 'utf8'));
            contractAbi = myTokenCompiled.abi;
            contractName = 'MyToken';
            console.log('✅ Loaded MyToken ABI');
        } catch {
            try {
                const simpleTokenCompiled = JSON.parse(readFileSync('./compiled/SimpleToken.json', 'utf8'));
                contractAbi = simpleTokenCompiled.abi;
                contractName = 'SimpleToken';
                console.log('✅ Loaded SimpleToken ABI');
            } catch {
                console.error('❌ Could not load contract ABI from compiled/ directory');
                console.log('💡 Run: npm run compile:erc20 or npm run compile:simple');
                return false;
            }
        }

        // Create contract instance
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, provider);
        const contractWithSigner = contract.connect(wallet);

        console.log(`\n📊 Testing ${contractName} Contract Functions...`);

        // Test 1: Check if address is a contract
        console.log('🔍 Verifying contract deployment...');
        const code = await provider.getCode(process.env.CONTRACT_ADDRESS);
        if (code === '0x') {
            console.error('❌ No contract found at this address');
            console.log('💡 Make sure the contract is deployed and the address is correct');
            return false;
        }
        console.log('✅ Contract verified at address');

        // Test 2: Read contract information
        console.log('\n📖 Reading contract information...');
        try {
            const name = await contract.name();
            const symbol = await contract.symbol();
            const decimals = await contract.decimals();
            const totalSupply = await contract.totalSupply();

            console.log('✅ Name:', name);
            console.log('✅ Symbol:', symbol);
            console.log('✅ Decimals:', decimals);
            console.log('✅ Total Supply:', ethers.formatUnits(totalSupply, decimals));

            // Test 3: Check balance
            console.log('\n💰 Testing balance check...');
            const balance = await contract.balanceOf(wallet.address);
            const formattedBalance = ethers.formatUnits(balance, decimals);
            console.log('✅ Token balance:', formattedBalance, symbol);

            // Test 4: Check allowance (if applicable)
            try {
                const allowance = await contract.allowance(wallet.address, wallet.address);
                console.log('✅ Self allowance:', ethers.formatUnits(allowance, decimals), symbol);
            } catch {
                console.log('ℹ️  Allowance function not available or failed');
            }

            // Test 5: Check owner (if applicable)
            try {
                const owner = await contract.owner();
                console.log('✅ Contract owner:', owner);
                console.log('✅ Is wallet owner?', owner.toLowerCase() === wallet.address.toLowerCase());
            } catch {
                console.log('ℹ️  Owner function not available');
            }

        } catch (error) {
            console.error('❌ Error reading contract info:', error.message);
            return false;
        }

        // Test 6: Gas estimation for a transfer (if balance > 0)
        console.log('\n⛽ Testing gas estimation...');
        try {
            const balance = await contract.balanceOf(wallet.address);
            if (balance > 0) {
                const transferAmount = ethers.parseUnits('0.1', await contract.decimals());
                if (balance >= transferAmount) {
                    const gasEstimate = await contractWithSigner.transfer.estimateGas(
                        wallet.address, // Self-transfer for testing
                        transferAmount
                    );
                    console.log('✅ Estimated gas for transfer:', gasEstimate.toString());
                } else {
                    console.log('ℹ️  Insufficient balance for gas estimation test');
                }
            } else {
                console.log('ℹ️  No tokens to test gas estimation');
            }
        } catch (error) {
            console.log('⚠️  Gas estimation failed:', error.message);
        }

        console.log('\n🎉 Contract test completed successfully!');
        return true;

    } catch (error) {
        console.error('❌ Contract test failed:', error.message);
        return false;
    }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
    testDeployedContract()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

export { testDeployedContract };
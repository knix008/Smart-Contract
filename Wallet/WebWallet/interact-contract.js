import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Check required environment variables
    if (!process.env.CONTRACT_ADDRESS) {
        console.error('❌ Error: CONTRACT_ADDRESS not found in .env file');
        console.log('\nPlease add your contract address to .env file:');
        console.log('CONTRACT_ADDRESS=0x...');
        process.exit(1);
    }

    if (!process.env.PRIVATE_KEY) {
        console.error('❌ Error: PRIVATE_KEY not found in .env file');
        process.exit(1);
    }

    // Setup provider and wallet
    const rpcUrl = process.env.RPC_URL || 'https://rpc.sepolia.org';
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log('🔗 Contract Interaction Script');
    console.log('==============================');
    console.log('Contract Address:', process.env.CONTRACT_ADDRESS);
    console.log('Wallet Address:', wallet.address);
    console.log('RPC URL:', rpcUrl);

    try {
        // Load contract ABI (try both compiled files)
        let contractAbi;
        let contractName;
        
        try {
            const myTokenCompiled = JSON.parse(readFileSync('./compiled/MyToken.json', 'utf8'));
            contractAbi = myTokenCompiled.abi;
            contractName = 'MyToken';
            console.log('📄 Using MyToken ABI');
        } catch {
            try {
                const simpleTokenCompiled = JSON.parse(readFileSync('./compiled/SimpleToken.json', 'utf8'));
                contractAbi = simpleTokenCompiled.abi;
                contractName = 'SimpleToken';
                console.log('📄 Using SimpleToken ABI');
            } catch {
                console.error('❌ Error: Could not load contract ABI from compiled/ directory');
                console.log('Please run: npm run compile:erc20 or npm run compile:simple');
                process.exit(1);
            }
        }

        // Create contract instance
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, wallet);

        console.log('\n📊 Contract Information:');
        console.log('========================');

        // Get basic token info
        try {
            const name = await contract.name();
            const symbol = await contract.symbol();
            const decimals = await contract.decimals();
            const totalSupply = await contract.totalSupply();
            const balance = await contract.balanceOf(wallet.address);

            console.log('Name:', name);
            console.log('Symbol:', symbol);
            console.log('Decimals:', decimals);
            console.log('Total Supply:', ethers.formatUnits(totalSupply, decimals));
            console.log('Your Balance:', ethers.formatUnits(balance, decimals));

        } catch (error) {
            console.log('⚠️ Could not fetch token info (contract might not be an ERC20 token)');
        }

        // Check wallet ETH balance
        const ethBalance = await provider.getBalance(wallet.address);
        console.log('ETH Balance:', ethers.formatEther(ethBalance), 'ETH');

        console.log('\n✅ Contract interaction setup complete!');
        console.log('\n💡 Available operations:');
        console.log('- Use the web interface at http://localhost:3006');
        console.log('- Modify this script to add custom function calls');
        console.log('- Add transfer functions, approval, etc.');

        // Example: Uncomment to transfer tokens
        /*
        console.log('\n📤 Example Transfer (uncomment to use):');
        const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
        const amount = ethers.parseUnits('10', decimals);
        
        const tx = await contract.transfer(recipientAddress, amount);
        console.log('Transfer transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('Transfer confirmed in block:', receipt.blockNumber);
        */

    } catch (error) {
        console.error('❌ Error interacting with contract:', error.message);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
});
const { Web3 } = require('web3');
const fs = require('fs');

// Configuration
const CONFIG = {
    RPC_URL: 'http://localhost:8545',
    CONTRACT_ADDRESS: '0xAd54AE137c6C39Fa413FA1dA7dB6463E3aE45664',
    DEPLOYER_ADDRESS: '0x2e988A386a799F506693793c6A5AF6B54dfAaBfB'
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDeployedContract() {
    try {
        const web3 = new Web3(CONFIG.RPC_URL);
        
        // Check connection
        const isConnected = await web3.eth.net.isListening();
        if (!isConnected) {
            throw new Error('Cannot connect to Ethereum node');
        }
        
        log('🚀 Testing deployed ERC20 contract...', 'cyan');
        
        // Load the compiled contract ABI
        const contractData = JSON.parse(fs.readFileSync('./build/SimpleERC20Token.json', 'utf8'));
        const contractAbi = contractData.abi;
        
        // Create contract instance
        const contract = new web3.eth.Contract(contractAbi, CONFIG.CONTRACT_ADDRESS);
        
        log(`📍 Contract address: ${CONFIG.CONTRACT_ADDRESS}`, 'blue');
        
        // Test basic contract functions
        try {
            // Get token name
            const name = await contract.methods.name().call();
            log(`📛 Token name: ${name}`, 'green');
            
            // Get token symbol
            const symbol = await contract.methods.symbol().call();
            log(`🔤 Token symbol: ${symbol}`, 'green');
            
            // Get total supply
            const totalSupply = await contract.methods.totalSupply().call();
            const totalSupplyFormatted = web3.utils.fromWei(totalSupply, 'ether');
            log(`📊 Total supply: ${totalSupplyFormatted} ${symbol}`, 'green');
            
            // Get decimals
            const decimals = await contract.methods.decimals().call();
            log(`🔢 Decimals: ${decimals}`, 'green');
            
            // Get deployer balance
            const balance = await contract.methods.balanceOf(CONFIG.DEPLOYER_ADDRESS).call();
            const balanceFormatted = web3.utils.fromWei(balance, 'ether');
            log(`💰 Deployer balance: ${balanceFormatted} ${symbol}`, 'green');
            
            log('✅ Contract test completed successfully!', 'green');
            log('🎉 ERC20 Token is deployed and working!', 'green');
            
        } catch (error) {
            log(`⚠️ Contract function call failed: ${error.message}`, 'yellow');
            log('💡 This might be because the transaction is still being processed', 'yellow');
        }
        
    } catch (error) {
        log(`❌ Test failed: ${error.message}`, 'red');
    }
}

testDeployedContract();

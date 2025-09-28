const { Web3 } = require('web3');
const fs = require('fs');

// Configuration
const CONFIG = {
    RPC_URL: 'http://localhost:8545',
    CHAIN_ID: 1337
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

class TokenInteractor {
    constructor() {
        this.web3 = null;
        this.accounts = [];
        this.contract = null;
        this.contractAddress = null;
    }

    async initialize() {
        try {
            log('🚀 Initializing Token Interactor...', 'cyan');
            
            // Load deployment info
            if (!fs.existsSync('./deployment.json')) {
                throw new Error('deployment.json not found. Please deploy the contract first.');
            }
            
            const deploymentInfo = JSON.parse(fs.readFileSync('./deployment.json', 'utf8'));
            this.contractAddress = deploymentInfo.contractAddress;
            
            log(`📍 Contract Address: ${this.contractAddress}`, 'blue');
            
            // Initialize Web3
            this.web3 = new Web3(CONFIG.RPC_URL);
            
            // Check connection
            const isConnected = await this.web3.eth.net.isListening();
            if (!isConnected) {
                throw new Error('Cannot connect to Ethereum node.');
            }
            
            // Get accounts
            this.accounts = await this.web3.eth.getAccounts();
            if (this.accounts.length === 0) {
                throw new Error('No accounts found.');
            }
            
            log(`✅ Connected with ${this.accounts.length} accounts`, 'green');
            
            // Load contract ABI
            const contractData = JSON.parse(fs.readFileSync('./build/MyToken.json', 'utf8'));
            this.contract = new this.web3.eth.Contract(contractData.abi, this.contractAddress);
            
            log('✅ Contract instance created', 'green');
            
        } catch (error) {
            log(`❌ Initialization failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async getTokenInfo() {
        try {
            log('📊 Getting token information...', 'yellow');
            
            const name = await this.contract.methods.name().call();
            const symbol = await this.contract.methods.symbol().call();
            const decimals = await this.contract.methods.decimals().call();
            const totalSupply = await this.contract.methods.totalSupply().call();
            const owner = await this.contract.methods.owner().call();
            
            log('📋 Token Information:', 'cyan');
            log(`   Name: ${name}`, 'blue');
            log(`   Symbol: ${symbol}`, 'blue');
            log(`   Decimals: ${decimals}`, 'blue');
            log(`   Total Supply: ${this.web3.utils.fromWei(totalSupply, 'ether')} ${symbol}`, 'blue');
            log(`   Owner: ${owner}`, 'blue');
            
            return { name, symbol, decimals, totalSupply, owner };
            
        } catch (error) {
            log(`❌ Failed to get token info: ${error.message}`, 'red');
            throw error;
        }
    }

    async getAccountBalance(address) {
        try {
            const balance = await this.contract.methods.balanceOf(address).call();
            const balanceFormatted = this.web3.utils.fromWei(balance, 'ether');
            
            log(`💰 Balance of ${address}: ${balanceFormatted} tokens`, 'green');
            return balance;
            
        } catch (error) {
            log(`❌ Failed to get balance: ${error.message}`, 'red');
            throw error;
        }
    }

    async transferTokens(to, amount, fromAccount = 0) {
        try {
            log(`💸 Transferring ${amount} tokens to ${to}...`, 'yellow');
            
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            const fromAddress = this.accounts[fromAccount];
            
            // Estimate gas
            const gasEstimate = await this.contract.methods.transfer(to, amountWei).estimateGas({
                from: fromAddress
            });
            
            // Send transaction
            const tx = await this.contract.methods.transfer(to, amountWei).send({
                from: fromAddress,
                gas: gasEstimate + 10000,
                gasPrice: '20000000000'
            });
            
            log(`✅ Transfer successful!`, 'green');
            log(`🔗 Transaction hash: ${tx.transactionHash}`, 'blue');
            
            return tx;
            
        } catch (error) {
            log(`❌ Transfer failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async approveSpender(spender, amount, fromAccount = 0) {
        try {
            log(`🔐 Approving ${spender} to spend ${amount} tokens...`, 'yellow');
            
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            const fromAddress = this.accounts[fromAccount];
            
            // Estimate gas
            const gasEstimate = await this.contract.methods.approve(spender, amountWei).estimateGas({
                from: fromAddress
            });
            
            // Send transaction
            const tx = await this.contract.methods.approve(spender, amountWei).send({
                from: fromAddress,
                gas: gasEstimate + 10000,
                gasPrice: '20000000000'
            });
            
            log(`✅ Approval successful!`, 'green');
            log(`🔗 Transaction hash: ${tx.transactionHash}`, 'blue');
            
            return tx;
            
        } catch (error) {
            log(`❌ Approval failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async getAllowance(owner, spender) {
        try {
            const allowance = await this.contract.methods.allowance(owner, spender).call();
            const allowanceFormatted = this.web3.utils.fromWei(allowance, 'ether');
            
            log(`🔐 Allowance of ${spender} from ${owner}: ${allowanceFormatted} tokens`, 'blue');
            return allowance;
            
        } catch (error) {
            log(`❌ Failed to get allowance: ${error.message}`, 'red');
            throw error;
        }
    }

    async mintTokens(to, amount, fromAccount = 0) {
        try {
            log(`🪙 Minting ${amount} tokens to ${to}...`, 'yellow');
            
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            const fromAddress = this.accounts[fromAccount];
            
            // Check if caller is owner
            const owner = await this.contract.methods.owner().call();
            if (fromAddress.toLowerCase() !== owner.toLowerCase()) {
                throw new Error('Only owner can mint tokens');
            }
            
            // Estimate gas
            const gasEstimate = await this.contract.methods.mint(to, amountWei).estimateGas({
                from: fromAddress
            });
            
            // Send transaction
            const tx = await this.contract.methods.mint(to, amountWei).send({
                from: fromAddress,
                gas: gasEstimate + 10000,
                gasPrice: '20000000000'
            });
            
            log(`✅ Minting successful!`, 'green');
            log(`🔗 Transaction hash: ${tx.transactionHash}`, 'blue');
            
            return tx;
            
        } catch (error) {
            log(`❌ Minting failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async runDemo() {
        try {
            await this.initialize();
            
            log('\n🎯 Running Token Interaction Demo...', 'cyan');
            
            // Get token info
            await this.getTokenInfo();
            
            // Show account balances
            log('\n💰 Account Balances:', 'cyan');
            for (let i = 0; i < Math.min(this.accounts.length, 3); i++) {
                await this.getAccountBalance(this.accounts[i]);
            }
            
            // Transfer tokens if we have multiple accounts
            if (this.accounts.length >= 2) {
                log('\n💸 Transfer Demo:', 'cyan');
                await this.transferTokens(this.accounts[1], 100);
                
                // Check balances after transfer
                await this.getAccountBalance(this.accounts[0]);
                await this.getAccountBalance(this.accounts[1]);
            }
            
            // Approval demo
            if (this.accounts.length >= 3) {
                log('\n🔐 Approval Demo:', 'cyan');
                await this.approveSpender(this.accounts[2], 50);
                await this.getAllowance(this.accounts[0], this.accounts[2]);
            }
            
            // Mint demo (if caller is owner)
            const owner = await this.contract.methods.owner().call();
            if (this.accounts[0].toLowerCase() === owner.toLowerCase() && this.accounts.length >= 2) {
                log('\n🪙 Mint Demo:', 'cyan');
                await this.mintTokens(this.accounts[1], 1000);
                await this.getAccountBalance(this.accounts[1]);
            }
            
            log('\n✅ Demo completed successfully!', 'green');
            
        } catch (error) {
            log(`\n💥 Demo failed: ${error.message}`, 'red');
            process.exit(1);
        }
    }
}

// Run demo if called directly
if (require.main === module) {
    const interactor = new TokenInteractor();
    interactor.runDemo();
}

module.exports = TokenInteractor;

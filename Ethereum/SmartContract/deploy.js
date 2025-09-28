const { Web3 } = require('web3');
const fs = require('fs');
const solc = require('solc');

// Configuration
const CONFIG = {
    // Network configuration
    RPC_URL: 'http://localhost:8545', // Node 1 RPC endpoint
    CHAIN_ID: 1337,
    
    // Token configuration
    TOKEN_NAME: 'My Private Token',
    TOKEN_SYMBOL: 'MPT',
    TOKEN_DECIMALS: 18,
    INITIAL_SUPPLY: 1000000, // 1 million tokens
    
    // Gas configuration
    GAS_LIMIT: 3000000,
    GAS_PRICE: '20000000000' // 20 gwei
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

class TokenDeployer {
    constructor() {
        this.web3 = null;
        this.accounts = [];
        this.contract = null;
        this.contractAddress = null;
    }

    async initialize() {
        try {
            log('🚀 Initializing Token Deployer...', 'cyan');
            
            // Initialize Web3
            this.web3 = new Web3(CONFIG.RPC_URL);
            
            // Check connection
            const isConnected = await this.web3.eth.net.isListening();
            if (!isConnected) {
                throw new Error('Cannot connect to Ethereum node. Make sure the network is running.');
            }
            
            // Get network info
            const networkId = await this.web3.eth.net.getId();
            if (parseInt(networkId) !== CONFIG.CHAIN_ID) {
                throw new Error(`Wrong network. Expected chain ID ${CONFIG.CHAIN_ID}, got ${networkId}`);
            }
            
            log(`✅ Connected to network (Chain ID: ${networkId})`, 'green');
            
            // Get accounts
            this.accounts = await this.web3.eth.getAccounts();
            if (this.accounts.length === 0) {
                throw new Error('No accounts found. Make sure accounts are unlocked.');
            }
            
            log(`✅ Found ${this.accounts.length} accounts`, 'green');
            log(`📝 Deployer account: ${this.accounts[0]}`, 'blue');
            
            // Check balance
            const balance = await this.web3.eth.getBalance(this.accounts[0]);
            const balanceEth = this.web3.utils.fromWei(balance, 'ether');
            log(`💰 Account balance: ${balanceEth} ETH`, 'blue');
            
            // Unlock the account for transactions
            const password = 'password'; // Default password from setup
            try {
                await this.web3.eth.personal.unlockAccount(this.accounts[0], password, 0);
                log(`🔓 Account unlocked: ${this.accounts[0]}`, 'green');
            } catch (unlockError) {
                log(`⚠️ Could not unlock account: ${unlockError.message}`, 'yellow');
            }
            
            if (balance === '0') {
                throw new Error('Deployer account has no ETH. Make sure accounts are funded.');
            }
            
        } catch (error) {
            log(`❌ Initialization failed: ${error.message}`, 'red');
            throw error;
        }
    }

    compileContract() {
        try {
            log('🔨 Compiling smart contract...', 'yellow');
            
            // Read contract source
            const source = fs.readFileSync('./MyToken.sol', 'utf8');
            
            // Solc input
            const input = {
                language: 'Solidity',
                sources: {
                    'MyToken.sol': {
                        content: source
                    }
                },
                settings: {
                    outputSelection: {
                        '*': {
                            '*': ['*']
                        }
                    }
                }
            };
            
            // Compile
            const output = JSON.parse(solc.compile(JSON.stringify(input)));
            
            if (output.errors) {
                const errors = output.errors.filter(error => error.severity === 'error');
                if (errors.length > 0) {
                    throw new Error(`Compilation errors: ${JSON.stringify(errors, null, 2)}`);
                }
            }
            
            const contract = output.contracts['MyToken.sol']['MyToken'];
            
            this.contract = {
                abi: contract.abi,
                bytecode: contract.evm.bytecode.object
            };
            
            log('✅ Contract compiled successfully', 'green');
            
            // Save compiled contract
            fs.writeFileSync('./build/MyToken.json', JSON.stringify({
                abi: this.contract.abi,
                bytecode: this.contract.bytecode
            }, null, 2));
            
            log('💾 Compiled contract saved to build/MyToken.json', 'blue');
            
        } catch (error) {
            log(`❌ Compilation failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async deployContract() {
        try {
            log('🚀 Deploying smart contract...', 'cyan');
            
            // Create contract instance
            const contract = new this.web3.eth.Contract(this.contract.abi);
            
            // Estimate gas
            const deployData = contract.deploy({
                data: this.contract.bytecode,
                arguments: [
                    CONFIG.TOKEN_NAME,
                    CONFIG.TOKEN_SYMBOL,
                    CONFIG.TOKEN_DECIMALS,
                    CONFIG.INITIAL_SUPPLY
                ]
            });
            
            const estimatedGas = await deployData.estimateGas({
                from: this.accounts[0]
            });
            const gasLimit = BigInt(estimatedGas) + BigInt(100000);
            
            log(`⛽ Estimated gas: ${estimatedGas}`, 'blue');
            
            // Deploy contract
            const deployedContract = await deployData.send({
                from: this.accounts[0],
                gas: gasLimit,
                gasPrice: CONFIG.GAS_PRICE,
                type: '0x2' // EIP-1559 transaction type
            });
            
            this.contractAddress = deployedContract.options.address;
            
            log(`✅ Contract deployed successfully!`, 'green');
            log(`📍 Contract address: ${this.contractAddress}`, 'green');
            log(`🔗 Transaction hash: ${deployedContract.transactionHash}`, 'blue');
            
            // Get transaction receipt
            const receipt = await this.web3.eth.getTransactionReceipt(deployedContract.transactionHash);
            log(`⛽ Gas used: ${receipt.gasUsed}`, 'blue');
            
            // Save deployment info
            const deploymentInfo = {
                contractAddress: this.contractAddress,
                transactionHash: deployedContract.transactionHash,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed,
                deployer: this.accounts[0],
                network: {
                    chainId: CONFIG.CHAIN_ID,
                    rpcUrl: CONFIG.RPC_URL
                },
                token: {
                    name: CONFIG.TOKEN_NAME,
                    symbol: CONFIG.TOKEN_SYMBOL,
                    decimals: CONFIG.TOKEN_DECIMALS,
                    initialSupply: CONFIG.INITIAL_SUPPLY
                },
                timestamp: new Date().toISOString()
            };
            
            fs.writeFileSync('./deployment.json', JSON.stringify(deploymentInfo, null, 2));
            log('💾 Deployment info saved to deployment.json', 'blue');
            
            return deployedContract;
            
        } catch (error) {
            log(`❌ Deployment failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async verifyDeployment() {
        try {
            log('🔍 Verifying deployment...', 'yellow');
            
            const contract = new this.web3.eth.Contract(this.contract.abi, this.contractAddress);
            
            // Get token info
            const name = await contract.methods.name().call();
            const symbol = await contract.methods.symbol().call();
            const decimals = await contract.methods.decimals().call();
            const totalSupply = await contract.methods.totalSupply().call();
            const owner = await contract.methods.owner().call();
            
            log('📊 Token Information:', 'cyan');
            log(`   Name: ${name}`, 'blue');
            log(`   Symbol: ${symbol}`, 'blue');
            log(`   Decimals: ${decimals}`, 'blue');
            log(`   Total Supply: ${this.web3.utils.fromWei(totalSupply, 'ether')} ${symbol}`, 'blue');
            log(`   Owner: ${owner}`, 'blue');
            
            // Check deployer balance
            const deployerBalance = await contract.methods.balanceOf(this.accounts[0]).call();
            const deployerBalanceFormatted = this.web3.utils.fromWei(deployerBalance, 'ether');
            
            log(`💰 Deployer Balance: ${deployerBalanceFormatted} ${symbol}`, 'green');
            
            log('✅ Deployment verification completed', 'green');
            
        } catch (error) {
            log(`❌ Verification failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async run() {
        try {
            // Create build directory
            if (!fs.existsSync('./build')) {
                fs.mkdirSync('./build');
            }
            
            await this.initialize();
            this.compileContract();
            await this.deployContract();
            await this.verifyDeployment();
            
            log('\n🎉 Token deployment completed successfully!', 'green');
            log(`\n📋 Summary:`, 'cyan');
            log(`   Contract Address: ${this.contractAddress}`, 'blue');
            log(`   Token Symbol: ${CONFIG.TOKEN_SYMBOL}`, 'blue');
            log(`   Total Supply: ${CONFIG.INITIAL_SUPPLY} ${CONFIG.TOKEN_SYMBOL}`, 'blue');
            log(`   Deployer: ${this.accounts[0]}`, 'blue');
            
        } catch (error) {
            log(`\n💥 Deployment failed: ${error.message}`, 'red');
            process.exit(1);
        }
    }
}

// Run deployment
if (require.main === module) {
    const deployer = new TokenDeployer();
    deployer.run();
}

module.exports = TokenDeployer;

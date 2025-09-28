const { Web3 } = require('web3');
const fs = require('fs');
const solc = require('solc');

// Configuration
const CONFIG = {
    RPC_URL: 'http://localhost:8545',
    CHAIN_ID: 1337,
    CONTRACT_FILE: './SimpleERC20Token.sol',
    CONTRACT_NAME: 'SimpleERC20Token',
    INITIAL_SUPPLY: 1000, // 1000 tokens
    GAS_PRICE: '20000000000', // 20 Gwei
    GAS_LIMIT: 3000000,
    // Development private key (DO NOT USE IN PRODUCTION!)
    PRIVATE_KEY: '0x1234567890123456789012345678901234567890123456789012345678901234'
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

class ERC20TokenDeployer {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.contract = null;
        this.contractAddress = null;
    }

    async initialize() {
        log('🚀 Initializing ERC20 Token Deployer...', 'cyan');
        try {
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
            
            // Create account from private key
            this.account = this.web3.eth.accounts.privateKeyToAccount(CONFIG.PRIVATE_KEY);
            this.web3.eth.accounts.wallet.add(this.account);
            
            log(`✅ Account created from private key`, 'green');
            log(`📝 Deployer account: ${this.account.address}`, 'blue');
            
            // Check balance
            const balance = await this.web3.eth.getBalance(this.account.address);
            const balanceEth = this.web3.utils.fromWei(balance, 'ether');
            log(`💰 Account balance: ${balanceEth} ETH`, 'blue');
            
            if (balance === '0') {
                log(`⚠️ Account has no ETH. This account needs to be funded in the genesis block.`, 'yellow');
                log(`💡 For development, you can fund this account manually or use an existing funded account.`, 'yellow');
                throw new Error('Account has no ETH. Please fund this account first.');
            }

        } catch (error) {
            log(`❌ Initialization failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async compileContract() {
        log('🔨 Compiling ERC20 smart contract...', 'yellow');
        try {
            const contractCode = fs.readFileSync(CONFIG.CONTRACT_FILE, 'utf8');
            
            // Create input for solc with OpenZeppelin dependencies
            const input = {
                language: 'Solidity',
                sources: {
                    'SimpleERC20Token.sol': {
                        content: contractCode,
                    },
                    '@openzeppelin/contracts/token/ERC20/ERC20.sol': {
                        content: fs.readFileSync('./node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol', 'utf8')
                    },
                    '@openzeppelin/contracts/token/ERC20/IERC20.sol': {
                        content: fs.readFileSync('./node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol', 'utf8')
                    },
                    '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol': {
                        content: fs.readFileSync('./node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol', 'utf8')
                    },
                    '@openzeppelin/contracts/utils/Context.sol': {
                        content: fs.readFileSync('./node_modules/@openzeppelin/contracts/utils/Context.sol', 'utf8')
                    }
                },
                settings: {
                    outputSelection: {
                        '*': {
                            '*': ['*'],
                        },
                    },
                },
            };

            const output = JSON.parse(solc.compile(JSON.stringify(input)));
            
            if (output.errors && output.errors.length > 0) {
                console.log('Compilation errors:', output.errors);
            }
            
            const contractOutput = output.contracts['SimpleERC20Token.sol']['SimpleERC20Token'];

            if (!contractOutput) {
                throw new Error(`Contract ${CONFIG.CONTRACT_NAME} not found in compilation output.`);
            }

            this.contractAbi = contractOutput.abi;
            this.contractBytecode = contractOutput.evm.bytecode.object;

            // Save compiled contract to build directory
            const buildDir = './build';
            if (!fs.existsSync(buildDir)) {
                fs.mkdirSync(buildDir);
            }
            fs.writeFileSync(`${buildDir}/SimpleERC20Token.json`, JSON.stringify(contractOutput, null, 2));
            log('✅ Contract compiled successfully', 'green');
            log('💾 Compiled contract saved to build/SimpleERC20Token.json', 'blue');

        } catch (error) {
            log(`❌ Compilation failed: ${error.message}`, 'red');
            throw error;
        }
    }

    async deployContract() {
        log('🚀 Deploying ERC20 smart contract...', 'cyan');
        try {
            this.contract = new this.web3.eth.Contract(this.contractAbi);
            
            // Prepare deployment data - the constructor takes a recipient address
            const deployData = this.contract.deploy({
                data: this.contractBytecode,
                arguments: [this.account.address] // Deployer receives the initial tokens
            });
            
            // Get nonce
            const nonce = await this.web3.eth.getTransactionCount(this.account.address);
            
            // Create transaction object
            const tx = {
                from: this.account.address,
                data: deployData.encodeABI(),
                gas: CONFIG.GAS_LIMIT,
                gasPrice: CONFIG.GAS_PRICE,
                nonce: nonce
            };
            
            log(`📤 Sending signed transaction...`, 'yellow');
            log(`🔢 Nonce: ${nonce}`, 'blue');
            log(`⛽ Gas: ${CONFIG.GAS_LIMIT}`, 'blue');
            log(`💰 Gas Price: ${CONFIG.GAS_PRICE}`, 'blue');
            log(`🎯 Initial recipient: ${this.account.address}`, 'blue');
            
            // Sign and send transaction
            const signedTx = await this.web3.eth.accounts.signTransaction(tx, CONFIG.PRIVATE_KEY);
            const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            
            this.contractAddress = receipt.contractAddress;
            
            log(`✅ Contract deployed successfully!`, 'green');
            log(`📍 Contract address: ${this.contractAddress}`, 'green');
            log(`🔗 Transaction hash: ${receipt.transactionHash}`, 'green');

            // Save contract address and ABI
            fs.writeFileSync('./build/SimpleERC20Token.address', this.contractAddress);
            fs.writeFileSync('./build/SimpleERC20Token.abi', JSON.stringify(this.contractAbi, null, 2));
            log('📝 Contract address and ABI saved to build/ directory', 'green');

            // Test the deployed contract
            await this.testContract();

        } catch (error) {
            log(`❌ Deployment failed: ${error.message}`, 'red');
            log(`🔍 Error details: ${JSON.stringify(error, null, 2)}`, 'yellow');
            throw error;
        }
    }

    async testContract() {
        log('🧪 Testing deployed contract...', 'cyan');
        try {
            const contractInstance = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
            
            // Test token name
            const name = await contractInstance.methods.name().call();
            log(`📛 Token name: ${name}`, 'green');
            
            // Test token symbol
            const symbol = await contractInstance.methods.symbol().call();
            log(`🔤 Token symbol: ${symbol}`, 'green');
            
            // Test total supply
            const totalSupply = await contractInstance.methods.totalSupply().call();
            const totalSupplyFormatted = this.web3.utils.fromWei(totalSupply, 'ether');
            log(`📊 Total supply: ${totalSupplyFormatted} ${symbol}`, 'green');
            
            // Test balance of deployer
            const balance = await contractInstance.methods.balanceOf(this.account.address).call();
            const balanceFormatted = this.web3.utils.fromWei(balance, 'ether');
            log(`💰 Deployer balance: ${balanceFormatted} ${symbol}`, 'green');
            
            // Test decimals
            const decimals = await contractInstance.methods.decimals().call();
            log(`🔢 Decimals: ${decimals}`, 'green');

        } catch (error) {
            log(`⚠️ Contract test failed: ${error.message}`, 'yellow');
        }
    }

    async run() {
        try {
            await this.initialize();
            await this.compileContract();
            await this.deployContract();
            log('🎉 ERC20 Token deployment completed successfully!', 'green');
        } catch (error) {
            log(`\n💥 Deployment failed: ${error.message}`, 'red');
        }
    }
}

const deployer = new ERC20TokenDeployer();
deployer.run();
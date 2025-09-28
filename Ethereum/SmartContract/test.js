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

class TokenTester {
    constructor() {
        this.web3 = null;
        this.accounts = [];
        this.contract = null;
        this.contractAddress = null;
        this.testResults = [];
    }

    async initialize() {
        try {
            log('🚀 Initializing Token Tester...', 'cyan');
            
            // Load deployment info
            if (!fs.existsSync('./deployment.json')) {
                throw new Error('deployment.json not found. Please deploy the contract first.');
            }
            
            const deploymentInfo = JSON.parse(fs.readFileSync('./deployment.json', 'utf8'));
            this.contractAddress = deploymentInfo.contractAddress;
            
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
            
            // Load contract ABI
            const contractData = JSON.parse(fs.readFileSync('./build/MyToken.json', 'utf8'));
            this.contract = new this.web3.eth.Contract(contractData.abi, this.contractAddress);
            
            log('✅ Tester initialized successfully', 'green');
            
        } catch (error) {
            log(`❌ Initialization failed: ${error.message}`, 'red');
            throw error;
        }
    }

    addTestResult(testName, passed, message) {
        const result = {
            test: testName,
            passed: passed,
            message: message,
            timestamp: new Date().toISOString()
        };
        this.testResults.push(result);
        
        const status = passed ? '✅' : '❌';
        const color = passed ? 'green' : 'red';
        log(`   ${status} ${testName}: ${message}`, color);
    }

    async testTokenInfo() {
        log('\n📊 Testing Token Information...', 'yellow');
        
        try {
            const name = await this.contract.methods.name().call();
            const symbol = await this.contract.methods.symbol().call();
            const decimals = await this.contract.methods.decimals().call();
            const totalSupply = await this.contract.methods.totalSupply().call();
            const owner = await this.contract.methods.owner().call();
            
            this.addTestResult('Token Name', name === 'My Private Token', `Expected: "My Private Token", Got: "${name}"`);
            this.addTestResult('Token Symbol', symbol === 'MPT', `Expected: "MPT", Got: "${symbol}"`);
            this.addTestResult('Token Decimals', decimals === '18', `Expected: 18, Got: ${decimals}`);
            this.addTestResult('Total Supply', totalSupply === this.web3.utils.toWei('1000000', 'ether'), `Expected: 1000000 tokens, Got: ${this.web3.utils.fromWei(totalSupply, 'ether')}`);
            this.addTestResult('Owner Assignment', owner.toLowerCase() === this.accounts[0].toLowerCase(), `Expected: ${this.accounts[0]}, Got: ${owner}`);
            
        } catch (error) {
            this.addTestResult('Token Information Retrieval', false, error.message);
        }
    }

    async testBalances() {
        log('\n💰 Testing Balances...', 'yellow');
        
        try {
            const deployerBalance = await this.contract.methods.balanceOf(this.accounts[0]).call();
            const expectedBalance = this.web3.utils.toWei('1000000', 'ether');
            
            this.addTestResult('Deployer Balance', deployerBalance === expectedBalance, 
                `Expected: 1000000 tokens, Got: ${this.web3.utils.fromWei(deployerBalance, 'ether')}`);
            
            // Test other accounts have zero balance initially
            for (let i = 1; i < Math.min(this.accounts.length, 3); i++) {
                const balance = await this.contract.methods.balanceOf(this.accounts[i]).call();
                this.addTestResult(`Account ${i} Initial Balance`, balance === '0', 
                    `Expected: 0 tokens, Got: ${this.web3.utils.fromWei(balance, 'ether')}`);
            }
            
        } catch (error) {
            this.addTestResult('Balance Testing', false, error.message);
        }
    }

    async testTransfer() {
        log('\n💸 Testing Transfers...', 'yellow');
        
        try {
            if (this.accounts.length < 2) {
                this.addTestResult('Transfer Test', false, 'Not enough accounts for transfer test');
                return;
            }
            
            const transferAmount = this.web3.utils.toWei('100', 'ether');
            const fromAccount = this.accounts[0];
            const toAccount = this.accounts[1];
            
            // Get initial balances
            const initialFromBalance = await this.contract.methods.balanceOf(fromAccount).call();
            const initialToBalance = await this.contract.methods.balanceOf(toAccount).call();
            
            // Perform transfer
            const tx = await this.contract.methods.transfer(toAccount, transferAmount).send({
                from: fromAccount,
                gas: 100000,
                gasPrice: '20000000000'
            });
            
            // Check final balances
            const finalFromBalance = await this.contract.methods.balanceOf(fromAccount).call();
            const finalToBalance = await this.contract.methods.balanceOf(toAccount).call();
            
            const expectedFromBalance = this.web3.utils.toBN(initialFromBalance).sub(this.web3.utils.toBN(transferAmount));
            const expectedToBalance = this.web3.utils.toBN(initialToBalance).add(this.web3.utils.toBN(transferAmount));
            
            this.addTestResult('Transfer Transaction', tx.transactionHash !== undefined, `Transaction hash: ${tx.transactionHash}`);
            this.addTestResult('From Balance After Transfer', finalFromBalance === expectedFromBalance.toString(), 
                `Expected: ${this.web3.utils.fromWei(expectedFromBalance.toString(), 'ether')}, Got: ${this.web3.utils.fromWei(finalFromBalance, 'ether')}`);
            this.addTestResult('To Balance After Transfer', finalToBalance === expectedToBalance.toString(), 
                `Expected: ${this.web3.utils.fromWei(expectedToBalance.toString(), 'ether')}, Got: ${this.web3.utils.fromWei(finalToBalance, 'ether')}`);
            
        } catch (error) {
            this.addTestResult('Transfer Test', false, error.message);
        }
    }

    async testApproval() {
        log('\n🔐 Testing Approvals...', 'yellow');
        
        try {
            if (this.accounts.length < 3) {
                this.addTestResult('Approval Test', false, 'Not enough accounts for approval test');
                return;
            }
            
            const approveAmount = this.web3.utils.toWei('50', 'ether');
            const owner = this.accounts[0];
            const spender = this.accounts[2];
            
            // Perform approval
            const tx = await this.contract.methods.approve(spender, approveAmount).send({
                from: owner,
                gas: 100000,
                gasPrice: '20000000000'
            });
            
            // Check allowance
            const allowance = await this.contract.methods.allowance(owner, spender).call();
            
            this.addTestResult('Approval Transaction', tx.transactionHash !== undefined, `Transaction hash: ${tx.transactionHash}`);
            this.addTestResult('Allowance Set Correctly', allowance === approveAmount, 
                `Expected: ${this.web3.utils.fromWei(approveAmount, 'ether')}, Got: ${this.web3.utils.fromWei(allowance, 'ether')}`);
            
        } catch (error) {
            this.addTestResult('Approval Test', false, error.message);
        }
    }

    async testMinting() {
        log('\n🪙 Testing Minting...', 'yellow');
        
        try {
            const mintAmount = this.web3.utils.toWei('1000', 'ether');
            const toAccount = this.accounts[1];
            const owner = await this.contract.methods.owner().call();
            
            // Check if caller is owner
            if (this.accounts[0].toLowerCase() !== owner.toLowerCase()) {
                this.addTestResult('Minting Test', false, 'Caller is not the owner');
                return;
            }
            
            // Get initial balance and total supply
            const initialBalance = await this.contract.methods.balanceOf(toAccount).call();
            const initialTotalSupply = await this.contract.methods.totalSupply().call();
            
            // Perform minting
            const tx = await this.contract.methods.mint(toAccount, mintAmount).send({
                from: this.accounts[0],
                gas: 100000,
                gasPrice: '20000000000'
            });
            
            // Check final balance and total supply
            const finalBalance = await this.contract.methods.balanceOf(toAccount).call();
            const finalTotalSupply = await this.contract.methods.totalSupply().call();
            
            const expectedBalance = this.web3.utils.toBN(initialBalance).add(this.web3.utils.toBN(mintAmount));
            const expectedTotalSupply = this.web3.utils.toBN(initialTotalSupply).add(this.web3.utils.toBN(mintAmount));
            
            this.addTestResult('Minting Transaction', tx.transactionHash !== undefined, `Transaction hash: ${tx.transactionHash}`);
            this.addTestResult('Minted Balance', finalBalance === expectedBalance.toString(), 
                `Expected: ${this.web3.utils.fromWei(expectedBalance.toString(), 'ether')}, Got: ${this.web3.utils.fromWei(finalBalance, 'ether')}`);
            this.addTestResult('Total Supply After Mint', finalTotalSupply === expectedTotalSupply.toString(), 
                `Expected: ${this.web3.utils.fromWei(expectedTotalSupply.toString(), 'ether')}, Got: ${this.web3.utils.fromWei(finalTotalSupply, 'ether')}`);
            
        } catch (error) {
            this.addTestResult('Minting Test', false, error.message);
        }
    }

    async testBurn() {
        log('\n🔥 Testing Burning...', 'yellow');
        
        try {
            if (this.accounts.length < 2) {
                this.addTestResult('Burn Test', false, 'Not enough accounts for burn test');
                return;
            }
            
            const burnAmount = this.web3.utils.toWei('10', 'ether');
            const burner = this.accounts[1];
            
            // Get initial balance and total supply
            const initialBalance = await this.contract.methods.balanceOf(burner).call();
            const initialTotalSupply = await this.contract.methods.totalSupply().call();
            
            // Check if account has enough balance to burn
            if (this.web3.utils.toBN(initialBalance).lt(this.web3.utils.toBN(burnAmount))) {
                this.addTestResult('Burn Test', false, 'Insufficient balance for burn test');
                return;
            }
            
            // Perform burning
            const tx = await this.contract.methods.burn(burnAmount).send({
                from: burner,
                gas: 100000,
                gasPrice: '20000000000'
            });
            
            // Check final balance and total supply
            const finalBalance = await this.contract.methods.balanceOf(burner).call();
            const finalTotalSupply = await this.contract.methods.totalSupply().call();
            
            const expectedBalance = this.web3.utils.toBN(initialBalance).sub(this.web3.utils.toBN(burnAmount));
            const expectedTotalSupply = this.web3.utils.toBN(initialTotalSupply).sub(this.web3.utils.toBN(burnAmount));
            
            this.addTestResult('Burn Transaction', tx.transactionHash !== undefined, `Transaction hash: ${tx.transactionHash}`);
            this.addTestResult('Burned Balance', finalBalance === expectedBalance.toString(), 
                `Expected: ${this.web3.utils.fromWei(expectedBalance.toString(), 'ether')}, Got: ${this.web3.utils.fromWei(finalBalance, 'ether')}`);
            this.addTestResult('Total Supply After Burn', finalTotalSupply === expectedTotalSupply.toString(), 
                `Expected: ${this.web3.utils.fromWei(expectedTotalSupply.toString(), 'ether')}, Got: ${this.web3.utils.fromWei(finalTotalSupply, 'ether')}`);
            
        } catch (error) {
            this.addTestResult('Burn Test', false, error.message);
        }
    }

    async runAllTests() {
        try {
            await this.initialize();
            
            log('🧪 Running Token Contract Tests...', 'cyan');
            
            await this.testTokenInfo();
            await this.testBalances();
            await this.testTransfer();
            await this.testApproval();
            await this.testMinting();
            await this.testBurn();
            
            // Summary
            const passed = this.testResults.filter(r => r.passed).length;
            const total = this.testResults.length;
            
            log('\n📊 Test Summary:', 'cyan');
            log(`   Total Tests: ${total}`, 'blue');
            log(`   Passed: ${passed}`, 'green');
            log(`   Failed: ${total - passed}`, total - passed > 0 ? 'red' : 'green');
            log(`   Success Rate: ${((passed / total) * 100).toFixed(1)}%`, 'blue');
            
            // Save test results
            const testReport = {
                timestamp: new Date().toISOString(),
                contractAddress: this.contractAddress,
                totalTests: total,
                passedTests: passed,
                failedTests: total - passed,
                successRate: (passed / total) * 100,
                results: this.testResults
            };
            
            fs.writeFileSync('./test-results.json', JSON.stringify(testReport, null, 2));
            log('💾 Test results saved to test-results.json', 'blue');
            
            if (passed === total) {
                log('\n🎉 All tests passed!', 'green');
            } else {
                log('\n⚠️  Some tests failed. Check the results above.', 'yellow');
            }
            
        } catch (error) {
            log(`\n💥 Testing failed: ${error.message}`, 'red');
            process.exit(1);
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new TokenTester();
    tester.runAllTests();
}

module.exports = TokenTester;

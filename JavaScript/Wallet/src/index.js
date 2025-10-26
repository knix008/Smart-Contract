import './styles.css';
import { ethers } from 'ethers';

class EthereumWallet {
    constructor() {
        this.wallet = null;
        this.provider = null;
        this.signer = null;
        this.transactionHistory = [];
        this.currentNetwork = null;
        this.checkingAddress = null;
        
        this.initEventListeners();
        // Wait for DOM to be ready before initializing provider
        if (document.getElementById('network')) {
            this.initProvider();
        }
        this.checkEnvWallet();
        this.loadSavedWallet();
    }

    initEventListeners() {
        // Account management
        document.getElementById('createAccount').addEventListener('click', () => this.createAccount());
        document.getElementById('importAccount').addEventListener('click', () => this.importAccount());
        document.getElementById('copyAddress').addEventListener('click', () => this.copyAddress());
        document.getElementById('checkBalance').addEventListener('click', () => this.checkBalanceForAddress());
        document.getElementById('refreshBalance').addEventListener('click', () => this.updateBalance());
        document.getElementById('addressInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkBalanceForAddress();
            }
        });
        
        // Transaction management
        document.getElementById('network').addEventListener('change', () => {
            this.initProvider();
            this.updateNetworkDisplay();
            // Update balance when network changes
            if (this.checkingAddress) {
                this.updateBalance();
            }
        });
        document.getElementById('signTransaction').addEventListener('click', () => this.signTransaction());
        document.getElementById('sendTransaction').addEventListener('click', () => this.sendTransaction());
    }

    checkEnvWallet() {
        // Check if PRIVATE_KEY is set in environment variables
        if (process.env.PRIVATE_KEY) {
            try {
                const privateKey = process.env.PRIVATE_KEY.trim();
                const cleanedKey = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;
                this.wallet = new ethers.Wallet(cleanedKey);
                this.saveWallet();
                this.initProvider();
                this.displayAccountInfo();
                console.log('✅ Wallet loaded from .env file');
                this.showResult('Wallet loaded from .env file successfully!', 'success');
            } catch (error) {
                console.error('Failed to load wallet from .env:', error);
                this.showResult('Failed to load wallet from .env: ' + error.message, 'error');
            }
        }
    }

    initProvider() {
        const networkSelect = document.getElementById('network');
        if (!networkSelect) {
            console.log('Network select not found, skipping provider initialization');
            return;
        }
        
        const network = networkSelect.value;
        this.currentNetwork = network;

        // Use RPC endpoints from environment variables ONLY
        const rpcUrls = {
            mainnet: process.env.ETHEREUM_MAINNET_RPC,
            sepolia: process.env.ETHEREUM_SEPOLIA_RPC
        };

        console.log('Environment variables loaded:', {
            ETHEREUM_SEPOLIA_RPC: process.env.ETHEREUM_SEPOLIA_RPC,
            ETHEREUM_MAINNET_RPC: process.env.ETHEREUM_MAINNET_RPC
        });
        console.log('Selected network:', network);
        console.log('RPC URL for', network, ':', rpcUrls[network]);

        // Check if environment variable is loaded
        if (!rpcUrls[network]) {
            const errorMsg = `Environment variable for ${network} is not loaded. Please check .env file and rebuild.`;
            console.error(errorMsg);
            this.showResult(errorMsg, 'error');
            return;
        }

        try {
            this.provider = new ethers.JsonRpcProvider(rpcUrls[network]);
            console.log('Provider initialized for network:', network, 'URL:', rpcUrls[network]);
            console.log('Provider object:', this.provider);
            
            // Test the provider connection
            this.provider.getNetwork().then(net => {
                console.log('Connected to network:', net.name, 'Chain ID:', net.chainId);
            }).catch(err => {
                console.error('Failed to get network info:', err);
            });
            
            if (this.wallet) {
                this.signer = new ethers.Wallet(this.wallet.privateKey, this.provider);
            }
            this.updateNetworkDisplay();
        } catch (error) {
            console.error('Failed to initialize provider:', error);
            this.showResult('Failed to initialize provider: ' + error.message, 'error');
        }
    }

    createAccount() {
        try {
            this.wallet = ethers.Wallet.createRandom();
            this.saveWallet();
            this.initProvider();
            this.displayAccountInfo();
            this.showResult('Account created successfully!', 'success');
            
            // Display private key with warning
            const proceed = confirm(
                'Account created!\n\n' +
                `Address: ${this.wallet.address}\n\n` +
                `Private Key: ${this.wallet.privateKey}\n\n` +
                '⚠️ IMPORTANT: Save your private key securely! ' +
                'If you lose it, you will not be able to access your account.\n\n' +
                'Do you want to copy the private key to clipboard?'
            );
            
            if (proceed) {
                navigator.clipboard.writeText(this.wallet.privateKey);
                alert('Private key copied to clipboard!');
            }
        } catch (error) {
            this.showResult('Failed to create account: ' + error.message, 'error');
        }
    }

    importAccount() {
        const privateKey = prompt('Enter your private key:');
        
        if (!privateKey) {
            return;
        }

        try {
            // Remove 0x prefix if present
            const cleanedKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
            this.wallet = new ethers.Wallet('0x' + cleanedKey);
            this.saveWallet();
            this.initProvider();
            this.displayAccountInfo();
            this.showResult('Account imported successfully!', 'success');
        } catch (error) {
            this.showResult('Failed to import account: ' + error.message, 'error');
        }
    }

    saveWallet() {
        if (this.wallet) {
            const walletData = {
                address: this.wallet.address,
                privateKey: this.wallet.privateKey
            };
            localStorage.setItem('ethereumWallet', JSON.stringify(walletData));
        }
    }

    loadSavedWallet() {
        const savedWallet = localStorage.getItem('ethereumWallet');
        
        if (savedWallet) {
            try {
                const walletData = JSON.parse(savedWallet);
                this.wallet = new ethers.Wallet(walletData.privateKey);
                this.initProvider();
                this.displayAccountInfo();
            } catch (error) {
                console.error('Failed to load saved wallet:', error);
                localStorage.removeItem('ethereumWallet');
            }
        }
    }

    displayAccountInfo() {
        if (!this.wallet) {
            return;
        }

        document.getElementById('addressInput').value = this.wallet.address;
        document.getElementById('walletAddress').textContent = this.wallet.address;
        document.getElementById('addressDisplayContainer').style.display = 'flex';
        
        this.checkingAddress = this.wallet.address;
        this.updateBalance();
        this.updateNetworkDisplay();
    }

    updateNetworkDisplay() {
        if (!this.currentNetwork) {
            this.currentNetwork = document.getElementById('network').value;
        }
        
        const networkNames = {
            mainnet: 'Ethereum Mainnet',
            sepolia: 'Sepolia Testnet'
        };
        
        document.getElementById('currentNetwork').textContent = networkNames[this.currentNetwork] || this.currentNetwork;
    }

    async updateBalance() {
        if (!this.provider) {
            console.error('No provider available for balance check');
            document.getElementById('balance').textContent = 'No provider';
            return;
        }

        // Prioritize checkingAddress (pasted address) over wallet address
        const address = this.checkingAddress || (this.wallet ? this.wallet.address : null);
        
        if (!address) {
            console.error('No address available for balance check');
            document.getElementById('balance').textContent = 'No address';
            return;
        }

        try {
            console.log('Fetching balance for:', address, 'on network:', this.currentNetwork);
            console.log('Provider URL:', this.provider.connection?.url || 'Unknown');
            
            const balance = await this.provider.getBalance(address);
            const balanceInEth = ethers.formatEther(balance);
            document.getElementById('balance').textContent = `${balanceInEth} ETH`;
            console.log('Balance fetched successfully:', balanceInEth, 'ETH');
        } catch (error) {
            document.getElementById('balance').textContent = 'Error loading balance';
            console.error('Balance update error:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                network: this.currentNetwork,
                providerURL: this.provider.connection?.url
            });
            this.showResult('Failed to fetch balance: ' + error.message, 'error');
        }
    }

    async checkBalanceForAddress() {
        const addressInput = document.getElementById('addressInput').value.trim();
        
        if (!addressInput) {
            this.showResult('Please enter an Ethereum address', 'error');
            return;
        }

        if (!ethers.isAddress(addressInput)) {
            this.showResult('Invalid Ethereum address', 'error');
            return;
        }

        this.checkingAddress = addressInput;

        // Show the address in the display
        document.getElementById('walletAddress').textContent = addressInput;
        document.getElementById('addressDisplayContainer').style.display = 'flex';
        
        // Show loading state
        document.getElementById('balance').textContent = 'Loading...';
        
        // Always reinitialize provider to ensure it's using the correct network
        console.log('Reinitializing provider for network:', document.getElementById('network').value);
        this.initProvider();
        
        // Wait for provider to initialize
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!this.provider) {
            this.showResult('Failed to initialize provider. Please check your network connection.', 'error');
            return;
        }
        
        try {
            console.log('Checking balance for:', addressInput);
            await this.updateBalance();
            this.showResult(`Balance checked for ${addressInput} on ${this.currentNetwork}`, 'success');
        } catch (error) {
            this.showResult('Failed to check balance: ' + error.message, 'error');
            console.error('Balance check error:', error);
        }
    }

    copyAddress() {
        if (this.wallet) {
            navigator.clipboard.writeText(this.wallet.address);
            this.showResult('Address copied to clipboard!', 'success');
        }
    }

    async signTransaction() {
        if (!this.validateTransaction()) {
            return;
        }

        if (!this.wallet || !this.signer) {
            this.showResult('Please create or import an account first', 'error');
            return;
        }

        try {
            const recipient = document.getElementById('recipient').value;
            const amount = document.getElementById('amount').value;
            const amountInWei = ethers.parseEther(amount);

            // Get current nonce and gas price
            const nonce = await this.provider.getTransactionCount(this.wallet.address);
            const feeData = await this.provider.getFeeData();

            const transaction = {
                to: recipient,
                value: amountInWei,
                nonce: nonce,
                gasLimit: 21000,
                gasPrice: feeData.gasPrice,
                chainId: await this.provider.getNetwork().then(n => n.chainId)
            };

            // Sign the transaction
            const signedTx = await this.signer.signTransaction(transaction);
            
            this.showResult('Transaction signed successfully!\n\n' + signedTx, 'success');
            
            this.addToHistory({
                type: 'Signed',
                to: recipient,
                amount: amount,
                transaction: signedTx,
                status: 'Signed'
            });

        } catch (error) {
            this.showResult('Failed to sign transaction: ' + error.message, 'error');
        }
    }

    async sendTransaction() {
        if (!this.validateTransaction()) {
            return;
        }

        if (!this.wallet || !this.signer) {
            this.showResult('Please create or import an account first', 'error');
            return;
        }

        try {
            const recipient = document.getElementById('recipient').value;
            const amount = document.getElementById('amount').value;

            // Show loading state
            const sendBtn = document.getElementById('sendTransaction');
            const originalText = sendBtn.textContent;
            sendBtn.textContent = 'Sending...';
            sendBtn.disabled = true;

            // Send the transaction
            const tx = await this.signer.sendTransaction({
                to: recipient,
                value: ethers.parseEther(amount)
            });

            this.showResult('Transaction sent! Waiting for confirmation...\n\n' + 
                          'Transaction Hash: ' + tx.hash, 'success');

            // Wait for transaction to be mined
            const receipt = await tx.wait();

            this.showResult(
                'Transaction confirmed!\n\n' +
                'Transaction Hash: ' + receipt.hash + '\n' +
                'Block Number: ' + receipt.blockNumber + '\n' +
                'Gas Used: ' + receipt.gasUsed.toString(),
                'success'
            );

            this.addToHistory({
                type: 'Sent',
                to: recipient,
                amount: amount,
                hash: receipt.hash,
                blockNumber: receipt.blockNumber,
                status: 'Confirmed'
            });

            // Update balance
            this.updateBalance();

            // Clear form
            document.getElementById('recipient').value = '';
            document.getElementById('amount').value = '';

        } catch (error) {
            this.showResult('Failed to send transaction: ' + error.message, 'error');
        } finally {
            const sendBtn = document.getElementById('sendTransaction');
            sendBtn.textContent = originalText;
            sendBtn.disabled = false;
        }
    }

    validateTransaction() {
        const recipient = document.getElementById('recipient').value.trim();
        const amount = document.getElementById('amount').value.trim();

        if (!recipient) {
            this.showResult('Please enter a recipient address', 'error');
            return false;
        }

        if (!ethers.isAddress(recipient)) {
            this.showResult('Invalid Ethereum address', 'error');
            return false;
        }

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            this.showResult('Please enter a valid amount', 'error');
            return false;
        }

        return true;
    }

    showResult(message, type) {
        const resultDiv = document.getElementById('transactionResult');
        resultDiv.textContent = message;
        resultDiv.className = 'transaction-result ' + type;
        resultDiv.classList.remove('hidden');

        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    addToHistory(tx) {
        this.transactionHistory.unshift(tx);
        
        // Keep only last 10 transactions
        if (this.transactionHistory.length > 10) {
            this.transactionHistory = this.transactionHistory.slice(0, 10);
        }

        this.renderHistory();
    }

    renderHistory() {
        const container = document.getElementById('historyContainer');
        
        if (this.transactionHistory.length === 0) {
            container.innerHTML = '<p class="no-history">No transactions yet</p>';
            return;
        }

        container.innerHTML = this.transactionHistory.map((tx, index) => `
            <div class="history-item">
                <h4>${tx.type} Transaction #${this.transactionHistory.length - index}</h4>
                <p><strong>To:</strong> ${tx.to}</p>
                <p><strong>Amount:</strong> ${tx.amount} ETH</p>
                ${tx.hash ? `<p><strong>Hash:</strong> ${tx.hash}</p>` : ''}
                ${tx.blockNumber ? `<p><strong>Block:</strong> ${tx.blockNumber}</p>` : ''}
                <p><strong>Status:</strong> ${tx.status}</p>
            </div>
        `).join('');
    }
}

// Initialize wallet when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EthereumWallet();
});

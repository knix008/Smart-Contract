// DID Wallet Web Interface JavaScript
class WalletApp {
    constructor() {
        this.apiUrl = 'http://localhost:3001';
        this.wallets = [];
        this.dids = [];
        this.transactions = [];
        
        this.init();
    }

    async init() {
        console.log('Initializing Wallet App...');
        console.log('API URL:', this.apiUrl);
        
        // Test API connection
        try {
            console.log('Testing API connection...');
            const response = await fetch(`${this.apiUrl}/health`);
            console.log('Health check response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Health check data:', data);
                this.showNotification('서버에 성공적으로 연결되었습니다.', 'success');
            } else {
                console.log('Health check failed with status:', response.status);
                this.showNotification('서버 연결 실패. 상태 코드: ' + response.status, 'warning');
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            this.showNotification('서버에 연결할 수 없습니다: ' + error.message, 'danger');
        }
        
        await this.loadWallets();
        await this.loadDashboardStats();
        this.populateWalletSelects();
        this.setupEventListeners();
    }

    // API Helper Methods
    async apiCall(endpoint, method = 'GET', data = null) {
        try {
            console.log(`Making API call: ${method} ${this.apiUrl}${endpoint}`);
            
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
                console.log('Request data:', data);
            }

            const response = await fetch(`${this.apiUrl}${endpoint}`, options);
            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Response data:', result);
            
            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return result;
        } catch (error) {
            console.error('API Error Details:', {
                endpoint,
                method,
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    // Notification Methods
    showNotification(message, type = 'info') {
        console.log(`Notification [${type}]: ${message}`);
        
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification-alert');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification-alert position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="me-2">${message}</span>
                <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Add click handler to close button
        const closeBtn = notification.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => notification.remove());
    }

    // Dashboard Methods
    async loadDashboardStats() {
        try {
            // Calculate stats from loaded data
            const totalWallets = this.wallets.length;
            const totalDIDs = this.dids.length;
            
            // Calculate total balance
            let totalBalance = 0;
            for (const wallet of this.wallets) {
                try {
                    const balanceResult = await this.apiCall(`/wallet/${wallet.address}/balance`);
                    if (balanceResult.success) {
                        totalBalance += parseFloat(balanceResult.data.balance);
                    }
                } catch (error) {
                    console.log(`Could not load balance for ${wallet.address}`);
                }
            }

            // Calculate total transactions
            let totalTransactions = 0;
            for (const wallet of this.wallets) {
                try {
                    const txResult = await this.apiCall(`/wallet/${wallet.address}/transactions`);
                    if (txResult.success) {
                        totalTransactions += txResult.data.transactions.length;
                    }
                } catch (error) {
                    console.log(`Could not load transactions for ${wallet.address}`);
                }
            }

            // Update dashboard
            document.getElementById('totalWallets').textContent = totalWallets;
            document.getElementById('totalDIDs').textContent = totalDIDs;
            document.getElementById('totalBalance').textContent = totalBalance.toFixed(4);
            document.getElementById('totalTransactions').textContent = totalTransactions;
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    // Wallet Methods
    async loadWallets() {
        try {
            const result = await this.apiCall('/wallet');
            if (result.success) {
                this.wallets = result.data.wallets;
                this.displayWallets();
            }
        } catch (error) {
            console.error('Error loading wallets:', error);
            this.showError('Failed to load wallets');
        }
    }

    displayWallets() {
        const container = document.getElementById('walletsContainer');
        const noWallets = document.getElementById('noWallets');

        if (this.wallets.length === 0) {
            container.innerHTML = '';
            noWallets.style.display = 'block';
            return;
        }

        noWallets.style.display = 'none';
        container.innerHTML = this.wallets.map(wallet => this.renderWalletCard(wallet)).join('');
    }

    renderWalletCard(wallet) {
        return `
            <div class="wallet-card fade-in-up">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="flex-grow-1">
                            <h6 class="card-title mb-2">
                                <i class="fas fa-wallet text-primary me-2"></i>
                                Wallet
                            </h6>
                            <div class="wallet-address mb-2">${wallet.address}</div>
                            <div class="wallet-balance" id="balance-${wallet.address}">
                                <i class="fas fa-coins me-1"></i>
                                Loading...
                            </div>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="#" onclick="copyToClipboard('${wallet.address}')">
                                        <i class="fas fa-copy me-2"></i>Copy Address
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#" onclick="viewWalletDetails('${wallet.address}')">
                                        <i class="fas fa-eye me-2"></i>View Details
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#" onclick="refreshWalletBalance('${wallet.address}')">
                                        <i class="fas fa-sync-alt me-2"></i>Refresh Balance
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary-custom btn-sm" onclick="showSendFromWallet('${wallet.address}')">
                            <i class="fas fa-paper-plane me-1"></i>Send
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="showWalletTransactions('${wallet.address}')">
                            <i class="fas fa-history me-1"></i>History
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async refreshWalletBalance(address) {
        try {
            const result = await this.apiCall(`/wallet/${address}/balance`);
            if (result.success) {
                const balanceElement = document.getElementById(`balance-${address}`);
                balanceElement.innerHTML = `
                    <i class="fas fa-coins me-1"></i>
                    ${parseFloat(result.data.balance).toFixed(4)} ETH
                `;
            }
        } catch (error) {
            console.error('Error refreshing balance:', error);
            const balanceElement = document.getElementById(`balance-${address}`);
            balanceElement.innerHTML = `
                <i class="fas fa-exclamation-triangle text-warning me-1"></i>
                Error loading balance
            `;
        }
    }

    async generateWallet() {
        try {
            this.showLoading(true);
            const result = await this.apiCall('/wallet/generate', 'POST');
            
            if (result.success) {
                const wallet = result.data;
                
                // Display wallet info in modal
                document.getElementById('newWalletAddress').value = wallet.address;
                document.getElementById('newWalletPrivateKey').value = wallet.privateKey;
                document.getElementById('newWalletMnemonic').value = wallet.mnemonic;
                document.getElementById('newWalletInfo').style.display = 'block';
                document.getElementById('generateBtn').style.display = 'none';
                
                // Reload wallets
                await this.loadWallets();
                await this.loadDashboardStats();
                this.populateWalletSelects();
                
                this.showSuccess('Wallet generated successfully!');
            }
        } catch (error) {
            console.error('Error generating wallet:', error);
            this.showError('Failed to generate wallet: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async importWallet() {
        try {
            const activeTab = document.querySelector('#importTabs .nav-link.active');
            const isPrivateKey = activeTab.id === 'private-key-tab';
            
            let data;
            if (isPrivateKey) {
                const privateKey = document.getElementById('importPrivateKey').value.trim();
                if (!privateKey) {
                    this.showError('Please enter a private key');
                    return;
                }
                data = { privateKey };
            } else {
                const mnemonic = document.getElementById('importMnemonic').value.trim();
                if (!mnemonic) {
                    this.showError('Please enter a mnemonic phrase');
                    return;
                }
                data = { mnemonic };
            }

            this.showLoading(true);
            const endpoint = isPrivateKey ? '/wallet/import/private-key' : '/wallet/import/mnemonic';
            const result = await this.apiCall(endpoint, 'POST', data);
            
            if (result.success) {
                // Close modal and reload wallets
                const modal = bootstrap.Modal.getInstance(document.getElementById('importWalletModal'));
                modal.hide();
                
                await this.loadWallets();
                await this.loadDashboardStats();
                this.populateWalletSelects();
                
                this.showSuccess(`Wallet imported successfully! Address: ${result.data.address}`);
                
                // Clear form
                document.getElementById('importPrivateKey').value = '';
                document.getElementById('importMnemonic').value = '';
            }
        } catch (error) {
            console.error('Error importing wallet:', error);
            this.showError('Failed to import wallet: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // DID Methods
    async registerDID() {
        try {
            const walletAddress = document.getElementById('didWalletSelect').value;
            if (!walletAddress) {
                this.showError('Please select a wallet');
                return;
            }

            // Collect services
            const services = [];
            const serviceEntries = document.querySelectorAll('.service-entry');
            serviceEntries.forEach(entry => {
                const serviceId = entry.querySelector('input[name="serviceId"]').value.trim();
                const serviceType = entry.querySelector('input[name="serviceType"]').value.trim();
                const serviceEndpoint = entry.querySelector('input[name="serviceEndpoint"]').value.trim();
                
                if (serviceId && serviceType && serviceEndpoint) {
                    services.push({
                        id: serviceId,
                        type: serviceType,
                        serviceEndpoint: serviceEndpoint
                    });
                }
            });

            this.showLoading(true);
            const result = await this.apiCall('/did/register', 'POST', {
                address: walletAddress,
                services: services
            });
            
            if (result.success) {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('registerDIDModal'));
                modal.hide();
                
                await this.loadDIDs();
                await this.loadDashboardStats();
                
                this.showSuccess(`DID registered successfully! DID: ${result.data.did}`);
                
                // Clear form
                document.getElementById('registerDIDForm').reset();
                this.resetServiceEntries();
            }
        } catch (error) {
            console.error('Error registering DID:', error);
            this.showError('Failed to register DID: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async loadDIDs() {
        try {
            // Note: This would need to be implemented in the backend
            // For now, we'll simulate loading DIDs
            this.dids = [];
            this.displayDIDs();
        } catch (error) {
            console.error('Error loading DIDs:', error);
            this.showError('Failed to load DIDs');
        }
    }

    displayDIDs() {
        const container = document.getElementById('didsContainer');
        const noDIDs = document.getElementById('noDIDs');

        if (this.dids.length === 0) {
            container.innerHTML = '';
            noDIDs.style.display = 'block';
            return;
        }

        noDIDs.style.display = 'none';
        container.innerHTML = this.dids.map(did => this.renderDIDCard(did)).join('');
    }

    renderDIDCard(did) {
        return `
            <div class="did-card fade-in-up">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="flex-grow-1">
                            <h6 class="card-title mb-2">
                                <i class="fas fa-id-card text-success me-2"></i>
                                DID Identity
                            </h6>
                            <div class="did-identifier mb-2">${did.identifier}</div>
                            <small class="text-muted">
                                <i class="fas fa-wallet me-1"></i>
                                Wallet: ${did.walletAddress}
                            </small>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="#" onclick="copyToClipboard('${did.identifier}')">
                                        <i class="fas fa-copy me-2"></i>Copy DID
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#" onclick="viewDIDDocument('${did.identifier}')">
                                        <i class="fas fa-file-alt me-2"></i>View Document
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-warning-custom btn-sm" onclick="updateDID('${did.identifier}')">
                            <i class="fas fa-edit me-1"></i>Update
                        </button>
                        <button class="btn btn-danger-custom btn-sm" onclick="revokeDID('${did.identifier}')">
                            <i class="fas fa-ban me-1"></i>Revoke
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Transaction Methods
    async loadTransactions() {
        const walletAddress = document.getElementById('walletSelect').value;
        if (!walletAddress) {
            this.displayTransactions([]);
            return;
        }

        try {
            const result = await this.apiCall(`/wallet/${walletAddress}/transactions`);
            if (result.success) {
                this.transactions = result.data.transactions;
                this.displayTransactions(this.transactions);
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            this.showError('Failed to load transactions');
            this.displayTransactions([]);
        }
    }

    displayTransactions(transactions) {
        const container = document.getElementById('transactionsContainer');
        const noTransactions = document.getElementById('noTransactions');

        if (transactions.length === 0) {
            container.innerHTML = '';
            noTransactions.style.display = 'block';
            return;
        }

        noTransactions.style.display = 'none';
        container.innerHTML = transactions.map(tx => this.renderTransactionCard(tx)).join('');
    }

    renderTransactionCard(tx) {
        const statusClass = tx.status === 'success' ? 'status-success' : 
                           tx.status === 'pending' ? 'status-pending' : 'status-failed';
        
        return `
            <div class="transaction-card fade-in-up">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="flex-grow-1">
                            <h6 class="card-title mb-2">
                                <i class="fas fa-exchange-alt text-info me-2"></i>
                                Transaction
                                <span class="transaction-status ${statusClass}">${tx.status}</span>
                            </h6>
                            <div class="transaction-hash mb-2">${tx.hash}</div>
                            <div class="row">
                                <div class="col-md-6">
                                    <small class="text-muted">
                                        <i class="fas fa-arrow-up me-1"></i>
                                        From: ${tx.from}
                                    </small>
                                </div>
                                <div class="col-md-6">
                                    <small class="text-muted">
                                        <i class="fas fa-arrow-down me-1"></i>
                                        To: ${tx.to}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong class="text-primary">${tx.value} ETH</strong>
                            <small class="text-muted ms-2">
                                <i class="fas fa-clock me-1"></i>
                                ${new Date(tx.timestamp).toLocaleString()}
                            </small>
                        </div>
                        <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank" class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-external-link-alt me-1"></i>
                            View on Etherscan
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    async sendTransaction() {
        try {
            const fromWallet = document.getElementById('txFromWallet').value;
            const toAddress = document.getElementById('txToAddress').value;
            const amount = document.getElementById('txAmount').value;

            if (!fromWallet || !toAddress || !amount) {
                this.showError('Please fill in all fields');
                return;
            }

            if (parseFloat(amount) <= 0) {
                this.showError('Amount must be greater than 0');
                return;
            }

            this.showLoading(true);
            const result = await this.apiCall('/wallet/send', 'POST', {
                from: fromWallet,
                to: toAddress,
                amount: amount
            });
            
            if (result.success) {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('sendTransactionModal'));
                modal.hide();
                
                this.showSuccess(`Transaction sent successfully! Hash: ${result.data.transactionHash}`);
                
                // Clear form
                document.getElementById('sendTransactionForm').reset();
                
                // Refresh data
                await this.loadTransactions();
                await this.loadDashboardStats();
            }
        } catch (error) {
            console.error('Error sending transaction:', error);
            this.showError('Failed to send transaction: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // Message Signing Methods
    async signMessage() {
        try {
            const walletAddress = document.getElementById('signWalletSelect').value;
            const message = document.getElementById('messageToSign').value;

            if (!walletAddress || !message) {
                this.showError('Please select a wallet and enter a message');
                return;
            }

            this.showLoading(true);
            const result = await this.apiCall('/wallet/sign', 'POST', {
                address: walletAddress,
                message: message
            });
            
            if (result.success) {
                document.getElementById('messageSignature').value = result.data.signature;
                document.getElementById('signatureResult').style.display = 'block';
                this.showSuccess('Message signed successfully!');
            }
        } catch (error) {
            console.error('Error signing message:', error);
            this.showError('Failed to sign message: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async verifyMessage() {
        try {
            const message = document.getElementById('originalMessage').value;
            const signature = document.getElementById('messageSignatureToVerify').value;
            const address = document.getElementById('signerAddress').value;

            if (!message || !signature || !address) {
                this.showError('Please fill in all fields');
                return;
            }

            this.showLoading(true);
            const result = await this.apiCall('/wallet/verify', 'POST', {
                message: message,
                signature: signature,
                address: address
            });
            
            if (result.success) {
                const isValid = result.data.valid;
                const alertElement = document.getElementById('verificationAlert');
                const textElement = document.getElementById('verificationText');
                
                if (isValid) {
                    alertElement.className = 'alert alert-success';
                    alertElement.innerHTML = '<i class="fas fa-check-circle me-2"></i>';
                    textElement.textContent = 'Signature is valid! The message was signed by the specified address.';
                } else {
                    alertElement.className = 'alert alert-danger';
                    alertElement.innerHTML = '<i class="fas fa-times-circle me-2"></i>';
                    textElement.textContent = 'Signature is invalid! The message was not signed by the specified address.';
                }
                
                document.getElementById('verificationResult').style.display = 'block';
            }
        } catch (error) {
            console.error('Error verifying message:', error);
            this.showError('Failed to verify message: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // Utility Methods
    populateWalletSelects() {
        const selects = [
            'didWalletSelect', 
            'txFromWallet', 
            'signWalletSelect',
            'walletSelect'
        ];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            const currentValue = select.value;
            
            // Clear existing options except the first one
            select.innerHTML = select.children[0].outerHTML;
            
            this.wallets.forEach(wallet => {
                const option = document.createElement('option');
                option.value = wallet.address;
                option.textContent = `${wallet.address.substring(0, 10)}...${wallet.address.substring(38)} (${wallet.address})`;
                select.appendChild(option);
            });
            
            // Restore previous selection if it still exists
            if (currentValue && this.wallets.find(w => w.address === currentValue)) {
                select.value = currentValue;
            }
        });
    }

    async updateWalletBalance() {
        const walletAddress = document.getElementById('txFromWallet').value;
        if (!walletAddress) {
            document.getElementById('senderBalance').textContent = '0.00';
            return;
        }

        try {
            const result = await this.apiCall(`/wallet/${walletAddress}/balance`);
            if (result.success) {
                document.getElementById('senderBalance').textContent = parseFloat(result.data.balance).toFixed(4);
            }
        } catch (error) {
            document.getElementById('senderBalance').textContent = 'Error';
        }
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Auto-load wallet balances when wallets are displayed
        setTimeout(() => {
            this.wallets.forEach(wallet => {
                this.refreshWalletBalance(wallet.address);
            });
        }, 1000);
    }

    // Modal Management
    showLoading(show) {
        document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '9999';
        toast.style.minWidth = '300px';
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    // Service Management for DID Registration
    addServiceEntry() {
        const container = document.getElementById('servicesContainer');
        const serviceEntry = document.createElement('div');
        serviceEntry.className = 'service-entry mb-2';
        serviceEntry.innerHTML = `
            <div class="row">
                <div class="col-3">
                    <input type="text" class="form-control form-control-sm" placeholder="Service ID" name="serviceId">
                </div>
                <div class="col-3">
                    <input type="text" class="form-control form-control-sm" placeholder="Service Type" name="serviceType">
                </div>
                <div class="col-4">
                    <input type="url" class="form-control form-control-sm" placeholder="Service Endpoint" name="serviceEndpoint">
                </div>
                <div class="col-2">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(serviceEntry);
    }

    resetServiceEntries() {
        const container = document.getElementById('servicesContainer');
        container.innerHTML = `
            <div class="service-entry mb-2">
                <div class="row">
                    <div class="col-4">
                        <input type="text" class="form-control form-control-sm" placeholder="Service ID" name="serviceId">
                    </div>
                    <div class="col-4">
                        <input type="text" class="form-control form-control-sm" placeholder="Service Type" name="serviceType">
                    </div>
                    <div class="col-4">
                        <input type="url" class="form-control form-control-sm" placeholder="Service Endpoint" name="serviceEndpoint">
                    </div>
                </div>
            </div>
        `;
    }
}

// Global Functions
let app;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new WalletApp();
});

// Modal functions
function showGenerateWalletModal() {
    const modal = new bootstrap.Modal(document.getElementById('generateWalletModal'));
    // Reset modal state
    document.getElementById('newWalletInfo').style.display = 'none';
    document.getElementById('generateBtn').style.display = 'inline-block';
    modal.show();
}

function showImportWalletModal() {
    const modal = new bootstrap.Modal(document.getElementById('importWalletModal'));
    modal.show();
}

function showRegisterDIDModal() {
    app.populateWalletSelects();
    const modal = new bootstrap.Modal(document.getElementById('registerDIDModal'));
    modal.show();
}

function showSendTransactionModal() {
    app.populateWalletSelects();
    const modal = new bootstrap.Modal(document.getElementById('sendTransactionModal'));
    modal.show();
}

function showSignMessageModal() {
    app.populateWalletSelects();
    const modal = new bootstrap.Modal(document.getElementById('signMessageModal'));
    // Reset modal state
    document.getElementById('signatureResult').style.display = 'none';
    document.getElementById('signMessageForm').reset();
    modal.show();
}

function showVerifyMessageModal() {
    const modal = new bootstrap.Modal(document.getElementById('verifyMessageModal'));
    // Reset modal state
    document.getElementById('verificationResult').style.display = 'none';
    document.getElementById('verifyMessageForm').reset();
    modal.show();
}

// Action functions
function generateWallet() {
    app.generateWallet();
}

function importWallet() {
    app.importWallet();
}

function registerDID() {
    app.registerDID();
}

function sendTransaction() {
    app.sendTransaction();
}

function signMessage() {
    app.signMessage();
}

function verifyMessage() {
    app.verifyMessage();
}

function loadTransactions() {
    app.loadTransactions();
}

function refreshTransactions() {
    app.loadTransactions();
}

function updateWalletBalance() {
    app.updateWalletBalance();
}

function addServiceEntry() {
    app.addServiceEntry();
}

// Utility functions
function copyToClipboard(elementIdOrText) {
    let textToCopy;
    
    if (elementIdOrText.startsWith('0x') || elementIdOrText.startsWith('did:')) {
        // It's already text
        textToCopy = elementIdOrText;
    } else {
        // It's an element ID
        const element = document.getElementById(elementIdOrText);
        textToCopy = element.value || element.textContent;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        app.showSuccess('Copied to clipboard!');
    }).catch(() => {
        app.showError('Failed to copy to clipboard');
    });
}

function togglePassword(elementId) {
    const element = document.getElementById(elementId);
    const button = element.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (element.type === 'password') {
        element.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        element.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Wallet-specific functions
function refreshWalletBalance(address) {
    app.refreshWalletBalance(address);
}

function viewWalletDetails(address) {
    const wallet = app.wallets.find(w => w.address === address);
    if (wallet) {
        alert(`Wallet Details:\n\nAddress: ${wallet.address}\nPublic Key: ${wallet.publicKey || 'N/A'}\n\nNote: Private keys are not displayed for security reasons.`);
    }
}

function showSendFromWallet(address) {
    document.getElementById('txFromWallet').value = address;
    app.updateWalletBalance();
    showSendTransactionModal();
}

function showWalletTransactions(address) {
    document.getElementById('walletSelect').value = address;
    app.loadTransactions();
    document.getElementById('transactions').scrollIntoView({ behavior: 'smooth' });
}

// DID-specific functions
function viewDIDDocument(didId) {
    alert(`DID Document for: ${didId}\n\nThis feature would show the complete DID document from the blockchain.`);
}

function updateDID(didId) {
    alert(`Update DID: ${didId}\n\nThis feature would allow you to update the DID document.`);
}

function revokeDID(didId) {
    if (confirm(`Are you sure you want to revoke DID: ${didId}?\n\nThis action cannot be undone.`)) {
        alert('DID revocation feature would be implemented here.');
    }
}
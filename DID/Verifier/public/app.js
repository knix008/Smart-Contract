// DID Verifier Web Interface JavaScript
class VerifierApp {
    constructor() {
        this.apiUrl = window.location.origin + '/api';
        this.verificationHistory = [];
        this.stats = {
            totalVerifications: 0,
            validCredentials: 0,
            invalidCredentials: 0,
            presentationVerifications: 0
        };
        
        this.init();
    }

    async init() {
        console.log('Initializing Verifier App...');
        console.log('API URL:', this.apiUrl);
        
        // Test API connection
        try {
            const response = await fetch(`${this.apiUrl}/verifier/health`);
            if (response.ok) {
                this.showNotification('Connected to Verifier service successfully!', 'success');
            } else {
                this.showNotification('Verifier service connection failed', 'warning');
            }
        } catch (error) {
            console.error('Connection error:', error);
            this.showNotification('Cannot connect to Verifier service', 'error');
        }
        
        await this.loadStats();
        await this.loadHistory();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Credential verification form
        document.getElementById('credentialVerificationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyCredential();
        });

        // Presentation verification form
        document.getElementById('presentationVerificationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyPresentation();
        });

        // DID verification form
        document.getElementById('didVerificationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyDID();
        });

        // Tab change events
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                const targetId = e.target.getAttribute('data-bs-target');
                if (targetId === '#history-pane') {
                    this.loadHistory();
                }
            });
        });
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.apiUrl}/verifier/stats`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.stats = data.data;
                    this.updateStatsDisplay();
                }
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    updateStatsDisplay() {
        document.getElementById('totalVerifications').textContent = this.stats.totalVerifications || 0;
        document.getElementById('validCredentials').textContent = this.stats.validCredentials || 0;
        document.getElementById('invalidCredentials').textContent = this.stats.invalidCredentials || 0;
        document.getElementById('presentationVerifications').textContent = this.stats.presentationVerifications || 0;
    }

    async verifyCredential() {
        const credentialInput = document.getElementById('credentialInput').value.trim();
        const checkRevocation = document.getElementById('checkRevocation').checked;

        if (!credentialInput) {
            this.showError('Please paste a Verifiable Credential JSON');
            return;
        }

        let credential;
        try {
            credential = JSON.parse(credentialInput);
        } catch (error) {
            this.showError('Invalid JSON format. Please check your credential format.');
            return;
        }

        try {
            this.showLoading(true);
            console.log('Verifying credential...');

            const response = await fetch(`${this.apiUrl}/verify/credential`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    credential: credential,
                    checkRevocation: checkRevocation
                })
            });

            const result = await response.json();
            console.log('Verification result:', result);

            this.displayCredentialResult(result);
            
            if (result.success) {
                this.showSuccess('Credential verification completed!');
                // Update stats
                this.stats.totalVerifications++;
                if (result.data.isValid) {
                    this.stats.validCredentials++;
                } else {
                    this.stats.invalidCredentials++;
                }
                this.updateStatsDisplay();
            } else {
                this.showError(result.error || 'Verification failed');
            }

        } catch (error) {
            console.error('Error verifying credential:', error);
            this.showError('Failed to verify credential: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async verifyPresentation() {
        const presentationInput = document.getElementById('presentationInput').value.trim();
        const requiredTypes = document.getElementById('requiredCredentialTypes').value.trim();

        if (!presentationInput) {
            this.showError('Please paste a Verifiable Presentation JSON');
            return;
        }

        let presentation;
        try {
            presentation = JSON.parse(presentationInput);
        } catch (error) {
            this.showError('Invalid JSON format. Please check your presentation format.');
            return;
        }

        try {
            this.showLoading(true);
            console.log('Verifying presentation...');

            const requestBody = {
                presentation: presentation
            };

            if (requiredTypes) {
                requestBody.requiredCredentialTypes = requiredTypes.split(',').map(type => type.trim());
            }

            const response = await fetch(`${this.apiUrl}/presentation/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            console.log('Presentation verification result:', result);

            this.displayPresentationResult(result);
            
            if (result.success) {
                this.showSuccess('Presentation verification completed!');
                // Update stats
                this.stats.presentationVerifications++;
                this.updateStatsDisplay();
            } else {
                this.showError(result.error || 'Presentation verification failed');
            }

        } catch (error) {
            console.error('Error verifying presentation:', error);
            this.showError('Failed to verify presentation: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async verifyDID() {
        const didInput = document.getElementById('didInput').value.trim();

        if (!didInput) {
            this.showError('Please enter a DID identifier');
            return;
        }

        if (!didInput.startsWith('did:')) {
            this.showError('Invalid DID format. DID should start with "did:"');
            return;
        }

        try {
            this.showLoading(true);
            console.log('Verifying DID:', didInput);

            const response = await fetch(`${this.apiUrl}/verify/did/${encodeURIComponent(didInput)}`);
            const result = await response.json();
            console.log('DID verification result:', result);

            this.displayDIDResult(result);
            
            if (result.success) {
                this.showSuccess('DID verification completed!');
            } else {
                this.showError(result.error || 'DID verification failed');
            }

        } catch (error) {
            console.error('Error verifying DID:', error);
            this.showError('Failed to verify DID: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    displayCredentialResult(result) {
        const resultContainer = document.getElementById('credentialResult');
        const resultHeader = document.getElementById('credentialResultHeader');
        const resultBody = document.getElementById('credentialResultBody');

        if (result.success && result.data) {
            const data = result.data;
            const isValid = data.isValid;

            // Update header
            resultHeader.className = `card-header ${isValid ? 'bg-success' : 'bg-danger'}`;
            resultHeader.innerHTML = `
                <h6 class="card-title mb-0">
                    <i class="fas fa-${isValid ? 'check-circle' : 'times-circle'} me-2"></i>
                    Verification Result: ${isValid ? 'VALID' : 'INVALID'}
                </h6>
            `;

            // Update body
            resultBody.innerHTML = `
                <div class="verification-details">
                    <div class="detail-item">
                        <span class="detail-label">Overall Status:</span>
                        <span class="status-badge ${isValid ? 'status-valid' : 'status-invalid'}">
                            ${isValid ? 'VALID' : 'INVALID'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Signature Valid:</span>
                        <span class="status-badge ${data.signatureValid ? 'status-valid' : 'status-invalid'}">
                            ${data.signatureValid ? 'YES' : 'NO'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">DID Valid:</span>
                        <span class="status-badge ${data.didValid ? 'status-valid' : 'status-invalid'}">
                            ${data.didValid ? 'YES' : 'NO'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Not Revoked:</span>
                        <span class="status-badge ${data.notRevoked ? 'status-valid' : 'status-invalid'}">
                            ${data.notRevoked ? 'YES' : 'NO'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Not Expired:</span>
                        <span class="status-badge ${data.notExpired ? 'status-valid' : 'status-invalid'}">
                            ${data.notExpired ? 'YES' : 'NO'}
                        </span>
                    </div>
                    ${data.issuer ? `
                        <div class="detail-item">
                            <span class="detail-label">Issuer:</span>
                            <span class="detail-value">${data.issuer}</span>
                        </div>
                    ` : ''}
                    ${data.subject ? `
                        <div class="detail-item">
                            <span class="detail-label">Subject:</span>
                            <span class="detail-value">${data.subject}</span>
                        </div>
                    ` : ''}
                    ${data.credentialType ? `
                        <div class="detail-item">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${data.credentialType}</span>
                        </div>
                    ` : ''}
                    ${data.issuanceDate ? `
                        <div class="detail-item">
                            <span class="detail-label">Issued:</span>
                            <span class="detail-value">${new Date(data.issuanceDate).toLocaleString()}</span>
                        </div>
                    ` : ''}
                    ${data.expirationDate ? `
                        <div class="detail-item">
                            <span class="detail-label">Expires:</span>
                            <span class="detail-value">${new Date(data.expirationDate).toLocaleString()}</span>
                        </div>
                    ` : ''}
                    ${data.errors && data.errors.length > 0 ? `
                        <div class="detail-item">
                            <span class="detail-label">Errors:</span>
                            <div class="detail-value">
                                ${data.errors.map(error => `<div class="text-danger">${error}</div>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            resultHeader.className = 'card-header bg-danger';
            resultHeader.innerHTML = `
                <h6 class="card-title mb-0">
                    <i class="fas fa-times-circle me-2"></i>
                    Verification Failed
                </h6>
            `;
            resultBody.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${result.error || 'Unknown error occurred during verification'}
                </div>
            `;
        }

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    displayPresentationResult(result) {
        const resultContainer = document.getElementById('presentationResult');
        const resultHeader = document.getElementById('presentationResultHeader');
        const resultBody = document.getElementById('presentationResultBody');

        if (result.success && result.data) {
            const data = result.data;
            const isValid = data.isValid;

            resultHeader.className = `card-header ${isValid ? 'bg-success' : 'bg-danger'}`;
            resultHeader.innerHTML = `
                <h6 class="card-title mb-0">
                    <i class="fas fa-${isValid ? 'check-circle' : 'times-circle'} me-2"></i>
                    Presentation Verification: ${isValid ? 'VALID' : 'INVALID'}
                </h6>
            `;

            let credentialsHtml = '';
            if (data.credentialResults && data.credentialResults.length > 0) {
                credentialsHtml = `
                    <div class="mt-3">
                        <h6>Individual Credential Results:</h6>
                        ${data.credentialResults.map((cred, index) => `
                            <div class="card mt-2">
                                <div class="card-body">
                                    <h6 class="card-title">
                                        Credential ${index + 1}
                                        <span class="status-badge ${cred.isValid ? 'status-valid' : 'status-invalid'} ms-2">
                                            ${cred.isValid ? 'VALID' : 'INVALID'}
                                        </span>
                                    </h6>
                                    <div class="detail-item">
                                        <span class="detail-label">Type:</span>
                                        <span class="detail-value">${cred.credentialType || 'Unknown'}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Subject:</span>
                                        <span class="detail-value">${cred.subject || 'Unknown'}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Issuer:</span>
                                        <span class="detail-value">${cred.issuer || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            resultBody.innerHTML = `
                <div class="verification-details">
                    <div class="detail-item">
                        <span class="detail-label">Overall Status:</span>
                        <span class="status-badge ${isValid ? 'status-valid' : 'status-invalid'}">
                            ${isValid ? 'VALID' : 'INVALID'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Holder:</span>
                        <span class="detail-value">${data.holder || 'Unknown'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Credentials Count:</span>
                        <span class="detail-value">${data.credentialsCount || 0}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Valid Credentials:</span>
                        <span class="detail-value">${data.validCredentialsCount || 0}</span>
                    </div>
                    ${data.errors && data.errors.length > 0 ? `
                        <div class="detail-item">
                            <span class="detail-label">Errors:</span>
                            <div class="detail-value">
                                ${data.errors.map(error => `<div class="text-danger">${error}</div>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                ${credentialsHtml}
            `;
        } else {
            resultHeader.className = 'card-header bg-danger';
            resultHeader.innerHTML = `
                <h6 class="card-title mb-0">
                    <i class="fas fa-times-circle me-2"></i>
                    Verification Failed
                </h6>
            `;
            resultBody.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${result.error || 'Unknown error occurred during verification'}
                </div>
            `;
        }

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    displayDIDResult(result) {
        const resultContainer = document.getElementById('didResult');
        const resultHeader = document.getElementById('didResultHeader');
        const resultBody = document.getElementById('didResultBody');

        if (result.success && result.data) {
            const data = result.data;
            const isValid = data.exists;

            resultHeader.className = `card-header ${isValid ? 'bg-success' : 'bg-danger'}`;
            resultHeader.innerHTML = `
                <h6 class="card-title mb-0">
                    <i class="fas fa-${isValid ? 'check-circle' : 'times-circle'} me-2"></i>
                    DID Status: ${isValid ? 'EXISTS' : 'NOT FOUND'}
                </h6>
            `;

            resultBody.innerHTML = `
                <div class="verification-details">
                    <div class="detail-item">
                        <span class="detail-label">DID:</span>
                        <span class="detail-value">${data.did}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Exists on Blockchain:</span>
                        <span class="status-badge ${data.exists ? 'status-valid' : 'status-invalid'}">
                            ${data.exists ? 'YES' : 'NO'}
                        </span>
                    </div>
                    ${data.document ? `
                        <div class="detail-item">
                            <span class="detail-label">DID Document:</span>
                            <div class="json-display">${JSON.stringify(data.document, null, 2)}</div>
                        </div>
                    ` : ''}
                    ${data.controller ? `
                        <div class="detail-item">
                            <span class="detail-label">Controller:</span>
                            <span class="detail-value">${data.controller}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            resultHeader.className = 'card-header bg-danger';
            resultHeader.innerHTML = `
                <h6 class="card-title mb-0">
                    <i class="fas fa-times-circle me-2"></i>
                    Verification Failed
                </h6>
            `;
            resultBody.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${result.error || 'Unknown error occurred during verification'}
                </div>
            `;
        }

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    async loadHistory() {
        try {
            const response = await fetch(`${this.apiUrl}/verifier/history`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.verificationHistory = data.data;
                    this.displayHistory();
                }
            } else {
                this.displayHistory([]); // Empty history
            }
        } catch (error) {
            console.error('Error loading history:', error);
            this.displayHistory([]); // Empty history
        }
    }

    displayHistory(history = this.verificationHistory) {
        const container = document.getElementById('historyContainer');
        
        if (!history || history.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-history fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No verification history</h5>
                    <p class="text-muted">Verification results will appear here after you perform verifications.</p>
                </div>
            `;
            return;
        }

        const historyHtml = `
            <div class="history-table">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Subject/DID</th>
                            <th>Result</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.map(item => `
                            <tr>
                                <td>${new Date(item.timestamp).toLocaleString()}</td>
                                <td>
                                    <span class="badge bg-secondary">${item.type}</span>
                                </td>
                                <td>
                                    <span class="text-truncate-long" title="${item.subject || item.did}">
                                        ${item.subject || item.did || 'Unknown'}
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge ${item.isValid ? 'status-valid' : 'status-invalid'}">
                                        ${item.isValid ? 'VALID' : 'INVALID'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-outline-primary btn-sm" onclick="showHistoryDetails('${item.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = historyHtml;
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'warning'} position-fixed`;
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Global functions
function refreshHistory() {
    app.loadHistory();
}

function showHistoryDetails(id) {
    const item = app.verificationHistory.find(h => h.id === id);
    if (item) {
        alert('History details:\n' + JSON.stringify(item, null, 2));
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new VerifierApp();
});
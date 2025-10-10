// DID Issuer Web Interface JavaScript
class IssuerApp {
    constructor() {
        this.apiUrl = 'http://localhost:3002/api';
        this.credentials = [];
        this.filteredCredentials = [];
        this.currentFilter = 'all';
        this.authToken = null;
        
        this.init();
    }

    async init() {
        await this.checkAuthentication();
        await this.loadCredentials();
        await this.loadTemplates();
        this.setupEventListeners();
        this.setDefaultExpirationDate();
    }

    async checkAuthentication() {
        // For demo purposes, we'll use basic auth
        // In production, implement proper login
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'issuer',
                    password: 'issuer123'
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.authToken = data.data.token;
                }
            }
        } catch (error) {
            console.log('Auth not required or service not available');
        }
    }

    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        
        return headers;
    }

    async loadCredentials() {
        this.showLoading(true);
        
        try {
            const response = await fetch(`${this.apiUrl}/credentials`, {
                headers: this.getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.credentials = data.data.credentials || [];
                    this.updateStatistics();
                    this.displayCredentials();
                }
            } else {
                this.showError('Failed to load credentials');
            }
        } catch (error) {
            console.error('Error loading credentials:', error);
            this.showError('Failed to connect to the server');
        } finally {
            this.showLoading(false);
        }
    }

    async loadTemplates() {
        try {
            const response = await fetch(`${this.apiUrl}/issuer/templates`, {
                headers: this.getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.populateTypeFilter(data.data);
                }
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    populateTypeFilter(templates) {
        const typeFilter = document.getElementById('typeFilter');
        Object.keys(templates).forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = templates[type].name;
            typeFilter.appendChild(option);
        });
    }

    updateStatistics() {
        const total = this.credentials.length;
        const active = this.credentials.filter(c => !c.revoked).length;
        const revoked = total - active;
        const types = new Set(this.credentials.map(c => c.verifiableCredential.type[c.verifiableCredential.type.length - 1])).size;

        document.getElementById('totalCredentials').textContent = total;
        document.getElementById('activeCredentials').textContent = active;
        document.getElementById('revokedCredentials').textContent = revoked;
        document.getElementById('credentialTypes').textContent = types;
    }

    displayCredentials() {
        const container = document.getElementById('credentialsList');
        const noCredentials = document.getElementById('noCredentials');
        
        if (this.filteredCredentials.length === 0) {
            container.innerHTML = '';
            noCredentials.style.display = 'block';
            return;
        }

        noCredentials.style.display = 'none';
        
        const html = this.filteredCredentials.map(credential => this.renderCredentialCard(credential)).join('');
        container.innerHTML = html;
        
        // Add fade-in animation
        container.querySelectorAll('.credential-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    renderCredentialCard(credential) {
        const vc = credential.verifiableCredential;
        const credentialType = vc.type[vc.type.length - 1];
        const isRevoked = credential.revoked;
        const issuedDate = new Date(vc.issuanceDate).toLocaleDateString();
        const expirationDate = new Date(vc.expirationDate).toLocaleDateString();
        
        const statusClass = isRevoked ? 'status-revoked' : 'status-active';
        const statusText = isRevoked ? 'Revoked' : 'Active';
        const cardClass = isRevoked ? 'credential-card revoked' : 'credential-card';

        return `
            <div class="card ${cardClass}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <div class="credential-type">${this.formatCredentialType(credentialType)}</div>
                            <h5 class="card-title mb-1">Credential ID: ${credential.credentialId}</h5>
                            <p class="text-muted mb-0">
                                <i class="fas fa-user me-1"></i>
                                Subject: ${vc.credentialSubject.id}
                            </p>
                        </div>
                        <div class="text-end">
                            <span class="credential-status ${statusClass}">${statusText}</span>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <small class="text-muted">
                                <i class="fas fa-calendar-plus me-1"></i>
                                Issued: ${issuedDate}
                            </small>
                        </div>
                        <div class="col-md-6">
                            <small class="text-muted">
                                <i class="fas fa-calendar-times me-1"></i>
                                Expires: ${expirationDate}
                            </small>
                        </div>
                    </div>

                    <div class="credential-details mb-3">
                        ${this.renderCredentialDetails(vc.credentialSubject)}
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <small class="text-muted">
                                <i class="fas fa-signature me-1"></i>
                                Issuer: ${vc.issuer.name || vc.issuer.id}
                            </small>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="viewCredential('${credential.credentialId}')">
                                <i class="fas fa-eye me-1"></i>View Details
                            </button>
                            ${!isRevoked ? `
                                <button class="btn btn-sm btn-danger-custom" onclick="revokeCredential('${credential.credentialId}')">
                                    <i class="fas fa-ban me-1"></i>Revoke
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    ${credential.transactionHash ? `
                        <div class="mt-2">
                            <small class="text-muted">
                                <i class="fas fa-link me-1"></i>
                                <a href="https://sepolia.etherscan.io/tx/${credential.transactionHash}" target="_blank" class="text-decoration-none">
                                    View on Blockchain
                                </a>
                            </small>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderCredentialDetails(credentialSubject) {
        const details = Object.entries(credentialSubject)
            .filter(([key]) => key !== 'id')
            .map(([key, value]) => {
                const label = this.formatFieldName(key);
                return `<span class="badge bg-light text-dark me-2 mb-1">${label}: ${value}</span>`;
            })
            .join('');
        
        return details;
    }

    formatCredentialType(type) {
        return type.replace(/([A-Z])/g, ' $1').trim();
    }

    formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, ' $1')
                       .replace(/^./, str => str.toUpperCase());
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchCredentials(e.target.value);
        });

        // Type filter
        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filterByType(e.target.value);
        });

        // Credential type change in modal
        document.getElementById('credentialType').addEventListener('change', (e) => {
            this.updateCredentialFields(e.target.value);
        });
    }

    searchCredentials(searchTerm) {
        if (!searchTerm.trim()) {
            this.applyCurrentFilter();
            return;
        }

        const term = searchTerm.toLowerCase();
        this.filteredCredentials = this.credentials.filter(credential => {
            const vc = credential.verifiableCredential;
            const credentialType = vc.type[vc.type.length - 1];
            
            return (
                credential.credentialId.toLowerCase().includes(term) ||
                vc.credentialSubject.id.toLowerCase().includes(term) ||
                credentialType.toLowerCase().includes(term) ||
                vc.issuer.name?.toLowerCase().includes(term)
            );
        });
        
        this.displayCredentials();
    }

    filterByType(type) {
        if (!type) {
            this.applyCurrentFilter();
            return;
        }

        this.filteredCredentials = this.credentials.filter(credential => {
            const credentialType = credential.verifiableCredential.type[credential.verifiableCredential.type.length - 1];
            return credentialType === type;
        });
        
        this.displayCredentials();
    }

    applyCurrentFilter() {
        switch (this.currentFilter) {
            case 'active':
                this.filteredCredentials = this.credentials.filter(c => !c.revoked);
                break;
            case 'revoked':
                this.filteredCredentials = this.credentials.filter(c => c.revoked);
                break;
            default:
                this.filteredCredentials = [...this.credentials];
        }
        this.displayCredentials();
    }

    setDefaultExpirationDate() {
        const tomorrow = new Date();
        tomorrow.setFullYear(tomorrow.getFullYear() + 1); // Default to 1 year from now
        const formattedDate = tomorrow.toISOString().slice(0, 16);
        document.getElementById('expirationDate').value = formattedDate;
    }

    updateCredentialFields(type) {
        const container = document.getElementById('credentialFields');
        
        const fieldTemplates = {
            'UniversityDegree': [
                { name: 'university', label: 'University', type: 'text', required: true },
                { name: 'degree', label: 'Degree', type: 'text', required: true },
                { name: 'graduationDate', label: 'Graduation Date', type: 'date', required: true },
                { name: 'gpa', label: 'GPA', type: 'number', step: '0.01', min: '0', max: '4', required: true }
            ],
            'IdentityVerification': [
                { name: 'fullName', label: 'Full Name', type: 'text', required: true },
                { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
                { name: 'nationality', label: 'Nationality', type: 'text', required: true },
                { name: 'documentNumber', label: 'Document Number', type: 'text', required: true }
            ],
            'ProfessionalCertification': [
                { name: 'certificationName', label: 'Certification Name', type: 'text', required: true },
                { name: 'issuingOrganization', label: 'Issuing Organization', type: 'text', required: true },
                { name: 'skillLevel', label: 'Skill Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true },
                { name: 'validUntil', label: 'Valid Until', type: 'date', required: true }
            ],
            'EmploymentVerification': [
                { name: 'company', label: 'Company', type: 'text', required: true },
                { name: 'position', label: 'Position', type: 'text', required: true },
                { name: 'startDate', label: 'Start Date', type: 'date', required: true },
                { name: 'endDate', label: 'End Date', type: 'date', required: false },
                { name: 'salary', label: 'Salary', type: 'number', min: '0', required: false }
            ]
        };

        const fields = fieldTemplates[type] || [];
        
        container.innerHTML = fields.map(field => {
            if (field.type === 'select') {
                return `
                    <div class="mb-3">
                        <label class="form-label">${field.label}</label>
                        <select class="form-control" name="${field.name}" ${field.required ? 'required' : ''}>
                            <option value="">Select ${field.label}</option>
                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else {
                return `
                    <div class="mb-3">
                        <label class="form-label">${field.label}</label>
                        <input type="${field.type}" class="form-control" name="${field.name}" 
                               ${field.required ? 'required' : ''} 
                               ${field.step ? `step="${field.step}"` : ''}
                               ${field.min ? `min="${field.min}"` : ''}
                               ${field.max ? `max="${field.max}"` : ''}>
                    </div>
                `;
            }
        }).join('');
    }

    async issueCredential() {
        console.log('Issue Credential button clicked');
        
        const form = document.getElementById('issueForm');
        if (!form.checkValidity()) {
            console.log('Form validation failed');
            form.reportValidity();
            return;
        }

        const subjectDID = document.getElementById('subjectDID').value;
        const credentialType = document.getElementById('credentialType').value;
        const expirationDate = document.getElementById('expirationDate').value;
        
        console.log('Form data:', { subjectDID, credentialType, expirationDate });
        
        const credentialSubject = { id: subjectDID };
        const fieldsContainer = document.getElementById('credentialFields');
        const inputs = fieldsContainer.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (input.value) {
                credentialSubject[input.name] = input.value;
            }
        });

        const requestData = {
            subjectDID,
            credentialType,
            credentialSubject,
            expirationDate: new Date(expirationDate).toISOString()
        };

        console.log('Request data:', requestData);
        console.log('API URL:', `${this.apiUrl}/credentials/issue`);

        try {
            this.showLoading(true);
            console.log('Sending request...');
            
            const response = await fetch(`${this.apiUrl}/credentials/issue`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(requestData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                this.showSuccess('Credential issued successfully!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('issueModal'));
                modal.hide();
                form.reset();
                this.setDefaultExpirationDate();
                await this.loadCredentials();
            } else {
                console.error('Server error:', data.error);
                this.showError(data.error || 'Failed to issue credential');
            }
        } catch (error) {
            console.error('Error issuing credential:', error);
            
            // Extract meaningful error message
            let errorMessage = 'Failed to issue credential';
            if (error.message) {
                if (error.message.includes('DID does not exist') || error.message.includes('DID is not registered')) {
                    errorMessage = 'DID is not registered. Please register the DID first in the Wallet service.';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Cannot connect to server. Please check if the service is running.';
                } else {
                    errorMessage = `Error: ${error.message}`;
                }
            }
            
            this.showError(errorMessage);
        } finally {
            this.showLoading(false);
        }
    }

    async revokeCredential(credentialId) {
        if (!confirm('Are you sure you want to revoke this credential? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/credentials/${credentialId}/revoke`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            
            if (data.success) {
                this.showSuccess('Credential revoked successfully!');
                await this.loadCredentials();
            } else {
                this.showError(data.error || 'Failed to revoke credential');
            }
        } catch (error) {
            console.error('Error revoking credential:', error);
            this.showError('Failed to revoke credential');
        }
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
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

    showError(message) {
        this.showToast(message, 'error');
    }
}

// Global functions
function showIssueModal() {
    const modal = new bootstrap.Modal(document.getElementById('issueModal'));
    modal.show();
}

function refreshData() {
    app.loadCredentials();
}

function filterCredentials(filter) {
    app.currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    
    document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.remove('btn-outline-primary');
    document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('btn-primary');
    
    app.applyCurrentFilter();
}

function viewCredential(credentialId) {
    const credential = app.credentials.find(c => c.credentialId === credentialId);
    if (credential) {
        // Create a modal to show credential details
        const modalHtml = `
            <div class="modal fade" id="viewModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Credential Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <pre class="bg-light p-3 rounded">${JSON.stringify(credential.verifiableCredential, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('viewModal'));
        modal.show();
        
        document.getElementById('viewModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }
}

function revokeCredential(credentialId) {
    app.revokeCredential(credentialId);
}

function issueCredential() {
    app.issueCredential();
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new IssuerApp();
});
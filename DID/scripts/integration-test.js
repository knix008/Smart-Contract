const axios = require('axios');

// Service endpoints
const WALLET_URL = 'http://localhost:3001';
const ISSUER_URL = 'http://localhost:3002';
const VERIFIER_URL = 'http://localhost:3003';

// Test configuration
const TEST_CONFIG = {
  delayBetweenTests: 2000, // 2 seconds
  timeoutPerRequest: 10000 // 10 seconds
};

class DIDIntegrationTest {
  constructor() {
    this.testResults = [];
    this.walletAddress = null;
    this.studentDID = null;
    this.issuedCredential = null;
  }

  async runAllTests() {
    console.log('🚀 Starting DID System Integration Tests...\n');

    try {
      // Check service health
      await this.checkServicesHealth();
      
      // Test wallet functionality
      await this.testWalletServices();
      
      // Test DID registration
      await this.testDIDRegistration();
      
      // Test credential issuance
      await this.testCredentialIssuance();
      
      // Test credential verification
      await this.testCredentialVerification();
      
      // Test end-to-end scenario
      await this.testEndToEndScenario();
      
      // Display results
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Integration test failed:', error.message);
      process.exit(1);
    }
  }

  async checkServicesHealth() {
    console.log('🏥 Checking service health...');
    
    const services = [
      { name: 'Wallet', url: `${WALLET_URL}/health` },
      { name: 'Issuer', url: `${ISSUER_URL}/health` },
      { name: 'Verifier', url: `${VERIFIER_URL}/health` }
    ];

    for (const service of services) {
      try {
        const response = await axios.get(service.url, { timeout: TEST_CONFIG.timeoutPerRequest });
        this.logTest(`${service.name} Service Health`, true, `Status: ${response.data.status}`);
      } catch (error) {
        this.logTest(`${service.name} Service Health`, false, error.message);
        throw new Error(`${service.name} service is not available`);
      }
    }
    
    await this.delay();
  }

  async testWalletServices() {
    console.log('💼 Testing wallet services...');

    // Test wallet generation
    try {
      const response = await axios.post(`${WALLET_URL}/api/wallet/generate`);
      
      if (response.data.success && response.data.data.address) {
        this.walletAddress = response.data.data.address;
        this.logTest('Wallet Generation', true, `Address: ${this.walletAddress}`);
      } else {
        this.logTest('Wallet Generation', false, 'Failed to generate wallet');
        throw new Error('Wallet generation failed');
      }
    } catch (error) {
      this.logTest('Wallet Generation', false, error.message);
      throw error;
    }

    // Test wallet balance check
    try {
      const response = await axios.get(`${WALLET_URL}/api/wallet/${this.walletAddress}/balance`);
      
      if (response.data.success) {
        this.logTest('Balance Check', true, `Balance: ${response.data.data.balanceInEth} ETH`);
      } else {
        this.logTest('Balance Check', false, 'Failed to get balance');
      }
    } catch (error) {
      this.logTest('Balance Check', false, error.message);
    }

    await this.delay();
  }

  async testDIDRegistration() {
    console.log('🆔 Testing DID registration...');

    try {
      const response = await axios.post(`${WALLET_URL}/api/did/register`, {
        address: this.walletAddress
      });

      if (response.data.success && response.data.data.didId) {
        this.studentDID = response.data.data.didId;
        this.logTest('DID Registration', true, `DID: ${this.studentDID}`);
      } else {
        this.logTest('DID Registration', false, 'Failed to register DID');
        throw new Error('DID registration failed');
      }
    } catch (error) {
      this.logTest('DID Registration', false, error.message);
      throw error;
    }

    // Test DID resolution
    try {
      const response = await axios.get(`${WALLET_URL}/api/did/${this.studentDID}`);
      
      if (response.data.success && response.data.data.didDocument) {
        this.logTest('DID Resolution', true, 'DID document retrieved successfully');
      } else {
        this.logTest('DID Resolution', false, 'Failed to resolve DID');
      }
    } catch (error) {
      this.logTest('DID Resolution', false, error.message);
    }

    await this.delay();
  }

  async testCredentialIssuance() {
    console.log('🏢 Testing credential issuance...');

    // Test getting credential templates
    try {
      const response = await axios.get(`${ISSUER_URL}/api/issuer/templates`);
      
      if (response.data.success && response.data.data) {
        this.logTest('Get Credential Templates', true, `${Object.keys(response.data.data).length} templates available`);
      } else {
        this.logTest('Get Credential Templates', false, 'Failed to get templates');
      }
    } catch (error) {
      this.logTest('Get Credential Templates', false, error.message);
    }

    // Test credential issuance
    try {
      const credentialData = {
        subjectDID: this.studentDID,
        credentialType: 'UniversityDegree',
        credentialSubject: {
          university: 'Seoul National University',
          degree: 'Bachelor of Computer Science',
          graduationDate: '2024-02-15',
          gpa: '4.2'
        },
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
      };

      const response = await axios.post(`${ISSUER_URL}/api/credentials/issue`, credentialData);

      if (response.data.success && response.data.data.verifiableCredential) {
        this.issuedCredential = response.data.data.verifiableCredential;
        this.logTest('Credential Issuance', true, `Credential ID: ${response.data.data.credentialId}`);
      } else {
        this.logTest('Credential Issuance', false, 'Failed to issue credential');
        throw new Error('Credential issuance failed');
      }
    } catch (error) {
      this.logTest('Credential Issuance', false, error.message);
      throw error;
    }

    await this.delay();
  }

  async testCredentialVerification() {
    console.log('🔍 Testing credential verification...');

    // Test DID verification
    try {
      const response = await axios.get(`${VERIFIER_URL}/api/verify/did/${this.studentDID}`);
      
      if (response.data.success && response.data.data.isValid) {
        this.logTest('DID Verification', true, 'DID is valid');
      } else {
        this.logTest('DID Verification', false, 'DID is invalid');
      }
    } catch (error) {
      this.logTest('DID Verification', false, error.message);
    }

    // Test credential verification
    try {
      const response = await axios.post(`${VERIFIER_URL}/api/verify/credential`, {
        credential: this.issuedCredential
      });

      if (response.data.success && response.data.data.isValid) {
        this.logTest('Credential Verification', true, 'Credential is valid');
      } else {
        this.logTest('Credential Verification', false, `Credential is invalid: ${response.data.data.errors?.join(', ')}`);
      }
    } catch (error) {
      this.logTest('Credential Verification', false, error.message);
    }

    await this.delay();
  }

  async testEndToEndScenario() {
    console.log('🔄 Testing end-to-end scenario...');

    // Create a verifiable presentation
    try {
      const presentationData = {
        credentials: [this.issuedCredential],
        holderDID: this.studentDID,
        address: this.walletAddress
      };

      const response = await axios.post(`${WALLET_URL}/api/did/presentation`, presentationData);

      if (response.data.success) {
        const presentation = response.data.data;
        this.logTest('Presentation Creation', true, 'Verifiable presentation created');

        // Verify the presentation
        const verifyResponse = await axios.post(`${VERIFIER_URL}/api/presentation/verify`, {
          presentation
        });

        if (verifyResponse.data.success && verifyResponse.data.data.isValid) {
          this.logTest('Presentation Verification', true, 'Presentation is valid');
        } else {
          this.logTest('Presentation Verification', false, 'Presentation is invalid');
        }
      } else {
        this.logTest('Presentation Creation', false, 'Failed to create presentation');
      }
    } catch (error) {
      this.logTest('End-to-End Scenario', false, error.message);
    }

    await this.delay();
  }

  logTest(testName, success, details = '') {
    const status = success ? '✅' : '❌';
    const result = { testName, success, details, timestamp: new Date().toISOString() };
    this.testResults.push(result);
    
    console.log(`${status} ${testName}: ${details}`);
  }

  displayResults() {
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.testName}: ${r.details}`));
    }

    console.log('\n🎉 Integration test completed!');
    
    if (passedTests === totalTests) {
      console.log('🌟 All tests passed! The DID system is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please check the service configurations.');
    }
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.delayBetweenTests));
  }
}

// Run the integration test
if (require.main === module) {
  const test = new DIDIntegrationTest();
  test.runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = DIDIntegrationTest;
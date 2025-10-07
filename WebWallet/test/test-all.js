import { testAccountBalance } from './test-account.js';
import { testDeployedContract } from './test-contract.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Comprehensive Test Suite
 * Runs all tests for accounts and deployed contracts
 */

async function runAllTests() {
    console.log('🚀 Running Comprehensive Test Suite');
    console.log('===================================');
    console.log('');

    const results = {
        accountTest: false,
        contractTest: false
    };

    // Test 1: Account Balance Test
    console.log('📋 Test 1: Account Balance and Network');
    console.log('--------------------------------------');
    try {
        results.accountTest = await testAccountBalance();
    } catch (error) {
        console.error('❌ Account test failed:', error.message);
        results.accountTest = false;
    }
    console.log('');

    // Test 2: Deployed Contract Test
    console.log('📋 Test 2: Deployed Contract Interaction');
    console.log('---------------------------------------');
    try {
        results.contractTest = await testDeployedContract();
    } catch (error) {
        console.error('❌ Contract test failed:', error.message);
        results.contractTest = false;
    }
    console.log('');

    // Summary
    console.log('📊 Test Results Summary');
    console.log('======================');
    console.log('✅ Account Test:', results.accountTest ? 'PASSED' : '❌ FAILED');
    console.log('✅ Contract Test:', results.contractTest ? 'PASSED' : '❌ FAILED');
    console.log('');

    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    
    console.log(`📈 Overall: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Your setup is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Check the output above for details.');
        
        if (!results.accountTest) {
            console.log('💡 Account test issues might be:');
            console.log('   • Missing or invalid .env configuration');
            console.log('   • Network connectivity issues');
            console.log('   • Incorrect RPC URL');
        }
        
        if (!results.contractTest) {
            console.log('💡 Contract test issues might be:');
            console.log('   • Contract not deployed at the specified address');
            console.log('   • Missing compiled contract files');
            console.log('   • Incorrect contract address in .env');
        }
    }

    return passedTests === totalTests;
}

// Run the test suite
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test suite execution failed:', error);
            process.exit(1);
        });
}
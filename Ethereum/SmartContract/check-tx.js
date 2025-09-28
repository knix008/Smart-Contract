const { Web3 } = require('web3');

const CONFIG = {
    RPC_URL: 'http://localhost:8545',
    // Transaction hash from the error message
    TX_HASH: '0xe0424c5dc6d97e09ce3f9ed1110747e6f8e77dcd2dafc21de22ee0a945d9918f'
};

async function checkTransaction() {
    const web3 = new Web3(CONFIG.RPC_URL);
    
    try {
        console.log(`🔍 Checking transaction: ${CONFIG.TX_HASH}`);
        
        // Check if transaction exists
        const tx = await web3.eth.getTransaction(CONFIG.TX_HASH);
        console.log('📋 Transaction found:', tx);
        
        // Check transaction receipt
        const receipt = await web3.eth.getTransactionReceipt(CONFIG.TX_HASH);
        if (receipt) {
            console.log('✅ Transaction confirmed!');
            console.log('📍 Contract address:', receipt.contractAddress);
            console.log('⛽ Gas used:', receipt.gasUsed);
            console.log('🔗 Block number:', receipt.blockNumber);
            
            if (receipt.contractAddress) {
                console.log('🎉 Contract deployed successfully!');
                console.log('📍 Contract address:', receipt.contractAddress);
            }
        } else {
            console.log('⏳ Transaction still pending...');
        }
        
    } catch (error) {
        console.error('❌ Error checking transaction:', error.message);
    }
}

checkTransaction();

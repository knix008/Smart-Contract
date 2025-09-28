const { Web3 } = require('web3');

async function testTransaction() {
    const web3 = new Web3('http://localhost:8545');
    
    try {
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log('Available accounts:', accounts);
        
        if (accounts.length >= 2) {
            const fromAccount = accounts[0];
            const toAccount = accounts[1];
            
            console.log('Testing transaction from:', fromAccount, 'to:', toAccount);
            
            // Check balances
            const fromBalance = await web3.eth.getBalance(fromAccount);
            const toBalance = await web3.eth.getBalance(toAccount);
            
            console.log('From balance:', web3.utils.fromWei(fromBalance, 'ether'), 'ETH');
            console.log('To balance:', web3.utils.fromWei(toBalance, 'ether'), 'ETH');
            
            // Try to send a small amount
            const amount = web3.utils.toWei('0.1', 'ether');
            
            const tx = {
                from: fromAccount,
                to: toAccount,
                value: amount,
                gas: 21000
            };
            
            console.log('Attempting transaction...');
            const receipt = await web3.eth.sendTransaction(tx);
            console.log('Transaction successful! Hash:', receipt.transactionHash);
            
        } else {
            console.log('Not enough accounts for testing');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testTransaction();

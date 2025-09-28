const { Web3 } = require('web3');

async function unlockAccount() {
    const web3 = new Web3('http://localhost:8545');
    
    try {
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log('Available accounts:', accounts);
        
        if (accounts.length > 0) {
            const account = accounts[0];
            console.log('Attempting to unlock account:', account);
            
            // Try to unlock with the default password
            try {
                await web3.eth.personal.unlockAccount(account, 'password', 0);
                console.log('Account unlocked successfully!');
                
                // Check if we can send a transaction
                const balance = await web3.eth.getBalance(account);
                console.log('Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
                
            } catch (unlockError) {
                console.error('Failed to unlock account:', unlockError.message);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

unlockAccount();

const { ethers } = require('ethers');
const crypto = require('crypto');

class WalletService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
    );
    this.wallets = new Map(); // In-memory storage for demo (use secure storage in production)
  }

  /**
   * Generate a new Ethereum wallet
   * @returns {Object} Wallet information including address, private key, and mnemonic
   */
  generateWallet() {
    try {
      // Generate random wallet
      const wallet = ethers.Wallet.createRandom();
      
      // Connect to provider
      const connectedWallet = wallet.connect(this.provider);
      
      const walletInfo = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
        publicKey: wallet.publicKey
      };

      // Store wallet (in production, encrypt and store securely)
      this.wallets.set(wallet.address, {
        ...walletInfo,
        createdAt: new Date().toISOString()
      });

      console.log(`💝 New wallet generated: ${wallet.address}`);
      
      return {
        success: true,
        data: walletInfo
      };
    } catch (error) {
      console.error('Error generating wallet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Import wallet from private key
   * @param {string} privateKey - The private key to import
   * @returns {Object} Wallet information
   */
  importWalletFromPrivateKey(privateKey) {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      
      const walletInfo = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey
      };

      this.wallets.set(wallet.address, {
        ...walletInfo,
        importedAt: new Date().toISOString()
      });

      console.log(`📥 Wallet imported: ${wallet.address}`);
      
      return {
        success: true,
        data: walletInfo
      };
    } catch (error) {
      console.error('Error importing wallet:', error);
      return {
        success: false,
        error: 'Invalid private key'
      };
    }
  }

  /**
   * Import wallet from mnemonic phrase
   * @param {string} mnemonic - The mnemonic phrase
   * @returns {Object} Wallet information
   */
  importWalletFromMnemonic(mnemonic) {
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic, this.provider);
      
      const walletInfo = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
        publicKey: wallet.publicKey
      };

      this.wallets.set(wallet.address, {
        ...walletInfo,
        importedAt: new Date().toISOString()
      });

      console.log(`📥 Wallet imported from mnemonic: ${wallet.address}`);
      
      return {
        success: true,
        data: walletInfo
      };
    } catch (error) {
      console.error('Error importing wallet from mnemonic:', error);
      return {
        success: false,
        error: 'Invalid mnemonic phrase'
      };
    }
  }

  /**
   * Get wallet balance
   * @param {string} address - Wallet address
   * @returns {Object} Balance information
   */
  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      
      return {
        success: true,
        data: {
          address,
          balance: balance.toString(),
          balanceInEth,
          network: 'sepolia'
        }
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get transaction history
   * @param {string} address - Wallet address
   * @returns {Object} Transaction history
   */
  async getTransactionHistory(address) {
    try {
      // Get recent transactions (this is a simplified version)
      const latestBlock = await this.provider.getBlockNumber();
      const transactions = [];
      
      // Check last 100 blocks for transactions
      for (let i = 0; i < 100 && i < latestBlock; i++) {
        const blockNumber = latestBlock - i;
        try {
          const block = await this.provider.getBlock(blockNumber, true);
          if (block && block.transactions) {
            const userTxs = block.transactions.filter(tx => 
              tx.from === address || tx.to === address
            );
            transactions.push(...userTxs);
          }
        } catch (blockError) {
          // Skip if can't get block
          continue;
        }
      }
      
      return {
        success: true,
        data: {
          address,
          transactions: transactions.slice(0, 50) // Limit to 50 recent transactions
        }
      };
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sign a message
   * @param {string} address - Wallet address
   * @param {string} message - Message to sign
   * @returns {Object} Signature
   */
  async signMessage(address, message) {
    try {
      const walletData = this.wallets.get(address);
      if (!walletData) {
        throw new Error('Wallet not found');
      }

      const wallet = new ethers.Wallet(walletData.privateKey, this.provider);
      const signature = await wallet.signMessage(message);
      
      return {
        success: true,
        data: {
          message,
          signature,
          address
        }
      };
    } catch (error) {
      console.error('Error signing message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify a message signature
   * @param {string} message - Original message
   * @param {string} signature - Signature to verify
   * @param {string} address - Expected signer address
   * @returns {Object} Verification result
   */
  verifyMessage(message, signature, address) {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      const isValid = recoveredAddress.toLowerCase() === address.toLowerCase();
      
      return {
        success: true,
        data: {
          isValid,
          recoveredAddress,
          expectedAddress: address
        }
      };
    } catch (error) {
      console.error('Error verifying message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send ETH transaction
   * @param {string} fromAddress - Sender address
   * @param {string} toAddress - Recipient address
   * @param {string} amount - Amount in ETH
   * @returns {Object} Transaction result
   */
  async sendTransaction(fromAddress, toAddress, amount) {
    try {
      const walletData = this.wallets.get(fromAddress);
      if (!walletData) {
        throw new Error('Wallet not found');
      }

      const wallet = new ethers.Wallet(walletData.privateKey, this.provider);
      
      const tx = {
        to: toAddress,
        value: ethers.parseEther(amount),
        gasLimit: 21000
      };

      const transaction = await wallet.sendTransaction(tx);
      
      return {
        success: true,
        data: {
          hash: transaction.hash,
          from: fromAddress,
          to: toAddress,
          amount,
          gasLimit: tx.gasLimit.toString()
        }
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all wallets (for development purposes)
   * @returns {Array} List of wallet addresses
   */
  getAllWallets() {
    return Array.from(this.wallets.keys());
  }

  /**
   * Get wallet by address
   * @param {string} address - Wallet address
   * @returns {Object} Wallet information (without private key)
   */
  getWallet(address) {
    const wallet = this.wallets.get(address);
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found'
      };
    }

    const { privateKey, ...publicInfo } = wallet;
    return {
      success: true,
      data: publicInfo
    };
  }
}

module.exports = WalletService;
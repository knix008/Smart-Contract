const { ethers } = require('ethers');

class EthereumWallet {
  constructor() {
    this.wallet = null;
    this.provider = null;
  }

  /**
   * Create a new random wallet
   * @returns {Object} Wallet details (address, privateKey, mnemonic)
   */
  createWallet() {
    this.wallet = ethers.Wallet.createRandom();

    return {
      address: this.wallet.address,
      privateKey: this.wallet.privateKey,
      mnemonic: this.wallet.mnemonic.phrase
    };
  }

  /**
   * Import wallet from private key
   * @param {string} privateKey - The private key to import
   * @returns {Object} Wallet details
   */
  importFromPrivateKey(privateKey) {
    this.wallet = new ethers.Wallet(privateKey);

    return {
      address: this.wallet.address,
      privateKey: this.wallet.privateKey
    };
  }

  /**
   * Import wallet from mnemonic phrase
   * @param {string} mnemonic - The mnemonic phrase
   * @returns {Object} Wallet details
   */
  importFromMnemonic(mnemonic) {
    this.wallet = ethers.Wallet.fromPhrase(mnemonic);

    return {
      address: this.wallet.address,
      privateKey: this.wallet.privateKey,
      mnemonic: this.wallet.mnemonic.phrase
    };
  }

  /**
   * Connect to an Ethereum network
   * @param {string} rpcUrl - RPC URL (e.g., Infura, Alchemy, or local node)
   */
  connectToNetwork(rpcUrl) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    if (this.wallet) {
      this.wallet = this.wallet.connect(this.provider);
    }
  }

  /**
   * Get balance of the wallet
   * @returns {Promise<string>} Balance in ETH
   */
  async getBalance() {
    if (!this.wallet || !this.provider) {
      throw new Error('Wallet or provider not initialized');
    }

    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }

  /**
   * Get balance of any address
   * @param {string} address - Ethereum address
   * @returns {Promise<string>} Balance in ETH
   */
  async getBalanceOf(address) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  /**
   * Send ETH to another address
   * @param {string} toAddress - Recipient address
   * @param {string} amount - Amount in ETH
   * @returns {Promise<Object>} Transaction receipt
   */
  async sendTransaction(toAddress, amount) {
    if (!this.wallet || !this.provider) {
      throw new Error('Wallet or provider not initialized');
    }

    const tx = await this.wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount)
    });

    console.log('Transaction hash:', tx.hash);
    console.log('Waiting for confirmation...');

    const receipt = await tx.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);

    return receipt;
  }

  /**
   * Sign a message
   * @param {string} message - Message to sign
   * @returns {Promise<string>} Signature
   */
  async signMessage(message) {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    return await this.wallet.signMessage(message);
  }

  /**
   * Verify a signed message
   * @param {string} message - Original message
   * @param {string} signature - Signature to verify
   * @returns {string} Address that signed the message
   */
  verifyMessage(message, signature) {
    return ethers.verifyMessage(message, signature);
  }

  /**
   * Get current gas price
   * @returns {Promise<string>} Gas price in Gwei
   */
  async getGasPrice() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const feeData = await this.provider.getFeeData();
    return ethers.formatUnits(feeData.gasPrice, 'gwei');
  }

  /**
   * Get transaction count (nonce)
   * @returns {Promise<number>} Transaction count
   */
  async getTransactionCount() {
    if (!this.wallet || !this.provider) {
      throw new Error('Wallet or provider not initialized');
    }

    return await this.provider.getTransactionCount(this.wallet.address);
  }

  /**
   * Get wallet address
   * @returns {string} Wallet address
   */
  getAddress() {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    return this.wallet.address;
  }
}

module.exports = EthereumWallet;

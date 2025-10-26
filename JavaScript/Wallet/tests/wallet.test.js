const { ethers } = require('ethers');
const { describe, test, expect, beforeEach } = require('@jest/globals');

describe('Ethereum Wallet - Core Functionality', () => {
  let wallet;
  let provider;

  beforeEach(() => {
    // Create a test provider (using a public RPC)
    provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e');
  });

  describe('Wallet Creation', () => {
    test('should create a new wallet with valid address and private key', () => {
      wallet = ethers.Wallet.createRandom();

      expect(wallet.address).toBeDefined();
      expect(wallet.privateKey).toBeDefined();
      expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    test('should create unique wallets on each creation', () => {
      const wallet1 = ethers.Wallet.createRandom();
      const wallet2 = ethers.Wallet.createRandom();

      expect(wallet1.address).not.toBe(wallet2.address);
      expect(wallet1.privateKey).not.toBe(wallet2.privateKey);
    });

    test('wallet should have expected properties', () => {
      wallet = ethers.Wallet.createRandom();

      expect(wallet).toHaveProperty('address');
      expect(wallet).toHaveProperty('privateKey');
      expect(wallet).toHaveProperty('publicKey');
    });
  });

  describe('Wallet Import', () => {
    const testPrivateKey = '0x1234567890123456789012345678901234567890123456789012345678901234';

    test('should import wallet from valid private key', () => {
      wallet = new ethers.Wallet(testPrivateKey);

      expect(wallet.address).toBeDefined();
      expect(wallet.privateKey).toBe(testPrivateKey);
    });

    test('should derive same address from same private key', () => {
      const wallet1 = new ethers.Wallet(testPrivateKey);
      const wallet2 = new ethers.Wallet(testPrivateKey);

      expect(wallet1.address).toBe(wallet2.address);
    });

    test('should throw error for invalid private key', () => {
      expect(() => {
        new ethers.Wallet('invalid_private_key');
      }).toThrow();
    });

    test('should throw error for empty private key', () => {
      expect(() => {
        new ethers.Wallet('');
      }).toThrow();
    });
  });

  describe('Address Validation', () => {
    test('should validate correct Ethereum addresses', () => {
      const validAddress = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      expect(ethers.isAddress(validAddress)).toBe(true);
    });

    test('should invalidate incorrect addresses', () => {
      const invalidAddresses = [
        'not_an_address',
        '0x123',
        '742d35Cc6634C0532925a3b844Bc9e7595f0bEb6', // missing 0x
        '0xZZZZ35Cc6634C0532925a3b844Bc9e7595f0bEb6', // invalid hex
        '',
      ];

      invalidAddresses.forEach(addr => {
        expect(ethers.isAddress(addr)).toBe(false);
      });
    });

    test('should handle checksummed addresses', () => {
      const checksummed = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      expect(ethers.isAddress(checksummed)).toBe(true);
    });
  });

  describe('Provider Connection', () => {
    test('should create provider with RPC URL', () => {
      const testProvider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e');
      expect(testProvider).toBeDefined();
    });

    test('should connect wallet to provider', () => {
      wallet = ethers.Wallet.createRandom();
      const connectedWallet = wallet.connect(provider);

      expect(connectedWallet.provider).toBeDefined();
    });

    test('should get network information', async () => {
      const network = await provider.getNetwork();

      expect(network).toBeDefined();
      expect(network.chainId).toBeDefined();
      expect(network.name).toBeDefined();
    }, 10000);
  });

  describe('Balance Checking', () => {
    test('should get balance for an address', async () => {
      const testAddress = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      const balance = await provider.getBalance(testAddress);

      expect(balance).toBeDefined();
      expect(typeof balance).toBe('bigint');
    }, 10000);

    test('should format balance from Wei to ETH', async () => {
      const testAddress = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      const balance = await provider.getBalance(testAddress);
      const balanceInEth = ethers.formatEther(balance);

      expect(balanceInEth).toBeDefined();
      expect(typeof balanceInEth).toBe('string');
      expect(parseFloat(balanceInEth)).toBeGreaterThanOrEqual(0);
    }, 10000);

    test('should return zero balance for new address', async () => {
      const newWallet = ethers.Wallet.createRandom();
      const balance = await provider.getBalance(newWallet.address);

      expect(balance).toBe(0n);
    }, 10000);
  });

  describe('Transaction Creation', () => {
    test('should create a valid transaction object', () => {
      const tx = {
        to: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        value: ethers.parseEther('0.01'),
      };

      expect(tx.to).toBeDefined();
      expect(tx.value).toBeDefined();
      expect(typeof tx.value).toBe('bigint');
    });

    test('should parse ETH amount to Wei correctly', () => {
      const ethAmount = '1.5';
      const weiAmount = ethers.parseEther(ethAmount);

      expect(weiAmount).toBe(1500000000000000000n);
    });

    test('should format Wei to ETH correctly', () => {
      const weiAmount = 1500000000000000000n;
      const ethAmount = ethers.formatEther(weiAmount);

      expect(ethAmount).toBe('1.5');
    });
  });

  describe('Transaction Signing', () => {
    test('should sign a transaction', async () => {
      wallet = ethers.Wallet.createRandom();
      const connectedWallet = wallet.connect(provider);

      const tx = {
        to: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        value: ethers.parseEther('0.01'),
      };

      // Populate transaction with gas estimates
      const populatedTx = await connectedWallet.populateTransaction(tx);
      const signedTx = await connectedWallet.signTransaction(populatedTx);

      expect(signedTx).toBeDefined();
      expect(typeof signedTx).toBe('string');
      expect(signedTx).toMatch(/^0x/);
    }, 15000);
  });

  describe('Environment Variable Configuration', () => {
    test('should load environment variables', () => {
      require('dotenv').config();

      expect(process.env.ETHEREUM_SEPOLIA_RPC).toBeDefined();
      expect(process.env.ETHEREUM_MAINNET_RPC).toBeDefined();
    });

    test('environment RPC URLs should be valid', () => {
      require('dotenv').config();

      const sepoliaRpc = process.env.ETHEREUM_SEPOLIA_RPC;
      const mainnetRpc = process.env.ETHEREUM_MAINNET_RPC;

      expect(sepoliaRpc).toMatch(/^https?:\/\//);
      expect(mainnetRpc).toMatch(/^https?:\/\//);
    });
  });

  describe('Network Support', () => {
    test('should connect to Sepolia testnet', async () => {
      const sepoliaProvider = new ethers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC);
      const network = await sepoliaProvider.getNetwork();

      expect(network.chainId).toBe(11155111n); // Sepolia chain ID
    }, 10000);

    test('should support multiple networks', () => {
      const networks = {
        mainnet: process.env.ETHEREUM_MAINNET_RPC,
        sepolia: process.env.ETHEREUM_SEPOLIA_RPC,
      };

      expect(networks.mainnet).toBeDefined();
      expect(networks.sepolia).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid RPC endpoint gracefully', async () => {
      const invalidProvider = new ethers.JsonRpcProvider('https://invalid-rpc-endpoint.com');

      await expect(invalidProvider.getNetwork()).rejects.toThrow();
    }, 10000);

    test('should handle invalid address in balance check', async () => {
      await expect(provider.getBalance('invalid_address')).rejects.toThrow();
    }, 10000);
  });
});

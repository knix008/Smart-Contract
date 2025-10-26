const { ethers } = require('ethers');
const { describe, test, expect } = require('@jest/globals');

describe('Utility Functions', () => {
  describe('ETH/Wei Conversions', () => {
    test('should convert 1 ETH to Wei correctly', () => {
      const eth = '1';
      const wei = ethers.parseEther(eth);

      expect(wei).toBe(1000000000000000000n);
    });

    test('should convert Wei to ETH correctly', () => {
      const wei = 1000000000000000000n;
      const eth = ethers.formatEther(wei);

      expect(eth).toBe('1.0');
    });

    test('should handle decimal ETH amounts', () => {
      const testCases = [
        { eth: '0.1', wei: 100000000000000000n },
        { eth: '0.01', wei: 10000000000000000n },
        { eth: '0.001', wei: 1000000000000000n },
        { eth: '2.5', wei: 2500000000000000000n },
      ];

      testCases.forEach(({ eth, wei }) => {
        expect(ethers.parseEther(eth)).toBe(wei);
        expect(ethers.formatEther(wei)).toBe(eth);
      });
    });

    test('should handle very small amounts', () => {
      const wei = 1n; // 1 wei
      const eth = ethers.formatEther(wei);

      expect(eth).toBe('0.000000000000000001');
    });

    test('should handle large amounts', () => {
      const eth = '1000000';
      const wei = ethers.parseEther(eth);

      expect(wei).toBe(1000000000000000000000000n);
    });
  });

  describe('Address Utilities', () => {
    test('should get checksum address', () => {
      const address = '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed';
      const checksummed = ethers.getAddress(address);

      expect(checksummed).toBe('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');
    });

    test('should validate address format', () => {
      const validAddresses = [
        '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        '0x0000000000000000000000000000000000000000',
      ];

      validAddresses.forEach(addr => {
        expect(ethers.isAddress(addr)).toBe(true);
      });
    });

    test('should identify invalid addresses', () => {
      const invalidAddresses = [
        'not an address',
        '0x',
        '0x123',
        '0xGGGG35Cc6634C0532925a3b844Bc9e7595f0bEb6',
        '',
        null,
        undefined,
      ];

      invalidAddresses.forEach(addr => {
        expect(ethers.isAddress(addr)).toBe(false);
      });
    });

    test('should handle addresses with/without 0x prefix', () => {
      const withPrefix = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      const withoutPrefix = '5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';

      // ethers.js v6 accepts both formats
      expect(ethers.isAddress(withPrefix)).toBe(true);
      expect(ethers.isAddress(withoutPrefix)).toBe(true);

      // But getAddress will normalize both to checksummed with 0x prefix
      expect(ethers.getAddress(withPrefix)).toBe('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');
      expect(ethers.getAddress(withoutPrefix)).toBe('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');
    });
  });

  describe('Transaction Utilities', () => {
    test('should serialize transaction data', async () => {
      const tx = {
        to: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        value: ethers.parseEther('1.0'),
        gasLimit: 21000n,
        gasPrice: ethers.parseUnits('20', 'gwei'),
        nonce: 0,
        chainId: 11155111, // Sepolia
      };

      const serialized = ethers.Transaction.from(tx).unsignedSerialized;

      expect(serialized).toBeDefined();
      expect(serialized).toMatch(/^0x/);
    });

    test('should calculate transaction hash', () => {
      const wallet = ethers.Wallet.createRandom();
      const tx = {
        to: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        value: ethers.parseEther('1.0'),
        nonce: 0,
        gasLimit: 21000n,
        gasPrice: ethers.parseUnits('20', 'gwei'),
        chainId: 11155111,
      };

      const txHash = wallet.signingKey.sign(
        ethers.keccak256(ethers.Transaction.from(tx).unsignedSerialized)
      );

      expect(txHash).toBeDefined();
      expect(txHash.r).toBeDefined();
      expect(txHash.s).toBeDefined();
    });
  });

  describe('Gas Utilities', () => {
    test('should parse gas price in Gwei', () => {
      const gwei = '20';
      const wei = ethers.parseUnits(gwei, 'gwei');

      expect(wei).toBe(20000000000n);
    });

    test('should format gas price from Wei to Gwei', () => {
      const wei = 20000000000n;
      const gwei = ethers.formatUnits(wei, 'gwei');

      expect(gwei).toBe('20.0');
    });

    test('should calculate total gas cost', () => {
      const gasLimit = 21000n;
      const gasPrice = ethers.parseUnits('50', 'gwei');
      const totalCost = gasLimit * gasPrice;

      expect(totalCost).toBe(1050000000000000n);
      expect(ethers.formatEther(totalCost)).toBe('0.00105');
    });
  });

  describe('Private Key Utilities', () => {
    test('should generate random private key', () => {
      const wallet = ethers.Wallet.createRandom();

      expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    test('should derive public key from private key', () => {
      const wallet = ethers.Wallet.createRandom();

      expect(wallet.publicKey).toBeDefined();
      // Public keys can be compressed (0x02/0x03 + 64 chars) or uncompressed (0x04 + 128 chars)
      expect(wallet.publicKey).toMatch(/^0x(02|03|04)[a-fA-F0-9]{64,128}$/);
    });

    test('should derive address from private key consistently', () => {
      const privateKey = '0x1234567890123456789012345678901234567890123456789012345678901234';
      const wallet1 = new ethers.Wallet(privateKey);
      const wallet2 = new ethers.Wallet(privateKey);

      expect(wallet1.address).toBe(wallet2.address);
    });
  });

  describe('Keccak256 Hashing', () => {
    test('should hash strings using keccak256', () => {
      const message = 'Hello, Ethereum!';
      const messageBytes = ethers.toUtf8Bytes(message);
      const hash = ethers.keccak256(messageBytes);

      expect(hash).toBeDefined();
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    test('should produce consistent hashes', () => {
      const message = 'Test Message';
      const bytes = ethers.toUtf8Bytes(message);
      const hash1 = ethers.keccak256(bytes);
      const hash2 = ethers.keccak256(bytes);

      expect(hash1).toBe(hash2);
    });

    test('should produce different hashes for different inputs', () => {
      const message1 = 'Message 1';
      const message2 = 'Message 2';

      const hash1 = ethers.keccak256(ethers.toUtf8Bytes(message1));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes(message2));

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Hex Utilities', () => {
    test('should convert string to hex', () => {
      const text = 'Hello';
      const hex = ethers.hexlify(ethers.toUtf8Bytes(text));

      expect(hex).toBe('0x48656c6c6f');
    });

    test('should convert hex to string', () => {
      const hex = '0x48656c6c6f';
      const text = ethers.toUtf8String(hex);

      expect(text).toBe('Hello');
    });

    test('should validate hex strings', () => {
      expect(ethers.isHexString('0x1234')).toBe(true);
      expect(ethers.isHexString('0xabcd')).toBe(true);
      expect(ethers.isHexString('1234')).toBe(false);
      expect(ethers.isHexString('0xGHIJ')).toBe(false);
    });
  });

  describe('Data Encoding', () => {
    test('should encode function signature', () => {
      const iface = new ethers.Interface([
        'function transfer(address to, uint256 amount)',
      ]);

      const data = iface.encodeFunctionData('transfer', [
        '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        ethers.parseEther('1.0'),
      ]);

      expect(data).toBeDefined();
      expect(data).toMatch(/^0x/);
    });

    test('should get function selector', () => {
      const iface = new ethers.Interface([
        'function transfer(address to, uint256 amount)',
      ]);

      const selector = iface.getFunction('transfer').selector;

      expect(selector).toBe('0xa9059cbb');
    });
  });
});

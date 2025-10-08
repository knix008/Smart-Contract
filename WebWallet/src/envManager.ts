import { Wallet } from './types';

export interface EnvWalletData {
  address: string;
  privateKey: string;
  mnemonic: string;
  name?: string;
}

export class EnvFileManager {
  // Generate .env file content from wallet data
  static generateEnvContent(wallets: Wallet[]): string {
    let content = `# Ethereum Wallet Environment Variables
# WARNING: This file contains sensitive information. Never commit to version control!
# Generated on: ${new Date().toISOString()}

# Network Configuration
VITE_ETHEREUM_RPC_URL=${import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'}
VITE_NETWORK_NAME=${import.meta.env.VITE_NETWORK_NAME || 'mainnet'}

# Application Settings
VITE_APP_NAME=${import.meta.env.VITE_APP_NAME || 'Ethereum Wallet Generator'}
VITE_ENABLE_WALLET_SAVE=${import.meta.env.VITE_ENABLE_WALLET_SAVE || 'true'}

`;

    wallets.forEach((wallet, index) => {
      const walletNumber = index + 1;
      const walletName = wallet.name?.replace(/\s+/g, '_').toUpperCase() || `WALLET_${walletNumber}`;
      
      content += `
# ${wallet.name || `Wallet ${walletNumber}`} (Created: ${new Date(wallet.createdAt).toLocaleDateString()})
${walletName}_ADDRESS=${wallet.address}
${walletName}_PRIVATE_KEY=${wallet.privateKey}
${walletName}_MNEMONIC="${wallet.mnemonic}"
`;
    });

    content += `
# Usage Instructions:
# 1. Copy this file to your project root as '.env'
# 2. Never commit .env files to version control
# 3. Use these variables in your application code
# 4. Keep this file secure and backed up safely

# Example usage in code:
# const address = import.meta.env.VITE_WALLET_1_ADDRESS;
# const privateKey = import.meta.env.VITE_WALLET_1_PRIVATE_KEY;
`;

    return content;
  }

  // Download .env file
  static downloadEnvFile(wallets: Wallet[], filename?: string): void {
    const content = this.generateEnvContent(wallets);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `.env.wallet-backup-${new Date().toISOString().split('T')[0]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Parse .env file content
  static parseEnvContent(content: string): EnvWalletData[] {
    const lines = content.split('\n');
    const wallets: EnvWalletData[] = [];
    const walletMap = new Map<string, Partial<EnvWalletData>>();

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || !trimmed.includes('=')) return;

      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes

      if (key.includes('_ADDRESS')) {
        const walletPrefix = key.replace('_ADDRESS', '');
        if (!walletMap.has(walletPrefix)) {
          walletMap.set(walletPrefix, {});
        }
        walletMap.get(walletPrefix)!.address = value;
      } else if (key.includes('_PRIVATE_KEY')) {
        const walletPrefix = key.replace('_PRIVATE_KEY', '');
        if (!walletMap.has(walletPrefix)) {
          walletMap.set(walletPrefix, {});
        }
        walletMap.get(walletPrefix)!.privateKey = value;
      } else if (key.includes('_MNEMONIC')) {
        const walletPrefix = key.replace('_MNEMONIC', '');
        if (!walletMap.has(walletPrefix)) {
          walletMap.set(walletPrefix, {});
        }
        walletMap.get(walletPrefix)!.mnemonic = value;
      }
    });

    walletMap.forEach((walletData, prefix) => {
      if (walletData.address && walletData.privateKey && walletData.mnemonic) {
        wallets.push({
          address: walletData.address,
          privateKey: walletData.privateKey,
          mnemonic: walletData.mnemonic,
          name: prefix.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        });
      }
    });

    return wallets;
  }

  // Load .env file from user upload
  static loadEnvFile(): Promise<EnvWalletData[]> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.env,.txt';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const wallets = this.parseEnvContent(content);
            resolve(wallets);
          } catch (error) {
            reject(new Error('Failed to parse .env file: ' + (error as Error).message));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      };
      
      input.click();
    });
  }

  // Get current environment configuration
  static getEnvConfig() {
    return {
      rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
      networkName: import.meta.env.VITE_NETWORK_NAME || 'mainnet',
      appName: import.meta.env.VITE_APP_NAME || 'Ethereum Wallet Generator',
      enableWalletSave: import.meta.env.VITE_ENABLE_WALLET_SAVE === 'true'
    };
  }
}
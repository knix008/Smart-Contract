export interface Wallet {
  address: string;
  privateKey: string;
  mnemonic: string;
  createdAt: string;
  name?: string;
}

export interface WalletBalance {
  address: string;
  balance: string;
}

export interface SavedWallets {
  wallets: Wallet[];
}
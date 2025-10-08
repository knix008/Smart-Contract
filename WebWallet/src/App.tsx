import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

interface Wallet {
  address: string;
  privateKey: string;
  mnemonic: string;
  createdAt: string;
  name?: string;
}

interface WalletBalance {
  address: string;
  balance: string;
}

interface SavedWallets {
  wallets: Wallet[];
}

function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [savedWallets, setSavedWallets] = useState<Wallet[]>([]);
  const [showSavedWallets, setShowSavedWallets] = useState(false);

  // Load saved wallets on component mount
  useEffect(() => {
    loadSavedWallets();
  }, []);

  const loadSavedWallets = async () => {
    try {
      const saved = localStorage.getItem('ethereum-wallets');
      if (saved) {
        const walletData: SavedWallets = JSON.parse(saved);
        setSavedWallets(walletData.wallets || []);
      }
    } catch (err) {
      console.error('Error loading saved wallets:', err);
    }
  };

  const saveWalletToStorage = (walletToSave: Wallet) => {
    try {
      const existingData = localStorage.getItem('ethereum-wallets');
      let walletData: SavedWallets = { wallets: [] };
      
      if (existingData) {
        walletData = JSON.parse(existingData);
      }
      
      // Check if wallet already exists (by address)
      const existingIndex = walletData.wallets.findIndex(w => w.address === walletToSave.address);
      
      if (existingIndex === -1) {
        // Add new wallet
        walletData.wallets.push(walletToSave);
      } else {
        // Update existing wallet
        walletData.wallets[existingIndex] = walletToSave;
      }
      
      localStorage.setItem('ethereum-wallets', JSON.stringify(walletData));
      setSavedWallets(walletData.wallets);
      
      // Also create a downloadable backup file
      createBackupFile(walletData);
      
      alert('Wallet saved successfully! A backup file has been downloaded.');
    } catch (err) {
      setError('Failed to save wallet: ' + (err as Error).message);
    }
  };

  const createBackupFile = (walletData: SavedWallets) => {
    const dataStr = JSON.stringify(walletData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ethereum-wallets-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deleteWallet = (address: string) => {
    if (confirm('Are you sure you want to delete this wallet? This action cannot be undone.')) {
      try {
        const updatedWallets = savedWallets.filter(w => w.address !== address);
        const walletData: SavedWallets = { wallets: updatedWallets };
        
        localStorage.setItem('ethereum-wallets', JSON.stringify(walletData));
        setSavedWallets(updatedWallets);
        
        // If the deleted wallet is currently selected, clear it
        if (wallet && wallet.address === address) {
          setWallet(null);
          setBalance(null);
        }
        
        alert('Wallet deleted successfully.');
      } catch (err) {
        setError('Failed to delete wallet: ' + (err as Error).message);
      }
    }
  };

  const loadWallet = (savedWallet: Wallet) => {
    setWallet(savedWallet);
    setBalance(null);
    setError('');
  };

  const createNewWallet = () => {
    try {
      setError('');
      const newWallet = ethers.Wallet.createRandom();
      
      const walletInfo: Wallet = {
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic?.phrase || '',
        createdAt: new Date().toISOString(),
        name: `Wallet ${savedWallets.length + 1}`
      };
      
      setWallet(walletInfo);
      setBalance(null); // Reset balance when creating new wallet
    } catch (err) {
      setError('Failed to create wallet: ' + (err as Error).message);
    }
  };

  const checkBalance = async () => {
    if (!wallet) {
      setError('Please create a wallet first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Using Ethereum mainnet provider (you can change to testnet)
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      const balanceWei = await provider.getBalance(wallet.address);
      const balanceEth = ethers.formatEther(balanceWei);
      
      setBalance({
        address: wallet.address,
        balance: balanceEth
      });
    } catch (err) {
      setError('Failed to check balance: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔗 Ethereum Wallet Generator</h1>
        <p>Create new Ethereum wallets and check their balances</p>
      </header>

      <main className="App-main">
        <div className="wallet-controls">
          <button 
            onClick={createNewWallet}
            className="create-wallet-btn"
          >
            🔑 Create New Wallet
          </button>
          
          {wallet && (
            <>
              <button 
                onClick={checkBalance}
                disabled={isLoading}
                className="check-balance-btn"
              >
                {isLoading ? '⏳ Checking...' : '💰 Check Balance'}
              </button>
              
              <button 
                onClick={() => saveWalletToStorage(wallet)}
                className="save-wallet-btn"
              >
                💾 Save Wallet
              </button>
            </>
          )}
          
          {savedWallets.length > 0 && (
            <button 
              onClick={() => setShowSavedWallets(!showSavedWallets)}
              className="show-saved-btn"
            >
              📂 {showSavedWallets ? 'Hide' : 'Show'} Saved Wallets ({savedWallets.length})
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {showSavedWallets && savedWallets.length > 0 && (
          <div className="saved-wallets">
            <h2>💼 Saved Wallets</h2>
            <div className="wallet-list">
              {savedWallets.map((savedWallet, index) => (
                <div key={savedWallet.address} className="saved-wallet-item">
                  <div className="wallet-summary">
                    <h3>{savedWallet.name || `Wallet ${index + 1}`}</h3>
                    <p className="wallet-address">{savedWallet.address}</p>
                    <p className="created-date">Created: {new Date(savedWallet.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="wallet-actions">
                    <button 
                      onClick={() => loadWallet(savedWallet)}
                      className="load-btn"
                    >
                      📥 Load
                    </button>
                    <button 
                      onClick={() => deleteWallet(savedWallet.address)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {wallet && (
          <div className="wallet-info">
            <h2>💼 Wallet Information</h2>
            
            <div className="info-item">
              <label>📍 Address:</label>
              <div className="copyable-field">
                <input 
                  type="text" 
                  value={wallet.address} 
                  readOnly 
                />
                <button onClick={() => copyToClipboard(wallet.address)}>
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="info-item">
              <label>🔐 Private Key:</label>
              <div className="copyable-field">
                <input 
                  type="password" 
                  value={wallet.privateKey} 
                  readOnly 
                />
                <button onClick={() => copyToClipboard(wallet.privateKey)}>
                  📋 Copy
                </button>
              </div>
              <small className="warning">⚠️ Never share your private key!</small>
            </div>

            <div className="info-item">
              <label>📝 Mnemonic Phrase:</label>
              <div className="copyable-field">
                <textarea 
                  value={wallet.mnemonic} 
                  readOnly 
                  rows={3}
                />
                <button onClick={() => copyToClipboard(wallet.mnemonic)}>
                  📋 Copy
                </button>
              </div>
              <small className="warning">⚠️ Store this safely - it's your wallet backup!</small>
            </div>
          </div>
        )}

        {balance && (
          <div className="balance-info">
            <h2>💰 Wallet Balance</h2>
            <div className="balance-display">
              <span className="balance-amount">{balance.balance} ETH</span>
              <span className="balance-address">for {balance.address}</span>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>ℹ️ Important Notes</h3>
          <ul>
            <li>This creates a completely new Ethereum wallet with a random private key</li>
            <li>The wallet will have 0 ETH balance initially</li>
            <li>To test with funds, use Ethereum testnets like Sepolia or Goerli</li>
            <li>Never share your private key or mnemonic phrase with anyone</li>
            <li>This is for educational purposes - use secure wallet software for real funds</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
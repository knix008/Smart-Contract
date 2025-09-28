#!/usr/bin/env python3
"""
Python deployment script for MyERC20Token
Deploys the ERC20 token to the local Ethereum network
"""

import json
import os
import sys
from web3 import Web3
from eth_account import Account
import time

# Network configuration
RPC_URL = "http://127.0.0.1:32973"
CHAIN_ID = 585858

# Private keys (from the network's funded accounts)
PRIVATE_KEYS = [
    "27515f805127bebad2fb9b183508bdacb8c763da16f54e0678b16e8f28ef3fff",
    "7ff1a4c1d57e5e784d327c4c7651e952350bc271f156afb3d00d20f5ef924856",
    "3a91003acaf4c21b3953d94fa4a6db694fa69e5242b2e37be05dd82761058899"
]

# Contract ABI (simplified for ERC20)
ERC20_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "recipient", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "internalType": "address", "name": "owner", "type": "address"},
            {"indexed": True, "internalType": "address", "name": "spender", "type": "address"},
            {"indexed": False, "internalType": "uint256", "name": "value", "type": "uint256"}
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "internalType": "address", "name": "from", "type": "address"},
            {"indexed": True, "internalType": "address", "name": "to", "type": "address"},
            {"indexed": False, "internalType": "uint256", "name": "value", "type": "uint256"}
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "address", "name": "spender", "type": "address"}],
        "name": "allowance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "transferFrom",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

def connect_to_network():
    """Connect to the Ethereum network"""
    print("🔗 Connecting to Ethereum network...")
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    
    if not w3.is_connected():
        print("❌ Failed to connect to network")
        return None
    
    print(f"✅ Connected to network at {RPC_URL}")
    return w3

def get_account(w3, private_key):
    """Get account from private key"""
    account = Account.from_key(private_key)
    return account

def check_balance(w3, address):
    """Check ETH balance"""
    balance = w3.eth.get_balance(address)
    return w3.from_wei(balance, 'ether')

def deploy_contract(w3, account, contract_bytecode, constructor_args):
    """Deploy the contract"""
    print("📦 Deploying MyERC20Token contract...")
    
    # Get nonce
    nonce = w3.eth.get_transaction_count(account.address)
    
    # Build transaction
    transaction = {
        'from': account.address,
        'gas': 2000000,  # Gas limit
        'gasPrice': w3.to_wei('20', 'gwei'),
        'nonce': nonce,
        'data': contract_bytecode + constructor_args.hex()[2:] if constructor_args else contract_bytecode
    }
    
    # Sign transaction
    signed_txn = w3.eth.account.sign_transaction(transaction, account.key)
    
    # Send transaction
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    print(f"📝 Transaction sent: {tx_hash.hex()}")
    
    # Wait for receipt
    print("⏳ Waiting for transaction confirmation...")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    if receipt.status == 1:
        print("✅ Contract deployed successfully!")
        return receipt.contractAddress
    else:
        print("❌ Contract deployment failed")
        return None

def get_contract_info(w3, contract_address, account):
    """Get contract information"""
    print("\n📊 Contract Information:")
    
    # Create contract instance
    contract = w3.eth.contract(address=contract_address, abi=ERC20_ABI)
    
    try:
        name = contract.functions.name().call()
        symbol = contract.functions.symbol().call()
        decimals = contract.functions.decimals().call()
        total_supply = contract.functions.totalSupply().call()
        balance = contract.functions.balanceOf(account.address).call()
        
        print(f"   Name: {name}")
        print(f"   Symbol: {symbol}")
        print(f"   Decimals: {decimals}")
        print(f"   Total Supply: {total_supply / (10 ** decimals)} {symbol}")
        print(f"   Your Balance: {balance / (10 ** decimals)} {symbol}")
        
        return {
            'name': name,
            'symbol': symbol,
            'decimals': decimals,
            'totalSupply': total_supply,
            'balance': balance
        }
    except Exception as e:
        print(f"❌ Error getting contract info: {e}")
        return None

def save_deployment_info(contract_address, deployer, tx_hash, contract_info):
    """Save deployment information"""
    deployment_info = {
        'network': 'localhost',
        'contractAddress': contract_address,
        'deployer': deployer,
        'transactionHash': tx_hash,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'contractInfo': contract_info,
        'rpcUrl': RPC_URL,
        'chainId': CHAIN_ID
    }
    
    # Create deployments directory
    os.makedirs('deployments', exist_ok=True)
    
    # Save to file
    filename = f'deployments/deployment-{int(time.time())}.json'
    with open(filename, 'w') as f:
        json.dump(deployment_info, f, indent=2)
    
    print(f"💾 Deployment info saved to: {filename}")
    return filename

def main():
    print("🚀 MyERC20Token Python Deployment Script")
    print("=" * 50)
    
    # Connect to network
    w3 = connect_to_network()
    if not w3:
        return
    
    # Get account
    account = get_account(w3, PRIVATE_KEYS[0])
    print(f"📝 Using account: {account.address}")
    
    # Check balance
    balance = check_balance(w3, account.address)
    print(f"💰 Account balance: {balance} ETH")
    
    if balance == 0:
        print("⚠️  Warning: Account has no ETH. Make sure the network is running and funded.")
        return
    
    # Note: In a real deployment, you would need the compiled bytecode
    # For this example, we'll show the structure
    print("\n📝 Note: This script requires the compiled contract bytecode.")
    print("   To get the bytecode, compile the contract using Hardhat:")
    print("   npm install")
    print("   npx hardhat compile")
    print("   Then extract the bytecode from artifacts/contracts/MyERC20Token.sol/MyERC20Token.json")
    
    print("\n🌐 Network Information:")
    print(f"   RPC URL: {RPC_URL}")
    print(f"   Chain ID: {CHAIN_ID}")
    print("   Block Explorer (Dora): http://127.0.0.1:32826")
    print("   Block Explorer (Blockscout): http://127.0.0.1:3000")
    
    print("\n💡 For actual deployment, use the Hardhat script:")
    print("   npm install")
    print("   npx hardhat run scripts/deploy.js --network localhost")

if __name__ == "__main__":
    main()

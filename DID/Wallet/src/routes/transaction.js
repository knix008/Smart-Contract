const express = require('express');
const { ethers } = require('ethers');

const router = express.Router();

// Get transaction by hash
router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!hash) {
      return res.status(400).json({ 
        success: false, 
        error: 'Transaction hash is required' 
      });
    }

    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
    );

    const transaction = await provider.getTransaction(hash);
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transaction not found' 
      });
    }

    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(hash);

    res.json({
      success: true,
      data: {
        transaction: {
          hash: transaction.hash,
          from: transaction.from,
          to: transaction.to,
          value: transaction.value.toString(),
          gasLimit: transaction.gasLimit.toString(),
          gasPrice: transaction.gasPrice?.toString(),
          nonce: transaction.nonce,
          data: transaction.data,
          blockNumber: transaction.blockNumber,
          blockHash: transaction.blockHash
        },
        receipt: receipt ? {
          status: receipt.status,
          gasUsed: receipt.gasUsed.toString(),
          effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
          logs: receipt.logs,
          confirmations: await transaction.confirmations()
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current gas price
router.get('/gas/price', async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
    );

    const feeData = await provider.getFeeData();
    
    res.json({
      success: true,
      data: {
        gasPrice: feeData.gasPrice?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get network information
router.get('/network/info', async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
    );

    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    
    res.json({
      success: true,
      data: {
        chainId: network.chainId.toString(),
        name: network.name,
        ensAddress: network.ensAddress,
        currentBlock: blockNumber,
        blockTimestamp: block ? new Date(block.timestamp * 1000).toISOString() : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
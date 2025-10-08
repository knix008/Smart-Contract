require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.27",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e",
      accounts: [], // Add your private key here if needed for deployment
      chainId: 11155111
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
      accounts: [], // Add your private key here if needed for deployment
      chainId: 1
    }
  },
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY" // Replace with your API key if needed
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
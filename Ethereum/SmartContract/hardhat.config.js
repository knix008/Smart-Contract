require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    node2: {
      url: "http://127.0.0.1:32978",
      chainId: 585858,
      accounts: [
        "0x27515f805127bebad2fb9b183508bdacb8c763da16f54e0678b16e8f28ef3fff",
        "0x7ff1a4c1d57e5e784d327c4c7651e952350bc271f156afb3d00d20f5ef924856",
        "0x3a91003acaf4c21b3953d94fa4a6db694fa69e5242b2e37be05dd82761058899"
      ]
    },
    node3: {
      url: "http://127.0.0.1:32983",
      chainId: 585858,
      accounts: [
        "0x27515f805127bebad2fb9b183508bdacb8c763da16f54e0678b16e8f28ef3fff",
        "0x7ff1a4c1d57e5e784d327c4c7651e952350bc271f156afb3d00d20f5ef924856",
        "0x3a91003acaf4c21b3953d94fa4a6db694fa69e5242b2e37be05dd82761058899"
      ]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

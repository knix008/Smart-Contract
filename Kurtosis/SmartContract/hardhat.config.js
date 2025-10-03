import dotenv from "dotenv";
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    kurtosis: {
      type: "http",
      url: process.env.RPC_URL || "http://127.0.0.1:32776",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: parseInt(process.env.CHAIN_ID || "3151908")
    }
  }
};

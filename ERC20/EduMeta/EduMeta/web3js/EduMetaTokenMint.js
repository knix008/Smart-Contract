const { JsonRpcProvider, Wallet } = require("@kaiachain/ethers-ext");
const { ethers } = require("ethers");
require('dotenv').config()

const provider = new ethers.JsonRpcProvider(process.env.L1RPC);
const privateKey = process.env.privatekey;
const account = process.env.account;
const signer = new ethers.Wallet(privateKey, provider);
const contractAddress = process.env.contractaddress;  // PASTE DEPLOYED CONTRACT ADDRESS;

const KaiaEduMetaTokenABI = require("../artifacts/contracts/EduMetaToken.sol/EduMetaToken.json").abi;

async function mint(amount) {
    //const myContract= new ethers.Contract(contractAddress, KaiaEduMetaTokenABI, signer);
    const klaytnEduMetaToken= new ethers.Contract(contractAddress, KaiaEduMetaTokenABI, signer);
    //console.log(klaytnEduMetaToken)
    //klaytnEduMetaToken = myContract.connect(signer);
    console.log("Signer address : " + signer.address);
    console.log("Private key : " + privateKey);
    const address = await klaytnEduMetaToken.getAddress();
    console.log("Contract address : " + address);
    console.log("Amount : " + amount);

    // The following two statements are same. You can use both of them for your own preference.
    //const tx = await klaytnEduMetaToken.mint(account, amount);
    const tx = await klaytnEduMetaToken.connect(signer)["mint(address, uint256)"](account, amount);
    console.log(tx);
}

async function getCode(ca) {
    const tx = await provider.getCode(ca);
    console.log(tx);
}

async function main() {
    //getCode(contractAddress)
    // Send Transaction
    mint(1000000000000000000000n) //1000 EMT
}

main()
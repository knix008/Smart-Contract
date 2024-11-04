const { JsonRpcProvider, Wallet } = require("@kaiachain/ethers-ext");
const { ethers } = require("ethers");
require('dotenv').config()

const provider = new JsonRpcProvider("http://127.0.0.1:8545/")

const privKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privKey, provider);
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // PASTE DEPLOYED CONTRACT ADDRESS;

const KaiaGreeterABI = require("../artifacts/contracts/KaiaGreeter.sol/KaiaGreeter.json").abi;

async function getCode(ca) {
    const tx = await provider.getCode(ca);
    console.log(tx);
}

async function greet(ca) {
    const klaytnGreeter = new ethers.Contract(ca, KaiaGreeterABI, signer);
    const tx = await klaytnGreeter.greet();
    console.log( tx);
}

async function getTotalGreetings(ca) {
    const klaytnGreeter = new ethers.Contract(ca, KaiaGreeterABI, provider);
    const value = await klaytnGreeter.getTotalGreetings();
    console.log(value.toString());
}

getCode(contractAddress);
getTotalGreetings(contractAddress);
greet(contractAddress);

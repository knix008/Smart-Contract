const fs = require('fs')
require('dotenv').config()

async function getWeb3() {
    const { Web3 } = require('web3')
    // We will use Ganache GUI. Run it first before you run this program.
    httpProvider = new Web3.providers.HttpProvider(process.env.L1RPC)
    //const web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.L1RPC}`))
    const web3 = new Web3(httpProvider)
    console.log("PRC Address : " + process.env.L1RPC)
    return web3
}

// Create getOrder function
async function mint(web3, token) {
    // Import the contract file
    const contractJsonFile = fs.readFileSync('../artifacts/contracts/EduMetaToken.sol/EduMetaToken.json')
    const contract = JSON.parse(contractJsonFile)

    // Create address variables
    const accountFrom = {
        privateKey: process.env.privatekey,
        address: process.env.account,
    }
    // Create address variables
    const contractAddress = process.env.contractaddress
    // Get the bytecode and API
    const abi = contract.abi;
    //console.log(abi)
    // Create contract instance
    const contractInst = new web3.eth.Contract(abi, contractAddress)
    //console.log(contractInst)
    console.log('Calling the mint function in contract at address : ' + contractAddress)
    //console.log(accountFrom.address);

    // Sign Tx with PK
    const mintTx = contractInst.methods.mint(accountFrom.address, token);
    //console.log(mintTx)
    console.log('Using account address : ' + accountFrom.address);
    // Create Transaction
    console.log('Signling Private Key : ' + accountFrom.privateKey);

    const tx = await web3.eth.accounts.signTransaction({
        from: accountFrom.address,
        to: contractAddress,
        data: mintTx.encodeABI(),
        maxFeePerGas: 250000000000,
        maxPriorityFeePerGas: 250000000000,
        // If you don't specify any gas here, it will be automatically calculated and used.
        //gas: 210000,
        //gas: mintTx.estimateGas()
    }, accountFrom.privateKey);
    console.log("Make transaction done!!!");

    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(receipt);
};

async function main() {
    let web3 = await getWeb3()
    if (web3 == null) {
        console.log('Cannot connect the Web3 provider!!!')
        exit()
    }
    //getOwner(web3);
    // Send Transaction
    mint(web3, 1000000000000000000000); //1000 EMT
}

main()
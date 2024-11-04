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

// Get the contract owner.
async function getOwner(web3) {
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
    console.log('Calling the owner function in contract at address : ' + contractAddress)

    // Sign Tx with PK
    const ownerTx = contractInst.methods.owner()
    //console.log(mintTx)
    console.log('Using account address :' + accountFrom.address)
    // Create Transaction
    console.log('Signling Private Key : ' + accountFrom.privateKey)

    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: accountFrom.address,
            to: contractAddress,
            data: ownerTx.encodeABI(),
            //gas: await ownerTx.estimateGas(),
            maxFeePerGas: 250000000000,
            maxPriorityFeePerGas: 250000000000,
        },
        accountFrom.privateKey
    );
    console.log('Signing Done!!!')

    // Send Tx and Wait for Receipt
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
    console.log(createReceipt)
    // Just call the Smart contract method and get the result from it.
    result = await contractInst.methods.owner().call()
    console.log(result)
};

async function main() {
    let web3 = await getWeb3()
    if (web3 == null) {
        console.log('Cannot connect the Web3 provider!!!')
        exit()
    }
    getOwner(web3);
}

main()
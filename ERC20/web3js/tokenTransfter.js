const fs = require('fs')
require('dotenv').config()

async function getWeb3() {
    const { Web3 } = require('web3')
    // We will use Ganache GUI. Run it first before you run this program.
    const web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.L1RPC}`))
    console.log("PRC Address Key : " + `${process.env.L1RPC}`)
    console.log("Private Key : " + `${process.env.privateKey}`)
    return web3
}

async function getAccounts(web3) {
    return await web3.eth.getAccounts()
}

// Create getOrder function
async function transfer(web3, account, token) {
    // Import the contract file
    const contractJsonFile = fs.readFileSync('../build/contracts/MyERC20Token.json')
    const contract = JSON.parse(contractJsonFile)
    const fromAddress = account
    console.log(`The address : ${fromAddress}`)

    // Create address variables
    const accountFrom = {
        privateKey: `${process.env.privateKey}`,
        address: fromAddress,
    }
    // Create address variables
    const contractAddress = `${process.env.contractaddress}`
    // Get the bytecode and API
    const abi = contract.abi;
    // Create contract instance
    const contractInst = new web3.eth.Contract(abi, contractAddress)
    console.log(`Calling the transfer function in contract at address: ${contractAddress}`)
    // Get the Tx count
    let txCount = await web3.eth.getTransactionCount(accountFrom.address)
    console.log(txCount)

    // Sign Tx with PK
    const transferTx = contractInst.methods.transfer(fromAddress, token);
    console.log('Contract Instance Done!!!')
    // Create Transaction
    console.log('Signling Private Key : ' + accountFrom.privateKey)
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            nonce: txCount,
            to: contractAddress,
            data: transferTx.encodeABI(),
            gasLimit: '0x520812',
            gasPrice: '0x09184e72a000',
            //gas: await transferTx.estimateGas(),
            //maxPriorityFeePerGas: 1,
            //maxFeePerGas: 875000000,
        },
        accountFrom.privateKey
    );
    console.log('Signing Done!!!')

    // Send Tx and Wait for Receipt
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`)
};

async function main() {
    let web3 = await getWeb3()
    let accounts = await getAccounts(web3)
    console.dir(accounts[1])

    // Send Transaction
    transfer(web3, accounts[1], 10000000000000000000) //10 MTK
}

main()
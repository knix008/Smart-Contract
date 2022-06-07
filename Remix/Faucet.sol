// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

contract owned {
    address payable owner;
    uint balance;
    
    // Contract constructor: set owner
    constructor() {
        owner = payable(msg.sender);
    }
    // Access control modifier
    modifier onlyOwner {
        require(msg.sender == owner,
            "Only the contract owner can call this function");
        _;
    }
 }

 contract mortal is owned {
    //Contract destructor
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
 }

 contract Faucet is mortal {
    event Withdrawal(address indexed to, uint amount);
    event Deposit(address indexed from, uint amount);
    event Received(address indexed from, uint amount);

    // Give out ether to anyone who asks
    function withdraw(uint withdraw_amount) public {
        // Limit withdrawal amount
        require(withdraw_amount <= 0.1 ether);
        require(address(this).balance >= withdraw_amount,
            "Insufficient balance in faucet for withdrawal request");
        // Send the amount to the address that requested it
        payable(msg.sender).transfer(withdraw_amount);
        emit Withdrawal(msg.sender, withdraw_amount);
    }
 
     receive() external payable {
        emit Received(msg.sender, msg.value);
    }
    // Accept any incoming amount
    fallback() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
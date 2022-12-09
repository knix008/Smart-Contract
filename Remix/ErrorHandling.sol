pragma solidity ^0.5.0;

contract Vendor {
   address public seller;
   modifier onlySeller() {
      require(
         msg.sender == seller,
         "Only seller can call this."
      );
      _;
   }
   function sell(uint amount) public payable onlySeller { 
      if (amount > msg.value / 2 ether)
         revert("Not enough Ether provided.");
      // Perform the sell operation.
   }
}


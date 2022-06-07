pragma solidity ^0.5.0;

contract SolidityTest {   
   uint public balance = 100;
   constructor() public{       
   }
   function getResult() public pure returns(string memory){
      uint a = 1; 
      uint b = 2;
      uint result = a + b;
      return integerToString(result); 
   }
   function integerToString(uint _i) internal pure returns (string memory) {
      
      if (_i == 0) {
         return "0";
      }
      uint j = _i;
      uint len;
      
      while (j != 0) {
         len++;
         j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len - 1;
      
      while (_i != 0) {
         bstr[k--] = byte(uint8(48 + _i % 10));
         _i /= 10;
      }
      return string(bstr);//access local variable
   }
}
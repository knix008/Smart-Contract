pragma solidity ^0.5.0;
contract SolidityTest {
    uint storedData;
   constructor() public{
       storedData = 10;
   }
   function getResult() public view returns(uint){
      //uint a = 1;
      //uint b = 2;
      //uint result = a + b;
      return storedData;
   }
}

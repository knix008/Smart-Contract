// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

contract test {
   enum FreshJuiceSize{ SMALL, MEDIUM, LARGE }
   FreshJuiceSize choice;
   FreshJuiceSize constant defaultChoice = FreshJuiceSize.MEDIUM;

   function setLarge() public {
      choice = FreshJuiceSize.LARGE;
   }
   function getChoice() public view returns (FreshJuiceSize) {
      return choice;
   }
   function getDefaultChoice() public pure returns (uint) {
      //defaultChoice = FreshJuiceSize.SMALL;
      return uint(defaultChoice);
   }
}
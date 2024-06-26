// SPDX-License-Identifier: No License
pragma solidity ^0.8.26;

contract Simple{
    uint256 count;
    
    function add() public pure returns (uint256){
        uint256 a;
        uint256 b;

        return a + b;
    }

    function getCount() public view returns (uint256){
        return count;
    }

    function addOne() public {
        count++;
    }
}

pragma solidity ^0.4.25;

contract Incrementer {
    uint256 public count;
    function addOne() public {
        count++;
    }
}


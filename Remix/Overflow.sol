pragma solidity ^0.4.8;

contract Overflow{
    uint z;
    
    function x() public returns (uint y){
        z = 2**256 - 1;
        return z+1;
    }
}
pragma solidity ^0.5.0;

contract TimeReporter{
    event Timelog(uint256 time);
    function reportTime() public{
        for(uint8 i = 0; i < 10; i++ ){
            emit Timelog(block.timestamp);
        }
    }
}

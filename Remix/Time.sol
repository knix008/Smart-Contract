pragma solidity ^0.5.0;

contract TimeReporter {
    event TimeLog(uint256 time);
    function reportTime() public {
        for (uint8 i = 0; i < 10; i++) {
            emit TimeLog(block.timestamp);
        }
    }
}
pragma solidity ^0.5.0;

contract SimpleCoin {
    mapping (address => uint256) public coinBalance;
    
    constructor() public {
        coinBalance[0x5B38Da6a701c568545dCfcB03FcB875f56beddC4] = 10000;
    }
    
    function transfer(address _to, uint256 _amount) public {
        coinBalance[msg.sender] -= _amount;
        coinBalance[_to] += _amount;
    }
}
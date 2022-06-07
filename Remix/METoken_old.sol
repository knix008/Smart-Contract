// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract METoken is ERC20 {
    uint constant _initial_supply = 1000000;

    constructor() public ERC20("Mastering Ethereum Blockchain", "MET"){ // Name, Symbol
        _setupDecimals(2); // Decimals
        _mint(msg.sender, _initial_supply);
        emit Transfer(address(0), msg.sender, _initial_supply);
    }
}
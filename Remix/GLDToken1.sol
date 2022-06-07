// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GLDToken is ERC20 {
    constructor() ERC20("MEGA", "MEG") {
        uint256 initialSupply = 1000000;
        _mint(msg.sender, initialSupply);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleERC20Token is ERC20 {
    constructor() ERC20("MEGA", "MEG") {
        _mint(msg.sender, 1000000000);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}

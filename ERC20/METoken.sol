// SPDX-License-Identifier: MIT
pragma solidity <=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract METoken is ERC20 {
    uint constant _initial_supply = 1000000;

    constructor() ERC20("MyToken", "MET"){ // Name, Symbol
        _mint(msg.sender, _initial_supply);
        emit Transfer(address(0), msg.sender, _initial_supply);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}

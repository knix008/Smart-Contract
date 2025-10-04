// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev ERC20 Token with minting, burning, and ownership features
 */
contract MyToken is ERC20, ERC20Burnable, Ownable {
    // Maximum supply cap (optional - remove if unlimited supply needed)
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens

    /**
     * @dev Constructor that gives msg.sender all of initial tokens
     * @param initialSupply Initial token supply (in whole tokens, will be multiplied by 10^18)
     */
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") Ownable(msg.sender) {
        require(initialSupply * 10**18 <= MAX_SUPPLY, "Initial supply exceeds max supply");
        _mint(msg.sender, initialSupply * 10**18);
    }

    /**
     * @dev Mint new tokens (only owner can call)
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint (in whole tokens)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount * 10**18 <= MAX_SUPPLY, "Minting would exceed max supply");
        _mint(to, amount * 10**18);
    }

    /**
     * @dev Override decimals to return 18 (default)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}

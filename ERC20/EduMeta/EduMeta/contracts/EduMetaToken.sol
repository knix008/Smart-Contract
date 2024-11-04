// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@kaiachain/contracts/KIP/token/KIP7/KIP7.sol";
import "@kaiachain/contracts/KIP/token/KIP7/extensions/KIP7Burnable.sol";
import "@kaiachain/contracts/security/Pausable.sol";
import "@kaiachain/contracts/access/Ownable.sol";

contract EduMetaToken is KIP7, KIP7Burnable, Pausable, Ownable {
    constructor() KIP7("EduMeta", "EMT"){}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(KIP7, KIP7Burnable)
        returns (bool)
    {
        return
            super.supportsInterface(interfaceId);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}

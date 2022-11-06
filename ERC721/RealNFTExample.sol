// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address payable public _owner;
    mapping(uint256 => bool) public sold;
    mapping(uint256 => uint256) public price;

    event Purchase(address owner, uint256 price, uint256 id, string uri);

    constructor() ERC721("YOUR TOKEN", "TOKEN") {
        _owner = payable(msg.sender);
    }

    function mint(string memory _tokenURI, uint256 _price) public onlyOwner returns (bool) {
        _tokenIds.increment();
        price[_tokenIds.current()] = _price;
        _mint(address(this), _tokenIds.current());
        _setTokenURI(_tokenIds.current(), _tokenURI);
        return true;
    }

    function buy(uint256 _id) external payable {
        _validate(_id);
        _trade(_id);
        emit Purchase(msg.sender, price[_id], _id, tokenURI(_id));
    }

    function _validate(uint256 _id) internal {
        require(_exists(_id), "Error, wrong Token id");
        require(!sold[_id], "Error, Token is sold");
        require(msg.value >= price[_id], "Error, Token costs more");
    }

    function _trade(uint256 _id) internal {
        _transfer(address(this), msg.sender, _id);
        _owner.transfer(msg.value);
        sold[_id] = true;
    }
}

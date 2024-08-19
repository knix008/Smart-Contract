// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Greeter {
    string private _greeting = "Hello, World!";
    address private _owner;

    function greet() external view returns (string memory) {
        return _greeting;
    }

    function setGreeting(string calldata greeting) public {
        _greeting = greeting;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

/**
 * @title MyToken
 * @dev A simple ERC-20 token implementation
 * @notice This token contract demonstrates basic ERC-20 functionality
 */
contract MyToken {
    // Token metadata
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    // Owner of the contract
    address public owner;
    
    // Mapping for balances
    mapping(address => uint256) public balanceOf;
    
    // Mapping for allowances
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _decimals Token decimals
     * @param _initialSupply Initial token supply
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10**_decimals;
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
        
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    /**
     * @dev Transfer tokens to a specified address
     * @param _to Address to transfer to
     * @param _value Amount to transfer
     * @return success True if transfer was successful
     */
    function transfer(address _to, uint256 _value) public validAddress(_to) returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Cannot transfer to zero address");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another
     * @param _from Address to transfer from
     * @param _to Address to transfer to
     * @param _value Amount to transfer
     * @return success True if transfer was successful
     */
    function transferFrom(address _from, address _to, uint256 _value) public validAddress(_to) returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        require(_to != address(0), "Cannot transfer to zero address");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    /**
     * @dev Approve spender to transfer tokens on behalf of the caller
     * @param _spender Address to approve
     * @param _value Amount to approve
     * @return success True if approval was successful
     */
    function approve(address _spender, uint256 _value) public validAddress(_spender) returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param _to Address to mint tokens to
     * @param _value Amount to mint
     */
    function mint(address _to, uint256 _value) public onlyOwner validAddress(_to) {
        totalSupply += _value;
        balanceOf[_to] += _value;
        
        emit Mint(_to, _value);
        emit Transfer(address(0), _to, _value);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     * @param _value Amount to burn
     */
    function burn(uint256 _value) public {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance to burn");
        
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        
        emit Burn(msg.sender, _value);
        emit Transfer(msg.sender, address(0), _value);
    }
    
    /**
     * @dev Burn tokens from a specific address (only owner)
     * @param _from Address to burn tokens from
     * @param _value Amount to burn
     */
    function burnFrom(address _from, uint256 _value) public onlyOwner validAddress(_from) {
        require(balanceOf[_from] >= _value, "Insufficient balance to burn");
        
        balanceOf[_from] -= _value;
        totalSupply -= _value;
        
        emit Burn(_from, _value);
        emit Transfer(_from, address(0), _value);
    }
    
    /**
     * @dev Get token information
     * @return tokenName Token name
     * @return tokenSymbol Token symbol
     * @return tokenDecimals Token decimals
     * @return tokenTotalSupply Total token supply
     */
    function getTokenInfo() public view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply
    ) {
        return (name, symbol, decimals, totalSupply);
    }
    
    /**
     * @dev Get account balance and allowance
     * @param _account Account address
     * @param _spender Spender address
     * @return balance Account balance
     * @return allowedAmount Allowed amount for spender
     */
    function getAccountInfo(address _account, address _spender) public view returns (
        uint256 balance,
        uint256 allowedAmount
    ) {
        return (balanceOf[_account], allowance[_account][_spender]);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// These files are dynamically created at test time
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MyCoin.sol";

contract TestMyCoin {

  function testInitialBalanceUsingDeployedContract() public {
    MyCoin my = MyCoin(DeployedAddresses.MyCoin());

    uint expected = 10000;

    Assert.equal(my.getBalance(tx.origin), expected, "Owner should have 10000 MyCoin initially");
  }

  function testInitialBalanceWithNewMyCoin() public {
    MyCoin my = new MyCoin();

    uint expected = 10000;

    Assert.equal(my.getBalance(tx.origin), expected, "Owner should have 10000 MyCoin initially");
  }

}

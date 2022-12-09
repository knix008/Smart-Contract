pragma solidity ^0.5.0;

contract Test {
   uint public x ;
   function() external { x = 1; }    
}
contract Sink {
   function() external payable { }
}
contract Caller {
   function callTest(Test test) public returns (bool) {
      (bool success,) = address(test).call(abi.encodeWithSignature("nonExistingFunction()"));
      require(success);
      // test.x is now 1

      address payable testPayable = address(uint160(address(test)));

      // Sending ether to Test contract,
      // the transfer will fail, i.e. this returns false here.
      return (testPayable.send(2 ether));
   }
   function callSink(Sink sink) public returns (bool) {
      address payable sinkPayable = address(sink);
      return (sinkPayable.send(2 ether));
   }
}



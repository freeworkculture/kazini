pragma solidity ^0.4.19;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DoersFactory.sol";

contract TestDoersFactory {

  function testNewDoerContractUsingDeployedContract() public {

    DoersFactory able = DoersFactory(DeployedAddresses.Able());

    DoersFactory userbase = DoersFactory(DeployedAddresses.UserBase());

    DoersFactory creator = DoersFactory(DeployedAddresses.Creators());

    DoersFactory factory = DoersFactory(DeployedAddresses.DoersFactory());

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin, "_fPrint", "_idNumber", "_email", "_fName", "_lName", "_keyId", "_data", 10), expected, "Owner should have 10000 MetaCoin initially");
  }

  function testInitialBalanceWithNewMetaCoin() public {
    MetaCoin meta = new MetaCoin();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  }

}
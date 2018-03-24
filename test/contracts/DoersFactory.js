const Able = artifacts.require("Able");
const Userbase = artifacts.require("Userbase");
const Creators = artifacts.require("Creators");
const Doers = artifacts.require("DoersFactory");

const ERROR_REVERT = "VM Exception while processing transaction: revert";
const ERROR_INVALID = 'VM Exception while processing transaction: invalid opcode';
const _CONTRACTNAME = "DOERSFACTORY 0.0118"

contract("Doers", function([owner,controller,doer,creator,curator,msgOrigin,msgSender]) {
  var creators;
  var doers;
  var _CONTRACTNAME_ = "0x444f455220302e30313138000000000000000000000000000000000000000000";

  it("should deploy the Doers Factory contract and get it's 'CONTRACTNAME'", function() {
    return DoersFactory.deployed().then(function(instance) {
      factory = instance;
      console.log(factory.address.toString(10));

      // Unit Test: CONTRACTNAME
      return doers.CONTRACTNAME.call();
      }).then(function(cname) {
        assert.equal(cname, _CONTRACTNAME_);
      });
    });
});

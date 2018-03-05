const Doers = artifacts.require("Doers");
const Oraclize = require("usingOraclize");

function assertThrow(err, test, msg) {
  if (err.toString().indexOf(test) != -1) {
    assert(true, msg);
  } else {
    assert(false, err.toString())
  }
}

contract("Doers", function(accounts) {
  it("should set the trustee", function() {
    var contract;
    return Doers.deployed().then(function(instance) {
      contract = instance;
      return contract.getTrustee.call();
    }).then(function(trustee) {
      assert.equal(trustee, accounts[0]);
    }).then(function() {
      return contract.getDoerCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  it("should validate doers", function() {
    var contract;
    return Doers.deployed().then(function(instance) {
      contract = instance;
      return contract.isDoer.call(accounts[0]);
    }).then(function(bool) {
      assert.equal(bool, true);
    }).then(function() {
      return contract.isDoer.call(accounts[1]);
    }).then(function(bool) {
      assert.equal(bool, false);
    });
  });

  it("should only let the trustee add doers", function() {
    var contract;
    return Doers.deployed().then(function(instance) {
      contract = instance;
      return contract.addDoer(accounts[1], {from: accounts[0]});
    }).then(function() {
      return contract.getDoerCount.call();
    }).then(function(count) {
      assert.equal(count, 2);
    }).then(function() {
      return contract.addDoer(accounts[2], {from: accounts[1]});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.getDoerCount.call();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

});

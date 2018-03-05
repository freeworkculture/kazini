var Doers = artifacts.require("./Doers.sol");
var DoPromise = artifacts.require("./DoPromise.sol");

function assertThrow(err, test, msg) {
  if (err.toString().indexOf(test) !== -1) {
    assert(true, msg);
  } else {
    assert(false, err.toString())
  }
}

contract("DoPromise", function(accounts) {
  it("should set deployer and doers", function() {
    var contract;
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.getDeployer.call();
    }).then(function(addr) {
      assert.equal(addr, accounts[0]);
    }).then(function() {
      return contract.getDoers.call();
    }).then(function(addr) {
      assert.equal(addr, Doers.address);
    });
  });

  it("should initially not have any promises", function() {
    var contract;
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.getPromiseCount.call();
    }).then(function(count) {
      assert.equal(count, 0);
    });
  });

  it("should initially not have any fulfillments", function() {
    var contract;
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.getFulfillmentCount.call();
    }).then(function(count) {
      assert.equal(count, 0);
    });
  });

  it("should only let doers promise something", function() {
    var contract;
    var timestamp = Math.round(new Date().getTime()/1000);
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
    }).then(function() {
      return contract.getPromiseCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
    }).then(function() {
      return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.getPromiseCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  it("should only accept promises in the future", function() {
    var contract;
    var timestamp = Math.round(new Date().getTime()/1000);
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.promise("baz", timestamp - 1, {from: accounts[0], value: 1});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.getPromiseCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
      assert.equal(web3.eth.getBalance(contract.address), 1);
    });
  });

  it("should only accept promises of more than 0 Wei", function() {
    var contract;
    var timestamp = Math.round(new Date().getTime()/1000);
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.promise("baz", timestamp + 1, {from: accounts[0], value: 0});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.getPromiseCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  it("should only let doers fulfill a promise", function() {
    var contract;
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.fulfill("foo", "123", {from: accounts[0]});
    }).then(function() {
      return contract.getFulfillmentCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
    }).then(function() {
      return contract.fulfill("foo", "123", {from: accounts[2]});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.getFulfillmentCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  it("should only allow fulfillment of existing promises", function() {
    var contract;
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.fulfill("bar", "123", {from: accounts[0]});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.getFulfillmentCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  it("should only allow fulfillment within expiry", function() {
    var contract;
    var timestamp = Math.round(new Date().getTime()/1000);
    return DoPromise.deployed().then(function(instance) {
      contract = instance;
      return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
    }).then(function() {
      // Wait past the promise expiry time.
      var ms = new Date().getTime();
      while(new Date().getTime() < ms + 1500){ /* do nothing */ }
      // Fulfill promise too late.
      return contract.fulfill("foo", "123", {from: accounts[0]});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.getPromiseCount.call();
    }).then(function(count) {
      assert.equal(count, 2);
      assert.equal(web3.eth.getBalance(contract.address), 2);
    }).then(function() {
      return contract.getFulfillmentCount.call();
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });
});
var BaseController = artifacts.require("BaseController");

function assertThrow(err, test, msg) {
  if (err.toString().indexOf(test) != -1) {
    assert(true, msg);
  } else {
    assert(false, err.toString())
  }
}

contract("Able", function([owner]) {
  let isAble
  beforeEach('setup contract for each test', async function () {
    isAble = await Able.new(owner)
  })
  it('has an owner', async function () {
    assert.equal(await Able.owner(), owner)
  })
  it("set the owner, contrl & controller", function() {
    var contract;
    return BaseController.deployed().then(function(instance) {
      contract = instance;
      return contract.owner.call();
    }).then(function(owner) {
      assert.equal(owner, address[0]);
    }).then(function() {
      return contract.getContrl.call();
    }).then(function(contrl) {
      assert.equal(contrl, address[1]);
    }).then(function() {
      return contract.controller.call();
    }).then(function(controller) {
      assert.equal(controller, address[2]);
    });
  });

  it("change the owner, contrl & controller", function() {
    var contract;
    return BaseController.deployed().then(function(instance) {
      contract = instance;
      return contract.changeOwner(accounts[1], {from: accounts[0]});
    }).then(function() {
      return contract.owner.call();
    }).then(function(owner) {
      assert.equal(owner, address[1]);
    }).then(function() {
      return contract.changeOwner(accounts[2], {from: accounts[0]});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.changeContrl(accounts[1], {from: accounts[0]});
    }).then(function() {
      return contract.getContrl().call();
    }).then(function() {
      assert.equal(owner, address[1]);
    }).then(function() {
      return contract.changeOwner(accounts[2], {from: accounts[0]});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    }).then(function() {
      return contract.changeOwner(accounts[2], {from: accounts[0]});
    }).catch(function(err) {
      assertThrow(err, "invalid opcode");
    });
  });

  it("changes the owner, contrl & controller", function() {
    var contract;
    return BaseController.deployed().then(function(instance) {
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

  it("should set the controller", function() {
    var contract;
    return BaseController.deployed().then(function(instance) {
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
    return IronDoers.deployed().then(function(instance) {
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



});


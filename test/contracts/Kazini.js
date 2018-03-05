var Doers = artifacts.require("./Doers.sol");
var DoPromise = artifacts.require("./DoPromise.sol");
const contractName = '0x4461746162617365000000000000000000000000000000000000000000000000'
const keyId = 0x9BCB2540EBAC30FC9E9EFF3D259B64A2
const Base = 2;
const _intention = '_intention_';
const _serviceId = '_serviceId_';
const _preCondition = '_preCondition_';
const _goal = '_goal_';
const _status = true;
const _postCondition = [_goal,_status];
const _time =  0;
const _budget = 1000;
const _projectUrl = '_projectUrl_';
const _state = 2;
const _preQualification = '_preQualification_';

function assertThrow(err, test, msg) {
  if (err.toString().indexOf(test) !== -1) {
    assert(true, msg);
  } else {
    assert(false, err.toString())
  }
}

contract("DoPromise", function(accounts) {

  var _intention_ = 'intention_';
  var _serviceId_ = 'serviceId_';
  var _preCondition_ = '0x5f707265436f6e646974696f6e5f000000000000000000000000000000000000';
  var _goal_ = '0x5f676f616c5f0000000000000000000000000000000000000000000000000000';
  var _status_ = true;
  var _postCondition_ = [_goal_,_status_];
  let _time_ =  0;
  let _budget_ = 1000;
  var _projectUrl_ = '0x5f70726f6a65637455726c5f0000000000000000000000000000000000000000';
  let _state_ = 2;
  var _preQualification_ = 'preQualification_';

  it("should initialise plans", function() {
    var timestamp = Math.round(new Date().getTime()/1000);
    var goal_;
    var status_;
    var preCondition_;
    var time_;
    var budget_;
    var projectUrl_;
    var creator_;
    var curator_; 
    return Database.deployed().then(function(instance) {
      database = instance;
      return database.initPlan(
        _intention,_serviceId,_preCondition,_goal,_status,_projectUrl,creator,_preQualification,
        {from: creator, value: 1});
      }).then(function() {
        return database.planState(_intention);
      }).then(function(state_) {
        assert.equal(state_, _state_);
      }).then(function() {
        return database.planGoal(_intention);
      }).then(function(postcondition_) {
        goal_ = postcondition_[0];
        status_ = postcondition_[1];
      }).then(function() {
        assert.equal(goal_, _goal_);
      }).then(function() {
        assert.equal(status_, _status_);
      }).then(function() {
        return database.planProject(_intention);
      }).then(function(project_) {
        preCondition_ = project_[0];
        time_ = project_[1].toNumber();
        // console.log(time_.toString(10));
        budget_ = project_[2].toNumber();
        // console.log(budget_.toString(10));
        projectUrl_ = project_[3];
        creator_ = project_[4];
        curator_ = project_[5];
      }).then(function() {
        assert.equal(preCondition_, _preCondition_);
      }).then(function() {
        assert.equal(time_, _time_);
      }).then(function() {
        assert.equal(budget_, _budget_);
      }).then(function() {
        assert.equal(projectUrl_, _projectUrl_);
      }).then(function() {
        assert.equal(creator_, creator);
      }).then(function() {
        assert.equal(curator_, 0);
      });
    });
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
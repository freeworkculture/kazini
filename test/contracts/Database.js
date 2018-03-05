const Able = artifacts.require("Able");
const Database = artifacts.require("Database");

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

contract("Database", function([msgOrigin,msgSender,newOwner,newController,storedContract,creator,curator,doer]) {

  var database;

  it("should get the contract'S constants: 'contractname' and 'BASE'", function() {
    return Database.deployed().then(function(instance) {
      database = instance;
      return database.cName.call();
    }).then(function(cname) {
      assert.equal(cname, contractName);
    }).then(function() {
      return database.getBase.call();
    }).then(function(base) {
      assert.equal(base, Base);
    })
  });
  it("constructor should set cName 'bytes32', 'owner', 'controller' and contrl address", function() {
    return Database.deployed().then(function(instance) {
      database = instance;
      return database.cName.call();
    }).then(function(cname) {
      assert.equal(cname, contractName);
    }).then(function() {
      return database.owner.call();
    }).then(function(addr) {
      assert.equal(addr, msgOrigin);
    }).then(function() {
      return database.controller.call();
    }).then(function(addr) {
      assert.equal(addr, Able.address);
    }).then(function() {
      return database.contrl.call();
    }).then(function(addr) {
      assert.equal(addr, Able.address);
    });
  });

  it("should initially not have any plans, promises, orders, fulfillments or verifications", function() {
    return Database.deployed().then(function(instance) {
      database = instance;
      return database.plansCount.call();
    }).then(function(count) {
      assert.equal(count, 0);
    }).then(function() {
      return database.promiseCount.call();
    }).then(function(count) {
      assert.equal(count, 0);
    }).then(function() {
      return database.orderCount.call();
    }).then(function(count) {
      assert.equal(count, 0);
    }).then(function() {
      return database.fulfillmentCount.call();
    }).then(function(count) {
      assert.equal(count, 0);
    }).then(function() {
      return database.verificationCount.call();
    }).then(function(count) {
      assert.equal(count, 0);
    });
  });
});
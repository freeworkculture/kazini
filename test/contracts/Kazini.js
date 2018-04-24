const Kazini = artifacts.require("Kazini");
const Database = artifacts.require("Database");
const Userbase = artifacts.require("Userbase");

const contractName = 'KAZINI 0.0118'
const keyId = 0x9BCB2540EBAC30FC9E9EFF3D259B64A2
const Base = 2;
const _intention = '_intention_';
const _serviceId = '_serviceId_';
const _preQualification = '_preQualification_';

const _state = 2;
const _preCondition = '_preCondition_';
const _time =  0;
const _budget = 1000;
const _goal = '_goal_';
const _status = true;
const _postCondition = [_goal,_status];
const _projectUrl = '_projectUrl_';
const _services = [_preCondition, _time, _budget, _projectUrl]; // key is XOR map of doer
var _experience;
var	_reputation;
var _talent;
var _index;
var _hash;
var _merit = [_experience, _reputation, _talent, _index, _hash];
var _country; //ISO3166-2:KE-XX;
var _cAuthority;
var _score;
var _qualification = [_country, _cAuthority, _score];
var _timeSoft;  // preferred timeline
var _expire;
var _hash;
var _serviceUrl;
var _metas = [_timeSoft, _expire, _hash, _serviceUrl];
var _Sig;
var _V;
var _R;
var _S;
var _order = [_Sig, _V, _R, _S];
var _procure; // key is address of doer
var _stateI;
var _service;
var _payout;
var _timeHard;   // proposed timeline
var _hash;
var _promise = [_stateI, _service, _payout, _timeHard, _hash];
var _proof;
var _rubric;
var _timestamp;
var _hash;
var _fulfillment = [_proof, _rubric, _timestamp, _hash];
var _verity;
var _complete;
var _timestamp;
var _hash;
var _verification = [_verity, _complete, _timestamp, _hash]; // key is hash of fulfillment

function assertThrow(err, test, msg) {
  if (err.toString().indexOf(test) !== -1) {
    assert(true, msg);
  } else {
    assert(false, err.toString())
  }
}

contract("Kazini", function([msgOrigin,msgSender,newOwner,newController,storedContract,creator,curator,doer]) {
  var kazini;

  var _intention_ = 'intention_';
  var _serviceId_ = 'serviceId_';
  var _preQualification_ = 'preQualification_';

  let _state_ = 2;
  var _preCondition_ = '0x5f707265436f6e646974696f6e5f000000000000000000000000000000000000';
  let _time_ =  0;
  let _budget_ = 1000;
  var _goal_ = '0x5f676f616c5f0000000000000000000000000000000000000000000000000000';
  var _status_ = true;
  var _postCondition_ = [_goal,_status];
  var _projectUrl_ = '0x5f70726f6a65637455726c5f0000000000000000000000000000000000000000';
  var _services_ = [_preCondition, _time, _budget, _projectUrl]; // key is XOR map of doer
  let _experience_;
  var	_reputation_;
  var _talent_;
  let _index_;
  var _hash_;
  var _merit_ = [_experience, _reputation, _talent, _index, _hash];
  var _country_; //ISO3166-2:KE-XX;
  var _cAuthority_;
  var _score_;
  var _qualification_ = [_country, _cAuthority, _score];
  let _timeSoft_;  // preferred timeline
  let _expire_;
  var _hash_;
  var _serviceUrl_;
  var _metas_ = [_timeSoft, _expire, _hash, _serviceUrl];
  var _Sig_;
  let _V_;
  var _R_;
  var _S_;
  var _order_ = [_Sig, _V, _R, _S];
  var _procure_; // key is address of doer
  let _stateI_;
  var _service_;
  let _payout_;
  let _timeHard_;   // proposed timeline
  var _hash_;
  var _promise_ = [_stateI, _service, _payout, _timeHard, _hash];
  var _proof_;
  var _rubric_;
  let _timestamp_;
  var _hash_;
  var _fulfillment_ = [_proof, _rubric, _timestamp, _hash];
  var _verity_;
  var _complete_;
  var _timestampV_;
  var _hash_;
  var _verification_ = [_verity, _complete, _timestamp, _hash]; // key is hash of fulfillment

  it("should get the contract'S constants: 'contractname' and 'BASE'", function() {
    return Kazini.deployed().then(function(instance) {
      kazini = instance;
      return kazini.cName.call();
    }).then(function(cname) {
      assert.equal(cname, contractName);
    }).then(function() {
      return kazini.getBase.call();
    }).then(function(base) {
      assert.equal(base, Base);
    })
  });
  
  it("should initialise plans", function() {
    var timestamp = Math.round(new Date().getTime()/1000);
    return Kazini.deployed().then(function(instance) {
      kazini = instance;
      return kazini.initPlan(
        _intention,_serviceId,_preCondition,_goal,_status,_projectUrl,creator,_preQualification,
        {from: creator, value: 1});
      }).then(function() {
        return kazini.planState(_intention);
      }).then(function(state_) {
        assert.equal(state_, _state_);
      }).then(function() {
        return kazini.planGoal(_intention);
      }).then(function(postcondition_) {
        goal_ = postcondition_[0];
        status_ = postcondition_[1];
      }).then(function() {
        assert.equal(goal_, _goal_);
      }).then(function() {
        assert.equal(status_, _status_);
      }).then(function() {
        return kazini.planProject(_intention);
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
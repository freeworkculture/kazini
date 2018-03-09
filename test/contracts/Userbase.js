const Able = artifacts.require("Able");
// const Kazini = artifacts.require("Kazini");
// const Database = artifacts.require("Database");
const Userbase = artifacts.require("Userbase");
const ERROR_REVERT = "VM Exception while processing transaction: revert";
const ERROR_INVALID = 'VM Exception while processing transaction: invalid opcode';

function assertThrow(err, test, msg) {
  if (err.toString().indexOf(test) !== -1) {
    assert(true, msg);
  } else {
    assert(false, err.toString())
  }
}

const contractName = 'USERBASE 0.0118'
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
const _talent = "DEFAULT TALENT";
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
var _timestampV;
var _hash;
var _verification = [_verity, _complete, _timestamp, _hash]; // key is hash of fulfillment
const _plansCount = 0;
const _promiseCount = 0;
const _orderCount = 0;
const _fulfillmentCount = 0;
const _verificationCount = 0;
const _doerCount = 0;
const _talentK = 0;
const _talentI = 0;
const _talentR = 0;
const _talentF = 0;
const _talentAll = [_talentK, _talentI, _talentR, _talentF];
const _doerskeyId = 0x93D259B6BCAC30FCB2540EB9E9EFF4A2

function assertThrow(err, test, msg) {
  if (err.toString().indexOf(test) !== -1) {
    assert(true, msg);
  } else {
    assert(false, err.toString())
  }
}

contract("Userbase", function([msgOrigin,msgSender,newOwner,newController,storedContract,Controller,creator,curator,doer]) {
  var userbase;
  var _contractName_ = '0x555345524241534520302e303131380000000000000000000000000000000000';
  var _Base_ = 2;
  var _KEYID_ = 0x9BCB2540EBAC30FC9E9EFF3D259B64A2;

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
  let _timestampV_;
  var _hash_;
  var _verification_ = [_verity, _complete, _timestamp, _hash]; // key is hash of fulfillment
  var _plansCount_ = 0;
  var _promiseCount_ = 0;
  var _orderCount_ = 0;
  var _fulfillmentCount_ = 0;
  var _verificationCount_ = 0;
  var _doerCount_ = 0;
  let _talentK_ = 0;
  let _talentI_ = 0;
  let _talentR_ = 0;
  let _talentF_ = 0;
  var _talentAll_ = [_talentK_, _talentI_, _talentR_, _talentF_];
  const _doerskeyId_ = 0x93D259B6BCAC30FCB2540EB9E9EFF4A2


  it("should get the contract's constants: 'contractName', 'BASE' ", function() {
    return Userbase.deployed().then(function(instance) {
      userbase = instance;
      // Unit Test: ContractName
      return userbase.cName.call();
    }).then(function(cname) {
      assert.equal(cname, _contractName_);
      // Unit Test: BASE
    }).then(function() {
      return userbase.BASE.call();
    }).then(function(base) {
      assert.equal(base, _Base_);
  });
});

  it("constructor should set cName 'bytes32', 'owner', 'controller' and contrl address", function() {
    return Userbase.deployed().then(function(instance) {
      userbase = instance;
      // Unit Test: cName
      return userbase.cName.call();
    }).then(function(cname) {
      assert.equal(cname, _contractName_);
      // Unit Test: owner
    }).then(function() {
      return userbase.owner.call();
    }).then(function(addr) {
      assert.equal(addr, msgOrigin);
      // Unit Test: controller
    }).then(function() {
      return userbase.controller.call();
    }).then(function(addr) {
      assert.equal(addr, Able.address);
      // Unit Test: Able insertion
    }).then(function() {
      return userbase.contrl.call();
    }).then(function(addr) {
      assert.equal(addr, Able.address);
    });
  });

  it("should initially not have any 'uint public' plansCount, promiseCount, orderCount, fulfillmentCount, verificationCount", function() {
    return Userbase.deployed().then(function(instance) {
      userbase = instance;
      // Unit Test: plansCount
      return userbase.plansCount.call();
    }).then(function(count) {
      assert.equal(count, _plansCount_);
      // Unit Test: promiseCount
    }).then(function() {
      return userbase.promiseCount.call();
    }).then(function(count) {
      assert.equal(count, _promiseCount_);
      // Unit Test: orderCount
    }).then(function() {
      return userbase.orderCount.call();
    }).then(function(count) {
      assert.equal(count, _orderCount_);
      // Unit Test: fulfillmentCount
    }).then(function() {
      return userbase.fulfillmentCount.call();
    }).then(function(count) {
      assert.equal(count, _fulfillmentCount_);
      // Unit Test: verificationCount
    }).then(function() {
      return userbase.verificationCount.call();
    }).then(function(count) {
      assert.equal(count, _verificationCount_);
      // Unit Test: doerCount
    }).then(function() {
      return userbase.doerCount.call();
    }).then(function(count) {
      assert.equal(count, _doerCount_);
    });
  });

  it("should initially not have any 'uint internal' talentK, talentI, talentR, talentF", function() {
    var talentK_;
    var talentI_;
    var talentR_;
    var talentF_;
    var _able;
    return Userbase.deployed().then(function(instance) {
      userbase = instance;
      _able = Able.address;
      console.log(Able.address.toString(10));
      console.log(_able.toString(10));
      // Unit Test: getTalents()
      return userbase.getTalents(_talent);
    }).then(function(talent) {
      talentK_ = talent[0].toNumber();
      talentI_ = talent[0].toNumber();
      talentR_ = talent[0].toNumber();
      talentF_ = talent[0].toNumber();
    }).then(function(count) {
      assert.equal(talentK_, _talentK_);
      assert.equal(talentI_, _talentI_);
      assert.equal(talentR_, _talentR_);
      assert.equal(talentF_, _talentF_);
    });
  });

  it("should initialise Doers", function() {
      var timestamp = Math.round(new Date().getTime()/1000);
      var _doersKeyId = 0x9B0EB2530FC9E9ACBEFF3D254C9B64A2;  
      var _doersUuId = 0x9B2530FC40EB20EB2530EB2530FC4A2;
      var _newkey = 0x9B2530FC40EB29ACBEFF3D254C9B64A2

    return Userbase.deployed().then(function(instance) {
      userbase = instance;
      // Unit Test: initDoer()
      return userbase.initDoer(_doersKeyId,_doersUuId,doer)
        // {from: creator, value: 1});
      }).then(function() {
        return userbase.pviewAgent(doer);
      }).then(function(success) {
        assert.equal(success[2], true);
        // Unit Test: isAgent()
      }).then(function() {
        return userbase.viewAgent(_doersKeyId);
      }).then(function(success) { // Unable to test overloaded function isAgent(bytes32 _keyid)
        assert.equal(success[2], true);
      })
    })

  it("should toggle Doers 'on/off', and should change a Doers 'key'", function() {
    var timestamp = Math.round(new Date().getTime()/1000);
    var _doersKeyId = 0x9B0EB2530FC9E9ACBEFF3D254C9B64A2;  
    var _doersUuId = 0x9B2530FC40EB20EB2530EB2530FC4A2;
    var _newkey = 0x9CBEFF3D254CB9ACBEFF3D254C9B64A2;

    return Userbase.deployed().then(function(instance) {
      userbase = instance;
      // Unit Test: initDoer()
      return userbase.initDoer(_doersKeyId,_doersUuId,doer)

      // Unit Test: isAgent(keyid)
      }).then(function() {
        return userbase.viewAgent(_doersKeyId);
      }).then(function(istrue) { // Unable to test overloaded function isAgent(bytes32 _keyid)
        assert.equal(istrue[2], true);

        // Unit Test: setAgent()
      }).then(function() {
        return userbase.asetAgent(doer, false);

        // Unit Test isAgent(address)
      }).then(function() {
        return userbase.viewAgent(doer);
      }).then(function(isfalse) {
        assert.equal(isfalse[2], false);

        // Unit Test: isAgent(keyid)
      }).then(function() {
        return userbase.viewAgent(_doersKeyId);
      }).then(function(isfalse) { // Unable to test overloaded function isAgent(bytes32 _keyid)
        assert.equal(isfalse[2], false);

        // Unit Test: setAgent(address,true)
      }).then(function() {
        return userbase.asetAgent(doer, true);

        // Unit Test: setAgent(address,keyid)
      }).then(function() {
        return userbase.ksetAgent(doer, _newkey);

        // Unit Test: isAgent(keyid)
      }).then(function() {
        return userbase.viewAgent(_newkey);
      }).then(function(istrue) { // Unable to test overloaded function isAgent(bytes32 _keyid)
        assert.equal(istrue[2], true);
      });
    });

  it("should flip from Doers to Creators", function() {
    var timestamp = Math.round(new Date().getTime()/1000);
    var _doersKeyId = 0x9B0EB2530FC9E9ACBEFF3D254C9B64A2;  
    var _doersUuId = 0x9B2530FC40EB20EB2530EB2530FC4A2;
    var _newkey = 0x9B2530FC40EB29ACBEFF3D254C9B64A2

    return Userbase.deployed().then(function(instance) {
      userbase = instance;
      return userbase.initDoer(_doersKeyId,_doersUuId,doer)

        // Unit Test: viewAgent()
      }).then(function() {
        return userbase.pviewAgent(doer, {from: doer});
      }).then(function(state) {
        assert.notEqual(state[1].toNumber(), 1);

        // Unit Test: setAgent(address,uint)
      }).then(function() {
        return userbase.ssetAgent(doer, 1)

        // Unit Test: viewAgent()
      }).then(function() {
        return userbase.pviewAgent(doer, {from: doer});
      }).then(function(state) {
        assert.equal(state[1].toNumber(), 1);
      });
    });

  it("should set num of Doers a Creator can spawn", function() {
    var timestamp = Math.round(new Date().getTime()/1000);
    var _doersKeyId = 0x9B0EB2530FC9E9ACBEFF3D254C9B64A2;  
    var _doersUuId = 0x9B2530FC40EB20EB2530EB2530FC4A2;
    var _newkey = 0x9B2530FC40EB29ACBEFF3D254C9B64A2;
    var _doersnum = 10;

    return Userbase.deployed().then(function(instance) {
      userbase = instance;

        // Unit Test: initDoer()
      return userbase.initDoer(_doersKeyId,_doersUuId,doer)
      }).then(function() {
        return userbase.nsetAgent(doer, _doersnum, {from: doer});
      })
      .then(assert.fail)
      .catch(function(error) {
        assert.include(error.message, ERROR_REVERT);

        // Unit Test: initDoer(bytes32,bytes32,address)
      }).then(function() {
        return userbase.initDoer(_doersKeyId,_doersUuId,creator)

        // Unit Test: setAgent(address, IS)
      }).then(function() {
        return userbase.ssetAgent(creator, 1)

        // Unit Test: setAgent(address,uint)
      }).then(function() {
        return userbase.nsetAgent(creator, _doersnum, {from: creator});

        // Unit Test viewAgent()
      }).then(function() {
        return userbase.pviewAgent(creator, {from: creator});
      }).then(function(state) {
        assert.equal(state[1].toNumber(), 1);
        
        // Unit Test: viewAgent(address)
      }).then(function() {
        return userbase.pviewAgent(creator, {from: creator});
      }).then(function(isdoer) {
        var _doersnum_ = isdoer[3].toNumber();
        assert.equal(_doersnum_, _doersnum);

        // Unit Test: decMyDoers()
      }).then(function() {
        return userbase.decMyDoers({from: creator})

        // Unit Test: viewAgent(address)
      }).then(function() {
        return userbase.pviewAgent(creator, {from: creator});
      }).then(function(isdoer) {
        _doersnum--;
        assert.equal(isdoer[3].toNumber(), _doersnum);
      });
    })

    it("should add plans made by creators to Allplans array, and add promises made by doers in services mapping", function() {
        var _apromise = '0x44454641554c5450524f4d495345000000000000000000000000000000000000';

      return Userbase.deployed().then(function(instance) {
          
        //   // Unit Test: allPlans
        // return userbase.allPlans(0);
        // })
        // .then(assert.fail)
        // .catch(function(error) {
        //   assert.include(error.message, ERROR_INVALID);
          
        //   // Unit Test: setAllPlans(address)
        // }).then(function() {
        // return userbase.tsetAllPlans(creator);

        //   // Unit Test: allPlans
        // }).then(function() {
        // return userbase.allPlans(0);
        // }).then(function(plans) {
        //   assert.equal(plans, creator);
          
          // Unit Test: allPromises
        }).then(function() {
        return userbase.allPromises(doer,0);
        })
        .then(assert.fail)
        .catch(function(error) {
          assert.include(error.message, ERROR_INVALID);

          // Unit Test setAllPromises(bytes32)
        }).then(function() {
        return userbase.tsetAllPromises(_apromise, {from: doer});
        }).then(function() {

          // Unit Test: allPromises
        return userbase.allPromises(doer,0);
        }).then(function(promise) {
          assert.equal(promise, _apromise);
      });
    });
});
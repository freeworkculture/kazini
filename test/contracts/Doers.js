const Able = artifacts.require("Able");
const Userbase = artifacts.require("Userbase");
const Creators = artifacts.require("Creators");
const Doers = artifacts.require("DoersFactory");
const Doers = artifacts.require("Doers");

function assertThrow(err, test, msg) {
  if (err.toString().indexOf(test) !== -1) {
    assert(true, msg);
  } else {
    assert(false, err.toString())
  }
}

const ERROR_REVERT = "VM Exception while processing transaction: revert";
const ERROR_INVALID = 'VM Exception while processing transaction: invalid opcode';

const _CONTRACTNAME = 'DOER 0.0118'
const _KEYID = 0x9BCB2540EBAC30FC9E9EFF3D259B64A2
const _UUID = 0x9E3D2559B649B66FF3D259B649B64A2
const _Base = 2;

const _creator = "CREATOR";
const _userbase = "USERBASE";
const _owner = 'OWNER';	

const _fPrint = 'FPRINT';
const _idNumber = 'IDNUMBER';
const _email = 'EMAIL';
const _fName = 'FNAME';
const _lName = 'LNAME';
const _keyid = 'KEYID';
const _uuid = 'UUID';
const _data = 'DATA';
const _age = 10;
const _Me = [_fPrint, _idNumber, _email, _fName, _lName, _keyid, _uuid, _data, _age];


const _promises = 'PROMISES';
const _promiseCount = 1;
const _orderCount = 2;
const _fulfillmentCount =3;

const _base = 2; 
const _rate = 10;
const _year = 31536000;
const _period = 31536000;

const _refMSD = 'MSD'; 
const _refRank = 'RANK';
const _refSigned = 'SIGNED';
const _refSigs = 'SIGS'; 
const _refTrust = 'TRUST';


var toUpdate = false;
var toFlip = false;

var newExperience = 10;
var newKBase = 2;


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
var _promise = [_stateI, _service, _payout, _timeHard, _hash];
var _proof;
var _rubric;
var _timestamp;
var _fulfillment = [_proof, _rubric, _timestamp, _hash];
var _verity;
var _complete;
var _timestampV;
var _verification = [_verity, _complete, _timestamp, _hash]; // key is hash of fulfillment
const _plansCount = 0;
const _verificationCount = 0;
const _doerCount = 0;
const _talentK = 0;
const _talentI = 0;
const _talentR = 0;
const _talentF = 0;
const _talentAll = [_talentK, _talentI, _talentR, _talentF];
const _doerskeyId = 0x93D259B6BCAC30FCB2540EB9E9EFF4A2
const userName = "DEFAULT CREATOR";
const ownUuid = "fordefaultcreator";

contract("Doers", function([owner,controller,doer,creator,curator,msgOrigin,msgSender]) {
  var creators;
  var doers;
  var _CONTRACTNAME_ = "0x444f455220302e30313138000000000000000000000000000000000000000000";
  var _KEYID_ = 0x9BCB2540EBAC30FC9E9EFF3D259B64A2
  var _UUID_ = 0x9E3D2559B649B66FF3D259B649B64A2
  var _Base_ = 2;
  
  var _creator_;
  var _userbase_;
  var _owner_;	
  
  var _fPrint_;
  var _idNumber_;
  var _email_;
  var _fName_;
  var _lName_;
  var _hash_;
  var _tag_;
  var _data_;
  var _age_;
  var _active_;
  var _Me_ = [_fPrint_, _idNumber_, _email_, _fName_, _lName_, _hash_, _tag_, _data_, _age_, _active_];
      
  var _experience_;
  var _reputation_;
  var _talent_;
  var _index_;
  var _hash_;
  var _myMerits_ = [_experience_, _reputation_, _talent_, _index_, _hash_];
  
  var _promises_;
  var _promiseCount_;
  var _orderCount_;
  var _fulfillmentCount_;
  
  var _base_; 
  var _rate_ = 10;
  var _year_ = 31536000;
  var _period_ = 31536000;
  
  var _refMSD_; 
  var _refRank_;
  var _refSigned_;
  var _refSigs_; 
  var _refTrust_;
  
  var _oraclizeResult_;
  var _oraclizeId_;

  var _intention_ = 'intention_';
  var _serviceId_ = 'serviceId_';
  var _preQualification_ = 'preQualification_';

  let _state_ = 2;
  var _preCondition_ = '0x5f707265436f6e646974696f6e5f000000000000000000000000000000000000';
  let _time_ =  0;
  let _budget_ = 1000;
  var _goal_ = '0x5f676f616c5f0000000000000000000000000000000000000000000000000000';
  var _status_ = true;
  var _postCondition_ = [_goal_,_status_];
  var _projectUrl_ = '0x5f70726f6a65637455726c5f0000000000000000000000000000000000000000';
  var _services_ = [_preCondition_, _time_, _budget_, _projectUrl_]; // key is XOR map of doer

  var _country_; //ISO3166-2:KE-XX;
  var _cAuthority_;
  var _score_;
  var _qualification_ = [_country_, _cAuthority_, _score_];
  let _timeSoft_;  // preferred timeline
  let _expire_;
  var _hash_;
  var _serviceUrl_;
  var _metas_ = [_timeSoft, _expire, _hash, _serviceUrl];
  var _Sig_;
  let _V_;
  var _R_;
  var _S_;
  var _order_ = [_Sig_, _V_, _R_, _S_];
  var _procure_; // key is address of doer
  let _stateI_;
  var _service_;
  let _payout_;
  let _timeHard_;   // proposed timeline
  var _hash_;
  var _promise_ = [_stateI_, _service_, _payout_, _timeHard_, _hash_];
  var _proof_;
  var _rubric_;
  let _timestamp_;
  var _hash_;
  var _fulfillment_ = [_proof_, _rubric_, _timestamp_, _hash_];
  var _verity_;
  var _complete_;
  let _timestampV_;
  var _hash_;
  var _verification_ = [_verity_, _complete_, _timestamp_, _hash_]; // key is hash of fulfillment
  var _plansCount_ = 0;
  var _verificationCount_ = 0;
  var _doerCount_ = 0;
  let _talentK_ = 0;
  let _talentI_ = 0;
  let _talentR_ = 0;
  let _talentF_ = 0;
  var _talentAll_ = [_talentK_, _talentI_, _talentR_, _talentF_];
  var _doerskeyId_ = 0x93D259B6BCAC30FCB2540EB9E9EFF4A2

  function assertThrow(err, test, msg) {
    if (err.toString().indexOf(test) != -1) {
      assert(true, msg);
    } else {
      assert(false, err.toString())
    }
  }

  it("should deploy the Doers Factory contract and get it's 'CONTRACTNAME'", function() {
    return Creators.deployed().then(function(instance) {
      creators = instance;
      console.log(creators.address.toString(10));

      }).then(function() {
      return creators.makeDoer(_fPrint, _idNumber, _lName, _keyid, _data, _age);
      }).then(function(instance) {
      doers = instance;
      console.log(doers.address.toString(10));

        // Unit Test: CONTRACTNAME
      }).then(function() {
      return doers.CONTRACTNAME.call();
      }).then(function(cname) {
        assert.equal(cname, _CONTRACTNAME_);

        // Unit Test: KEYID
      }).then(function() {
        return doers.KEYID.call();
      }).then(function(keyid) {
        assert.equal(keyid, _KEYID_);

        // Unit Test: UUID
      }).then(function() {
        return doers.UUID.call();
      }).then(function(uuid) {
        assert.equal(uuid, _UUID_);
      });
    });

    it("should get the contract's 'CONTRACTNAME', 'KEYID', 'UUID'", function() {
      return Creators.deployed().then(function(instance) {
        creators = instance;
        console.log(creators.address.toString(10));
  
        }).then(function() {
        return creators.makeDoer(_fPrint, _idNumber, _lName, _keyid, _data, _age);
        }).then(function(instance) {
        doers = instance;
        console.log(doers.address.toString(10));
  
          // Unit Test: CONTRACTNAME
        }).then(function() {
        return doers.CONTRACTNAME.call();
        }).then(function(cname) {
          assert.equal(cname, _CONTRACTNAME_);
  
          // Unit Test: KEYID
        }).then(function() {
          return doers.KEYID.call();
        }).then(function(keyid) {
          assert.equal(keyid, _KEYID_);
  
          // Unit Test: UUID
        }).then(function() {
          return doers.UUID.call();
        }).then(function(uuid) {
          assert.equal(uuid, _UUID_);
        });
      });

  // it("constructor should set KEYID, UUID, creator, owner, Me ", function() {
  //   return Doers.deployed().then(function(instance) {
  //     doers = instance;

  //       // Unit Test: CONTRACTNAME
  //       return doers.CONTRACTNAME.call();
  //     }).then(function(cname) {
  //       assert.equal(cname, _CONTRACTNAME_);

  //       // Unit Test: KEYID
  //     }).then(function() {
  //       return doers.KEYID.call();
  //     }).then(function(keyid) {
  //       assert.equal(keyid, _KEYID_);

  //       // Unit Test: UUID
  //     }).then(function() {
  //       return doers.UUID.call();
  //     }).then(function(keyid) {
  //       assert.equal(keyid, _UUID_);

  //       //  Unit Test: creator
  //     }).then(function() {
  //       return doers.creator.call();
  //     }).then(function(creator_) {
  //       assert.equal(creator_, Creators.address);

  //       //  Unit Test: owner
  //     }).then(function() {
  //       return doers.creator.call();
  //     }).then(function(owner) {
  //       assert.equal(owner_, owner);

  //       //  Unit Test: Iam
  //     }).then(function() {
  //       return doers.getDoer();
  //     }).then(function(iam) {
  //       assert.equal(iam[0], _fPrint_);
  //       assert.equal(iam[1], _idNumber_);
  //       assert.equal(iam[2], _email_);
  //       assert.equal(iam[3], _fName_);
  //       assert.equal(iam[4], _lName_);
  //       assert.equal(iam[5], _hash_);
  //       assert.equal(iam[6], _tag_);
  //       assert.equal(iam[7], _data_);
  //       assert.equal(iam[8], _age_);
  //       assert.equal(iam[9], _active_);

  //       //  Unit Test: myMerits
  //     }).then(function() {
  //       return doers.merits.call();
  //     }).then(function(merits_) {
  //       assert.equal(merits_[0], _experience_);
  //       assert.equal(merits_[1], _reputation_);
  //       assert.equal(merits_[2], _talent_);
  //       assert.equal(merits_[3], _index_);
  //       assert.equal(merits_[3], _hash_);
  //     });
  // });

  // it("should have MERITS ", function() {
  //   return Doers.deployed().then(function(instance) {
  //     doers = instance;
    
  //         //  Unit Test: merits
  //       }).then(function() {
  //         return doers.merits.call();
  //       }).then(function(merits_) {
  //         assert.equal(merits_[0].toNumber(), _experience_);
  //         assert.equal(merits_[1], _reputation_);
  //         assert.equal(merits_[2], _talent_);
  //         assert.equal(merits_[3].toNumber(), _index_);
  //         assert.equal(merits_[3], _hash_);
  //       });
  //     });

  // it("should have a doers promiseCount, orderCount and fulfillmentCount", function() {
  //   return Doers.deployed().then(function(instance) {
  //     doers = instance;
    
  //       //  Unit Test: promiseCount
  //     }).then(function() {
  //       return doers.promiseCount.call();
  //     }).then(function(count) {
  //       assert.equal(count.toNumber(), _promiseCount_);

  //       //  Unit Test: promiseCount
  //     }).then(function() {
  //       return doers.orderCount.call();
  //     }).then(function(count) {
  //       assert.equal(count.toNumber(), _orderCount_);

  //       //  Unit Test: promiseCount
  //     }).then(function() {
  //       return doers.fulfillmentCount.call();
  //     }).then(function(count) {
  //       assert.equal(count.toNumber(), _fulfillmentCount_);
  //     });
  //   });

  //   it("should get a Doer heartbeat", function() {
  //     return Doers.deployed().then(function(instance) {
  //       doers = instance;
      
  //         //  Unit Test: iam
  //       }).then(function() {
  //         return doers.iam();
  //       }).then(function(iam_) {
  //         assert.equal(iam_, true);
  
  //         //  Unit Test: promiseCount
  //       }).then(function() {
  //         return doers.orderCount.call();
  //       }).then(function(count) {
  //         assert.equal(count.toNumber(), _orderCount_);
  
  //         //  Unit Test: promiseCount
  //       }).then(function() {
  //         return doers.fulfillmentCount.call();
  //       }).then(function(count) {
  //         assert.equal(count.toNumber(), _fulfillmentCount_);
  //       });
  //     });


  // it("should validate doers", function() {
  //   var contract;
  //   return Doers.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.iam({from: doer});
  //   }).then(function(bool) {
  //     assert.equal(bool, true);
  //   }).then(function() {
  //     return contract.iam({from: owner});
  //   }).then(function(bool) {
  //     assert.equal(bool, false);
  //   });
  // });

  // it("should only let the trustee add doers", function() {
  //   var contract;
  //   return Doers.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.addDoer(accounts[1], {from: accounts[0]});
  //   }).then(function() {
  //     return contract.getDoerCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 2);
  //   }).then(function() {
  //     return contract.addDoer(accounts[2], {from: accounts[1]});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getDoerCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 2);
  //   });
  // });

});

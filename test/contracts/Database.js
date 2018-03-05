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
      // }).then(function() {
      //   return database.plans[intention].plan.preCondition.call();
      // }).then(function(_precondition) {
      //   assert.equal(_precondition, preCondition);
      // }).then(function() {
      //   return database.plans[intention].plan.postCondition.goal.call();
      // }).then(function(_goal) {
      //   assert.equal(_goal, goal);
      // }).then(function() {
      //   return database.plans[intention].plan.postCondition.status.call();
      // }).then(function(_status) {
      //   assert.equal(_status, status);
      // }).then(function() {
      //   return database.plans[intention].plan.projectUrl.call();
      // }).then(function(_projecturl) {
      //   assert.equal(_projecturl, projectUrl);
      // }).then(function() {
      //   return database.plans[intention].plan.creator.call();
      // }).then(function(addr) {
      //   assert.equal(addr, creator);
      // }).then(function() {
      //   return database.plans[intention].plan.curator.call();
      // }).then(function(addr) {
      //   assert.equal(addr, curator);
      // }).then(function() {
      //   return database.plans[intention].services[serviceId].definition.preCondition.merits.hash.call();
      // }).then(function(_prequalification) {
      //   assert.equal(_prequalification, prequalification);
      });
    });
    
    it("should populate services", function() {
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
        // }).then(function() {
        //   return database.plans[intention].plan.preCondition.call();
        // }).then(function(_precondition) {
        //   assert.equal(_precondition, preCondition);
        // }).then(function() {
        //   return database.plans[intention].plan.postCondition.goal.call();
        // }).then(function(_goal) {
        //   assert.equal(_goal, goal);
        // }).then(function() {
        //   return database.plans[intention].plan.postCondition.status.call();
        // }).then(function(_status) {
        //   assert.equal(_status, status);
        // }).then(function() {
        //   return database.plans[intention].plan.projectUrl.call();
        // }).then(function(_projecturl) {
        //   assert.equal(_projecturl, projectUrl);
        // }).then(function() {
        //   return database.plans[intention].plan.creator.call();
        // }).then(function(addr) {
        //   assert.equal(addr, creator);
        // }).then(function() {
        //   return database.plans[intention].plan.curator.call();
        // }).then(function(addr) {
        //   assert.equal(addr, curator);
        // }).then(function() {
        //   return database.plans[intention].services[serviceId].definition.preCondition.merits.hash.call();
        // }).then(function(_prequalification) {
        //   assert.equal(_prequalification, prequalification);
        });
      });
  //   it("should populate plans", function() {
  //     var timestamp = Math.round(new Date().getTime()/1000);
  //     return DoPromise.deployed().then(function(instance) {
  //       contract = instance;
  //       return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //       struct Plans {
  //         Project state;
  //         Plan plan;
      
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should populate plans", function() {
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //    struct Plan {
  //         bytes32 preCondition;
  //         uint time;
  //         uint budget;
  //         Userbase.Desire postCondition;
  //         bytes32 projectUrl;
  //         address creator;
  //         address curator;
  //     }
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should populate plans", function() {
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //     struct Plan {
  //         bytes32 preCondition;
  //         uint time;
  //         uint budget;
  //         Userbase.Desire postCondition;
  //         bytes32 projectUrl;
  //         address creator;
  //         address curator;
  //     }
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should populate plans", function() {
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //       struct Service {
  //         Userbase.Belief preCondition;
  //         Userbase.Desire postCondition;
  //         Metas metas;
  //         }
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should populate plans", function() {
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //     struct Metas {
  //           uint timeSoft;  // preferred timeline
  //           uint expire;
  //           bytes32 hash;
  //           bytes32 serviceUrl;
  //           address doer;
  //       }
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should populate plans", function() {
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //   struct Order {
  //           bytes32 Sig;
  //           uint8 V;
  //           bytes32 R;
  //           bytes32 S;
  //       }
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should populate plans", function() {
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //     } struct Promise {
  //           Userbase.Intention thing;
  //             uint timeHard;   // proposed timeline
  //             bytes32 hash;
  //     }
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should populate plans", function() {
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});

  //       mapping(address => Procure) procure;
  //     } struct Fulfillment {
  //             bytes32 proof;
  //             Level rubric;
  //             uint timestamp;
  //             bytes32 hash;
  //     }
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should populate plans", function() {
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});

  //           mapping(address => Verification) verification; // key is hash of fulfillment
  //     } struct Verification {
  //               bytes32 verity;
  //               bool complete;
  //               uint timestampV;
  //               bytes32 hash;
  //     }
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });
  

  // it("should only let doers promise something", function() {
  //   var contract;
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });


  // it("should only let doers promise something", function() {
  //   var contract;
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.promise("bar", timestamp + 1, {from: accounts[2], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should only accept promises in the future", function() {
  //   var contract;
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("baz", timestamp - 1, {from: accounts[0], value: 1});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //     assert.equal(web3.eth.getBalance(contract.address), 1);
  //   });
  // });

  // it("should only accept promises of more than 0 Wei", function() {
  //   var contract;
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("baz", timestamp + 1, {from: accounts[0], value: 0});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should only let doers fulfill a promise", function() {
  //   var contract;
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.fulfill("foo", "123", {from: accounts[0]});
  //   }).then(function() {
  //     return contract.getFulfillmentCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   }).then(function() {
  //     return contract.fulfill("foo", "123", {from: accounts[2]});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getFulfillmentCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should only allow fulfillment of existing promises", function() {
  //   var contract;
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.fulfill("bar", "123", {from: accounts[0]});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getFulfillmentCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  // });

  // it("should only allow fulfillment within expiry", function() {
  //   var contract;
  //   var timestamp = Math.round(new Date().getTime()/1000);
  //   return DoPromise.deployed().then(function(instance) {
  //     contract = instance;
  //     return contract.promise("foo", timestamp + 1, {from: accounts[0], value: 1});
  //   }).then(function() {
  //     // Wait past the promise expiry time.
  //     var ms = new Date().getTime();
  //     while(new Date().getTime() < ms + 1500){ /* do nothing */ }
  //     // Fulfill promise too late.
  //     return contract.fulfill("foo", "123", {from: accounts[0]});
  //   }).catch(function(err) {
  //     assertThrow(err, "invalid opcode");
  //   }).then(function() {
  //     return contract.getPromiseCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 2);
  //     assert.equal(web3.eth.getBalance(contract.address), 2);
  //   }).then(function() {
  //     return contract.getFulfillmentCount.call();
  //   }).then(function(count) {
  //     assert.equal(count, 1);
  //   });
  































































});
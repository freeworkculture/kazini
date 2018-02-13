pragma solidity ^0.4.19;
import "./ControlAbstract.sol";
pragma experimental ABIEncoderV2;

/// @dev `Owned` is a base level contract that assigns an `owner` that can be
///  later changed
contract Controlled {

    /// @dev `owner` is the only address that can call a function with this
    /// modifier
    modifier onlyController {
        require (msg.sender == controller); 
        _;
    }

    address public controller;
    
    Able internal contrl;

    /// @notice The Constructor assigns the message sender to be `owner`
    function Controlled() internal {
        controller = msg.sender;
        contrl = Able(msg.sender);
    }

    /// @notice `owner` can step down and assign some other address to this role
    /// @param _newOwner The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function changeController(address _newOwner) public onlyController {
        controller = _newOwner;
    }
    
    function registerCon(bytes32 _name) public returns (bool) {
        contrl.registerContract(_name, this);
    }
    
    function getContrl() view public returns (Able) {
        return contrl;
    }
}

/// @dev `Owned` is a base level contract that assigns an `owner` that can be
///  later changed
contract Data is Controlled {
    
    Database internal database;

	modifier onlyCreator {
		require(database.isCreator(msg.sender));
		_;
	}

	modifier onlyDoer {
		require (database.isDoer(msg.sender)); 
		_;
	}
    
    // Get the address of an existing contract frrom the controller.
    function getDatabase() onlyController public view returns (Database) {
        return database;   
    }
}

contract Able is Data {
    // /// @notice The address of the controller is the only address that can call
    // ///  a function with this modifier
    // modifier onlyController { 
    //     require(msg.sender == controller); 
    //     _; 
    //     }

    // address public controller;

    // This is where we keep all the contracts.
    mapping (bytes32 => address) public contracts;

    // mapping (bytes32 => Database) public databases;
    
    Creators internal create;

    function Able() public { 
        // controller = msg.sender;
        contracts["Able"] = this;
        }

    // /// @notice Changes the controller of the contract
    // /// @param _newController The new controller of the contract
    // function changeController(address _newController) public onlyController {
    //     controller = _newController;
    // }

    // Get the address of an existing contract frrom the controller.
    function getContract(bytes32 name) internal constant onlyController returns (address) {
        return contracts[name];   
    }

    // Add a new contract to the controller. This will overwrite an existing contract.
    function registerContract(
		bytes32 name, 
		address addr) onlyController public returns (bool)	 // This guard exhibits buglike behaviour, 
		{ 													// Only do validation if there is an actions contract.	
			address cName =	contracts[name];	 			// stops contract from registering itself.
			if (cName != 0x0) {
				return false;
				} else {
				contracts[name] = addr;
				return true;
			}
        
    }

    // Remove a contract from the controller. We could also selfdestruct if we want to.
    function removeContract(bytes32 name) onlyController internal returns (bool result) {
        address cName = contracts[name];
        if (cName != 0x0) {
           return false;
           } else {
               // Kill any contracts we remove, for now.
               contracts[name] = 0x0;
               return true;
           }
       
    }

    // Make a new database contract.
    function makeDatabase(Database _addr, bytes32 _name) onlyController public returns (bool,address) {
        require(_name != 0x0);
        address cName = contracts[_name];
        if (cName != 0x0) {
            return (false,cName);
            } else {
                database = _addr;
                contracts[_name] = database;
                return (true,database);
                }
                }
                
    // Make a new creators contract.
    function makeCreators(bytes32 _name) onlyController public returns (bool,address) {
        require(_name != 0x0);
        address cName = contracts[_name];
        if (cName != 0x0) {
            return (false,cName);
            } else {
                create = new Creators(this,database,_name);
                contracts[_name] = create;
                return (true,create);
                }
                }
    
    // function getPlan(bytes32 _name, bytes32 _plan) view internal returns (Database.Plan) {
    //     return databases[_name].plans[_plan];
    //         }
    
    // function getBDI(bytes32 _name) view internal returns (Database.BDI) {
    //     return databases[_name].bdi[tx.origin];
    // }

    // function setPlan(bytes32 _name, bytes32 _planId, Database.Plan _data) onlyController internal returns (bool) {
    //     databases[_name].plans[_planId] = _data;
    //     return true;
    // }

    // function setBDI(bytes32 _name, Database.BDI _data) onlyController internal returns (bool) {
    //     databases[_name].bdi[tx.origin] = _data;
    //     return true;
    // }
}

/////////////////
// Database Controller Contract
/////////////////
contract Database is Controlled {

    // /// @notice The address of the controller is the only address that can call
    // ///  a function with this modifier
    // modifier onlyController {
    //     require(msg.sender == controller);
    //     _;
    //     }

    // address public controller;
    
    
	modifier onlyCreator {
		require(isCreator(msg.sender));
		_;
	}

	modifier onlyDoer {
		require (isDoer(msg.sender)); 
		_;
	}

///////////////////
/// @dev `SomeDoer` defines the basic universal structure of an agent
///////////////////
	struct SomeDoer {
        bytes32 fPrint;
        bytes32 idNumber;
		bytes32 email;
		bytes32 fName;
		bytes32 lName;
        bytes32 hash;
		bytes32 tag;
        bytes32 data;
        int birth;
		bool active;
		}
/// SomeDoer aDoer {hex, string, uint, string, string, true, now}
/// @dev Interp. aDoer {fPrint, email, birth, fName, lName, active, lastUpdate} is an agent with
					// fPrint is PGP Key fingerprint
					// email is PGP key email
					// birth is date of birth in seconds from 1970
					// fName is first name in identity document MRZ
					// lName is last name in identity document MRZ
					// state is deliberative state of agent
					// lastUpdate is timestamp of last record entry
	//SomeDoer public thisDoer;// = SomeDoer(0x4fc6c65443d1b988, "whoiamnottelling", 346896000, "Iam", "Not", false);	

	// function funcForSomeDoer(SomeDoer _aDoer) {
	// 	(...	(_aDoer.fPrint),
	// 			(_aDoer.email),
	// 			(_aDoer.birth),
	// 			(_aDoer.fName),
	// 			(_aDoer.lName),
	// 			(_aDoer.state)
	// 			}
/// Template rules used:
/// - Compound: 6 fields
///

///////////////////
/// @dev `B-D-I` is the structure that prescribes a strategy model to an actual agent
///////////////////
    struct Belief {
        mapping(bytes32 => Qualification) qualification; // Key is the keccak256 hash of the struct contents
        uint experience;
        bytes32 reputation;
        bytes32 talent;
        bytes32 index;
        bytes32 hash;
        }
        struct Qualification {
            bytes32 country; //ISO3166-2:KE-XX;
            bytes32 cAuthority;
            bytes32 score;
            }
            // enum Level {PRIMARY,SECONDARY,TERTIARY,CERTIFICATE,DIPLOMA,BACHELOR,MASTER,DOCTORATE,LICENSE,CERTIFICATION}
    struct Desire {
        bytes32 goal;
        bool status;
        }
    struct Intention {
        Agent state;
        bytes32 service;
        uint256 payout;
        }
        enum Agent {ACTIVE, INACTIVE, RESERVED}
	/// Belief myBelief {hex, int, int8, hex}
	/// @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
					// Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
					// experience is age in seconds
					// reputaion is PGP trust level flag !!! CITE RFC PART
					// talent is user declared string of talents
	//Belief myBelief; // = Belief(myQualification, 1, 0x004, 0x00);
	// function funcForBelief(Belief _aBelief) {
	// 	(...	(_aBelief.myQualification),
	// 			(_aBelief.experience),
	// 			(_aBelief.reputation),
	// 			(_aBelief.talent),
	// 			}
/// Template rules used:
/// - Compound: 4 fields
///

    struct BDI {
        Belief beliefs;
        mapping(bytes32 => Desire) desires;
	    mapping(bool => Intention) intentions;
	    }
        
    struct Service {
		Belief conditionP;
		Promise taskT;
        Desire conditionQ;
        uint timeSoft;  // preferred timeline
        uint expire;
        bytes32 hash;
        Fulfillment fulfillment;
		} 
        
    struct Plan {
		bytes32 conditionP;
		mapping(bytes32 => Service) service;    // The key is XOR of serviceId and agent address 
		Desire conditionQ;
        mapping(bytes32 => string) ipfs;
        Project state;
        address creator;
        address curator;
		}
        enum Project { PENDING, STARTED, CLOSED }

    struct Promise {
        address doer;
        bytes32 thing;
        uint timeHard;   // proposed timeline
        uint256 value;
        bytes32 hash;
    }

    struct Fulfillment {
        address doer;
        bytes32 promise;
        bytes32 proof;
        Level rubric;
        uint timestamp;
        bytes32 hash;
        mapping(bytes32 => Verification) check;  // key is hash of fulfillment
        }
        enum Level { POOR,SATISFACTORY,GOOD,EXCELLENT }
        struct Verification {
            address prover;
            bool complete;
            uint timestamp;
            bytes32 hash;
            }

    enum Flag { 
		experience,e,
		reputation,r,
		talent,t,
		index,i,
		hashB,HB,
		country,c,
		cAuthority,CA,
		score,s,
		hashQ,HQ,
		goal,g,
		statusD,SD,
		statusI,SI,
		service,S,
		payout,p
		}

/////////////////
// Database Contract
/////////////////

    struct Creator {
		bool active;
		uint myDoers;
	}
	mapping(address => Creator) internal creators;
///////////////////
/// @dev `SomeDoer` defines the Sovereignty of an agent
///////////////////
    struct Doer {
        address doer;
        bool active;
        }
        mapping(bytes32 => Doer) internal doersUuid;
        mapping(address => Doer) doersAddress;
        address[] internal doersAccts;
        uint internal doerCount;	// !!! Can I call length of areDoers instead??!!!

///////////////////
/// @dev `Initialised data structures
///////////////////

    mapping(bytes32 => Qualification) qualification;
    
    //enum Level {PRIMARY,SECONDARY,TERTIARY,CERTIFICATE,DIPLOMA,BACHELOR,MASTER,DOCTORATE,LICENSE,CERTIFICATION}
        
    mapping(address => BDI) internal bdi;
        
    mapping(bytes32 => Plan) internal plans;

    bytes32[] allPlans;

    mapping(address => bytes32[]) public Promises;
  
    uint public promiseCount;

    uint public orderCount;
    uint public fulfillmentCount;

    function Database(Able _ctrl) public {
        // controller = _ctrl;
        contrl = _ctrl;
        }


/////////////////
// Database Read/Write
/////////////////




    // Data -> Plan
    // Produce a Plan
        // struct Plan {
		// bytes32 conditionP;
		// mapping(bytes32 => Service) service;
        // mapping(bytes32 => Service[]) services;
        // mapping(bytes32 => string) project;
		// bytes32 conditionQ;
		// }
        // mapping(bytes32 => Plan) plans;
    // function concept(bytes32 _wish, bytes32 _goal, bytes32 _preConditions) returns (Plan); // STUB
    // Examples
    // desire(aWish, aGoal, aPreconditions, aProjectUrl);
    // url = keccak256(aUrl)
        // struct Service {
		// bytes32 conditionP;
		// Promise taskT;
		// bytes32 conditionQ;
		// } 
        //} 
        //     struct Service {
		// Belief conditionP;
		// Promise taskT;
        // bytes32 conditionQ;
        // uint timeOpt;  // preferred timeline
        // uint expire;
		// } 

    function plan(bytes32 _intention, bytes32 _desire, bytes32 _preConditions, string _projectUrl) public payable onlyCreator returns (bool) {
        require((plans[_intention].state != Project.STARTED) || // This is 
        (plans[_intention].state != Project.CLOSED)); // a new plan?
        plans[_intention].conditionQ = bdi[tx.origin].desires[_desire]; // Creator and project share a goal
																			// Get this from Doers direct.
        bytes32 serviceId = plans[_intention].conditionQ.goal ^ bytes32(msg.sender);  // bitwise XOR builds a map of serviceIds
        plans[_intention].service[serviceId].conditionP.hash = _preConditions; // pCondition of the curate that will define the concept.
        bytes32 url = keccak256(_projectUrl);
        plans[_intention].ipfs[url] = _projectUrl; // Store the prefeasibility at the main project repo.
        plans[_intention].state == Project.PENDING;
        plans[_intention].creator = tx.origin;
        // push event for new plan
		return true;
    }

    function serviceId(bytes32 _intention) internal view onlyCreator returns (bytes32) {
        return bytes32(msg.sender) ^ plans[_intention].conditionQ.goal;  // bitwise XOR builds a map of serviceIds
    }

    function plan(
		bytes32 _intention, 
		bytes32 _theCondQ, 
        bool _theGoalG, 
        uint _experience, 
        bytes32 _reputation, 
        bytes32 _talent, 
        bytes32 _index, 
        bytes32 hash, 
        bytes32 _country, 
        bytes32 _cAuthority, 
        bytes32 _score) public payable onlyDoer returns (bool)
		{
			require(plans[_intention].state == Project.PENDING); // Project is not pending or closed
			require(bdi[tx.origin].beliefs.index >= bdi[plans[_intention].curator].beliefs.index); // Curate // meets or exceeds the current Curator
			// require(bdi[tx.origin].beliefs.index >= plans[_intention].service[_intention ^ bytes32(plans[_intention].curator)].conditionP.index); // Curate // meets or exceeds the pCondition
			require(hash == keccak256(_country,_cAuthority,_score,_experience,_reputation,_talent));
			plans[_intention].service[serviceId(_intention)].conditionP = bdi[tx.origin].beliefs; // Creates the curators microservice
			// bytes32 nServiceId = _serviceId ^ bytes32(msg.sender);
			plans[_intention].service[serviceId(_intention)].conditionQ = Desire(_theCondQ, _theGoalG);
			plans[_intention].service[serviceId(_intention)].hash = keccak256(_theCondQ, hash);
			planAdv(_intention, _talent, _reputation, _experience, _index, hash, _country, _cAuthority, _score);
			plans[_intention].curator = tx.origin;
			return true;
	}

	function planAdv(
        bytes32 _intention, 
		bytes32 _talent, 
		bytes32 _reputation, 
		uint _experience, 
		bytes32 _index, 
		bytes32 hash, 
		bytes32 _country, 
		bytes32 _cAuthority, 
		bytes32 _score) onlyDoer internal returns (bool)
        {
            plans[_intention].service[serviceId(serviceId(_intention))].conditionP = Belief({
					talent: _talent, 
					reputation: _reputation, 
					experience: _experience, 
					index: _index, 
					hash: hash
					});
			plans[_intention].service[serviceId(serviceId(_intention))].conditionP.qualification[keccak256(_country, _cAuthority, _score)] = Qualification({
					country: _country, 
					cAuthority: _cAuthority, 
					score: _score
					});
			return true;
	}
    
    // pCondition must be present before project is started
    // qCondition must be present before project is closed
    function plan(bytes32 _intention, bytes32 _prerequisites, string _projectUrl, bytes32 _verity) public payable onlyDoer returns (bool) {
        require(plans[_intention].curator == tx.origin); // curate meets the pCondition
        plans[_intention].ipfs[keccak256(_projectUrl)] = _projectUrl; // additional urls of project repo.
		plans[_intention].conditionP = keccak256(_prerequisites, plans[_intention].conditionP); // Use a merkle tree // function and base the design pCondition to the merkle tree
        //plans[_intention].conditionQ = keccak256(_verity, plans[_intention].conditionQ);
        allPlans.push(_intention);
        plans[_intention].state == Project.STARTED;
		return true;
    }      

    function promise(bytes32 _intention, bytes32 _desire, bytes32 _serviceId, uint _time, bool _thing) public payable onlyDoer returns (bool) {
        require(bdi[tx.origin].beliefs.index >= plans[_intention].service[_serviceId].conditionP.index);
        require(bdi[tx.origin].desires[_desire].goal == plans[_intention].service[_serviceId].conditionQ.goal);
        require((_time > block.timestamp) || (_time < plans[_intention].service[_serviceId].expire));
        require(msg.value > 0);
        require(bdi[tx.origin].beliefs.index > bdi[plans[_intention].service[_serviceId].taskT.doer].beliefs.index);
        bytes32 eoi = keccak256(msg.sender, _intention, _serviceId);
        plans[_intention].service[_serviceId].taskT = Promise({
            doer: tx.origin, 
            thing: bdi[tx.origin].intentions[_thing].service, 
            timeHard: _time, 
            value: msg.value, 
            hash: eoi});
        Promises[tx.origin].push(_serviceId);
        promiseCount++;
		return true;
        }

    // }
    //     struct Desire {
    //     bytes32 goal;
    //     bool status;
    //     }
    // struct Intention {
    //     Agent state;
    //     bytes32 service;
    //     uint256 payout;
    //     }
    

    // function order(bytes32 _intention, bytes32 _serviceId, bool _check, string thing, string proof) public payable onlyDoer {

    //     Fulfillment storage checker;
    //     orders[verity] = Order({doer: msg.sender, promise: plans[_intention].service[lso].taskT.hash, proof: proof, timestamp: block.timestamp, check: checker, hash: verity});
    //     orderCount++;
    //     }

    function fulfill(bytes32 _intention, bytes32 _serviceId, bool _check, bytes32 _proof, Database.Level _level) public payable onlyDoer returns (bool) {
		        // Validate existing promise.
        if (bdi[plans[_intention].service[_serviceId].taskT.doer].intentions[_check].state != 
        Agent.ACTIVE) {
            Promise storage reset;
            plans[_intention].service[_serviceId].taskT = reset;
            }
        bytes32 lso = keccak256(msg.sender, _serviceId); // Use merkle tree function to build order tree, rebase design plan 
        require(block.timestamp < plans[_intention].service[lso].expire);
        bytes32 verity = keccak256(msg.sender, _proof);
		plans[_intention].service[_serviceId].fulfillment = Fulfillment({
				doer: msg.sender, 
				promise: plans[_intention].service[_serviceId].taskT.hash, 
				proof: _proof, 
				rubric: _level, 
				timestamp: block.timestamp, 
				hash: verity
				});
		orderCount++;
        // function setReputation(Intention _service, bool _intention) internal onlyDoer {
        //     myBDI.beliefs.reputation = _service;  !!! Working on
		return true;
		}

    function verify(bytes32 _intention, bytes32 _serviceId, bytes32 _verity, bytes32 _thing) public payable onlyDoer returns(bool) {
        // Validate existing promise.
        // plans[_intention].service[_serviceId].fulfillment.hash = _thing;
        require(_verity == plans[_intention].service[_serviceId].fulfillment.hash);
        // _verity = keccak256(msg.sender, _verity); // Use merkle tree function to build as-built tree, change/configuration management
		plans[_intention].service[_serviceId].fulfillment.check[_verity] = Verification({
				prover: tx.origin, 
				complete: true, 
				timestamp: block.timestamp, 
				hash: _verity
				});   
		fulfillmentCount++;
        // function setReputation(Intention _service, bool _intention) internal onlyDoer { // Oraclise function, sets the trust level
        //     myBDI.beliefs.reputation = _service;  !!! Working on             // between creator -> doer && verifier -> doer
		return true;
		}


    function getPromiseCount() internal constant returns (uint) {
        return promiseCount;
    }

    function getFulfillmentCount() internal constant returns (uint) {
        return fulfillmentCount;
    }        
/////////////////
// All ASSERTS
/////////////////

    
	function isCreator(address _address) view public returns (bool) {
		return creators[_address].active;
	}
	
	function isCreator(Creator _data) public {
// 		creators[msg.sender] = _data;   // Testing effect of ppassing address
		creators[tx.origin] = _data;    // Propose to use a delegateCall function
	}

	function isDoer(address _address) public view returns (bool) { // Point this to oraclise service checking MSD on 
		return doersAddress[_address].active;	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json
	}

	function isDoer(bytes32 _uuid) public view returns (bool) {
		return doersUuid[_uuid].active;
	}
	
	function isPlanning(bytes32 _intention) public view returns (uint256) { 
        return uint256(plans[_intention].state);
    }


/////////////////
// All GETTERS
/////////////////

    function getPlan(bytes32 _plan) view internal returns (Plan) {
        return plans[_plan];
    }
	
	struct PlanData {			//An object to enable external bulk data transfer
		bytes32 conditionP;
		Desire conditionQ;
		Project state;
		address creator;
		address curator;
		} 
    function getPlanData(bytes32 _plan) view external returns (PlanData) {
        return PlanData({
			conditionP: plans[_plan].conditionP, 
			conditionQ: plans[_plan].conditionQ, 
			state: plans[_plan].state, 
			creator: plans[_plan].creator, 
			curator: plans[_plan].curator
			});
    }

	struct ServiceData {			//An object to enable external bulk data transfer
		Promise taskT;
		Desire conditionQ;
		uint timeSoft;
		uint expire;
		bytes32 hash;
		} 
    function getServiceData(bytes32 _plan, bytes32 _serviceId) view external returns (ServiceData) {
        return ServiceData({
			taskT: plans[_plan].service[_serviceId].taskT, 
			conditionQ: plans[_plan].service[_serviceId].conditionQ, 
			timeSoft: plans[_plan].service[_serviceId].timeSoft, 
			expire: plans[_plan].service[_serviceId].expire, 
			hash: plans[_plan].service[_serviceId].hash
			});
	}

    struct CondPData {
        uint experience;
        bytes32 reputation;
        bytes32 talent;
        bytes32 index;
        bytes32 hash;
        }
    function getCondPData(bytes32 _plan, bytes32 _serviceId) view external returns (CondPData) {
        return CondPData({
			experience: plans[_plan].service[_serviceId].conditionP.experience, 
			reputation: plans[_plan].service[_serviceId].conditionP.reputation, 
			talent: plans[_plan].service[_serviceId].conditionP.talent, 
			index: plans[_plan].service[_serviceId].conditionP.index, 
			hash: plans[_plan].service[_serviceId].conditionP.hash
			});
	}

    // // function getServiceTimeSoft(bytes32 _plan, bytes32 _serviceId) view external returns (uint) {
    // //     return plans[_plan].service[_serviceId].timeSoft;
	// // }

    // // function getServiceTaskT(bytes32 _plan, bytes32 _serviceId) view external returns (Promise ref) {
    // //     return plans[_plan].service[_serviceId].taskT;
	// // }
	struct FulfillmentData {
        address doer;
        bytes32 promise;
        bytes32 proof;
        Level rubric;
        uint timestamp;
        bytes32 hash;
		}
	function getFulfillmentData(bytes32 _plan, bytes32 _serviceId) view external returns (FulfillmentData) {
        return FulfillmentData({
		doer: plans[_plan].service[_serviceId].fulfillment.doer, 
		promise: plans[_plan].service[_serviceId].fulfillment.promise, 
		proof: plans[_plan].service[_serviceId].fulfillment.proof, 
		rubric: plans[_plan].service[_serviceId].fulfillment.rubric, 
		timestamp: plans[_plan].service[_serviceId].fulfillment.timestamp, 
		hash: plans[_plan].service[_serviceId].fulfillment.hash
		});
	}

	// function getFulfillmentVerif(bytes32 _plan, bytes32 _serviceId) view external returns (bytes32) {
    //     return plans[_plan].service[_serviceId].fulfillment.check[plans[_plan].service[_serviceId].fulfillment.hash].hash;
	// }

	// function getFulfillmentTimeStamp(bytes32 _plan, bytes32 _serviceId) view external returns (uint) {
    //     return plans[_plan].service[_serviceId].fulfillment.timestamp;
	// }

//     function getBDI() view internal returns (BDI) {
//         return bdi[tx.origin];
//     }

	
	function countDoers() onlyController public view returns(uint) {
		return doerCount;
	}
	
	function getCreatorsNum() public view returns(uint) {
		return creators[tx.origin].myDoers ;
	}
	
	function getCreators(address _address) view public returns (bool,uint256) {
        return (creators[_address].active, creators[_address].myDoers);
	}

	function countPromise() view external onlyController returns (uint) {
		return promiseCount;
	}

	function countOrder() view external onlyController returns (uint) {
		return orderCount;
	}	

	function countFulfillment() view external onlyController returns (uint) {
		return fulfillmentCount;
	}		
// 	function getDoersAccts() view public returns (address[]) {
// 		return doersAccts;
// 	}
	
// 	function getDoersUuid(bytes32 _uuid) public view returns(bool) {
// 		return doersUuid[_uuid].active;
// 	}

// 	function getPlans() onlyController internal view returns (bytes32[]) {
// 		return allPlans;
// 	}

/////////////////
// All SETTERS
/////////////////


    function setPlan(bytes32 _planId, Plan _data) onlyController internal returns (bool) {
        plans[_planId] = _data;
        return true;
    }

    function setPlan(bytes32 _planId, bytes32 _condP) onlyController external returns (bool) {
        plans[_planId].conditionP = _condP;
        return true;
    }

    function setPlanCurator(bytes32 _planId, bytes32 _serviceId) onlyController external returns (bool) {
        plans[_planId].service[_serviceId].conditionP = bdi[msg.sender].beliefs; // current pCondition, set new curate
		plans[_planId].curator = msg.sender;
        return true;
    }

    function setPlan(bytes32 _planId, bytes32 _url, string _projectUrl) onlyController external returns (bool) {
		plans[_planId].ipfs[_url] = _projectUrl; // additional urls of project repo.
        return true;
    }

    function setPlanSCondP(
			bytes32 _planId, 
			bytes32 _serviceId,
			bytes32 _country, 
			bytes32 _hash,
			bytes32 _cAuthority, 
			bytes32 _score, 
			bytes32 _talent, 
			bytes32 _reputation, 
			uint _experience, 
			bytes32 _index, 
			bytes32 hash) onlyController external returns (bool) 
			{
				plans[_planId].service[_serviceId].conditionP = Belief({
					talent: _talent, 
					reputation: _reputation, 
					experience: _experience, 
					index: _index, 
					hash: hash
					});
				plans[_planId].service[_serviceId].conditionP.qualification[_hash] = Qualification({
					country: _country, 
					cAuthority: _cAuthority, 
					score: _score
					});
				return true;
		}

    function setPlanSCondQ(
		bytes32 _planId, 
		bytes32 _serviceId, 
		bytes32 _theCondQ, 
		bool _theGoalG) onlyController external returns (bool) 
		{
			plans[_planId].service[_serviceId].conditionQ = Desire(_theCondQ, _theGoalG);
        	return true;
    }

    function setPlanSHash(bytes32 _planId, bytes32 _serviceId, bytes32 _data) onlyController external returns (bool) {
		plans[_planId].service[_serviceId].hash = _data;
        return true;
    }

    function setPlanSTaskT(bytes32 _planId, bytes32 _serviceId, bytes32 _reset) external onlyController returns (bool) {
		require(_reset == "reset");
		Database.Promise memory reset;
		plans[_planId].service[_serviceId].taskT = reset;
	}
	
    function setPlanSTaskT(
		bytes32 _planId, 
		bytes32 _serviceId, 
		bytes32 _doersThing, 
		uint _time,
		uint256 _value, 
		bytes32 _eoi) onlyController external returns (bool) 
		{
			plans[_planId].service[_serviceId].taskT = Promise(
				tx.origin,
				_doersThing,
				_time,
				_value,
				_eoi);
        	return true;
    }

    function setPlanSFulfillment(
		bytes32 _planId, 
		bytes32 _serviceId, 
		bytes32 _proof, 
		Level _level, 
		bytes32 _verity) onlyController external returns (bool) 
		{
			plans[_planId].service[_serviceId].fulfillment = Fulfillment({
				doer: msg.sender, 
				promise: plans[_planId].service[_serviceId].taskT.hash, 
				proof: _proof, 
				rubric: _level, 
				timestamp: block.timestamp, 
				hash: _verity
				});
			orderCount++;
        	return true;
    }

    function setPlanSFVerification(
		bytes32 _planId, 
		bytes32 _serviceId, 
		bool _state, 
		bytes32 _proof, 
		bytes32 _verity) onlyController external returns (bool) 
		{
			plans[_planId].service[_serviceId].fulfillment.check[_proof] = Verification({
				prover: tx.origin, 
				complete: _state, 
				timestamp: block.timestamp, 
				hash: _verity
				});   
			fulfillmentCount++;
			return true;
    }

	function setAllPlans(bytes32 _planId) external onlyController {
		allPlans.push(_planId);
	}
	function setPromises(bytes32 _serviceId) external onlyController {
		require(promiseCount < 2^256);
		Promises[tx.origin].push(_serviceId);
		promiseCount++;
	}
	
    // function setBDI(BDI _data) onlyController internal returns (bool) {
    //     bdi[tx.origin] = _data;
    //     return true;
    // }
	
	function setCreator(address _address, bool _active, uint _num) onlyController internal {
		creators[_address] = Creator(_active, _num);
	}

	function setDoersNum(uint _num) public onlyController {
		doerCount = _num;
	}
	
	function setDoersUuid(Doer _data, bytes32 _uuid) public {
		doersUuid[_uuid] = _data;
	}
	
	function setDoersAdd(address _addr, bool _ans) public {
	    doersAddress[_addr].active = _ans;
	}

	function setDoersAdd(address _addr) public {
	    doersAccts.push(_addr);
	}	
	
	function setDoersDec() public { // Decrement a Creators Doers
	    require(creators[msg.sender].myDoers-- > 0);
		creators[msg.sender].myDoers--;
	}
	
	function setDoersInc() public { // Increment all Doers
		require(doerCount < 2^256);
	    doerCount++;
	}
			
	function setMyDoers(address _address, uint _allowed) internal onlyController {
		creators[_address].myDoers += _allowed;
	}
	
	function setDoerBDI(
	    Flag _flag, 
	    bytes32 _var, 
	    bool _bvar, 
	    uint256 _cvar, uint256 _evar, bytes32 _level) onlyController public returns (bool)  // Check to Call by onlyDoer
		{
		if ((_flag == Flag.experience) || (_flag == Flag.e)) {
			bdi[msg.sender].beliefs.experience = _cvar;
			return true;
			} else if ((_flag == Flag.reputation) || (_flag == Flag.r)) {
				bdi[msg.sender].beliefs.reputation = _var;
				return true;
			} else if ((_flag == Flag.index) || (_flag == Flag.i)) {
				bdi[msg.sender].beliefs.index = _var;
				return true;
			} else if ((_flag == Flag.hashB) || (_flag == Flag.HB)) {
				bdi[msg.sender].beliefs.hash = _var;
				return true;
			} else if ((_flag == Flag.hashQ) || (_flag == Flag.HQ)) {
				bdi[msg.sender].beliefs.qualification[_level].score = _var;
				return true;
			} else if ((_flag == Flag.payout) || (_flag == Flag.p)) {
				bdi[msg.sender].intentions[_bvar].payout = _evar;
				return true;
				} else {
					return false;
					}
		}
		
// 	function setDoerQualify(Qualification _qualification) onlyController public { //block to onlyDoer
// 		bytes32 hash = keccak256(_qualification); 
// 		bdi[msg.sender].beliefs.qualification[hash] = _qualification;
// 		}
	
// 	function setDoerDesire(Desire _goal, bytes32 _desire) onlyController public { //block to onlyDoer
// 		bdi[msg.sender].desires[_desire] = _goal;
// 		}

// 	function setDoerIntent(Intention _service, bool _intention) onlyController public { //block to onlyDoer
// 		bdi[msg.sender].intentions[_intention] = _service;
// 		}


    // Data -> Plan
    // Produce a Plan
        // struct Plan {
		// bytes32 conditionP;
		// mapping(bytes32 => Service) service;
        // mapping(bytes32 => Service[]) services;
        // mapping(bytes32 => string) project;
		// bytes32 conditionQ;
		// }
        // mapping(bytes32 => Plan) plans;
    // function concept(bytes32 _wish, bytes32 _goal, bytes32 _preConditions) returns (Plan); // STUB
    // Examples
    // desire(aWish, aGoal, aPreconditions, aProjectUrl);
    // url = keccak256(aUrl)
        // struct Service {
		// bytes32 conditionP;
		// Promise taskT;
		// bytes32 conditionQ;
		// } 
        //} 
        //     struct Service {
		// Belief conditionP;
		// Promise taskT;
        // bytes32 conditionQ;
        // uint timeOpt;  // preferred timeline
        // uint expire;
		// } 

}
// Doers is a class library of natural or artificial entities within A multi-agent system (MAS).
// The agents are collectively capable of reaching goals that are difficult to achieve by an 
// individual agent or monolithic system. The class can be added to, modified and reconstructed, 
// without the need for detailed rewriting. 
// The nature of an agent is: 
// An identity structure
// A behaviour method
// A capability model
// 

///////////////////
// Beginning of Contract
///////////////////

contract Creators is Data {

/// @dev The actual agent contract, the nature of the agent is identified controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract.

	bytes32 public userName;
	address ownAddress;

    // enum Flag { 
	// 	experience,e,
	// 	reputation,r,
	// 	talent,t,
	// 	index,i,
	// 	hashB,HB,
	// 	country,c,
	// 	cAuthority,CA,
	// 	score,s,
	// 	hashQ,HQ,
	// 	goal,g,
	// 	statusD,SD,
	// 	statusI,SI,
	// 	service,S,
	// 	payout,p
	// 	}

	function Creators(Able _ctrl, Database _db, bytes32 _name) public {
		userName = _name;
		ownAddress = msg.sender;
		contrl = _ctrl;
		database = _db;
// 		contrl.registerContract("Creators", this);
// 		database = _ctrl.getDatabase();
// 		database.call.setCreator(msg.sender, Database.Creator(true, 1));
// 		database.setDoersNum(0);
		
	}

	function makeDoer(
	    bytes32 _name,
		bytes32 _fPrint,
        bytes32 _idNumber,
		bytes32 _email,
		bytes32 _fName,
		bytes32 _lName,
        bytes32 _hash,
		bytes32 _tag,
		bytes32 _data,
        int256 _birth,
		bool _active
		) onlyCreator public returns (bool,address) 
		{
			require(database.getCreatorsNum() > 0);
			bytes32 uuidCheck = keccak256(_fPrint, _birth, _lName, _idNumber);
			require(!database.isDoer(uuidCheck));
			// Doers newDoer = new Doers(this, _name);
			// newDoer.setDoer(setDoer(_fPrint,_idNumber,_email,_fName,_lName,_hash,_tag,_data,_birth,_active));
			Doers newDoer = new Doers(_name, setDoer(_fPrint,_idNumber,_email,_fName,_lName,_hash,_tag,_data,_birth,_active));
			database.setDoersUuid(Database.Doer(newDoer, true), uuidCheck);
			database.setDoersAdd(newDoer, true);
			database.setDoersAdd(newDoer);
			database.setDoersDec();
			database.setDoersInc();
			return (true,newDoer);
            }

/////////////////
// All ASSERTS
/////////////////


	function isCreator() public view returns (bool) { // Consider use of delegateCall
		return database.isCreator(tx.origin);
	}
	
	function isCreator(bool _active, uint _num) public {
		database.isCreator(Database.Creator({active:_active, myDoers: _num}));
	}

	function isDoer() view public returns (bool) { // Point this to oraclise service checking MSD on 
		return database.isDoer(tx.origin);	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json
	}
	
	function isDoer(address _address) view public returns (bool) { // Point this to oraclise service checking MSD on 
		return database.isDoer(_address);	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json
	}

	function isDoer(bytes32 _uuid) view public returns (bool) {
		return database.isDoer(_uuid);
	}

	function isPlanning(bytes32 _intention) view public returns (uint256) { 
        return database.isPlanning(_intention);
    }

/////////////////
// All GETTERS
/////////////////

    // Get the address of an existing contract frrom the controller.
    function getDatabase() public view returns (Database) {
        return database;   
    }
	
	function getOwner() public view returns (address) {
        return ownAddress;
	}

	function getCreator(address _address) view public returns (bool,uint256) {
        return database.getCreators(_address);
	}

	function getDoerCount() view public returns (uint) {
		return database.countDoers();
	}

// 	function getDoers() view public returns (address[]) {
// 		return database.getDoers();
// 	}

// 	function getPlans() view internal onlyDoer returns (bytes32[]) {
// 		return database.allPlans;
// 	}


/////////////////
// All SETTERS
/////////////////


// 	function setCreator(address _address, bool _active) internal onlyController {
// 		database.creators[_address] = database.Creator(_active, 0);
// 	}

// 	function setMyDoers(address _address, uint _allowed) internal onlyController {
// 		database.creators[_address].myDoers += _allowed;
// 	}

	function setDoer(
		bytes32 _fPrint,
		bytes32 _idNumber,
		bytes32 _email,
		bytes32 _fName,
		bytes32 _lName,
		bytes32 _hash,
		bytes32 _tag,
		bytes32 _data,
		int256 _birth,
		bool _active
		) internal pure returns (Database.SomeDoer) 
		{
			return Database.SomeDoer({
				fPrint:_fPrint, 
				idNumber:_idNumber, 
				email:_email, 
				fName:_fName, 
				lName:_lName, 
				hash:_hash, 
				tag:_tag, 
				data:_data, 
				birth:_birth, 
				active:_active});
		}

	function setBDI(
	    Database.Flag _flag, 
	    bytes32 _var, 
	    bool _bvar, 
	    uint256 _cvar, 
	    uint256 _evar, 
	    bytes32 _level) internal onlyDoer returns (bool)
		{
	    return database.setDoerBDI(_flag, _var, _bvar, _cvar, _evar, _level);
		}

// 	function setQualification(Database.Qualification _qualification) internal onlyDoer {
// 		database.setDoerQualify(_qualification);
// 		}
	
// 	function setDesire(Database.Desire _goal, bytes32 _desire) internal onlyDoer {
// 		database.setDoerDesire(_goal, _desire);
// 		}

// 	function setIntention(Database.Intention _service, bool _intention) internal onlyDoer {
// 		database.setDoerIntent(_service, _intention);
// 		}
		

	//function Creators() {registerContract("Creators", this);}

	// function getCreator() view public returns (address);

	// function addDoer(address addr) public;

	// function isDoer(address addr) view public returns (bool);

	// function getDoerCount() view public returns (uint);
}

// Doers is a class library of natural or artificial entities within A multi-agent system (MAS).
// The agents are collectively capable of reaching goals that are difficult to achieve by an 
// individual agent or monolithic system. The class can be added to, modified and reconstructed, 
// without the need for detailed rewriting. 
// The nature of an agent is: 
// An identity structure
// A behaviour method
// A capability model
// 

///////////////////
// Beginning of Contract
///////////////////

contract Doers {

	modifier onlyCreator {
		if (msg.sender != myCreator) 
		revert();
		_;
	}

	modifier onlyDoer {
		if (!Me.active) 
		revert();
		_;
	}

	address public Controller;
	address public myCreator;
	address public doer;
	bytes32 public userName;

	Database.SomeDoer public Me;// = SomeDoer(0x4fc6c65443d1b988, "whoiamnottelling", 346896000, "Iam", "Not", false);		
			
	Database.BDI myBDI;
	
	Database.Promise public myPromises;
	uint256 promiseCount;

	Database.Fulfillment[] myOrders;
	uint256 orderCount;
	
	//Creators.Flag aflag;
	
	function Doers(bytes32 _name, Database.SomeDoer _adoer) public {
		myCreator = msg.sender;
		doer = tx.origin;
		userName = _name;
		setDoer(_adoer);
		}
			

/////////////////
// All SETTERS
/////////////////

	function isDoer() view public returns (bool) {
		if (Me.active) {
			return true;}
			return false;
			}


/////////////////
// All GETTERS
/////////////////


	function getInfo() constant public returns (address,address,bytes32) {
		return (myCreator, doer, userName);
		}
	
	function getDoer() view public returns (bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,int256,bool) {
		return (Me.fPrint,Me.idNumber,Me.email,Me.fName,Me.lName,Me.hash,Me.tag,Me.data,Me.birth,Me.active);
		}

	struct BeliefData {
        uint experience;
        bytes32 reputation;
        bytes32 talent;
        bytes32 index;
        bytes32 hash;
        }
	function getBelief() view public returns (BeliefData) {
		return BeliefData(
			myBDI.beliefs.experience,
			myBDI.beliefs.reputation,
			myBDI.beliefs.talent,
			myBDI.beliefs.index,
			myBDI.beliefs.hash);
		}
		struct QualificationData {
        bytes32 country;
        bytes32 cAuthority;
        bytes32 score;
        }
	function getQualification(bytes32 _level) view external returns (Database.Qualification) {
		return (myBDI.beliefs.qualification[_level]);
		}

	function getDesire(bytes32 _desire) view public returns (Database.Desire) {
		return myBDI.desires[_desire];
		}

	function getIntention(bool _check) view external returns (Database.Intention) {
		return myBDI.intentions[_check];
		}
	
	function viewDesire(bytes32 _desire) view public returns (bytes32,bool) {
		return (
			myBDI.desires[_desire].goal,
			myBDI.desires[_desire].status);
			}

	function viewIntention(bool _check) view public returns (uint256,bytes32,uint256) {
		return (
			uint256(myBDI.intentions[_check].state),
			myBDI.intentions[_check].service,
			myBDI.intentions[_check].payout);
			}
	
	function getPromise() internal view onlyDoer returns (address,bytes32,uint,uint,bytes32) {
		return (myPromises.doer, myPromises.thing, myPromises.timeHard, myPromises.value, myPromises.hash);
	}


/////////////////
// All SETTERS
/////////////////


	function setBDI(
		Database.Flag _flag, bytes32 _goal, 
		bool _intent, 
		bytes32 _var, 
		bool _status,
		bytes32 _level, 
		Database.Agent _avar) internal onlyDoer returns (bool) 
		{
			if ((_flag == Database.Flag.talent) || (_flag == Database.Flag.t)) {
				return true;
				} else if ((_flag == Database.Flag.country) || (_flag == Database.Flag.c)) {
					myBDI.beliefs.qualification[_level].country = _var;
					return true;
				} else if ((_flag == Database.Flag.cAuthority) || (_flag == Database.Flag.CA)) {
					myBDI.beliefs.qualification[_level].cAuthority = _var;
					return true;
				} else if ((_flag == Database.Flag.score) || (_flag == Database.Flag.s)) {
					myBDI.beliefs.qualification[_level].score = _var;
					return true;
				} else if ((_flag == Database.Flag.goal) || (_flag == Database.Flag.g)) {
					myBDI.desires[_goal].goal = _var;
					return true;
				} else if ((_flag == Database.Flag.statusD) || (_flag == Database.Flag.SD)) {
					myBDI.desires[_goal].status = _status;
					return true;
				} else if ((_flag == Database.Flag.statusI) || (_flag == Database.Flag.SI)) {
					myBDI.intentions[_intent].state = _avar;
					return true;
				} else if ((_flag == Database.Flag.service) || (_flag == Database.Flag.S)) {
					myBDI.intentions[_intent].service = _var;
					return true;
					} else {
						return false;
						}
	}
	
	function setDoer(Database.SomeDoer _aDoer) public onlyCreator {
		Me = _aDoer;
	}

	function setBelief(Database.Belief _belief) internal onlyDoer {
		myBDI.beliefs = _belief;
	}

	function setQualification(Database.Qualification _qualification) internal onlyDoer {
		bytes32 hash = keccak256(_qualification);
		myBDI.beliefs.qualification[hash] = _qualification;
	}
	
	function setDesire(Database.Desire _goal, bytes32 _desire) internal onlyDoer {
		myBDI.desires[_desire] = _goal;
	}

	function setIntention(Database.Intention _service, bool _intention) internal onlyDoer {
		myBDI.intentions[_intention] = _service;
	}

////////////////
// Events
////////////////
    event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
}

// interface SomeDoers {
// 	function Doers(SomeDoer _aDoer) returns (bool);
// 	}
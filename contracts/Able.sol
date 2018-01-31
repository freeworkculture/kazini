pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;

/// @dev `Owned` is a base level contract that assigns an `owner` that can be
///  later changed
contract Able {

    /// @dev `owner` is the only address that can call a function with this
    /// modifier
    modifier onlyAble {require (msg.sender == owner); _;}

    address public owner;

    /// @notice The Constructor assigns the message sender to be `owner`
    function Able() internal {owner = msg.sender;}

    /// @notice `owner` can step down and assign some other address to this role
    /// @param _newOwner The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function changeOwner(address _newOwner) internal onlyAble {
        owner = _newOwner;
    }
}


contract Controller {
    /// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyController { 
        require(msg.sender == controller); 
        _; 
        }

    address public controller;

    // This is where we keep all the contracts.
    mapping (bytes32 => address) public contracts;

    mapping (bytes32 => Database) public databases;

    function Controller() public { 
        controller = msg.sender;
        registerContract("Controller", this);
        }

    /// @notice Changes the controller of the contract
    /// @param _newController The new controller of the contract
    function changeController(address _newController) public onlyController {
        controller = _newController;
    }

    // Get the address of an existing contract frrom the controller.
    function getContract(bytes32 name) onlyController internal constant returns (address) {
        return contracts[name];   
    }

    // Add a new contract to the controller. This will overwrite an existing contract.
    function registerContract(bytes32 name, address addr) onlyController public returns (bool) {
    // Only do validation if there is an actions contract.
        address cName = contracts[name];
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
    function makeDatabase(bytes32 _name) onlyController internal returns (bool,address) {
        address cName = contracts[_name];
        if (cName != 0x0) {
            return (false,cName);
            } else {
                Database newDB = new Database(this);
                contracts[_name] = newDB;
                return (true,newDB);
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
contract Database is Able {

    /// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyController {
        require(msg.sender == controller);
        _;
        }

    address public controller;

    Controller contrl;

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
					// status is dead or alive state of agent
					// lastUpdate is timestamp of last record entry
	//SomeDoer public thisDoer;// = SomeDoer(0x4fc6c65443d1b988, "whoiamnottelling", 346896000, "Iam", "Not", false);	

	// function funcForSomeDoer(SomeDoer _aDoer) {
	// 	(...	(_aDoer.fPrint),
	// 			(_aDoer.email),
	// 			(_aDoer.birth),
	// 			(_aDoer.fName),
	// 			(_aDoer.lName),
	// 			(_aDoer.status)
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
        State state;
        bytes32 service;
        uint256 payout;
        }
        enum State {ACTIVE, INACTIVE, RESERVED}
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
		uint256 myDoers;
	}
	mapping(address => Creator) creators;
///////////////////
/// @dev `SomeDoer` defines the Sovereignty of an agent
///////////////////
    struct Doer {
        address doer;
        bool active;
        }
        mapping(bytes32 => Doer) doersUuid;
        mapping(address => Doer) doersAddress;
        address[] doersAccts;
        uint public doerCount;	// !!! Can I call length of areDoers instead??!!!

///////////////////
/// @dev `B-D-I` is the structure that prescribes a strategy model to an actual agent
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

    function Database(Controller _ctrl) public {
        controller = msg.sender;
        contrl = _ctrl;
        contrl.registerContract("Database", this);
        }

    // function getPlan(bytes32 _plan) view internal returns (Plan) {
    //     return plans[_plan];
    // }

    // function getBDI() view internal returns (BDI) {
    //     return bdi[tx.origin];
    // }

    // function setPlan(bytes32 _planId, Plan _data) onlyController internal returns (bool) {
    //     plans[_planId] = _data;
    //     return true;
    // }

    // function setBDI(BDI _data) onlyController internal returns (bool) {
    //     bdi[tx.origin] = _data;
    //     return true;
    // }
}


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

contract Controlled {
    
    address public controller;
    
    // This is where we keep all the contracts.
    mapping (bytes32 => address) public contracts;

    struct Creator {
		bool active;
		uint256 myDoers;
	}
	mapping(address => Creator) creators;
///////////////////
/// @dev `SomeDoer` defines the Sovereignty of an agent
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
        int256 birth;
		bool active;
		}
    struct Doer {
        address doer;
        bool active;
        }
        mapping(bytes32 => Doer) doersUuid;
        mapping(address => Doer) doersAddress;
        address[] doersAccts;
        uint public doerCount;	// !!! Can I call length of areDoers instead??!!!
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
///////////////////
/// @dev `B-D-I` is the structure that prescribes a strategy model to an actual agent
///////////////////
	
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
    struct Belief {
        Qualification qualification;
        int256 experience;
        bytes32 reputation;
        bytes32 talent;
        bytes32 index;
        bytes32 hash;
        }
        struct Qualification {
            bytes32 country; //ISO3166-2:KE-XX;
            bytes32 cAuthority;
            bytes32 score;
            bytes32 hash;
            }
            mapping(bytes32 => Qualification[]) qualification;
            enum Level {PRIMARY,SECONDARY,TERTIARY,CERTIFICATE,DIPLOMA,BACHELOR,MASTER,DOCTORATE,LICENSE,CERTIFICATION}
    struct Desire {
        bytes32 goal;
        bool status;
        }
    struct Intention {
        Agent status;
        bytes32 service;
        uint256 payout;
        }
    enum Agent {ACTIVE, INACTIVE, RESERVED}

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

    struct BDI {
        Belief beliefs;
        mapping(bytes32 => Desire) desires;
	    mapping(bool => Intention) intentions;
	    }
        mapping(address => BDI) bdi;
        
    struct Service {
		Belief conditionP;
		Promise taskT;
        bytes32 conditionQ;
        uint timeOpt;  // preferred timeline
        uint expire;
        bytes32 hash;
		} 
        
    struct Plan {
		bytes32 conditionP;
		mapping(bytes32 => Service) service;
        // mapping(bytes32 => Service[]) services;
		bytes32 conditionQ;
        mapping(bytes32 => string) ipfs;
        Project status;
        address creator;
        address curator;
		}
        enum Project { PENDING, STARTED, CLOSED }
        mapping(bytes32 => Plan) public plans;
        bytes32[] allPlans;

    struct Promise {
        address doer;
        bytes32 thing;
        uint timeAlt;   // proposed timeline
        uint256 value;
        bytes32 hash;
    }
    mapping(address => bytes32[]) public Promises;
    uint public promiseCount;

    struct Order {
        address doer;
        bytes32 promise;
        string proof;
        uint timestamp;
        Fulfillment check;
        bytes32 hash;
        }
        struct Fulfillment {
            address prover;
            uint timestamp;
            bytes32 hash;
            bool complete;
            }
    mapping(bytes32 => Order) public orders;
    uint public orderCount;
    uint public fulfillmentCount;

    /// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyController {require(msg.sender == controller); _;}

    function Controlled() public {controller = msg.sender;}

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
    function registerContract(bytes32 name, address addr) internal returns (bool result) {
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
}

/////////////////
// TokenController interface
/////////////////

/// @dev This is designed to control the issuance and reserve of the Doit Token.
/// This contract effectively dictates the monetary operations policy.
///

/// @dev The token controller contract must implement these functions
contract TokenController {
    /// @notice Called when `_owner` sends ether to the Doit Token contract
    /// @param _owner The address that sent the ether to create tokens
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address _owner) public payable returns(bool);

    /// @notice Notifies the controller about a token transfer allowing the
    ///  controller to react if desired
    /// @param _from The origin of the transfer
    /// @param _to The destination of the transfer
    /// @param _amount The amount of the transfer
    /// @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) public returns(bool);

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @param _owner The address that calls `approve()`
    /// @param _spender The spender in the `approve()` call
    /// @param _amount The amount in the `approve()` call
    /// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount) public
        returns(bool);
}

//contract Kazini is TokenController, Able {

    // /// @notice Called when `_owner` sends ether to the Doit Token contract
    // /// @param _owner The address that sent the ether to create tokens
    // /// @return True if the ether is accepted, false if it throws
    // function proxyPayment(address _owner) public payable returns(bool) {
    //     doPayment(_owner);
    //     return true;
    // }

    // /// @notice Notifies the controller about a token transfer allowing the
    // ///  controller to react if desired
    // /// @param _from The origin of the transfer
    // /// @param _to The destination of the transfer
    // /// @param _amount The amount of the transfer
    // /// @return False if the controller does not authorize the transfer
    // function onTransfer(address _from, address _to, uint _amount) public returns(bool) {
    //     return true;
    // }


    // /// @notice Notifies the controller about an approval allowing the
    // ///  controller to react if desired
    // /// @param _owner The address that calls `approve()`
    // /// @param _spender The spender in the `approve()` call
    // /// @param _amount The amount in the `approve()` call
    // /// @return False if the controller does not authorize the approval
    // function onApprove(address _owner, address _spender, uint _amount) public returns(bool) {
    //     return true;
    // }
//}

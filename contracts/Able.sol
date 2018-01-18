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

///////////////////
/// @dev `B-D-I` is the structure that prescribes a strategy model to an actual agent
///////////////////
	struct Belief {		
		Qualification myQualification;
		uint experience;
		bytes32 reputation;
		bytes32 talent;
        bytes32 chck;
		}
        struct Qualification {
            bytes32 country; //ISO3166-2:KE-XX;
		    bytes32 cAuthority;
		    bytes32 score;
            }
            mapping(uint8 => Qualification) public qualification;
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
	struct Desire {
		bytes32 goal;
		bool status;
		}
	
	struct Intention {
		Status status;
		bytes32 task;
		uint256 factorPayout;
		}
        enum Status {INACTIVE, ACTIVE, RESERVED}

    struct BDI {
    mapping(bytes32 => Belief) beliefs;
    mapping(bytes32 => Desire) desires;
	mapping(bool => Intention) intentions;
	}
	mapping(address => BDI) bdi;

    address[] public myPromises;

    struct Service {
		bytes32 conditionP;
		Promise taskT;
		bytes32 conditionQ;
		}
        
    struct Plan {
		bytes32 conditionP;
		mapping(bytes32 => Service) services;
		bytes32 conditionQ;
		}
        mapping(bytes32 => Plan) public plans;

    struct Promise {
        address doer;
        string thing;
        uint expire;
        uint value;
        bytes32 hash;
    }

    struct Fulfillment {
        address doer;
        bytes32 promise;
        string proof;
        uint timestamp;
        bytes32 hash;
    }
    mapping(bytes32 => Fulfillment) public fulfillments;

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

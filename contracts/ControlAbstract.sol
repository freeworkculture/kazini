pragma solidity ^0.4.19;
import "./Able.sol";
pragma experimental ABIEncoderV2;

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

contract ControlAbstract {

/* Constants */

/* User Types */

	enum KBase {PRIMARY,SECONDARY,TERTIARY,CERTIFICATION,DIPLOMA,LICENSE,BACHELOR,MASTER,DOCTORATE}
    // Weights	   1,		2,		 4,		    8,		   16,	    32,		64,	    128    256
	enum IS {ACTIVE, INACTIVE, RESERVED, CREATOR, CURATOR, PROVER}
	enum Project { PENDING, APPROVED, STARTED, CLOSED }
	enum Level { POOR,SATISFACTORY,GOOD,EXCELLENT }
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

	struct SomeDoer {
        bytes32 fPrint;
        bytes32 idNumber;
		bytes32 email;
		bytes32 fName;
		bytes32 lName;
        bytes32 hash;
		bytes32 tag;
        bytes32 data;
        uint age;
		bool active;
	}

	struct BDI {
        Belief beliefs;
        Desire desires;
	    Intention intentions;
		} 
	struct Belief {
		Merits merits;
		Qualification qualification;
		} 
	struct Merits {
		uint experience;
		bytes32 reputation;
		bytes32 talent;
		uint8 index;
		bytes32 hash;
		} 
	struct Qualification {
		bytes32 country; //ISO3166-2:KE-XX;
		bytes32 cAuthority;
		bytes32 score;
		} 
	struct Desire {
        bytes32 goal;
        bool status;
		} 
	struct Intention {
        IS state;
        bytes32 service;
        uint256 payout;
		}

    struct Plans {
		Plan plan;
		bool project;
		Services services;
		} 
	struct Plan {
		bytes32 preCondition;
		Desire postCondition;
		string projectUrl;
		Project state;
		address creator;
		address curator;
		} 
	struct Services {
		Service definition;
		Promises promises;
		} 
	struct Service {
		Belief preCondition;
		Desire postCondition;
		Metas metas;
		} 
	struct Metas {
		uint timeSoft;  // preferred timeline
		uint expire;
		bytes32 hash;
		string serviceUrl;
		address doer;
		} 
	struct Promises {
		Promise order;
		Fulfillments fulfillment;
		} 
	struct Promise {
		bytes32 thing;
		uint timeHard;   // proposed timeline
		uint256 value;
		bytes32 hash;
		bytes32 lso;
		} 
	struct Fulfillments {
		Fulfillment completion;
		Verification verification;
		} 
	struct Fulfillment {
		bytes32 proof;
		Level rubric;
		uint timestamp;
		bytes32 hash;
		} 
	struct Verification {
		bytes32 verity;
		bool complete;
		uint timestamp;
		bytes32 hash;
		}

/* State Variables */

/* Events */

/* Modifiers */

/* Functions */

/// @dev The actual agent contract, the nature of the agent is identified controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract.

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
		bool _active) public returns (Database.SomeDoer);

	function getOwner() view public returns (address);

	function getCreator(address _address) view public returns (bool,uint256);

	function setCreator(address _address, bool _active) internal;
	
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
		) internal returns (Database.SomeDoer);

	function setBDI(Database.Flag _flag, bytes32 _var, bytes32 _avar, bool _bvar, int256 _cvar, Database.Agent _dvar, uint256 _evar) internal returns (bool);

/////////////////
// Controller interface
/////////////////

/// @dev This is designed to control the issuance and reserve of the Doit Token.
/// This contract effectively dictates the monetary operations policy.
///
/// @dev The token controller contract must implement these functions

    /// @notice Changes the controller of the contract
    /// @param _newController The new controller of the contract
    function changeController(address _newController) public;

    // Add a new contract to the controller. This will overwrite an existing contract.
    function registerContract(bytes32 name, address addr) internal returns (bool);
    
    // /// @notice Called when `_owner` sends ether to the Doit Token contract
    // /// @param _owner The address that sent the ether to create tokens
    // /// @return True if the ether is accepted, false if it throws
    // function proxyPayment(address _owner) public payable returns(bool);

    // /// @notice Notifies the controller about a token transfer allowing the
    // ///  controller to react if desired
    // /// @param _from The origin of the transfer
    // /// @param _to The destination of the transfer
    // /// @param _amount The amount of the transfer
    // /// @return False if the controller does not authorize the transfer
    // function onTransfer(address _from, address _to, uint _amount) public returns(bool);

    // /// @notice Notifies the controller about an approval allowing the
    // ///  controller to react if desired
    // /// @param _owner The address that calls `approve()`
    // /// @param _spender The spender in the `approve()` call
    // /// @param _amount The amount in the `approve()` call
    // /// @return False if the controller does not authorize the approval
    // function onApprove(address _owner, address _spender, uint _amount) public returns(bool);

	function isDoer() view public returns (bool);

	function getInfo() view public returns (address,address,bytes32);
	
	function getDoer() view public returns (bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,int256,bool);
	
	function getBelief() view public returns (uint256, bytes32,bytes32,bytes32,bytes32);
	
	function getQualification(bytes32 _level) view public returns (bytes32,bytes32,bytes32);

	function viewDesire(bytes32 _desire) view public returns (bytes32,bool);

	function getDesire(bytes32 _desire) view public returns (Database.Desire);

	function getIntention(bool _check) view public returns (uint256,bytes32,uint256);
	
	function getPromise() internal view returns (address,bytes32,uint,uint,bytes32);

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

	function setBDI(
		Database.Flag _flag, 
		bytes32 _goal, 
		bool _intent, bytes32 _var, 
		bool _status, 
		bytes32 _level, 
		Database.Agent _avar) internal returns (bool);
	
	function setDoer(Database.SomeDoer _aDoer) internal;

	function setBelief(Database.Belief _belief) internal;

	function setQualification(Database.Qualification _qualification) internal;
	
	function setDesire(Database.Desire _goal, bytes32 _desire) internal;

	function setIntention(Database.Intention _service, bool _intention) internal;
	
/// @dev The token controller contract must implement these functions
    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
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
    function onApprove(address _owner, address _spender, uint _amount) public returns(bool);


	        
/////////////////
// All ASSERTS
/////////////////

    
	function isCreator(address _address) view public returns (bool);
	
	function isCreator(Database.Agent _data) public;

	function isDoer(address _address) public view returns (bool);

	function isDoer(bytes32 _uuid) public view returns (bool);
	
	function isPlanning(bytes32 _intention) public view returns (uint256);


/////////////////
// All GETTERS
/////////////////

    function getPlan(bytes32 _plan) internal view returns (Database.Plan);

    function getPlanP(bytes32 _plan) external view returns (bytes32);
    
    function getPlanService(bytes32 _plan, bytes32 _serviceId) internal view returns (Database.Service);
    
    function getPlanServiceP(bytes32 _plan, bytes32 _serviceId) internal view returns (Database.Belief);
    
    function getPlanServicePQualify(bytes32 _plan, bytes32 _serviceId, bytes32 _qualify) internal view returns (Database.Qualification);
    
    function getPlanServicePexperience(bytes32 _plan, bytes32 _serviceId) internal view returns (uint);
    
    function getPlanServicePreputation(bytes32 _plan, bytes32 _serviceId) internal view returns (bytes32);
    
    function getPlanServicePtalent(bytes32 _plan, bytes32 _serviceId) internal view returns (bytes32);
    
    function getPlanServicePindex(bytes32 _plan, bytes32 _serviceId) internal view returns (bytes32);
	
    function getPlanServicePhash(bytes32 _plan, bytes32 _serviceId) external view returns (bytes32);
    
    function getPlanServiceQ(bytes32 _plan, bytes32 _serviceId) internal view returns (Database.Desire);
    
    function getPlanServiceTime(bytes32 _plan, bytes32 _serviceId) internal view returns (uint);
    
    function getPlanServiceExp(bytes32 _plan, bytes32 _serviceId) internal view returns (uint);
    
    function getPlanServiceHash(bytes32 _plan, bytes32 _serviceId) internal view returns (bytes32);
    
    function getPlanServiceFul(bytes32 _plan, bytes32 _serviceId) internal view returns (Database.Fulfillment);
        
    function getPlanQ(bytes32 _plan) external view returns (Database.Desire);
    
    function getPlanIPFS(bytes32 _plan, bytes32 _ipfsId) external view returns (string);
    
    function getPlanState(bytes32 _plan) external view returns (Database.Project);
    
    function getPlanCreator(bytes32 _plan) external view returns (address);
    
    function getPlanCurator(bytes32 _plan) external view returns (address);

    function getBDI() internal view returns (Database.BDI);
	
	function viewDoers() public view returns(uint);
	
	function getCreatorsNum() public view returns(uint);
	
	function getCreators(address _address) view public returns (bool,uint256);
	
	function getDoersAccts() view public returns (address[]);
	
	function getDoersUuid(bytes32 _uuid) public view returns(bool);

	function getPlans() internal view returns (bytes32[]);

/////////////////
// All SETTERS
/////////////////


    function setPlan(Database.Plan _data, bytes32 _planId) internal returns (bool);

    function setBDI(Database.BDI _data) internal returns (bool);
	
	function setCreator(address _address, bool _active, uint _num) internal;

	function setDoersNum(uint _num) public;
	
	function setDoersUuid(Database.Agent _data, bytes32 _uuid) public;
	
	function setDoersAdd(address _addr, bool _ans) public;

	function setDoersAdd(address _addr) public;
	
	function setDoersDec() public;
	
	function setDoersInc() public;
			
	function setMyDoers(address _address, uint _allowed) internal;
	
	function setDoerBDI(
	    Database.Flag _flag, 
	    bytes32 _var, 
	    bool _bvar, 
	    uint256 _cvar, uint256 _evar, bytes32 _level) public returns (bool);
		
	function setDoerQualify(Database.Qualification _qualification) public;
	
	function setDoerDesire(Database.Desire _goal, bytes32 _desire) public;

	function setDoerIntent(Database.Intention _service, bool _intention) public;
}


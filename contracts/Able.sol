pragma solidity ^0.4.19;
import "./ControlAbstract.sol";
// import "./Oraclize.sol";
pragma experimental ABIEncoderV2;

//////////////////////
// BaseController
//////////////////////
/// @dev `BaseController` is a base level contract that assigns an `controller` that can be
///  later changed
contract BaseController is UserDefined {

/* Constants */

    bytes32 constant public VERSION = "BaseController 0.2.3";

/* State Variables */

    Able public contrl;
	address public owner;
	address public controller;
	bool mutex;
	bytes32 public cName;
	uint8 V;
	bytes32 R;
	bytes32 S;

/* Events */

    event Log(string message);
    event ChangedOwner(address indexed oldOwner, address indexed newOwner);
	event ChangedContrl(address indexed oldContrl, address indexed newContrl);
	event ChangedController(address indexed oldController, address indexed newController);
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
	event ContractCallEvent(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _data);
	event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
	event LogNewOraclizeQuery(string description);
    event LogNewResult(string result, bytes proof);

/* Modifiers */

	/// @dev `Able` is the controller.
	/// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyController { 
        require(msg.sender == controller); 
        _; 
	}

	/// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyControlled { 
        require(contrl.contracts(msg.sender) != 0x0); 
        _; 
	}

    /// @dev `owner` is the only address that can call a function with this
    /// modifier
    modifier onlyOwner {
        require (msg.sender == owner); 
        _;
    }

    // This modifier can be used on functions with external calls to
    // prevent reentry attacks.
    // Constraints:
    //   Protected functions must have only one point of exit.
    //   Protected functions cannot use the `return` keyword
    //   Protected functions return values must be through return parameters.
    modifier preventReentry() {
        if (mutex) 
		revert();
        else 
		mutex = true;
        _;
        delete mutex;
        return;
    }

    // This modifier can be applied to pulic access state mutation functions
    // to protect against reentry if a `mutextProtect` function is already
    // on the call stack.
    modifier noReentry() {
        require(!mutex);
        _;
    }

    // Same as noReentry() but intended to be overloaded
    modifier canEnter() {
        require(!mutex);
        _;
    }
    
/* Functions */ 

    /// @notice The Constructor assigns the message sender to be `owner`
    function BaseController() internal {
        owner = tx.origin;
    }

    function getContrl() view public returns (Able) {
        return contrl;
    }

	function isAble() view public returns (bytes32) {
		contrl.KEYID;
	}

    // Change the owner of a contract
    /// @notice `setOwner` can step down and assign some other address to this role
    /// @param _newOwner The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function setOwner(address _newOwner) internal onlyOwner returns (bool) {
		assert(owner != _newOwner);
        owner = _newOwner;
        ChangedOwner(msg.sender, owner);
        return true;
    }

    /// @notice `setContrl` can step down and assign some other address to this role
    /// @param _newCtrl The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function setContrl(Able _newCtrl) internal onlyOwner returns (bool) {
		assert(contrl != _newCtrl);
        contrl = _newCtrl;
		ChangedContrl(msg.sender, owner);
        return true;
    }

    /// @notice `setController` can step down and assign some other address to this role
    ///  The address of the new controller is the address of the contrl. 
	///  0x0 can be used to create an unowned neutral vault, however that cannot be undone
    function setController(uint8 _v, bytes32 _r, bytes32 _s) internal onlyOwner returns (bool) {
		V = _v;
		R = _r;
		S = _s;
    }

    /// @notice `setController` can step down and assign some other address to this role
    ///  The address of the new controller is the address of the contrl. 
	///  0x0 can be used to create an unowned neutral vault, however that cannot be undone
    function setController() internal onlyOwner returns (bool) {
		assert(controller != address(contrl));
        controller = address(contrl);
		ChangedController(msg.sender, owner);
    }

  	function verify(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view public returns (address) {
		bytes memory prefix = "\x19Ethereum Signed Message:\n32";
		bytes32 prefixedHash = keccak256(prefix, _message);
		return ecrecover(prefixedHash, _v, _r, _s);
	}

	function verified(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view external returns (bool success) {
		verify(_message,_v,_r,_s) == msg.sender ? success = true : success = false;
	}

/* End of BaseController */
}


///////////////////
// Token Controller
///////////////////

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

//////////////////
// Data Controller
//////////////////
/// @dev `Data` is a base level contract that is a `database controller` that can be
///  later changed
contract DataController is BaseController {

/* State Variables */
    
    Database internal database;
    
    Userbase internal userbase;

/* Modifiers */

	modifier onlyCreator {
		require(userbase.isDoer(msg.sender) == IS.CREATOR);
		_;
	}

	modifier onlyDoer {
		require(userbase.isDoer(msg.sender) != IS.CREATOR);
		_;
	}
    
/* Functions */ 

	/// @notice `anybody` can Get the address of an existing contract frrom the controller.
    function getDatabase() view public returns (Database) {
        return database;   
    }
}
/* End of Data */

////////////////
// Able Contract
////////////////
contract Able is DataController {

/* Constants */
// !!! ******** FOR TEST ONLY CHANGE TO ACTUAL 40 BYTES FPRINT ***********
	bytes32 constant public KEYID = 0x9BCB2540EBAC30FC9E9EFF3D259B64A2;
	bytes32 constant internal CONTRACTNAME = "Able";

/* State Variables */

    // This is where we keep all the contracts.
    mapping (address => bytes32) public contracts;

/* Events */
/* Modifiers */
/* Functions */ 

    function Able() public { 
        contrl = Able(this);
        controller = this;
        cName = CONTRACTNAME;
        contracts[this] = cName;
		owner = msg.sender;
		//	database = Database(makeContract("database"));
		//  userbase = Userbase(makeContract("userbase"));
		// 	ContractEvent(this,msg.sender,tx.origin);
	}

	///////////////////
	// Controller Logic

	// Change the owner of a contract
	/// @notice `owner` can step down and assign some other address to this role
	/// @param _newOwner _sig The address of the new owner. 0x0 can be used to create
	///  an unowned neutral vault, however that cannot be undone
	function changeOwner(address _newOwner, bytes32 _sig) public onlyOwner returns (bool) {
		require(_sig == 0x0);
		// require(verify(_sig,_v,_r,_s) == controller);
		setOwner(_newOwner);
	}

	/// @notice `contrl` can step down and assign some other address to this role
	/// @param _newCtrl _sig The address of the new owner. 0x0 can be used to create
	///  an unowned neutral vault, however that cannot be undone
	function changeContrl(Able _newCtrl, bytes32 _sig) public onlyOwner returns (bool) {
		require(_sig == 0x0);
		// require(verify(_sig,_v,_r,_s) == controller);
		setContrl(_newCtrl);
		// _e.delegatecall(bytes4(sha3("setN(uint256)")), _n); // D's storage is set, E is not modified
		// contrl.delegatecall(bytes4(sha3("setContrl(address)")),_newCtrl);
		
	}

	/// @notice `controller` can step down and assign some other address to this role
	/// @param _sig The address of the new controller is the address of the contrl. 
	///  0x0 can be used to create an unowned neutral vault, however that cannot be undone
	function changeController(bytes32 _sig) public onlyOwner returns (bool) {
		require(_sig == 0x0);
		// require(verify(_sig,_v,_r,_s) == controller);
		setController();
	}
	///////////////////


    /// @notice Get the address of an existing contract frrom the controller.
    /// @param _address The new controller of the contract
	//  @dev `Controller` can retrive a registered contract
    function getContract(address _address) view external onlyOwner returns (bytes32) {
        return contracts[_address];
    }

    /// @notice Add a new contract to the controller. This will not overwrite an existing contract.
    /// @param _address _name The address of the new owner. 0x0 can be used to create
	//  @dev `Controller` can register a contract and assign to it some role
    function registerContract(
		address _address, 
		bytes32 _name,
		bytes32 _sig) external onlyOwner returns (bool)	 // This guard exhibits buglike behaviour, 
		{													// Only do validation if there is an actions contract. stops contract from overwriting itself.
			require(_sig == 0x0);
			// require(verify(_sig,_v,_r,_s) == controller);
			require(contracts[_address] == 0x0);
			contracts[_address] = _name;
			ContractCallEvent(this,msg.sender,tx.origin,_name);
			return true;
	}

    // Remove a contract from the controller. We could also selfdestruct if we want to.
    function removeContract(address _address, bytes32 _sig) onlyOwner external returns (bool result) {
		require(_sig == 0x0);
		// require(verify(_sig,_v,_r,_s) == controller);
        require(contracts[_address] != 0x0);
        // Kill any contracts we remove, for now.
		bytes32 reset;
		contracts[_address] = reset;
		ContractCallEvent(this,msg.sender,tx.origin,CONTRACTNAME);
		return true;
    }
                
    // // Make a new contract.
    // function makeContract(bytes32 _base, bytes32 _sig) public returns (address contract_) {
	// 	require(_sig == 0x0);
	// 	// require(verify(_sig,_v,_r,_s) == controller);
    //     if (_base == "database") {
    //         contract_ = new Database(contrl);
    //         contracts[contract_] = Database(contract_).cName();
    //     } else if (_base == "userbase") {
    //         contract_ = new Userbase(contrl);
    //         contracts[contract_] = Userbase(contract_).cName();
    //     } else if (_base == "creator") {
    //         contract_ = new Creators(this,userbase,_base);
    //         contracts[contract_] = Creators(contract_).cName();
    //     }
    // }
        
                
    // // Make a new creators contract.
    // function makeCreators(bytes32 _name) onlyController public returns (Creators create) {
    //     create = new Creators(this,userbase,_name);
    //     contracts[create] = create.cName();
    // }
/* End of Able */
}


////////////////////
// Database Contract
////////////////////
contract Database is BaseController {
    
/* Constants */

    bytes32 constant internal CONTRACTNAME = "DATABASE 0.0118";
	uint8 constant internal BASE = 2;

/* Enums*/


/* Structs*/


/* State Variables */
    
	uint public GEN = 1000;
	uint public plansCount;
	uint public promiseCount;
    uint public orderCount;
    uint public fulfillmentCount;
	uint public verificationCount;
	Userbase userbase;

	/// @dev `Initialised data structures
	/// @notice `Creator && Doer lookup` is the type that defines a strategy model of an actual agent
	// @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
	// Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
	// experience is period from qualification in seconds
	// reputaion is PGP trust level flag !!! CITE RFC PART
	// talent is user declared string of talents

    mapping(bytes32 => Plans) public plans;

	mapping(bytes32 => address[]) public allPromises;

    // bytes32[] public allPlans;

/* Events */

	event SetPlan(address indexed _from, address indexed _sender, address indexed _creator, bytes32 _intention, bytes32 _planData);
	event SetService(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId, bytes32 _serviceData);
	event SetPromise(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
	event SetOrder(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
	event SetFulfillment(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
	event SetVerification(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);

/* Modifiers */    
    
	modifier onlyCreator {
		require(userbase.isDoer(msg.sender) == IS.CREATOR);
		_;
	}

	modifier onlyDoer {
		require(userbase.isDoer(msg.sender) != IS.CREATOR);
		_;
	}

	modifier onlyCurator {
		require(userbase.isDoer(msg.sender) == IS.CURATOR);
		_;
	}

	modifier onlyTrustee {
		require(userbase.isDoer(msg.sender) == IS.ACTIVE);
		_;
	}

	modifier onlyProver {
		require(userbase.isDoer(msg.sender) == IS.PROVER);
		_;
	}
/* Functions */ 

    function Database(Able _ctrl) public {
        cName = CONTRACTNAME;
        contrl = _ctrl;
		owner = contrl.owner();
		controller = contrl.controller();
		ContractEvent(this,msg.sender,tx.origin);
	}

/////////////////
// All METAS
/////////////////

	// function setAllPlans(bytes32 _planId) external onlyController {
	// 	allPlans.push(_planId);
	// }
	
	function setPromise(bytes32 _serviceId) external onlyController {
		require(promiseCount++ < 2^256);
		allPromises[_serviceId].push(tx.origin);
	}

	function getBase() pure public returns (uint8) {
		return BASE;
	}

/////////////////
// All ASSERTS
/////////////////

	function isPlanning(bytes32 _intention) public view returns (uint256) { 
        return uint256(plans[_intention].state);
    }

/////////////////
// All GETTERS FOR FUTURE USE
/////////////////

	/// @notice Get the initialisation data of a plan created by a Creator. 
    /// @param _intention The query condition of the contract
	//  @dev `anybody` can retrive the plan data in the contract Plan has five levels
    

	function plan(bytes32 _intention) 
	view public returns (Plan) {
        return plans[_intention].plan;
    }
	
	function status(bytes32 _intention) 
	view public returns (Project) {
        return plans[_intention].state;
    }

    function precondition(bytes32 _intention, bytes32 _serviceId) 
	view public returns (Merits) {
        return plans[_intention].services[_serviceId].definition.preCondition.merits;
    }

    function precondition(bytes32 _intention, bytes32 _serviceId, KBase _index)
	view public returns (Qualification) {
        return plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)];
	}

    function postcondition(bytes32 _intention, bytes32 _serviceId) 
	view public returns (Desire) {
        return plans[_intention].services[_serviceId].definition.postCondition;
    }

    function metas(bytes32 _intention, bytes32 _serviceId) 
	view public returns (Metas) {
        return plans[_intention].services[_serviceId].definition.metas;
    }

    function promise(bytes32 _intention, bytes32 _serviceId, address _address) 
	view public returns (Promise) {
        return plans[_intention].services[_serviceId].procure[_address].promise;
    }
	
	function fulfillment(bytes32 _intention, bytes32 _serviceId, address _doer) 
	view public returns (Fulfillment) {
		return plans[_intention].services[_serviceId].procure[_doer].fulfillment;
	}

	function verification(bytes32 _intention, bytes32 _serviceId, address _doer, address _prover)
	view public returns (Verification) {
		return plans[_intention].services[_serviceId].procure[_doer].verification[_prover];
	}


//////////////////////////////
// ALL GETTERS FOR CURRENT USE
//////////////////////////////


	function getPlan(bytes32 _intention) 
	view public returns (
	bytes32 preCondition,
	uint time,
	uint budget,
	bytes32 projectUrl,
	address creator,
	address curator) {
		return (
			plans[_intention].plan.preCondition,
			plans[_intention].plan.time,
			plans[_intention].plan.budget,
			plans[_intention].plan.projectUrl,
			plans[_intention].plan.creator,
			plans[_intention].plan.curator);
    }
	
	function getStatus(bytes32 _intention)
	view external returns (Project, bytes32 goal, bool success) {
		return (
			plans[_intention].state,
			plans[_intention].plan.postCondition.goal,
			plans[_intention].plan.postCondition.status);
	}

    function getPrecondition(
		bytes32 _intention, bytes32 _serviceId) 
	view public returns (
	uint experience,
	bytes32 reputation,
	bytes32 talent,
	uint8 index) {
		return (
			plans[_intention].services[_serviceId].definition.preCondition.merits.experience,
			plans[_intention].services[_serviceId].definition.preCondition.merits.reputation,
			plans[_intention].services[_serviceId].definition.preCondition.merits.talent,
			plans[_intention].services[_serviceId].definition.preCondition.merits.index);
    }

    function getPrecondition(
		bytes32 _intention, bytes32 _serviceId, KBase _index)
	view public returns (
	bytes32 country,
	bytes32 cAuthority,
	bytes32 score) {
		return (
			plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].country,
			plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].cAuthority,
			plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].score);
	}

    function getPostcondition(
		bytes32 _intention, bytes32 _serviceId) 
	view external returns (
	bytes32 goal_,
	bool status_) {
		return (
			plans[_intention].services[_serviceId].definition.postCondition.goal,
			plans[_intention].services[_serviceId].definition.postCondition.status);
    }

    function getMetas(
		bytes32 _intention, bytes32 _serviceId) 
	view external returns (
	uint timeSoft, // preferred timeline
	uint expire,
	bytes32 hash,
	bytes32 serviceUrl,
	address doer) {
        return (
			plans[_intention].services[_serviceId].definition.metas.timeSoft,
			plans[_intention].services[_serviceId].definition.metas.expire,
			plans[_intention].services[_serviceId].definition.metas.hash,
			plans[_intention].services[_serviceId].definition.metas.serviceUrl,
			plans[_intention].services[_serviceId].definition.metas.doer);
    }

    function getPromise(
		bytes32 _intention, bytes32 _serviceId, address _address) 
	view external returns (
	IS state,			// Intention type,
	bytes32 service,	// Intention type,
	uint256 payout, 	// Intention type,
	uint timeHard,
	bytes32 hash) {
			return (
				plans[_intention].services[_serviceId].procure[_address].promise.thing.state,
				plans[_intention].services[_serviceId].procure[_address].promise.thing.service,
				plans[_intention].services[_serviceId].procure[_address].promise.thing.payout,
				plans[_intention].services[_serviceId].procure[_address].promise.timeHard,
				plans[_intention].services[_serviceId].procure[_address].promise.hash);
    }
	
	function getFulfillment(
		bytes32 _intention, bytes32 _serviceId, address _doer) 
	view external returns (
	bytes32 proof,
	Level rubric,
	uint timestamp,
	bytes32 hash) {
		return (
			plans[_intention].services[_serviceId].procure[_doer].fulfillment.proof,
			plans[_intention].services[_serviceId].procure[_doer].fulfillment.rubric,
			plans[_intention].services[_serviceId].procure[_doer].fulfillment.timestamp,
			plans[_intention].services[_serviceId].procure[_doer].fulfillment.hash);
	}

	function getVerification(
		bytes32 _intention, bytes32 _serviceId, address _doer, address _prover) 
	view external returns (
	bytes32 verity,
	bool complete,
	uint timestamp,
	bytes32 hash) {
		return (
			plans[_intention].services[_serviceId].procure[_doer].verification[_prover].verity,
			plans[_intention].services[_serviceId].procure[_doer].verification[_prover].complete,
			plans[_intention].services[_serviceId].procure[_doer].verification[_prover].timestamp,
			plans[_intention].services[_serviceId].procure[_doer].verification[_prover].hash);
	}

/////////////////
// All SETTERS
/////////////////

	/// @notice Get the initialisation data of a plan created by a Creator. 
    /// @param _intention The query condition of the contract
	//  @dev `anybody` can retrive the plan data in the contract Plan has five levels
	function setPlan(
		bytes32 _intention, Plan _planData, Project _state)
	public payable onlyCreator {
		require(uint(plans[_intention].state) == 0); // This is a new plan? // Cannot overwrite incomplete Plan // succesful plan??
		plans[_intention].plan = _planData;
		plans[_intention].state = _state;
		SetPlan(
			tx.origin,
			msg.sender,
			plans[_intention].plan.creator,_intention,
			plans[_intention].plan.postCondition.goal);
			
	}

    function setService(
		bytes32 _intention, bytes32 _serviceId, Merits _merits, Qualification _qualification, KBase _index)
	public onlyCurator {
		plans[_intention].services[_serviceId].definition.preCondition.merits = _merits;
		plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)] = _qualification;
		SetService(
			tx.origin,
			msg.sender,
			_intention,
			_serviceId,
			bytes32(uint(_index)));		
	}

    function setService(
		bytes32 _intention, bytes32 _serviceId, Desire _postCondition)
	public onlyCurator {
		plans[_intention].services[_serviceId].definition.postCondition = _postCondition;
		SetService(
			tx.origin,
			msg.sender,
			_intention,
			_serviceId,
			plans[_intention].services[_serviceId].definition.postCondition.goal);				
	}

    function setService(
		bytes32 _intention, bytes32 _serviceId, Metas _metas)
	public onlyCurator {
		plans[_intention].services[_serviceId].definition.metas = _metas;
		SetService(
			tx.origin,
			msg.sender,
			_intention,
			_serviceId,
			plans[_intention].services[_serviceId].definition.metas.serviceUrl);
	}
	
	function setPromise(
		bytes32 _intention, bytes32 _serviceId, address _address, Promise _data)
	public onlyDoer {
		plans[_intention].services[_serviceId].procure[_address].promise = _data;
		SetPromise(tx.origin,msg.sender,_intention,_serviceId);
    }

	function setOrder(
		bytes32 _intention, bytes32 _serviceId, address _address, Order _data)
	public onlyDoer {
		plans[_intention].services[_serviceId].order = _data;
		SetOrder(tx.origin,msg.sender,_intention,_serviceId);
    }

	function setFulfillment(
		bytes32 _intention, bytes32 _serviceId, address _doer, Fulfillment _data)
	public onlyTrustee {
		plans[_intention].services[_serviceId].procure[_doer].fulfillment = _data;
		SetFulfillment(tx.origin,msg.sender,_intention,_serviceId);
	}

	function setVerification(
		bytes32 _intention, bytes32 _serviceId, address _doer, address _prover, Verification _data)
	public onlyProver {
			plans[_intention].services[_serviceId].procure[_doer].verification[_prover] = _data;
			SetVerification(tx.origin,msg.sender,_intention,_serviceId);
	}

/* End of Database */
}

////////////////////
// Userbase Contract
////////////////////
contract Userbase is BaseController {
    
/* Constants */

    bytes32 constant internal CONTRACTNAME = "USERBASE 0.0118";
	uint8 constant public BASE = 2;

/* Enums */


/* Structs */
	

/* State Variables */
    
	uint public promiseCount;
	uint public doerCount;						// !!! Can I call length of areDoers instead??!!!

	uint internal talentK; 						// Total number of all identified talents
	uint internal talentI;	  					// Total number of talents of all individuals
	uint internal talentR;						// Total number of unique talents


    mapping(bytes32 => uint) public talentF; 	// Frequency of occurence of a talent  
        
    mapping(address => Agent) public agents;

	mapping(bytes32 => address) public uuids;

	mapping(address => bytes32[]) public allPromises;

/* Events */

	event SetPlan(address indexed _from, address indexed _sender, address indexed _creator, bytes32 _intention, bytes32 _goal);

/* Modifiers */    
    
	modifier onlyCreator {
		require(agents[msg.sender].state == IS.CREATOR);
		_;
	}

	modifier onlyDoer {
		require (agents[msg.sender].state != IS.CREATOR); 
		_;
	}

	modifier onlyCurator {
		require (agents[msg.sender].state == IS.CURATOR); 
		_;
	}

	modifier onlyTrustee {
		require (agents[msg.sender].state == IS.ACTIVE); 
		_;
	}

	modifier onlyProver {
		require (agents[msg.sender].state == IS.PROVER); 
		_;
	}
/* Functions */ 

    function Userbase(Able _ctrl) public {
		cName = CONTRACTNAME;
        contrl = _ctrl;
		owner = contrl.owner();
		controller = contrl.controller();
		ContractEvent(this,msg.sender,tx.origin);
	}

/////////////////
// All ASSERTS
/////////////////

	function isDoer(address _address) public view returns (IS) { // Consider use of delegateCall
		require(agents[_address].active);
		return agents[_address].state;
	}

	function isDoer(bytes32 _uuids) external view returns (IS) { // Consider use of delegateCall
		return isDoer(uuids[_uuids]);
	}

/////////////////
// All GETTERS
/////////////////

	/// @notice Get the data of all Talents in the ecosystem.
    /// @param _talent The talent whose frequency is being queried 
	//  @dev `anybody` can retrive the talent data in the contract
	function getTalents(bytes32 _talent) 
	view external returns (uint talentK_, uint talentI_, uint talentR_, uint talentF_) {
		// check_condition ? true : false;
		talentK_ = talentK;
		talentI_ = talentI;
		talentR_ = talentR;
		talentF_= talentF[_talent];
		
	}

	/// @notice Get the number of doers that can be spawned by a Creators.
    /// The query condition of the contract
	//  @dev `anybody` can retrive the count data in the contract
	function getAgent(address _address) 
	public view returns (bytes32 keyid_, IS state_, bool active_, uint myDoers_) {
		return (
			agents[_address].keyId,
			agents[_address].state,
			agents[_address].active,
			agents[_address].myDoers);
	}

	function getAgent(bytes32 _uuid) 
	external view returns (address) { // Point this to oraclise service checking MSD on 
		return uuids[_uuid];	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json
	}

/////////////////
// All SETTERS
/////////////////

	/// @notice Get the initialisation data of a plan created by a Creator. 
    /// The query condition of the contract
	//  @dev `anybody` can retrive the plan data in the contract Plan has five levels

	/// @notice Get the initialisation data of a plan created by a Creator. 
    /// The query condition of the contract
	//  @dev `anybody` can retrive the plan data in the contract Plan has five levels

	function incTalent() payable public onlyDoer returns (bool) {
		bytes32 _talent_;
		(,,_talent_,,) = Doers(msg.sender).merits();
		if (talentF[_talent_] == 0) {  // First time Doer 
			require(talentR++ < 2^256);
			}
		require(talentF[_talent_]++ < 2^256);
		require(talentI++ < 2^256);
		require(talentK++ < 2^256);
	}

	function decTalent() payable public onlyDoer returns (bool) {
		bytes32 _talent_;
		(,,_talent_,,) = Doers(msg.sender).merits();
		require(talentF[_talent_]-- > 0);
		if (talentF[_talent_] == 0) {  // First time Doer 
			require(talentR-- > 0);
			}
		require(talentI-- > 0);
	}

	function initAgent(address _address) public returns (bool) {
		require(doerCount++ < 2^256);
		bytes32 keyid_;
		bytes32 uuid_;
		(,,,,,uuid_,keyid_,,) = Doers(_address).getDoer(); 
		agents[_address] = 
		Agent({
			keyId: keyid_, 
			state: IS.INACTIVE, 
			active: true, 
			myDoers: 0
			});
		uuids[uuid_] = _address;
	}

	function incAgent(address _address) public { // Decrement a Creators Doers
	    require(agents[_address].myDoers++ < 2^256);
	}

	function decAgent(address _address) public { // Decrement a Creators Doers
	    require(agents[_address].myDoers-- > 0);
	}

	function setAgent(address _address, bytes32 _keyId) 
	external onlyController returns (bytes32) {
		return agents[_address].keyId = _keyId;
	}

	function setAgent(address _address, IS _state) 
	external onlyController returns (IS) {
		return agents[_address].state = _state;
	}

	function setAgent(address _address, bool _active) 
	external onlyController returns (bool) {
		return agents[_address].active = _active;
	}

	function setAgent(address _address, uint _myDoers) 
	external onlyController returns (uint) {
		return agents[_address].myDoers = _myDoers;
	}

	function setAllPromises(bytes32 _serviceId) external onlyController {
		require(promiseCount++ < 2^256);
		allPromises[tx.origin].push(_serviceId);
	}

/* End of Userbase */
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

contract Doers is UserDefined {

	bytes32 constant public CONTRACTNAME = "DOER 0.0118";
	bytes32 public KEYID;
	bytes32 public UUID;

	enum BE {QUALIFICATION, EXPERIENCE, REPUTATION, TALENT}

	modifier onlyCreator {
		require(msg.sender == address(creator));
		_;
	}

	modifier onlyDoer {
		require(iam() && msg.sender == owner);
		_;
	}

	Creators internal creator;
	Userbase internal userbase;
	address internal owner;	

	SomeDoer internal Iam;// = SomeDoer(0x4fc6c65443d1b988, "whoiamnottelling", 346896000, "Iam", "Not", false);		
			
	BDI internal bdi;

	Merits public merits = bdi.beliefs.merits;
	
	mapping (bytes32 => bytes32) promises;
	uint public promiseCount;
	uint public orderCount;
	uint public fulfillmentCount;

	uint8 BASE; // !!! GET THIS DATA FROM DATABASE
	uint8 rate = 10; // !!! GET THIS DATA FROM DATABASE
	uint year = 31536000; // !!! GET THIS DATA FROM DATABASE
	uint period = 31536000; // !!! GET THIS DATA FROM DATABASE

	struct WOT {
		uint refMSD; // !!! GET THIS DATA FROM DATABASE  **** MAYBE WE SHOULD JUST MEASURE THIS RELATIVE TO THE INDIVIDUAL ****
		uint refRank;  //!!! GET THIS DATA FROM DATABASE
		uint refSigned; //!!! GET THIS DATA FROM DATABASE
		uint refSigs; //!!! GET THIS DATA FROM DATABASE
		uint refTrust; //!!! GET THIS DATA FROM DATABASE
	}

	WOT callBackResults;

	mapping (bytes32 => mapping (bool => BE)) callBackData;
	mapping (bytes32 => BE) callBackFunc;
	bool toUpdate;
	bool toFlip;

	Qualification newQualification;
	uint newExperience;
	KBase newKBase;
	
	//Creators.Flag aflag;
	
	function Doers(Creators _creator) public {
		creator = _creator;
		owner = tx.origin;
		// oraclize_setCustomGasPrice(4000000000 wei);
        // oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS); // !!! UNCOMMENT BEFORE DEPLOYING
		ContractEvent(this,msg.sender,tx.origin);
	}

	function callBack(bytes32 _callid, WOT _result, bytes proof) public onlyCreator {
		callBackResults = _result;
		LogNewResult(_callid, proof);
		ContractCallEvent(this,msg.sender,tx.origin,_callid);
		///!!! Insert sNARK Proof function HERE
		if (callBackFunc[_callid] == BE.QUALIFICATION) {
			toUpdate = true;
			setQualification(newKBase,newQualification,newExperience);
			setReputation(bytes32(_result.refRank));
			updateIndex();
		}

		if (callBackFunc[_callid] == BE.TALENT) {
			setTalent(bytes32(_result.refRank));
			updateIndex();
		}
	// !!! THE CALLBACK FUNC SHOULD COMPUTE AND UPDATE THE INDEX FIELD
	// !!! THE CALLBACK FUNC SHOULD HASH THE BDI AND UPDATE HASH FIELD
	}		
	
	function updateIndex() internal returns (bool) {
		uint8 merit = uint8(KBase.DOCTORATE);
		while (bdi.beliefs.qualification[merit].cAuthority == 0x0) {
			// merit == 0 ? bdi.beliefs.index = merit : merit --;
			if (merit == 0) {
				bdi.beliefs.merits.index = 1;
				return false;}
			merit--;
		}

		uint8 T = uint8(bdi.beliefs.merits.talent);
		uint8 R = uint8(bdi.beliefs.merits.reputation);
		uint8 Q = merit; 
		uint8 q;
		if ((block.timestamp - bdi.beliefs.merits.experience) > year) {
			// !!! Maybe subtract Reputation and Talent first here before proceeding
			q = (Q * ((1 + rate/100) ^ uint8(bdi.beliefs.merits.experience / period)));
			} else {
				q = Q;
			}
		BASE = T + R + q;
		
	}

/////////////////
// All HELPERS
/////////////////
function bytesToString(bytes32 _bytes) public constant returns (string) {

    // string memory str = string(_bytes);
    // TypeError: Explicit type conversion not allowed from "bytes32" to "string storage pointer"
    // thus we should fist convert bytes32 to bytes (to dynamically-sized byte array)

    bytes memory bytesArray = new bytes(_bytes.length);
    for (uint256 i; i < _bytes.length; i++) {
        bytesArray[i] = _bytes[i];
        }
    return string(bytesArray);
    }

/////////////////
// All ASSERTERS
/////////////////

	function iam() view public returns (bool iam_) {
		userbase.isDoer(this) != IS.CREATOR ? 
		iam_ = true : 
		iam_ = userbase.isDoer(this) == IS.CREATOR;
	}

/////////////////
// All GETTERS
/////////////////

	function getDoer() 
	view external returns (
	bytes32 fPrint,
	bytes32 idNumber,
	bytes32 email,
	bytes32 fName,
	bytes32 lName,
	bytes32 keyid,
	bytes32 uuid,
	bytes32 data,
	uint age) {
			return(
				Iam.fPrint,
				Iam.idNumber,
				Iam.email,
				Iam.fName,
				Iam.lName,
				Iam.uuid,
				Iam.keyid,
				Iam.data,
				Iam.age);
	}
	
	function getBelief(KBase _kbase) 
	view external returns (
	bytes32 country_,
	bytes32 cAuthority_,
	bytes32 score_,
	uint experience_,
	bytes32 reputation_,
	bytes32 talent_,
	uint8 index_) {
		return (
			bdi.beliefs.qualification[uint8(_kbase)].country,
			bdi.beliefs.qualification[uint8(_kbase)].cAuthority,
			bdi.beliefs.qualification[uint8(_kbase)].score,
			bdi.beliefs.merits.experience,
			bdi.beliefs.merits.reputation,
			bdi.beliefs.merits.talent,
			bdi.beliefs.merits.index);
	}
	
	function getDesire(bytes1 _desire) 
	view external returns (bytes32,bool) {
		return (
			bdi.desires[_desire].goal,
			bdi.desires[_desire].status);
	}

	function getIntention(bool _intention) 
	view external returns (IS,bytes32,uint256) {
		return (
			bdi.intentions[_intention].state,
			bdi.intentions[_intention].service,
			bdi.intentions[_intention].payout);
	}

/////////////////
// All SETTERS
/////////////////

	function init(SomeDoer _adoer) public {
		Iam = _adoer;
		KEYID = _adoer.uuid;
		UUID = _adoer.keyid;
	}

	function setQualification(
	KBase _kbase, 
	bytes32 _country, 
	bytes32 _cAuthority, 
	bytes32 _score, 
	uint _year) public onlyDoer {
		toUpdate = false;
		// bytes memory _data;
		Doers(creator).setQualification(_kbase,Qualification({country: _country, cAuthority: _cAuthority, score: _score}),_year);
		// mapping (bytes32 => mapping (bool => bytes)) callBackData;
		callBackData[keccak256(msg.data)][false] = BE.QUALIFICATION;
		LogSetQualification(this,msg.sender,tx.origin,keccak256(msg.data),Iam.uuid,Iam.keyid,_kbase,msg.data);
	}

	function setQualification(
		KBase _kbase, Qualification _qualification, uint _year) 
	external {
		if (_kbase == KBase.BACHELOR) {		// exclude Bachelors from prerequisite of having a License
			require(bdi.beliefs.qualification[uint8(KBase.SECONDARY)].cAuthority != 0x0);
			} else {
				require(bdi.beliefs.qualification[uint8(_kbase) - 1].cAuthority != 0x0);
			}
		if (toUpdate) {	
			bdi.beliefs.qualification[uint8(_kbase)] = _qualification;
			bdi.beliefs.merits.experience = _year;
			toUpdate = false;
			Qualification memory NULL;
			uint ZERO;
			newQualification = NULL;
			newExperience = ZERO;
			} else {	// !!! USE CREATORS CALLBACK FUNC AND GET VERIFICATION OF CAUTHORITY
				toUpdate = false;
				bytes32 country = newQualification.country;
				bytes32 cAuthority = newQualification.cAuthority;
				bytes32 score = newQualification.score;
				require (country == 0x0 && cAuthority == 0x0 && score == 0x0 && _year == 0);
				bytes32 callid = keccak256(country,cAuthority,score);
				callBackFunc[callid] = BE.QUALIFICATION;
				newKBase = _kbase;
				newQualification = _qualification;
				newExperience = _year;
				LogSetQualification(this,msg.sender,tx.origin,callid,Iam.uuid,Iam.keyid,_kbase,msg.data);
			}
	}

	function setReputation(bytes32 _reputation) internal {
		bdi.beliefs.merits.reputation = _reputation;
	// !!! USE CREATORS CALLBACK FUNC AND GET COMPUTE OF WOT
		bytes32 callid = keccak256(_reputation);
		callBackFunc[callid] = BE.REPUTATION;
		LogSetReputation(this,msg.sender,tx.origin,callid,Iam.uuid,Iam.keyid);


	}

	function setTalent(bytes32 _talent) public onlyDoer {
		if (bdi.beliefs.merits.talent.length == 0x0) {
			bdi.beliefs.merits.talent = _talent;
			Userbase(userbase).incTalent();
		} else {
			assert(_talent.length <= bdi.beliefs.merits.talent.length);
			Userbase(userbase).decTalent();
			bdi.beliefs.merits.talent = _talent;
			Userbase(userbase).incTalent();
		}
	// !!! USE CREATORS CALLBACK FUNC AND GET COMPUTE OF TALENT INDEX
		bytes32 callid = keccak256(_talent);
		callBackFunc[callid] = BE.TALENT;
		LogSetTalent(this,msg.sender,tx.origin,callid,Iam.uuid,Iam.keyid,keccak256(_talent));
	}

	function setbdi(bytes1 _desire, Desire _goal) public onlyDoer {
		bdi.desires[_desire] = _goal;
	}

	function setbdi(bool _intention, Intention _service) public onlyDoer {
		bdi.intentions[_intention] = _service;
	}

////////////////
// Events
////////////////
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
	event ContractCallEvent(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _data);
	event QualificationEvent(address indexed _this, address indexed _sender, address indexed _origin, bytes16 _message, bytes _data);
	event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
	event LogNewOraclizeQuery(string description);
    event LogNewResult(bytes32 result, bytes proof);
	event LogSetQualification(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _callid, bytes32 _uuid, bytes32 _keyid, KBase _kbase, bytes _data);
	event LogSetReputation(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _callid, bytes32 _uuid, bytes32 _keyid);
	event LogSetTalent(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _callid, bytes32 _uuid, bytes32 _keyid, bytes32 _data);
}

// interface SomeDoers {
// 	function Doers(SomeDoer _aDoer) returns (bool);
// 	}

///////////////////
// Beginning of Contract
///////////////////

contract Creators is DataController {

/// @dev The actual agent contract, the nature of the agent is identified controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract.

    bytes32 constant internal CONTRACTNAME = "CREATOR 0.0118";
	bytes32 constant public KEYID = 0x90EBAC34FC40EAC30FC9CB464A2E56;

	address public owner;

	mapping (address => mapping (bool => bytes)) callData;	

	function Creators(Able _ctrl, Userbase _ubs) public {
		cName = CONTRACTNAME;
		contrl = _ctrl;
		userbase = _ubs;
		owner = contrl.owner();
		controller = contrl.controller();
		ContractEvent(this,msg.sender,tx.origin);
	}

	  //prime the data using the fallback function.
	function() payable {
		callData[msg.sender][false] = msg.data;
	}

	function execute(address _address) external onlyController returns (bool) {
		require (callData[_address][true].length == 0 && callData[_address][false].length != 0);
		bytes memory _data = callData[msg.sender][false];
		callData[msg.sender][true] = bytes32ToBytes(keccak256(_data));
		callData[msg.sender][true].length = 32;
		callData[msg.sender][false].length = 0;
    	return _address.call(callData[msg.sender][false]);
  }

	function bytes32ToBytes(bytes32 _bytes32) internal pure returns (bytes) {

		// string memory str = string(_bytes32);
		// TypeError: Explicit type conversion not allowed from "bytes32" to "string storage pointer"
		// thus we should fist convert bytes32 to bytes (to dynamically-sized byte array)

		bytes memory bytesArray = new bytes(32);
		for (uint256 i; i < 32; i++) {
			bytesArray[i] = _bytes32[i];
			}
		return bytesArray;
		}



	function makeDoer(
		bytes32 _fPrint,
        bytes32 _idNumber,
		bytes32 _lName,
		bytes32 _keyId,
		bytes32 _data,
        uint _birth
		) onlyCreator public returns (bool,address) 
		{
			uint myDoers_;
			(,,,myDoers_) = userbase.getAgent(msg.sender);
			require(myDoers_ > 0);
			bytes32 uuidCheck = keccak256(_fPrint, _birth, _lName, _idNumber);
			require(!isDoer(uuidCheck));
			Doers newDoer = new Doers(this);
			bytes32 reset;
			Doers(newDoer).init(SomeDoer({
				fPrint: _fPrint, 
				idNumber: _idNumber, 
				email: reset, 
				fName: reset, 
				lName: _lName, 
				uuid: uuidCheck, 
				keyid: _keyId, 
				data: _data, 
				age: _birth}));
			userbase.initAgent(newDoer);
			userbase.decAgent(newDoer);
			return (true,newDoer);
	}

/////////////////
// All ASSERTS
/////////////////

	function isAble() view public returns (bytes32) {
		return contrl.KEYID();
	}

	function iam(address _address) view public returns (bool iam_) {
		require((userbase.isDoer(_address) != IS.CREATOR) ||
		(userbase.isDoer(_address) == IS.CREATOR));
		return iam_;
	}

	function isDoer(bytes32 _keyid) public view returns (bool doeractive) { // Consider use of delegateCall
		userbase.isDoer(userbase.getAgent(_keyid)) != IS.CREATOR;
	}	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

		function isCreator(bytes32 _keyid) view external returns (bool createactive) { // Point this to oraclise service checking MSD on 
		userbase.isDoer(userbase.getAgent(_keyid)) == IS.CREATOR;
	} 	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

// 	function isPlanning(bytes32 _intention) view external returns (uint256) { 
//         return userbase.isPlanning(_intention);
//     }

/////////////////
// All GETTERS
/////////////////

	/// @notice Get the active status of a Creator and its number of doers spawned.
    /// @param _address The query condition of the contract
	//  @dev `anybody` can retrive the count data in the contract
	function getAgent(address _address) 
	view public returns (bytes32 keyid_, IS state_, bool active_, uint myDoers_) {
		return userbase.getAgent(_address);
	} 	
	
	function getAgent(bytes32 _uuid) 
	view external returns (bytes32 keyid_, IS state_, bool active_, uint myDoers_) {
        return userbase.getAgent(userbase.getAgent(_uuid));
	}

/////////////////
// All SETTERS
/////////////////
	
	function flipTo(address _address) 
	external onlyController returns (IS) {
		if (userbase.isDoer(_address) != IS.CREATOR) {
			return userbase.setAgent(_address, IS.CREATOR);
		} else {
			return userbase.setAgent(_address, IS.INACTIVE);
		}
	}

	function numberOf(address _address, uint _allowed) 
	external onlyController returns (uint) {
		require(userbase.isDoer(_address) == IS.CREATOR);
		return userbase.setAgent(_address, _allowed);
	}

	function toggle(address _address) 
	external onlyController returns (bool) {
		bool active_;
		(,,active_,) = userbase.getAgent(_address);
		if (active_) {
			return userbase.setAgent(_address, true);
		} else {
			return userbase.setAgent(_address, false);
			}
	}

	function reset(address _address, bytes32 _keyid) 
	external onlyController returns (bytes32) {
		require(iam(_address));
		return userbase.setAgent(_address, _keyid);
	}

/* END OF CREATORS */
}

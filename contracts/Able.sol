pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;
import "./ControlAbstract.sol";


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
    function getDatabase() view public returns (Database,Userbase) {
        return (database, userbase);
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
        bytes32 _sig) 
    external onlyOwner returns (bool)  {	 // This guard exhibits buglike behaviour,
        require(_sig == 0x0);   // Only do validation if there is an actions contract. stops contract from overwriting itself.
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
        // bytes32 reset;
        delete contracts[_address];
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
    uint reputation,
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

    function iam(address _address) public view returns (bool) {
        require(agents[_address].active);
        return true;
    }

    function iam(bytes32 _uuids) external view returns (bool) {
        return iam(uuids[_uuids]);
    }

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

    function initCreator(address _address) public returns (bool) {
        require(doerCount++ < 2^256);
        bytes32 keyid_;
        bytes32 uuid_;
        agents[_address] = Agent({
            keyId: keyid_,
            state: IS.CREATOR,
            active: true,
            myDoers: 1
            });
        uuids[uuid_] = _address;
        return agents[_address].active;
    }

    function initAgent(Doers _address) external onlyControlled returns (bool) {
        require(doerCount++ < 2^256 && _address.ringlength() == 0); //(0) == 0x0);
        bytes32 uuid_ = _address.UUID();
        bytes32 keyid_ = _address.KEYID();
        require(keyid_ != 0x0 && uuid_ != 0x0 && this.getAgent(uuid_) == 0x0);
        agents[_address] = Agent({
            keyId: keyid_,
            state: IS.INACTIVE,
            active: true,
            myDoers: 0
            });
        uuids[uuid_] = _address;
        return agents[_address].active;
    }

    function incAgent(address _address) public { // Decrement a Creators Doers
        require(agents[_address].myDoers++ < 2^256);
    }

    function decAgent(address _address) public { // Decrement a Creators Doers
        require(agents[_address].myDoers-- > 0);
    }

    function setAgent(address _address, bytes32 _keyId)
    external onlyControlled returns (bytes32) {
        return agents[_address].keyId = _keyId;
    }

    function setAgent(address _address, IS _state)
    external onlyControlled returns (IS) {
        return agents[_address].state = _state;
    }

    function setAgent(address _address, bool _active)
    external onlyControlled returns (bool) {
        return agents[_address].active = _active;
    }

    function setAgent(address _address, uint _myDoers)
    external onlyControlled returns (uint) {
        return agents[_address].myDoers = _myDoers;
    }

    function setAllPromises(bytes32 _serviceId) external onlyControlled {
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

// 5.2.3.13.  Trust Signature

//    (1 octet "level" (depth), 1 octet of trust amount)

//    Signer asserts that the key is not only valid but also trustworthy at
//    the specified level.  Level 0 has the same meaning as an ordinary
//    validity signature.  Level 1 means that the signed key is asserted to
//    be a valid trusted introducer, with the 2nd octet of the body
//    specifying the degree of trust.  Level 2 means that the signed key is
//    asserted to be trusted to issue level 1 trust signatures, i.e., that
//    it is a "meta introducer".  Generally, a level n trust signature
//    asserts that a key is trusted to issue level n-1 trust signatures.
//    The trust amount is in a range from 0-255, interpreted such that
//    values less than 120 indicate partial trust and values of 120 or
//    greater indicate complete trust.  Implementations SHOULD emit values
//    of 60 for partial trust and 120 for complete trust.

///////////////////
// Beginning of Contract
///////////////////

contract Doers is UserDefined {

/* Constant */
/* State Variables */
/* Events */
/* Modifiers */
/* Functions */
/* End of Contract */

    bytes32 constant public CONTRACTNAME = "DOER 0.0118";
    bytes32 public MASK = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    bool public init;

    enum BE {NULL, QUALIFICATION, EXPERIENCE, REPUTATION, TALENT}

    modifier onlyCreator {
        require(creator.isCreator());
        _;
    }

    modifier onlyDoer {
        require (creator.isDoer());
        _;
    }

    modifier onlyOwner {
        require(creator.iam() && msg.sender == owner);
        _;
    }

    modifier ProxyKey {
        require(msg.sender == proxyKey);
        _;
    }

    modifier ProxyBDI {
        require(msg.sender == proxyKey || msg.sender == owner);
        _;
    }

    bytes32 public KEYID;
    bytes32 public UUID;
    Merits public merits = bdi.beliefs.merits;
    uint public promiseCount;
    uint public orderCount;
    uint public fulfillmentCount;

    Creators internal creator;
    Userbase internal userbase;
    address public owner;
    address internal proxyKey;
    address internal proxyBDI;

    SomeDoer internal Iam;// = SomeDoer(0x4fc6c65443d1b988, "whoiamnottelling", 346896000, "Iam", "Not", false);

    BDI internal bdi;
// 	mapping (bytes32 => bytes32) promises;

    uint8 BASE; // !!! GET THIS DATA FROM DATABASE
    uint8 rate = 10; // !!! GET THIS DATA FROM DATABASE
    uint year = 31536000; // !!! GET THIS DATA FROM DATABASE
    uint period = 31536000; // !!! GET THIS DATA FROM DATABASE

    // mapping (bool => BE) callBackState;
    // mapping (bytes32 => bool) callBackData;
    mapping (bytes32 => mapping (bool => BE)) callBackState;

    bytes32[] public keyring;
    uint public ringlength;
    Reputation public reputation;

    mapping (bytes32 => uint) keyIndex;

    //Creators.Flag aflag;

    function Doers(Creators _creator, SomeDoer _adoer) public {
        creator = _creator;
        owner = tx.origin;
        MASK = _creator.DOER();
        proxyKey = _creator.proxyKey();
        proxyBDI = _creator.proxyBDI();
        Iam = _adoer;
        KEYID = Iam.keyid;
        UUID = Iam.uuid;
        emit ContractEvent(this, msg.sender, tx.origin);
    }

    function updateIndex() internal returns (bool) {
        uint8 kbase = uint8(KBase.DOCTORATE);
        while (bdi.beliefs.qualification[kbase].cAuthority == 0x0) {
            // merit == 0 ? bdi.beliefs.index = merit : merit --;
            if (kbase == 0) {
                bdi.beliefs.merits.index = 1;
                return false;}
            kbase--;
        }

        uint8 T = uint8(bdi.beliefs.merits.talent);
        uint8 R = uint8(bdi.beliefs.merits.reputation);
        uint8 Q = kbase;
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
// function bytesToString(bytes32 _bytes) public constant returns (string) {

//     // string memory str = string(_bytes);
//     // TypeError: Explicit type conversion not allowed from "bytes32" to "string storage pointer"
//     // thus we should fist convert bytes32 to bytes (to dynamically-sized byte array)

//     bytes memory bytesArray = new bytes(_bytes.length);
//     for (uint256 i; i < _bytes.length; i++) {
//         bytesArray[i] = _bytes[i];
//         }
//     return string(bytesArray);
//     }

/////////////////
// All ASSERTERS
/////////////////

    function iam() view public returns (bool) {
        return creator.iam();
    }

/////////////////
// All GETTERS
/////////////////

    function getDoer()
    view external returns (
    bytes32 fPrint,
    bytes32 email,
    bytes32 fName,
    bytes32 data) {
        return(
            Iam.fPrint,
            Iam.email,
            Iam.fName,
            Iam.data);
    }

    function getBelief(KBase _kbase)
    view external returns (
    bytes32 country_,
    bytes32 cAuthority_,
    bytes32 score_) {
        return (
            bdi.beliefs.qualification[uint8(_kbase)].country,
            bdi.beliefs.qualification[uint8(_kbase)].cAuthority,
            bdi.beliefs.qualification[uint8(_kbase)].score);
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

    function init() external returns (bool) {
        require(msg.sender == owner && !init);
        return init = creator.initDoer();
    }
//
    function sign(address _address) onlyOwner public returns (uint, bool signed) {

        emit LogSigning(this, msg.sender, tx.origin, _address, keyXOR);

        if (Doers(_address) != this) {
            signed = _address.call(bytes4(sha3("sign()")));
            require(signed);
            require(reputation.signer++ < 2^256 && ringlength > 0);
            return (reputation.signer,signed);
        } else {
            bytes32 keyXOR = bytes32(uint256(_address)) ^ bytes32(uint256(msg.sender));
            bytes memory callData = msg.data;
            emit LogSigned(this, msg.sender, tx.origin, callData, keyXOR);
            if (keyring.length == 0) {
                ringlength = keyring.push(keyXOR | MASK);
                require(reputation.signer++ < 2^256);
                signed = false;
            } else {
                require(address(keyring[0]) != address(keyXOR));
                keyring[0] = (keyXOR | MASK);
                signed = true;
            }
            keyIndex[keyXOR] = 0;
            emit LogKeyRing(ringlength,keyring[keyIndex[keyXOR]],keyIndex[keyXOR]);
            return (ringlength,signed);
        }
    }

    function sign() external onlyDoer returns (uint, bool signed) { // padd left before using bytes32(uint256(this) << 96)
        require(msg.sender != owner);
        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        bytes memory callData = msg.data;
        emit LogSigned(this, msg.sender, tx.origin, callData, keyXOR);

        require(keyring.length > 0 && keyring.length < 2^256);
        require(keyIndex[keyXOR] == 0);

        keyIndex[keyXOR] = (keyring.push(keyXOR | MASK) -1);
        ringlength = keyring.length;
        reputation.signee = ringlength;
        // Doers(proxyKey).incSigns(keyXOR << 32);
        signed = true;

        emit LogKeyRing(ringlength,keyring[keyIndex[keyXOR]],keyIndex[keyXOR]);
        return (ringlength,signed);
    }

    function revoke(address _address) external onlyDoer returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using
        require(keyring.length > 0);

        bytes memory callData = msg.data;
        emit LogRevoking(this, msg.sender, tx.origin, callData, keyXOR);

        if (keyring.length == 1) {	//	a ^ b; == key; //	key ^ a == b
            bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
            require (address(keyXOR) == address(keyring[keyIndex[keyXOR]]));
            keyIndex[keyXOR] = 2^256;
            delete keyring;
            delete reputation.signee;
            require(reputation.signer-- > 0);
            ringlength = 0;
            revoked = false;
        } else {
            revoked = _address.call(bytes4(sha3("revoke()")));
            require(revoked);
            require(reputation.signer-- > 0);
            return (reputation.signer,revoked);
        }
        emit LogKeyRing(ringlength,keyXOR,keyIndex[keyXOR]);
        return (ringlength,revoked);
    }

    function revoke() external onlyDoer returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using
        require(keyring.length > 1 && msg.sender != owner);
        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        require (address(keyXOR) == address(keyring[keyIndex[keyXOR]]));
        bytes memory callData = msg.data;
        emit LogRevoking(this, msg.sender, tx.origin, callData, keyXOR);

        keyring[keyIndex[keyXOR]] = keyring[keyring.length -1];
        keyIndex[((keyring[keyring.length -1] << 96) >> 96)] = keyIndex[keyXOR];
        delete keyring[keyring.length -1];
        ringlength = keyring.length;
        delete keyIndex[keyXOR];
        reputation.signee = ringlength;
        Doers(proxyKey).decSigns(keyXOR << 32);
        revoked == true;

        emit LogKeyRing(ringlength,keyXOR,keyIndex[keyXOR]);
        return (ringlength,revoked);
    }

    function trust(Trust _level) returns (bool) {
        require((keyring.length > 0) && (keyring.length < 2^256));
        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        uint num = keyIndex[keyXOR];
        require (address(keyXOR) == address(keyring[num]));
        keyXOR = keyring[num];
        bytes memory callData = msg.data;
        emit LogTrusted(this, msg.sender, tx.origin, callData, keyXOR);
        keyXOR &= 0xffffffffffff00ffffffffffffffffffffffffffffffffffffffffffffffffff;   // RESET THE TRUST FLAG FIRST
        keyXOR |= creator.trust(_level);    // NO ADDING UP, JUST SET CUMULATIVE VALUE
        keyring[num] = keyXOR;
        emit LogKeyRing(ringlength,keyring[keyIndex[keyXOR]],keyIndex[keyXOR]);
        return true;
    }

    function incSigns(bytes32 _keyd) external ProxyKey returns (uint) {
        require(reputation.signer++ < 2^256);
        return reputation.signer;
    }
    function decSigns(bytes32 _keyd) external ProxyKey returns (uint) {
        require(reputation.signer-- > 0);
        return reputation.signer;
    }

    function setbdi(
        KBase _kbase,
        bytes32 _country,
        bytes32 _cAuthority,
        bytes32 _score,
        uint _year)
    external ProxyBDI {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == owner) {
            Doers(proxyBDI).setbdi(_kbase,_country,_cAuthority,_score,_year);
            callBackState[callid][false] = BE.QUALIFICATION;
            LogSetbdi(this,msg.sender,tx.origin,Iam.keyid,Iam.uuid,callid);
            } else {
            require(callBackState[callid][false] == BE.QUALIFICATION);
            if (_kbase == KBase.BACHELOR) {		// exclude Bachelors from prerequisite of having a License
                require(bdi.beliefs.qualification[uint8(KBase.SECONDARY)].cAuthority != 0x0);
                } else {
                require(bdi.beliefs.qualification[uint8(_kbase) - 1].cAuthority != 0x0);
                }
            // IF (TO UPDATE)
            bdi.beliefs.qualification[uint8(_kbase)] = Qualification({country: _country, cAuthority: _cAuthority, score: _score});
            bdi.beliefs.merits.experience = _year;
            callBackState[callid][true] = callBackState[callid][false];
            delete callBackState[callid][false];
            updateIndex();
        }

    }

    function setbdi(
        uint _refMSD,
        uint _refRank,
        uint _refSigned,
        uint _refSigs,
        uint _refTrust)
    external ProxyBDI {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == owner) {
            Doers(proxyBDI).setbdi(_refMSD,_refRank,_refSigs,_refSigned,_refTrust);
            callBackState[callid][false] = BE.REPUTATION;
            LogSetbdi(this,msg.sender,tx.origin,Iam.keyid,Iam.uuid,callid);
            } else {
            require(callBackState[callid][false] == BE.REPUTATION);
            reputation.refMSD = _refMSD;
            reputation.refRank = _refRank;
            reputation.refTrust = _refTrust;
            bdi.beliefs.merits.reputation = _refTrust;
            callBackState[callid][true] = callBackState[callid][false];
            delete callBackState[callid][false];
            updateIndex();
        }
    }

    function setbdi(bytes32 _talent) external ProxyBDI {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == owner) {
            Doers(proxyBDI).setbdi(_talent);
            callBackState[callid][false] = BE.TALENT;
            LogSetbdi(this,msg.sender,tx.origin,Iam.keyid,Iam.uuid,callid);
            } else {
            require(callBackState[callid][false] == BE.TALENT);
            if (bdi.beliefs.merits.talent == 0x0) {
                bdi.beliefs.merits.talent = _talent;
                Userbase(userbase).incTalent();
            } else {
                Userbase(userbase).decTalent();
                bdi.beliefs.merits.talent = _talent;
                Userbase(userbase).incTalent();
            }
            callBackState[callid][true] = callBackState[callid][false];
            delete callBackState[callid][false];
            updateIndex();
            }

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
// 	event ContractCallEvent(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _data);
// 	event QualificationEvent(address indexed _this, address indexed _sender, address indexed _origin, bytes16 _message, bytes _data);
// 	event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
//     event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
//     event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
// 	event LogNewOraclizeQuery(string description);
//     event LogNewResult(bytes32 result, bytes proof);
    event LogKeyRing(uint _length, bytes32 _data, uint _index);
    event LogSigning(address indexed _this, address indexed _sender, address indexed _origin, address _data, bytes32 _result);
    event LogSigned(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogTrusted(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogRevoking(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogSetbdi(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _keyid, bytes32 _uuid, bytes32 _callid);
}

// interface SomeDoers {
// 	function Doers(SomeDoer _aDoer) returns (bool);
// 	}

contract ProxyKey is BaseController {

/* Constant */
/* State Variables */
/* Events */

    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
    event LogData(address sender, bytes calldata, bytes _data, bytes32 _data1, bytes32 _data2);
    event LogCall(address indexed from, address indexed to, address _keyd);
    event LogHash(address indexed from, address indexed to, address _keyd, bytes32 _data);

/* Modifiers */
/* Functions */


    bytes public callParam;
    bytes32 public addressXOR;

    function() {
        callParam = msg.data;
        bytes32 newcallparam = bytesToBytes32(callParam);
        bytes32 newaddress = bytes32(uint256(msg.sender));
        addressXOR = newcallparam ^ newaddress;
        execute(address(addressXOR)); //!!! Check here that the pattern is well formated
        emit LogData(msg.sender, msg.data, callParam, newcallparam, newaddress);
    }

    function ProxyKey() {
        emit ContractEvent(this,msg.sender,tx.origin);
    }

    function bytesToBytes32(bytes _data) constant returns (bytes32 result) {
        assembly {
            result := mload(add(_data, 32))
        }
    }

    function execute(address _receiver) returns (bool) {
        emit LogCall(msg.sender,this,_receiver);
        return _receiver.call(callParam);

    }
/* End of ProxyKey Contract */
}

contract ProxyBDI is BaseController {

/* Constant */
/* State Variables */
/* Events */

    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
    event LogMsgData(address sender, bytes calldata, bytes _data);
    event LogCall(address indexed from, address indexed to, address _keyd);
    event LogHash(address indexed from, address indexed to, address _keyd, bytes32 _data);
    event LogProxyCall(address indexed from, address indexed to, bytes32 _data);
    event LogProxyResult(address indexed from, address indexed to, bytes32 _data, bytes32 _result);

/* Modifiers */
/* Functions */


    function ProxyBDI() {
        emit ContractEvent(this,msg.sender,tx.origin);
    }

    bytes public callParam;
    bytes32 public keyXOR;
    address public proxyKey;
    mapping (address => mapping (bool => bytes)) callData;

      //prime the data using the fallback function.
    function() payable {
        callData[msg.sender][false] = msg.data;
        delete callData[msg.sender][true];
    }

    function execute(address _address, bool _success) external onlyControlled returns (bool) {
        require (callData[_address][true].length == 0);
        bytes memory _data = callData[msg.sender][false];
        bytes32 _hash = keccak256(_data);
        callData[msg.sender][true] = toBytes(_hash);
        delete callData[msg.sender][false];
        if (snarkProof(_address, _data, _success)) {
            ///!!! INSERT SNARK PROOF FUNCTION HERE

            LogProxyCall(msg.sender,this,_hash);
        } else {
            ///!!! INSERT SNARK PROOF FUNCTION HERE

            LogProxyResult(msg.sender,this,_hash,"default");
            return Doers(_address).call(callData[msg.sender][true]);
        }
    }

    function toBytes(bytes32 _bytes32) internal pure returns (bytes) {

        // string memory str = string(_bytes32);
        // TypeError: Explicit type conversion not allowed from "bytes32" to "string storage pointer"
        // thus we should fist convert bytes32 to bytes (to dynamically-sized byte array)

        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
            }
        return bytesArray;
    }

    function toBytes32() returns (bytes32) {
        return bytes32(uint256(msg.sender) << 96);
    }

    function snarkProof(address _address, bytes _data, bool success)  returns (bool) {
        // !!! STUB: FOR SNARK PROOF IMPLEMENTATION
        return true;
    }
/* End of ProxyBDI Contract */
}

///////////////////
// Beginning of Contract
///////////////////

contract DoersFactory {

/* Constant */
/* State Variables */

    Userbase internal userbase;
    Creators internal creator;

/* Events */
/* Modifiers */

    event LogNewDoer(address indexed from, address indexed to, address indexed origin, address _newdoer);
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);

/* Functions */

    function DoersFactory (Userbase _userbase, Creators _creator) {
        userbase = _userbase;
        creator = _creator;
        emit ContractEvent(this,msg.sender,tx.origin);
    }

// "0xca35b7d915458ef540ade6068dfe2f44e8fa733c","_fPrint","_idNumber","_email","_fName","_lName","_keyId","_data",10
    function makeDoer(
        address _introducer,
        bytes32 _fPrint,
        bytes32 _idNumber,
        bytes32 _email,
        bytes32 _fName,
        bytes32 _lName,
        bytes32 _keyId,
        bytes32 _data,
        uint _birth)
    public returns (address) {
        userbase.decAgent(_introducer);
        bytes32 uuidCheck = keccak256(_fPrint, _idNumber, _lName, _birth);
        Doers newDoer = new Doers(creator,UserDefined.SomeDoer({
            fPrint: _fPrint,
            idNumber: _idNumber,
            email: _email,
            fName: _fName,
            lName: _lName,
            uuid: uuidCheck,
            keyid: _keyId,
            data: _data,
            age: _birth}));
        emit LogNewDoer(this,msg.sender,tx.origin,address(newDoer));
        return newDoer;
    }

/* End of Contract */

}

///////////////////
// Beginning of Contract
///////////////////

contract Creators is DataController {

/* Constant */
/* State Variables */
/* Events */
/* Modifiers */
/* Functions */
/* End of Contract */

/// @dev The actual agent contract, the nature of the agent is identified controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract.

    bytes32 constant internal CONTRACTNAME = "CREATOR 0.0118";
    bytes32 constant public KEYID = 0x90EBAC34FC40EAC30FC9CB464A2E56;
    bytes32 constant public DOER     			   	    = 0x11ff10ff100f00ff << 192;
// 	bytes32 constant public MASK 			   		    = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    bytes32 constant public KEY_CERTIFICATION 		    = 0x01ffffffffffffff << 192; // “C”	Key Certification
    bytes32 constant public SIGN_DATA   			    = 0x02ffffffffffffff << 192; // “S”	Sign Data
    bytes32 constant public ENCRYPT_COMMUNICATIONS 	    = 0x04ffffffffffffff << 192; // “E”	Encrypt Communications
    bytes32 constant public ENCRYPT_STORAGE  		    = 0x08ffffffffffffff << 192; // “E”	Encrypt Storage
    bytes32 constant public SPLIT_KEY   			    = 0x10ffffffffffffff << 192; // Split key
    bytes32 constant public AUTHENTICATION   		    = 0x20ffffffffffffff << 192; // “A”	Authentication
    bytes32 constant public MULTI_SIGNATURE			    = 0x80ffffffffffffff << 192; // Held by more than one person
    bytes32 constant public AMOUNT 			   		    = 0xffffffffffff00ff << 192;
    bytes32 constant public BINARY_DOCUMENT             = 0xffff00ffffffffff << 192; // 0x00: Signature of a binary document.
    bytes32 constant public CANONICAL_DOCUMENT          = 0xffff01ffffffffff << 192; // 0x01: Signature of a canonical text document.
    bytes32 constant public STANDALONE_SIGNATURE        = 0xffff02ffffffffff << 192; // 0x02: Standalone signature.
    bytes32 constant public GENERIC                     = 0xffff10ffffffffff << 192; // 0x10: Generic certification of a User ID and Public-Key packet.
    bytes32 constant public PERSONA                     = 0xffff11ffffffffff << 192; // 0x11: Persona certification of a User ID and Public-Key packet.
    bytes32 constant public CASUAL                      = 0xffff12ffffffffff << 192; // 0x12: Casual certification of a User ID and Public-Key packet.
    bytes32 constant public POSITIVE                    = 0xffff13ffffffffff << 192; // 0x13: Positive certification of a User ID and Public-Key packet.
    bytes32 constant public SUBKEY_BINDING              = 0xffff18ffffffffff << 192; // 0x18: Subkey Binding Signature
    bytes32 constant public PRIMARY_KEY_BINDING         = 0xffff19ffffffffff << 192; // 0x19: Primary Key Binding Signature
    bytes32 constant public DIRECTLY_ON_KEY             = 0xffff1Fffffffffff << 192; // 0x1F: Signature directly on a key
    bytes32 constant public KEY_REVOCATION              = 0xffff20ffffffffff << 192; // 0x20: Key revocation signature
    bytes32 constant public SUBKEY_REVOCATION           = 0xffff28ffffffffff << 192; // 0x28: Subkey revocation signature
    bytes32 constant public CERTIFICATION_REVOCATION    = 0xffff30ffffffffff << 192; // 0x30: Certification revocation signature
    bytes32 constant public TIMESTAMP                   = 0xffff40ffffffffff << 192; // 0x40: Timestamp signature.
    bytes32 constant public THIRD_PARTY_CONFIRMATION    = 0xffff50ffffffffff << 192; // 0x50: Third-Party Confirmation signature.
    bytes32 constant public ORDINARY   				    = 0xffffffff100fffff << 192;
    bytes32 constant public INTRODUCER 				    = 0xffffffff010fffff << 192;
    bytes32 constant public ISSUER	   				    = 0xffffffff001fffff << 192;

    Clearance internal TRUST = Clearance({
        Zero:       0x01ff << 192,
        Unknown:    0x03ff << 192,
        Generic:    0x07ff << 192,
        Poor:       0xF0ff << 192,
        Casual:     0xF1ff << 192,
        Partial:    0xF3ff << 192,
        Complete:   0xF7ff << 192,
        Ultimate:   0xFFff << 192
    });

    address public proxyKey;
    address public proxyBDI;

    // mapping (address => mapping (bool => bytes)) callData;

    function Creators(Able _ctrl, Userbase _ubs) public {
        cName = CONTRACTNAME;
        contrl = _ctrl;
        userbase = _ubs;
        owner = contrl.owner();
        controller = contrl.controller();
        proxyKey = new ProxyKey();
        proxyBDI = new ProxyBDI();
        ContractEvent(this,msg.sender,tx.origin);
    }

/////////////////
// All ASSERTS
/////////////////

    function isAble() view public returns (bytes32) {
        return contrl.KEYID();
    }

    function Iam() view public returns (IS) {
        return userbase.isDoer(msg.sender);
    }

    function iam() view public returns (bool) {
        return userbase.iam(msg.sender);
    }

    function isDoer() public view returns (bool) { // Consider use of delegateCall
        require (userbase.isDoer(msg.sender) != IS.CREATOR);
        return true;
    }	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

    function isDoer(bytes32 _keyid) public view returns (bool isDoer) { // Consider use of delegateCall
        require (userbase.isDoer(userbase.getAgent(_keyid)) != IS.CREATOR);
        return true;
    }	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

    function isCreator() view external returns (bool isCreator) { // Point this to oraclise service checking MSD on
        require (userbase.isDoer(msg.sender) == IS.CREATOR);
        return true;
    } 	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

    function isCreator(bytes32 _keyid) view external returns (bool isCreator) { // Point this to oraclise service checking MSD on
        require (userbase.isDoer(userbase.getAgent(_keyid)) == IS.CREATOR);
        return true;
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

    function initDoer() returns (bool) {
        return userbase.initAgent(Doers(msg.sender));
    }

    function flipTo(address _address)
    external onlyOwner returns (IS) {
        if (userbase.isDoer(_address) != IS.CREATOR) {
            return userbase.setAgent(_address, IS.CREATOR);
        } else {
            return userbase.setAgent(_address, IS.INACTIVE);
        }
    }

    function numberOf(address _address, uint _allowed)
    external onlyOwner returns (uint) {
        require(userbase.isDoer(_address) == IS.CREATOR);
        return userbase.setAgent(_address, _allowed);
    }

    function toggle(address _address)
    external onlyOwner returns (bool) {
        bool active_;
        (,,active_,) = userbase.getAgent(_address);
        if (!active_) {
            return userbase.setAgent(_address, true);
        } else {
            return userbase.setAgent(_address, false);
            }
    }

    function reset(address _address, bytes32 _keyid)
    external onlyOwner returns (bytes32) {
        require(userbase.iam(_address));
        userbase.setAgent(_address, IS.INACTIVE);
        return userbase.setAgent(_address, _keyid);
    }

    function trust(Trust _level) returns (bytes32) {
        if (_level == Trust.ZERO) {
            return TRUST.Zero;
            } else if (_level == Trust.UNKNOWN ) {
                return TRUST.Unknown;
                } else if (_level == Trust.GENERIC ) {
                    return TRUST.Generic;
                    } else if (_level == Trust.POOR ) {
                        return TRUST.Poor;
                        } else if (_level == Trust.CASUAL ) {
                            return TRUST.Casual;
                            } else if (_level == Trust.PARTIAL ) {
                                return TRUST.Partial;
                                } else if (_level == Trust.COMPLETE ) {
                                    return TRUST.Complete;
                                        } else if (_level == Trust.ULTIMATE ) {
                                            return TRUST.Ultimate;
                                            }
    }

    event LogCall(address indexed from, address indexed to, address indexed origin, bytes _data);
/* END OF CREATORS CONTRACT */
}

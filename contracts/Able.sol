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
    Peana internal _peana_;
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
    
    modifier toPeana {
        Collector(_peana_).sendLog(msg.sender,this,msg.data);
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

    function isAble() view public returns (bytes32 Able_) {
        Able_ = contrl.KEYID();
    }
    
    
    function peana() view public returns (address) {
        return address(_peana_);
    }

    // Change the owner of a contract
    /// @notice `setOwner` can step down and assign some other address to this role
    /// @param _newOwner The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function setOwner(address _newOwner) internal onlyOwner returns (bool) {
        assert(owner != _newOwner);
        owner = _newOwner;
        emit ChangedOwner(msg.sender, owner);
        return true;
    }

    /// @notice `setContrl` can step down and assign some other address to this role
    /// @param _newCtrl The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function setContrl(Able _newCtrl) internal onlyOwner returns (bool) {
        assert(contrl != _newCtrl);
        contrl = _newCtrl;
        emit ChangedContrl(msg.sender, owner);
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
        return true;
    }

    function verify(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view public returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(prefix, _message);
        return ecrecover(prefixedHash, _v, _r, _s);
    }

    function verified(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view external returns  (bool success) {
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

    // Database internal database;

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
    function getDatabase() view public returns (Userbase) {
        return userbase;   
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
    
    // Peana internal peana;
    // This is where we keep all the contracts.
    mapping (address => bytes32) public contracts;

/* Events */
/* Modifiers */
/* Functions */

    // function() onlyControlled {

    // }

    function Able() public {
        contrl = Able(this);
        controller = this;
        cName = CONTRACTNAME;
        contracts[this] = cName;
        owner = msg.sender;
        _peana_ = new Peana(this);
        //	database = Database(makeContract("database"));
        //  userbase = Userbase(makeContract("userbase"));
        ContractEvent(this,msg.sender,tx.origin);
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
        return setOwner(_newOwner);
    }

    /// @notice `contrl` can step down and assign some other address to this role
    /// @param _newCtrl _sig The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function changeContrl(Able _newCtrl, bytes32 _sig) public onlyOwner returns (bool) {
        require(_sig == 0x0);
        // require(verify(_sig,_v,_r,_s) == controller);
        return setContrl(_newCtrl);
        // _e.delegatecall(bytes4(sha3("setN(uint256)")), _n); // D's storage is set, E is not modified
        // contrl.delegatecall(bytes4(sha3("setContrl(address)")),_newCtrl);

    }

    /// @notice `controller` can step down and assign some other address to this role
    /// @param _sig The address of the new controller is the address of the contrl.
    ///  0x0 can be used to create an unowned neutral vault, however that cannot be undone
    function changeController(bytes32 _sig) public onlyOwner returns (bool) {
        require(_sig == 0x0);
        // require(verify(_sig,_v,_r,_s) == controller);        
        return setController();
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
    function removeContract(address _address, bytes32 _sig) onlyOwner external returns  (bool result) {
        require(_sig == 0x0);
        // require(verify(_sig,_v,_r,_s) == controller);
        require(contracts[_address] != 0x0);
        // Kill any contracts we remove, for now.
        suicide(_address);
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


// ////////////////////
// // Database Contract
// ////////////////////
// contract Database is BaseController {

// /* Constants */

//     bytes32 constant internal CONTRACTNAME = "DATABASE 0.0118";
//     uint8 constant internal BASE = 2;

// /* Enums*/


// /* Structs*/

//     struct Storage {
    
// /* State Variables */

//     uint GEN;
//     uint plansCount;
//     uint curatedPlansCount;
//     uint promiseCount;
//     uint orderCount;
//     uint fulfillmentCount;
//     uint verificationCount;
//     Userbase userbase;

//     /// @dev `Initialised data structures
//     /// @notice `Creator && Doer lookup` is the type that defines a strategy model of an actual agent
//     // @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
//     // Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
//     // experience is period from qualification in seconds
//     // reputaion is PGP trust level flag !!! CITE RFC PART
//     // talent is user declared string of talents

//     mapping(bytes32 => Plans) plans;

//     mapping(bytes32 => address[]) promises;
    
//     // bytes32[] public allPlans;

//     }

// /* State Variables */

//     Storage public data;
  
    

// /* Events */

//     event SetPlan(address indexed _from, address indexed _sender, address indexed _creator, bytes32 _intention, bytes32 _planData);
//     event SetService(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId, bytes32 _serviceData);
//     event SetPromise(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
//     event SetOrder(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
//     event SetFulfillment(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
//     event SetVerification(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);

// /* Modifiers */

//     modifier onlyCreator {
//         require(data.userbase.isDoer(msg.sender) == IS.CREATOR);
//         _;
//     }

//     modifier onlyDoer {
//         require(data.userbase.isDoer(msg.sender) != IS.CREATOR);
//         _;
//     }

//     modifier onlyCurator {
//         require(data.userbase.isDoer(msg.sender) == IS.CURATOR);
//         _;
//     }

//     modifier onlyTrustee {
//         require(data.userbase.isDoer(msg.sender) == IS.ACTIVE);
//         _;
//     }

//     modifier onlyProver {
//         require(data.userbase.isDoer(msg.sender) == IS.PROVER);
//         _;
//     }
// /* Functions */

//     function Database(Able _ctrl) public  {
//         cName = CONTRACTNAME;
//         contrl = _ctrl;
//         owner = contrl.owner();
//         controller = contrl.controller();
//         ContractEvent(this,msg.sender,tx.origin);
//     }

// /////////////////
// // All METAS
// /////////////////

//     // function setAllPlans(bytes32 _planId) external onlyController {
//     // 	allPlans.push(_planId);
//     // }

//     function setPromise(bytes32 _serviceId) external onlyController {
//         require(data.promiseCount++ < 2^256);
//         data.promises[_serviceId].push(tx.origin);
//     }

//     function getBase() public  returns (uint8) {
//         return BASE;
//     }

// /////////////////
// // All ASSERTS
// /////////////////

//     function isPlanning(bytes32 _intention) view public  returns (uint256) {
//         return uint256(data.plans[_intention].state);
//     }
    

// /////////////////
// // All GETTERS FOR FUTURE USE
// /////////////////

//     /// @notice Get the initialisation data of a plan created by a Creator.
//     /// @param _intention The query condition of the contract
//     //  @dev `anybody` can retrive the plan data in the contract Plan has five levels


//     function plan(bytes32 _intention)
//     view public returns (Plan) {
//         return data.plans[_intention].plan;
//     }

//     function state(bytes32 _intention)
//     view external returns (Project) {
//         return data.plans[_intention].state;
//     }
    
//     function goal(bytes32 _intention)
//     view public toPeana returns (bytes32) {
//         return data.plans[_intention].plan.postCondition.goal;
//     }

//     function precondition(bytes32 _intention, bytes32 _serviceId)
//     view public returns (Merits) {
//         return data.plans[_intention].services[_serviceId].definition.preCondition.merits;
//     }

//     function precondition(bytes32 _intention, bytes32 _serviceId, KBase _index)
//     view public returns (Qualification) {
//         return data.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)];
//     }

//     function postcondition(bytes32 _intention, bytes32 _serviceId)
//     view public returns (Desire) {
//         return data.plans[_intention].services[_serviceId].definition.postCondition;
//     }

//     function metas(bytes32 _intention, bytes32 _serviceId)
//     view public returns (Metas) {
//         return data.plans[_intention].services[_serviceId].definition.metas;
//     }

//     function promise(bytes32 _intention, bytes32 _serviceId, address _address)
//     view public returns (Promise) {
//         return data.plans[_intention].services[_serviceId].procure[_address].promise;
//     }

//     function fulfillment(bytes32 _intention, bytes32 _serviceId, address _doer)
//     view public returns (Fulfillment) {
//         return data.plans[_intention].services[_serviceId].procure[_doer].fulfillment;
//     }

//     function verification(bytes32 _intention, bytes32 _serviceId, address _doer, address _prover)
//     view public returns (Verification) {
//         return data.plans[_intention].services[_serviceId].procure[_doer].verification[_prover];
//     }


// //////////////////////////////
// // ALL GETTERS FOR CURRENT USE
// //////////////////////////////


//     function getPlan(bytes32 _intention)
//     view public returns (
//     bytes32 preCondition,
//     uint time,
//     uint budget,
//     bytes32 projectUrl,
//     address creator,
//     address curator) {
//         return (
//             data.plans[_intention].plan.preCondition,
//             data.plans[_intention].plan.time,
//             data.plans[_intention].plan.budget,
//             data.plans[_intention].plan.projectUrl,
//             data.plans[_intention].plan.creator,
//             data.plans[_intention].plan.curator);
//     }

//     function getStatus(bytes32 _intention)
//     view external returns  (Project, bytes32 goal, bool success) {
//         return (
//             data.plans[_intention].state,
//             data.plans[_intention].plan.postCondition.goal,
//             data.plans[_intention].plan.postCondition.status);
//     }

//     function getPrecondition(
//         bytes32 _intention, bytes32 _serviceId)
//     view public returns (
//     uint experience,
//     bytes32 reputation,
//     bytes32 talent,
//     uint8 index) {
//         return (
//             data.plans[_intention].services[_serviceId].definition.preCondition.merits.experience,
//             data.plans[_intention].services[_serviceId].definition.preCondition.merits.reputation,
//             data.plans[_intention].services[_serviceId].definition.preCondition.merits.talent,
//             data.plans[_intention].services[_serviceId].definition.preCondition.merits.index);
//     }

//     function getPrecondition(
//         bytes32 _intention, bytes32 _serviceId, KBase _index)
//     view public returns (
//     bytes32 country,
//     bytes32 cAuthority,
//     bytes32 score) {
//         return (
//             data.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].country,
//             data.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].cAuthority,
//             data.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].score);
//     }

//     function getPostcondition(
//         bytes32 _intention, bytes32 _serviceId)
//     view external returns  (
//     bytes32 goal_,
//     bool status_) {
//         return (
//             data.plans[_intention].services[_serviceId].definition.postCondition.goal,
//             data.plans[_intention].services[_serviceId].definition.postCondition.status);
//     }

//     function getMetas(
//         bytes32 _intention, bytes32 _serviceId)
//     view external returns  (
//     uint timeSoft, // preferred timeline
//     uint expire,
//     bytes32 hash,
//     bytes32 serviceUrl,
//     address doer) {
//         return (
//             data.plans[_intention].services[_serviceId].definition.metas.timeSoft,
//             data.plans[_intention].services[_serviceId].definition.metas.expire,
//             data.plans[_intention].services[_serviceId].definition.metas.hash,
//             data.plans[_intention].services[_serviceId].definition.metas.serviceUrl,
//             data.plans[_intention].services[_serviceId].definition.metas.doer);
//     }

//     function getPromise(
//         bytes32 _intention, bytes32 _serviceId, address _address)
//     view external returns  (
//     IS state,			// Intention type,
//     bytes32 service,	// Intention type,
//     uint256 payout, 	// Intention type,
//     uint timeHard,
//     bytes32 hash) {
//         return (
//             data.plans[_intention].services[_serviceId].procure[_address].promise.thing.state,
//             data.plans[_intention].services[_serviceId].procure[_address].promise.thing.service,
//             data.plans[_intention].services[_serviceId].procure[_address].promise.thing.payout,
//             data.plans[_intention].services[_serviceId].procure[_address].promise.timeHard,
//             data.plans[_intention].services[_serviceId].procure[_address].promise.hash);
//     }
    
//     function getOrder(
//         bytes32 _intention, bytes32 _serviceId)
//     view external toPeana returns  (
//         bytes32 Sig,
//         uint8 V,
//         bytes32 R,
//         bytes32 S) {
//         return (
//             data.plans[_intention].services[_serviceId].order.Sig,
//             data.plans[_intention].services[_serviceId].order.V,
//             data.plans[_intention].services[_serviceId].order.R,
//             data.plans[_intention].services[_serviceId].order.S
//             );
//     }

//     function getFulfillment(
//         bytes32 _intention, bytes32 _serviceId, address _doer)
//     view external returns  (
//     bytes32 proof,
//     Level rubric,
//     uint timestamp,
//     bytes32 hash) {
//         return (
//             data.plans[_intention].services[_serviceId].procure[_doer].fulfillment.proof,
//             data.plans[_intention].services[_serviceId].procure[_doer].fulfillment.rubric,
//             data.plans[_intention].services[_serviceId].procure[_doer].fulfillment.timestamp,
//             data.plans[_intention].services[_serviceId].procure[_doer].fulfillment.hash);
//     }

//     function getVerification(
//         bytes32 _intention, bytes32 _serviceId, address _doer, address _prover)
//     view external returns  (
//     bytes32 verity,
//     bool complete,
//     uint timestamp,
//     bytes32 hash) {
//         return (
//             data.plans[_intention].services[_serviceId].procure[_doer].verification[_prover].verity,
//             data.plans[_intention].services[_serviceId].procure[_doer].verification[_prover].complete,
//             data.plans[_intention].services[_serviceId].procure[_doer].verification[_prover].timestamp,
//             data.plans[_intention].services[_serviceId].procure[_doer].verification[_prover].hash);
//     }

// /////////////////
// // All SETTERS
// /////////////////

//     /// @notice Get the initialisation data of a plan created by a Creator.
//     /// @param _intention The query condition of the contract
//     //  @dev `anybody` can retrive the plan data in the contract Plan has five levels
//     function setPlan(
//         bytes32 _intention, Plan _planData, Project _state)
//     public payable onlyCreator {
//         require(uint(data.plans[_intention].state) == 0); // This is a new plan? // Cannot overwrite incomplete Plan // succesful plan??
//         data.plans[_intention].plan = _planData;
//         data.plans[_intention].state = _state;
//         SetPlan(
//             tx.origin,
//             msg.sender,
//             data.plans[_intention].plan.creator,
//             _intention,
//             data.plans[_intention].plan.postCondition.goal);
//             require(data.plansCount++ < 2^256);

//     }
    
//     function setPlan(bytes32 _intention, address _address) public payable onlyCreator  {
// 			data.plans[_intention].plan.curator = _address;
//     }
    
//     function setPlan(bytes32 _intention, Project _state) public payable onlyCreator  {
// 			data.plans[_intention].state = _state;
//     }
    
//     function setPlan(bytes32 _intention, bytes32 _serviceId, address _address) public payable onlyCreator  {
// 			data.plans[_intention].services[_serviceId].definition.metas.doer = _address;
//     }
    
    
//     function setPlan(
//         bytes32 _intention, uint _time, uint _budget, bytes32 _url)
//     public payable onlyCreator {
//         require(uint(data.plans[_intention].state) == 0); // This is a new plan? // Cannot overwrite incomplete Plan // succesful plan??

//         data.plans[_intention].plan.time = _time;
//         data.plans[_intention].plan.budget = _budget;
//         data.plans[_intention].plan.projectUrl = _url;
//         require(data.curatedPlansCount++ < 2^256);
//         // SetPlan(
//         //     tx.origin,
//         //     msg.sender,
//         //     _intention,
//         //     data.plans[_intention].plan.time,
//         //     data.plans[_intention].plan.budget,
//         //     data.plans[_intention].plan.projectUrl);

//     }

//     function setService(
//         bytes32 _intention, bytes32 _serviceId, Merits _merits, Qualification _qualification, KBase _index)
//     public onlyCurator {
//         data.plans[_intention].services[_serviceId].definition.preCondition.merits = _merits;
//         data.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)] = _qualification;
//         SetService(
//             tx.origin,
//             msg.sender,
//             _intention,
//             _serviceId,
//             bytes32(uint(_index)));
//     }

//     function setService(
//         bytes32 _intention, bytes32 _serviceId, Desire _postCondition)
//     public onlyCurator {
//         data.plans[_intention].services[_serviceId].definition.postCondition = _postCondition;
//         SetService(
//             tx.origin,
//             msg.sender,
//             _intention,
//             _serviceId,
//             data.plans[_intention].services[_serviceId].definition.postCondition.goal);
//     }

//     function setService(
//         bytes32 _intention, bytes32 _serviceId, Metas _metas)
//     public onlyCurator {
//         data.plans[_intention].services[_serviceId].definition.metas = _metas;
//         SetService(
//             tx.origin,
//             msg.sender,
//             _intention,
//             _serviceId,
//             data.plans[_intention].services[_serviceId].definition.metas.serviceUrl);
//     }

//     function setPromise(
//         bytes32 _intention, bytes32 _serviceId, address _address, Promise _data)
//     public onlyDoer {
//         data.plans[_intention].services[_serviceId].procure[_address].promise = _data;
//         SetPromise(tx.origin,msg.sender,_intention,_serviceId);
//         require(data.promiseCount++ < 2^256);
//     }

//     function setOrder(
//         bytes32 _intention, bytes32 _serviceId, address _address, Order _data)
//     public onlyDoer {
//         data.plans[_intention].services[_serviceId].order = _data;
//         SetOrder(tx.origin,msg.sender,_intention,_serviceId);
//         require(data.orderCount++ < 2^256);
//     }

//     function setFulfillment(
//         bytes32 _intention, bytes32 _serviceId, address _doer, Fulfillment _data)
//     public onlyTrustee {
//         data.plans[_intention].services[_serviceId].procure[_doer].fulfillment = _data;
//         SetFulfillment(tx.origin,msg.sender,_intention,_serviceId);
//         require(data.fulfillmentCount++ < 2^256);
//     }

//     function setVerification(
//         bytes32 _intention, bytes32 _serviceId, address _doer, address _prover, Verification _data)
//     public onlyProver {
//         data.plans[_intention].services[_serviceId].procure[_doer].verification[_prover] = _data;
//         SetVerification(tx.origin,msg.sender,_intention,_serviceId);
//         require(data.verificationCount++ < 2^256);
//     }

// /* End of Database */
// }

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

    function iam(address _address) view public returns (bool) {
        require(agents[_address].active);
        return true;
    }

    function iam(bytes32 _uuids) view external returns (bool) {
        return iam(uuids[_uuids]);
    }

    function isDoer(address _address) view public returns (IS) { // Consider use of delegateCall
        require(agents[_address].active);
        return agents[_address].state;
    }

    function isDoer(bytes32 _uuids) view external returns (IS) { // Consider use of delegateCall
        return isDoer(uuids[_uuids]);
    }

/////////////////
// All GETTERS
/////////////////

    /// @notice Get the data of all Talents in the ecosystem.
    /// @param _talent The talent whose frequency is being queried
    //  @dev `anybody` can retrive the talent data in the contract
    function getTalents(bytes32 _talent)
    view external returns  (uint talentK_, uint talentI_, uint talentR_, uint talentF_) {
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
    view public returns (bytes32 keyid_, IS state_, bool active_, uint myDoers_) {
        return (
            agents[_address].keyId,
            agents[_address].state,
            agents[_address].active,
            agents[_address].myDoers);
    }

    function getAgent(bytes32 _uuid)
    view external returns (address) { // Point this to oraclise service checking MSD on
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

library DoersLib {

/* Constant */


    bytes32 constant internal CONTRACTNAME = "DOER 0.0118";
    uint8 constant internal rate = 10; // !!! GET THIS DATA FROM DATABASE
    uint constant internal year = 31536000; // !!! GET THIS DATA FROM DATABASE
    uint constant internal period = 31536000; // !!! GET THIS DATA FROM DATABASE

/* User Types */

    enum BE {NULL, QUALIFICATION, EXPERIENCE, REPUTATION, TALENT}

/* State Variables */

    struct DataStorage {

        Creators creator;
        Userbase userbase;
        
        bytes32 MASK;
    
        address owner;
        address peana;
        address proxyKey;
        address proxyBDI;
    
        bool initialised;
        bytes32 KEYID;
        bytes32 UUID;
        uint promiseCount;
        uint orderCount;
        uint fulfillmentCount;
    
        UserDefined.SomeDoer Iam;
    
        UserDefined.BDI bdi;
    // 	mapping (bytes32 => bytes32) promises;
        UserDefined.KBase Kbase;
    
        uint8 BASE; // !!! GET THIS DATA FROM DATABASE

    
        // mapping (bool => BE) callBackState;
        // mapping (bytes32 => bool) callBackData;
        mapping (bytes32 => mapping (bool => BE)) callBackState;
    
        bytes32[] keyring;
        uint ringlength;
        UserDefined.Reputation reputation;
    
        mapping (bytes32 => uint) keyIndex;
    
        //Creators.Flag aflag;

    }

/* Events */

////////////////
// Events
////////////////
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
    event LogKeyRing(uint _length, bytes32 _data, uint _index);
    event LogSigning(address indexed _this, address indexed _sender, address indexed _origin, address _data, bytes32 _result);
    event LogSigned(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogTrusted(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogRevoking(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogSetbdi(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _keyid, bytes32 _uuid, bytes32 _callid);

/* Modifiers */

/* Functions */


/////////////////
// ABLE COMPUTE
/////////////////
// function bytesToString(bytes32 _bytes) public constant returns (string) {

    function updateIndex(DataStorage storage self) public returns (bool) {
        uint8 kbase = uint8(UserDefined.KBase.DOCTORATE);
        while (self.bdi.beliefs.qualification[kbase].cAuthority == 0x0) {
            // merit == 0 ? bdi.beliefs.index = merit : merit --;
            if (kbase == 0) {
                self.bdi.beliefs.merits.index = 1;
                return false;}
            kbase--;
        }

        uint8 T = uint8(self.bdi.beliefs.merits.talent);
        uint8 R = uint8(self.bdi.beliefs.merits.reputation);
        uint8 Q = kbase;
        uint8 q;
        if ((block.timestamp - self.bdi.beliefs.merits.experience) > year) {
            // !!! Maybe subtract Reputation and Talent first here before proceeding
            q = (Q * ((1 + rate/100) ^ uint8(self.bdi.beliefs.merits.experience / period)));
            } else {
            q = Q;
            }
        self.BASE = T + R + q;

        // Collector(creator.peana()).updateLog(keccak256("updateIndex()"),true);

    }

/////////////////
// All ASSERTERS
/////////////////

    function iam(DataStorage storage self) view public returns (bool iam_) {
        return self.creator.iam();
        // Collector(creator.peana()).updateLog(keccak256("iam()"),iam);
        // return iam_;
    }
    
    function index(DataStorage storage self) view public returns (uint8 index_) {
        return self.bdi.beliefs.merits.index;
    }
    
    function merits(DataStorage storage self) 
    view public returns (
            uint,
            bytes32,
            bytes32,
            uint8,
            bytes32) {
        return (
            self.bdi.beliefs.merits.experience,
            self.bdi.beliefs.merits.reputation,
            self.bdi.beliefs.merits.talent,
            self.bdi.beliefs.merits.index,
            self.bdi.beliefs.merits.hash
            );
    }
    
    function kbase(DataStorage storage self) view public returns (UserDefined.KBase kbase_) {
            
        uint8 _kbase_ = uint8(UserDefined.KBase.DOCTORATE);
        while (self.bdi.beliefs.qualification[_kbase_].cAuthority == 0x0) {
            // merit == 0 ? bdi.beliefs.index = merit : merit --;
            if (_kbase_ == 0) {
                return UserDefined.KBase.PRIMARY;}
            _kbase_--;
        }
        return UserDefined.KBase(_kbase_);
    }
    
    function desire(DataStorage storage self, bytes1 _desire)
    view public returns  (bytes32) {        
        return self.bdi.desires[_desire].goal;
    }
    
    function intention(DataStorage storage self, bool _intention)
    view public returns  (bytes32) {
        return self.bdi.intentions[_intention].service;
    }
    
    function intention(DataStorage storage self, bool _intention, UserDefined.IS _state)
    public returns  (UserDefined.IS) {
        return self.bdi.intentions[_intention].state = _state;
    }
    
    function flipIntention(DataStorage storage self)
    public returns  (bool) {
        self.bdi.intentions[true].state = UserDefined.IS.RESERVED;
        self.bdi.intentions[true].service = self.bdi.intentions[false].service;
        delete self.bdi.intentions[false];
        return true;
    }
    


/////////////////
// All GETTERS
/////////////////

    function getDoer(DataStorage storage self)
    view public returns  (
        bytes32 fPrint,
        bool iam_,
        bytes32 email,
        bytes32 fName,
        bytes32 lName,
        uint age,
        bytes32 data) {
            // Collector(creator.peana()).updateLog(
            //     keccak256("getDoer()"),
            //     keccak256(Iam.fPrint),
            //     keccak256(this.iam()),
            //     keccak256(Iam.email),
            //     keccak256(Iam.fName),
            //     keccak256(Iam.lName),
            //     keccak256(Iam.age),
            //     keccak256(Iam.data));
            return(
                self.Iam.fPrint,
                iam(self),
                self.Iam.email,
                self.Iam.fName,
                self.Iam.lName,
                self.Iam.age,
                self.Iam.data
                );
    }

    function getBelief(DataStorage storage self, UserDefined.KBase _kbase)
    view public returns  (
    bytes32 country_,
    bytes32 cAuthority_,
    bytes32 score_) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.beliefs.qualification[uint8(_kbase)].country,
        //     bdi.beliefs.qualification[uint8(_kbase)].cAuthority,
        //     bdi.beliefs.qualification[uint8(_kbase)].score);
        return (
            self.bdi.beliefs.qualification[uint8(_kbase)].country,
            self.bdi.beliefs.qualification[uint8(_kbase)].cAuthority,
            self.bdi.beliefs.qualification[uint8(_kbase)].score);
    }

    function getDesire(DataStorage storage self, bytes1 _desire)
    view public returns  (bytes32,bool) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.desires[_desire].goal,
        //     bdi.desires[_desire].status);        
        return (
            self.bdi.desires[_desire].goal,
            self.bdi.desires[_desire].status);
    }

    function getIntention(DataStorage storage self, bool _intention)
    view public returns  (UserDefined.IS,bytes32,uint256) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.intentions[_intention].state,
        //     bdi.intentions[_intention].service,
        //     bdi.intentions[_intention].payout);
        return (
            self.bdi.intentions[_intention].state,
            self.bdi.intentions[_intention].service,
            self.bdi.intentions[_intention].payout);
    }

/////////////////
// All SETTERS
/////////////////

    function init(DataStorage storage self) public returns (bool) {
        require(msg.sender == self.owner && !self.initialised);
        self.initialised = self.creator.initDoer();
        return self.initialised;
    }
//
    function sign(DataStorage storage self, address _address, bytes32 keyXOR) public returns (uint, bool signed) {

        // emit LogSigning(this, msg.sender, tx.origin, _address, keyXOR);

        if (Doers(_address) != msg.sender) {
            signed = _address.call(bytes4(sha3("sign()")));
            require(signed);
            require(self.reputation.signer++ < 2^256 && self.ringlength > 0);
            return (self.reputation.signer,signed);
        } else {
            
            bytes memory callData = msg.data;
            // emit LogSigned(this, msg.sender, tx.origin, callData, keyXOR);
            if (self.keyring.length == 0) {
                self.ringlength = self.keyring.push(keyXOR | self.MASK);
                require(self.reputation.signer++ < 2^256);
                signed = false;
            } else {
                require(address(self.keyring[0]) != address(keyXOR));
                self.keyring[0] = (keyXOR | self.MASK);
                signed = true;
            }
            self.keyIndex[keyXOR] = 0;
            // emit LogKeyRing(self.ringlength,self.keyring[self.keyIndex[keyXOR]],self.keyIndex[keyXOR]);

            // Collector(creator.peana()).updateLog(
            // keccak256("sign(address)"),
            // ringlength,
            // keyring[keyIndex[keyXOR]],
            // keyIndex[keyXOR],
            // signed);

            return (self.ringlength,signed);
        }
    }

    function sign(DataStorage storage self, bytes32 keyXOR) public returns (uint, bool signed) { // padd left before using bytes32(uint256(this) << 96)
        require(msg.sender != self.owner);
        // bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        bytes memory callData = msg.data;
        // emit LogSigned(this, msg.sender, tx.origin, callData, keyXOR);

        require(self.keyring.length > 0 && self.keyring.length < 2^256);
        require(self.keyIndex[keyXOR] == 0);

        self.keyIndex[keyXOR] = (self.keyring.push(keyXOR | self.MASK) -1);
        self.ringlength = self.keyring.length;
        self.reputation.signee = self.ringlength;
        // Doers(proxyKey).incSigns(keyXOR << 32);
        signed = true;

        emit LogKeyRing(self.ringlength,self.keyring[self.keyIndex[keyXOR]],self.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("sign()"),
        //     ringlength,
        //     keyring[keyIndex[keyXOR]],
        //     keyIndex[keyXOR],
        //     signed);
        return (self.ringlength,signed);
    }

    function revoke(DataStorage storage self, address _address, bytes32 keyXOR) public returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using
        require(self.keyring.length > 0);

        bytes memory callData = msg.data;
        emit LogRevoking(this, msg.sender, tx.origin, callData, keyXOR);

        if (self.keyring.length == 1) {	//	a ^ b; == key; //	key ^ a == b
            
            require (address(keyXOR) == address(self.keyring[self.keyIndex[keyXOR]]));
            self.keyIndex[keyXOR] = 2^256;
            delete self.keyring;
            delete self.reputation.signee;
            require(self.reputation.signer-- > 0);
            self.ringlength = 0;
            revoked = false;
        } else {
            revoked = _address.call(bytes4(sha3("revoke()")));
            require(revoked);
            require(self.reputation.signer-- > 0);
            return (self.reputation.signer,revoked);
        }

        emit LogKeyRing(self.ringlength,keyXOR,self.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("revoke(address)"),
        //     ringlength,
        //     keyXOR,
        //     keyIndex[keyXOR],
        //     revoked);
        return (self.ringlength,revoked);
    }

    function revoke(DataStorage storage self, bytes32 keyXOR) public returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using
        require(self.keyring.length > 1 && msg.sender != self.owner);
        // bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        require (address(keyXOR) == address(self.keyring[self.keyIndex[keyXOR]]));
        bytes memory callData = msg.data;
        emit LogRevoking(this, msg.sender, tx.origin, callData, keyXOR);

        self.keyring[self.keyIndex[keyXOR]] = self.keyring[self.keyring.length -1];
        self.keyIndex[((self.keyring[self.keyring.length -1] << 96) >> 96)] = self.keyIndex[keyXOR];
        delete self.keyring[self.keyring.length -1];
        self.ringlength = self.keyring.length;
        delete self.keyIndex[keyXOR];
        self.reputation.signee = self.ringlength;
        Doers(self.proxyKey).decSigns(keyXOR << 32);
        revoked == true;

        emit LogKeyRing(self.ringlength,keyXOR,self.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("revoke()"),
        //     ringlength,
        //     keyXOR,
        //     keyIndex[keyXOR],
        //     revoked);
        return (self.ringlength,revoked);
    }

    function trust(DataStorage storage self, UserDefined.Trust _level, bytes32 keyXOR) public returns (bool) {
        require((self.keyring.length > 0) && (self.keyring.length < 2^256));
        
        uint num = self.keyIndex[keyXOR];
        require (address(keyXOR) == address(self.keyring[num]));
        keyXOR = self.keyring[num];
        bytes memory callData = msg.data;
        emit LogTrusted(this, msg.sender, tx.origin, callData, keyXOR);
        // if (((keyXOR >> 192) << 240) > (creator.trust(_level) << 48)) {
        //     keyXOR &= 0xffffffffffff00ffffffffffffffffffffffffffffffffffffffffffffffffff;   // RESET THE TRUST FLAG FIRST
        // }
        keyXOR &= 0xffffffffffff00ffffffffffffffffffffffffffffffffffffffffffffffffff;   // RESET THE TRUST FLAG FIRST
        keyXOR |= self.creator.trust(_level);    // NO ADDING UP, JUST SET CUMULATIVE VALUE
        self.keyring[num] = keyXOR;
        emit LogKeyRing(self.ringlength,self.keyring[self.keyIndex[keyXOR]],self.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("trust(Trust)"),
        //     ringlength,
        //     keyring[keyIndex[keyXOR]],
        //     keyIndex[keyXOR],
        //     true);

        return true;
    }

    // function incSigns(DataStorage storage self, bytes32 _keyd) public returns (uint) {
    //     require(self.reputation.signer++ < 2^256);
    //     return self.reputation.signer;
    // }
    function decSigns(DataStorage storage self, bytes32 _keyd) public returns (uint) {
        require(self.reputation.signer-- > 0);
        return self.reputation.signer;
    }

    function setbdi(
        DataStorage storage self, 
        UserDefined.KBase _kbase,
        bytes32 _country,
        bytes32 _cAuthority,
        bytes32 _score,
        uint _year)
    public returns(bool) {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == self.owner) {
            Doers(self.proxyBDI).setbdi(_kbase,_country,_cAuthority,_score,_year);
            self.callBackState[callid][false] = BE.QUALIFICATION;
            emit LogSetbdi(this,msg.sender,tx.origin,self.Iam.keyid,self.Iam.uuid,callid);
            } else {
            require(self.callBackState[callid][false] == BE.QUALIFICATION);
            if (_kbase == UserDefined.KBase.BACHELOR) {		// exclude Bachelors from prerequisite of having a License
                require(self.bdi.beliefs.qualification[uint8(UserDefined.KBase.SECONDARY)].cAuthority != 0x0);
                } else {
                require(self.bdi.beliefs.qualification[uint8(_kbase) - 1].cAuthority != 0x0);
                }
            // IF (TO UPDATE)
            self.bdi.beliefs.qualification[uint8(_kbase)] = UserDefined.Qualification({country: _country, cAuthority: _cAuthority, score: _score});
            self.bdi.beliefs.merits.experience = _year;
            self.callBackState[callid][true] = self.callBackState[callid][false];
            delete self.callBackState[callid][false];
            // index_ = updateIndex(self);
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(KBase,bytes32,bytes32,bytes32,uint)"),
            // index_);
        }
    }

    function setbdi(
        DataStorage storage self, 
        uint _refMSD,
        uint _refRank,
        uint _refSigned,
        uint _refSigs,
        bytes32 _refTrust)
    public returns (bool) {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == self.owner) {
            Doers(self.proxyBDI).setbdi(_refMSD,_refRank,_refSigs,_refSigned,_refTrust);
            self.callBackState[callid][false] = BE.REPUTATION;
            emit LogSetbdi(this,msg.sender,tx.origin,self.Iam.keyid,self.Iam.uuid,callid);
            } else {
            require(self.callBackState[callid][false] == BE.REPUTATION);
            self.reputation.refMSD = _refMSD;
            self.reputation.refRank = _refRank;
            self.reputation.refTrust = _refTrust;
            self.bdi.beliefs.merits.reputation = _refTrust;
            self.callBackState[callid][true] = self.callBackState[callid][false];
            delete self.callBackState[callid][false];
            // index_ = updateIndex(self);
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(uint,uint,uint,uint,uint)"),
            // index_);
        }
    }

    function setbdi(DataStorage storage self, bytes32 _talent) public returns (bool) {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == self.owner) {
            Doers(self.proxyBDI).setbdi(_talent);
            self.callBackState[callid][false] = BE.TALENT;
            emit LogSetbdi(this,msg.sender,tx.origin,self.Iam.keyid,self.Iam.uuid,callid);
            } else {
            require(self.callBackState[callid][false] == BE.TALENT);
            if (self.bdi.beliefs.merits.talent == 0x0) {
                self.bdi.beliefs.merits.talent = _talent;
                Userbase(self.userbase).incTalent();
            } else {
                Userbase(self.userbase).decTalent();
                self.bdi.beliefs.merits.talent = _talent;
                Userbase(self.userbase).incTalent();
            }
            self.callBackState[callid][true] = self.callBackState[callid][false];
            delete self.callBackState[callid][false];
            // index_ = updateIndex(self);
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(bytes32)"),
            // index_);
            }
    }

    function setbdi(DataStorage storage self, bytes1 _desire, UserDefined.Desire _goal) public {
        self.bdi.desires[_desire] = _goal;
        //  Collector(creator.peana()).updateLog(
        //     keccak256("setbdi(bytes1,Desire)"),
        //     true);
    }

    function setbdi(DataStorage storage self, UserDefined.Intention _service) public {
        self.bdi.intentions[false] = _service;
        self.bdi.intentions[false].state = UserDefined.IS.INACTIVE;
        // Collector(creator.peana()).updateLog(
        //     keccak256("setbdi(bytes1,Desire)"),
        //     true);
    }


/* End of Doers Library */
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
    
    using DoersLib for DoersLib.DataStorage;
    DoersLib.DataStorage data;

/* Constant */

/* User Types */

/* State Variables */

/* Events */

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

/* Modifiers */

    modifier onlyCreator {
        require(data.creator.isCreator());
        _;
    }

    modifier onlyDoer {
        require (data.creator.isDoer());
        _;
    }

    modifier onlyOwner {
        require(data.creator.iam() && msg.sender == data.owner);
        _;
    }

    modifier ProxyKey {
        require(msg.sender == data.proxyKey);
        _;
    }

    modifier ProxyBDI {
        require(msg.sender == data.proxyKey || msg.sender == data.owner);
        _;
    }
    
    modifier toPeana {
        Collector(data.creator.peana()).sendLog(msg.sender,this,msg.data);
        _;
    }



/* Functions */

    function Doers(Creators _creator, SomeDoer _adoer) public {
        data.creator = _creator;
        data.owner = tx.origin;
        data.peana = _creator.peana();
        data.MASK = _creator.DOER();
        data.proxyKey = _creator.proxyKey();
        data.proxyBDI = _creator.proxyBDI();
        data.Iam = _adoer;
        emit ContractEvent(this, msg.sender, tx.origin);
    }

/////////////////
// ABLE COMPUTE
/////////////////
    
    function updateIndex() internal returns (bool) {
        return data.updateIndex();

        // Collector(creator.peana()).updateLog(keccak256("updateIndex()"),true);

    }

/////////////////
// All ASSERTERS
/////////////////

    function iam() view public returns (bool iam_) {
        return data.iam();
        // Collector(creator.peana()).updateLog(keccak256("iam()"),iam);
    }
    
    function index() view public returns (uint8 index_) {
        return data.index();
    }
    
    function ringlength() view public returns (uint ringlength_) {
        return data.ringlength;
    }
    
    function UUID() view public returns (bytes32 UUID_) {
        return data.Iam.uuid;
    }
    
    function KEYID() view public returns (bytes32 KEYID_) {
        return data.Iam.keyid;
    }
    
    function merits() 
    view public returns (
        uint experience_,
        bytes32 reputation_,
        bytes32 talent_,
        uint8 index_,
        bytes32 hash_) {
                
        return data.merits();
        
    }
    
    function kbase() view public returns (KBase kbase_) {
        return data.kbase();
    }
    
    function desire(bytes1 _desire)
    view external returns  (bytes32) {        
        return data.desire(_desire);
    }
    
    function intention(bool _intention)
    view external returns  (bytes32) {
        return data.intention(_intention);
    }
    
    function intention(bool _intention, IS _state)
    external returns  (IS) {
        return data.intention(_intention,_state);
    }
    
    function flipIntention()
    external returns  (bool) {
        return data.flipIntention();
    }
    


/////////////////
// All GETTERS
/////////////////

    function getDoer()
    view external returns  (
    bytes32 fPrint,
    bool iam_,
    bytes32 email,
    bytes32 fName,
    bytes32 lName,
    uint age,
    bytes32 data_) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getDoer()"),
        //     keccak256(Iam.fPrint),
        //     keccak256(this.iam()),
        //     keccak256(Iam.email),
        //     keccak256(Iam.fName),
        //     keccak256(Iam.lName),
        //     keccak256(Iam.age),
        //     keccak256(Iam.data));
        return data.getDoer();
    }

    function getBelief(KBase _kbase)
    view external returns  (
    bytes32 country_,
    bytes32 cAuthority_,
    bytes32 score_) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.beliefs.qualification[uint8(_kbase)].country,
        //     bdi.beliefs.qualification[uint8(_kbase)].cAuthority,
        //     bdi.beliefs.qualification[uint8(_kbase)].score);
        return data.getBelief(_kbase);
    }

    function getDesire(bytes1 _desire)
    view external returns  (bytes32,bool) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.desires[_desire].goal,
        //     bdi.desires[_desire].status);        
        return data.getDesire(_desire);
    }

    function getIntention(bool _intention)
    view external returns  (IS,bytes32,uint256) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.intentions[_intention].state,
        //     bdi.intentions[_intention].service,
        //     bdi.intentions[_intention].payout);
        return data.getIntention(_intention);
    }

/////////////////
// All SETTERS
/////////////////

    function init() external returns  (bool) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     init);
        return data.init();
    }
//
    function sign(address _address) public onlyOwner returns (uint, bool signed) {

        bytes32 keyXOR = bytes32(uint256(_address)) ^ bytes32(uint256(msg.sender));
        
        emit LogSigning(this, msg.sender, tx.origin, _address, keyXOR);

        return data.sign(_address, keyXOR);

            // Collector(creator.peana()).updateLog(
            // keccak256("sign(address)"),
            // ringlength,
            // keyring[keyIndex[keyXOR]],
            // keyIndex[keyXOR],
            // signed);
    }

    function sign() external onlyDoer returns (uint, bool signed) { // padd left before using bytes32(uint256(this) << 96)
    
        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        
        emit LogKeyRing(data.ringlength,data.keyring[data.keyIndex[keyXOR]],data.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("sign()"),
        //     ringlength,
        //     keyring[keyIndex[keyXOR]],
        //     keyIndex[keyXOR],
        //     signed);
        return data.sign(keyXOR);
    }

    function revoke(address _address) external onlyDoer returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using

        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        
        emit LogRevoking(this, msg.sender, tx.origin, msg.data, keyXOR);

        emit LogKeyRing(data.ringlength,keyXOR,data.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("revoke(address)"),
        //     ringlength,
        //     keyXOR,
        //     keyIndex[keyXOR],
        //     revoked);
        return data.revoke(_address, keyXOR);
    }

    function revoke() external onlyDoer returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using

        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        
        emit LogRevoking(this, msg.sender, tx.origin, msg.data, keyXOR);

        emit LogKeyRing(data.ringlength,keyXOR,data.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("revoke()"),
        //     ringlength,
        //     keyXOR,
        //     keyIndex[keyXOR],
        //     revoked);
        return data.revoke(keyXOR);
    }

    function trust(Trust _level) returns (bool) {
        
        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));

        emit LogTrusted(this, msg.sender, tx.origin, msg.data, keyXOR);

        emit LogKeyRing(data.ringlength,data.keyring[data.keyIndex[keyXOR]],data.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("trust(Trust)"),
        //     ringlength,
        //     keyring[keyIndex[keyXOR]],
        //     keyIndex[keyXOR],
        //     true);

        return data.trust(_level, keyXOR);
    }

    // function incSigns(bytes32 _keyd) external ProxyKey returns (uint) {
    //     return data.incSigns(_keyd);
    // }
    
    function decSigns(bytes32 _keyd) external ProxyKey returns (uint) {
        return data.decSigns(_keyd);
    }

    function setbdi(
        KBase _kbase,
        bytes32 _country,
        bytes32 _cAuthority,
        bytes32 _score,
        uint _year)
    external ProxyBDI returns(bool qualification_) {
        
                return data.setbdi(
                    _kbase,
                    _country,
                    _cAuthority,
                    _score,
                    _year
                    );
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(KBase,bytes32,bytes32,bytes32,uint)"),
            // index_);
    }

    function setbdi(
        uint _refMSD,
        uint _refRank,
        uint _refSigned,
        uint _refSigs,
        bytes32 _refTrust)
    external ProxyBDI returns (bool reputation_) {
                return data.setbdi(
                    _refMSD,
                    _refRank,
                    _refSigned,
                    _refSigs,
                    _refTrust
                    );
                    
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(uint,uint,uint,uint,uint)"),
            // index_);
    }

    function setbdi(bytes32 _talent) external ProxyBDI returns (bool talent_) {

        return data.setbdi(_talent);
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(bytes32)"),
            // index_);
    }

    function setbdi(bytes1 _desire, Desire _goal) public onlyDoer {
        
        return data.setbdi(_desire, _goal);
        //  Collector(creator.peana()).updateLog(
        //     keccak256("setbdi(bytes1,Desire)"),
        //     true);
    }

    function setbdi(Intention _service) public onlyDoer {
        
        return data.setbdi(_service);
        // Collector(creator.peana()).updateLog(
        //     keccak256("setbdi(bytes1,Desire)"),
        //     true);
    }


/* End of Doers Contract */
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

///////////////////
// Beginning of Contract
///////////////////

contract Collector is UserDefined {
    
        
    function sendLog(address _address, address _address2, bytes _data) view external returns (bool) {
        return true;
    }
    
    function updateLog(bytes32 _funcSignature, bool _result) pure external returns (bool) {
        return true;
    }
    
    function updateLog(bytes32 _funcSignature, address _result) pure external returns (bool) {
        return true;
    }
    
    function updateLog(
        bytes32 _funcSignature, 
        bytes32 _result0, 
        bool _result1) pure external returns (bool) {
        return true;
    }
    
    function updateLog(
        bytes32 _funcSignature, 
        bytes32 _result0, 
        bytes32 _result1) pure external returns (bool) {
        return true;
    }
    
    function updateLog(
        bytes32 _funcSignature, 
        IS _result0, 
        bytes32 _result1,
        uint _result2) pure external returns (bool) {
        return true;
    }
            
    function updateLog(
        bytes32 _funcSignature, 
        uint _result0, 
        bytes32 _result1,
        uint _result2,
        bool _results3) pure external returns (bool) {
        return true;
    }
    
    function updateLog(
        bytes32 _funcSignature, 
        bytes32 _result0, 
        bytes32 _result1,
        bytes32 _result2) pure external returns (bool) {
        return true;
    }
    
    function updateLog(
        bytes32 _funcSignature, 
        bytes32 _result0, 
        bytes32 _result1,
        bytes32 _result2,
        bytes32 _result3,
        bytes32 _result4,
        bytes32 _result5,
        bytes32 _result6) pure external returns (bool) {
        return true;
    }
}

contract Peana is BaseController {

/* Constant */

    // Able contrl;
    
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


    function Peana(Able _ctrl) {
        contrl = _ctrl;
        emit ContractEvent(this,msg.sender,tx.origin);
    }

    bytes public callParam;
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

    function toBytes(bytes32 _bytes32) pure internal returns (bytes) {

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

    function snarkProof(address _address, bytes _data, bool success) returns (bool) {
        // !!! STUB: FOR SNARK PROOF IMPLEMENTATION
        return true;
    }
/* End of ProxyBDI Contract */
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

    function toBytes(bytes32 _bytes32) pure internal returns (bytes) {

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

    event LogNewDoer(address indexed from, address indexed to, address indexed origin, address _newdoer);
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
    
/* Modifiers */

    modifier toPeana {
        Collector(creator.peana()).sendLog(msg.sender,this,msg.data);
        _;
    }

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
        uint _birth
        )
        public returns (address) {
            userbase.decAgent(_introducer);
            bytes32 uuidCheck = keccak256(_fPrint, _idNumber, _lName, _birth);
            Doers newDoer = new Doers(creator, UserDefined.SomeDoer({
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
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(makeDoer(address,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,uint)"),
            // newDoer);
            return newDoer;
    }

/* End of DoersFactory Contract */

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
        // Zero:       0x01ff << 192,
        Unknown:    0x03ff << 192,
        // Unknown:    0x02ff << 192,
        Generic:    0x07ff << 192,
        // Generic:    0x04ff << 192,
        Poor:       0xF0ff << 192,
        // Poor:       0x08ff << 192,
        Casual:     0xF1ff << 192,
        // Casual:     0x10ff << 192,
        Partial:    0xF3ff << 192,
        // Partial:    0x20ff << 192,
        Complete:   0xF7ff << 192,
        // Complete:   0x40ff << 192,
        Ultimate:   0xFFff << 192
        // Ultimate:   0x80ff << 192
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

    function isCreator() view external returns  (bool isCreator) { // Point this to oraclise service checking MSD on
        require (userbase.isDoer(msg.sender) == IS.CREATOR);
        return true;
    } 	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

    function isCreator(bytes32 _keyid) view external returns  (bool isCreator) { // Point this to oraclise service checking MSD on
        require (userbase.isDoer(userbase.getAgent(_keyid)) == IS.CREATOR);
        return true;
    } 	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

// 	function isPlanning(bytes32 _intention) view external returns  (uint256) {
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
    view external returns  (bytes32 keyid_, IS state_, bool active_, uint myDoers_) {
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

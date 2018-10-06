pragma solidity ^0.4.25;
//pragma experimental ABIEncoderV2;


//////////////////////
// Abstract Contract
//////////////////////
/// @dev `ControlAbstract` is a base level contract that declares and scopes `user defined type` 
contract ControlAbstract {

/* Constants */

/* State Variables */


/* Events */


/* Modifiers */

    
/* Functions */ 

    function verify(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view internal returns (address);

    function verified(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view internal returns (bool success);

/* End of ControlAbstract */

}

contract UserDefined {

    /* Enums*/

    enum KBase {PRIMARY,SECONDARY,TERTIARY,CERTIFICATION,DIPLOMA,LICENSE,BACHELOR,MASTER,DOCTORATE}
    // Weights	   1,		2,		 4,		    8,		   16,	    32,		64,	    128    256
    enum IS { CLOSED, CREATOR, CURATOR, ACTIVE, INACTIVE, RESERVED, PROVER }
    enum Project { NULL, PENDING, INITIATED, APPROVED, STARTED, CLOSED }
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
        // 0x01	“C”	Key Certification
        // 0x02	“S”	Sign Data
        // 0x04	“E”	Encrypt Communications
        // 0x08	“E”	Encrypt Storage
        // 0x10	 	Split key
        // 0x20	“A”	Authentication
        // 0x80	 	Held by more than one person
    enum Trust {ZERO, UNKNOWN, GENERIC, POOR, CASUAL, PARTIAL, COMPLETE, ULTIMATE}


/* Structs*/

/// @notice `SomeDoer` defines the basic universal structure of an agent
    // @dev Interp. aDoer {fPrint, email, birth, fName, lName, active, lastUpdate} is an agent with
    // fPrint is PGP Key fingerprint
    // email is PGP key email
    // birth is date of birth in seconds from 1970
    // fName is first name in identity document MRZ
    // lName is last name in identity document MRZ
    // state is deliberative state of agent
    // lastUpdate is timestamp of last record entry
    struct SomeDoer {
        bytes32 fPrint;
        bytes32 idNumber;
        bytes32 email;
        bytes32 fName;
        bytes32 lName;
        bytes32 uuid;
        bytes32 keyid;
        bytes32 data;
        uint age;
    }

    /// @notice `Belief_Desire_Intention` is the type that defines a strategy model of an actual agent
    // @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
    // Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
    // experience is period from qualification in seconds
    // reputaion is PGP trust level flag !!! CITE RFC PART
    // talent is user declared string of talents
    struct BDI {
        Belief beliefs;
        mapping(bytes1 => Desire) desires;
        mapping(bool => Intention) intentions;
    } struct Belief {
        Merits merits;
        mapping(uint8 => Qualification) qualification; // Key is the keccak256 hash of the struct contents
        } struct Merits {
            uint experience;
            bytes32 reputation;
            bytes32 talent;
            uint8 index;
            bytes32 hash;
            } struct Qualification {
            bytes32 country; //ISO3166-2:KE-XX;
            bytes32 cAuthority;
            bytes32 score;
    } struct Desire {
        bytes32 goal;
        bool status;
    } struct Intention {
        IS state;
        bytes32 service;
        uint256 payout;
    }

    /// @notice `Creator && Doer lookup` is the type that defines a strategy model of an actual agent
    // @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
    // Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
    // experience is period from qualification in seconds
    // reputaion is PGP trust level flag !!! CITE RFC PART
    // talent is user declared string of talents

    struct Agent {
        bytes32 keyId;
        IS state;
        bool active;
        uint myDoers;
    }

    /// @dev `Initialised data structures
    /// @notice `Creator && Doer lookup` is the type that defines a strategy model of an actual agent
    // @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
    // Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
    // experience is period from qualification in seconds
    // reputaion is PGP trust level flag !!! CITE RFC PART
    // talent is user declared string of talents

    /// @notice `Plan_Service_Promise_Fulfillment_Verification` is the type that defines a strategy model of an actual agent
    // @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
    // Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
    // experience is period from qualification in seconds
    // reputaion is PGP trust level flag !!! CITE RFC PART
    // talent is user declared string of talents

    struct Plans {
        Project state;
        Plan plan;
        mapping(bytes32 => Services) services;
    } struct Plan {
            bytes32 preCondition;
            uint time;
            uint budget;
            Desire postCondition;
            bytes32 projectUrl;
            address creator;
            address curator;
    } struct Services {
        Service definition;
        Order order;
        mapping(address => Procure) procure;
        } struct Service {
            Belief preCondition;
            Desire postCondition;
            Metas metas;
            } struct Metas {
                uint timeSoft;  // preferred timeline
                uint expire;
                bytes32 hash;
                bytes32 serviceUrl;
                address doer;
        } struct Order {
            bytes32 Sig;
            uint8 V;
            bytes32 R;
            bytes32 S;
        } struct Procure {
            Promise promise;
            Fulfillment fulfillment;
            mapping(address => Verification) verification; // key is hash of fulfillment
    } struct Promise {
                Intention thing;
                uint timeHard;   // proposed timeline
                bytes32 hash;
    } struct Fulfillment {
                bytes32 proof;
                Level rubric;
                uint timestamp;
                bytes32 hash;
    } struct Verification {
                bytes32 verity;
                bool complete;
                uint timestamp;
                bytes32 hash;
    }

    struct Reputation {
        uint refMSD; // !!! GET THIS DATA FROM DATABASE  **** MAYBE WE SHOULD JUST MEASURE THIS RELATIVE TO THE INDIVIDUAL ****
        uint refRank;  //!!! GET THIS DATA FROM DATABASE
        uint signer; //!!! GET THIS DATA FROM DATABASE
        uint signee; //!!! GET THIS DATA FROM DATABASE
        bytes32 refTrust; //!!! GET THIS DATA FROM DATABASE
    }

    struct Clearance {
        bytes32 Zero;
        bytes32 Unknown;
        bytes32 Generic;
        bytes32 Poor;
        bytes32 Casual;
        bytes32 Partial;
        bytes32 Complete;
        bytes32 Ultimate;
    }
}

/* Constant */
/* State Variables */
/* Events */
/* Modifiers */
/* Functions */
/* End of Contract */

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
    address internal _peana_;
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
    /// Contract BaseController Constructor
    /// @notice The Constructor assigns the message sender to be `owner`
    constructor() internal {
        owner = tx.origin;
    }

    function getContrl() view public returns (Able) {
        return contrl;
    }

    function isAble() view public returns (bytes32 Able_) {
        Able_ = contrl.KEYID();
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
        emit ChangedController(msg.sender, owner);
        return true;
    }

    function verify(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) pure public returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, _message));
        return ecrecover(prefixedHash, _v, _r, _s);
    }

    function verified(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view external returns  (bool success) {
        verify(_message,_v,_r,_s) == msg.sender ? success = true : success = false;
    }

    function contractBalance() public constant returns(uint) {
        return address(this).balance;
    }

    function safeSend(address _recipient, uint _ether) internal preventReentry() returns (bool success_) {
        require(_recipient.call.value(_ether)());
        success_ = true;
    }

/* End of BaseController */
}

////////////////
// Able Contract
////////////////
contract Able is BaseController {

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

    /// Contract Able Constructor
    /// @notice The Constructor assigns ***** the message sender to be `owner`
    constructor() public {
        contrl = Able(this);
        controller = this;
        cName = CONTRACTNAME;
        contracts[this] = cName;
        owner = msg.sender;
        //	database = Database(makeContract("database"));
        //  userbase = Userbase(makeContract("userbase"));
        emit ContractEvent(this,msg.sender,tx.origin);
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

    // /// @notice Changes the controller of the contract
    // /// @param _newController The new controller of the contract
    // function changeController(address _newController) public onlyController returns (bool) {
    //     if (controller == _newController) {
    //         revert();
    //     } else {
    //         setContrl(Able(_newController));
    //         return setController();
    //         }
    // }

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
        emit ContractCallEvent(this,msg.sender,tx.origin,_name);
        return true;
    }

    // Remove a contract from the controller. We could also selfdestruct if we want to.
    function removeContract(address _address, bytes32 _sig) onlyOwner external returns  (bool result) {
        require(_sig == 0x0);
        // require(verify(_sig,_v,_r,_s) == controller);
        require(contracts[_address] != 0x0);
        // Kill any contracts we remove, for now.
        selfdestruct(_address);
        // bytes32 reset;
        delete contracts[_address];
        emit ContractCallEvent(this,msg.sender,tx.origin,CONTRACTNAME);
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
pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;
import "./Reserve.sol";


////////////////////
// Database Contract
////////////////////
library DatabaseLib {

/* Constants */

    bytes32 constant internal CONTRACTNAME = "DATABASE 0.0118";
    uint8 constant internal BASE = 2;
    uint constant GEN = 1000;
    uint constant difficulty = 10**32;

/* Enums*/


/* Structs*/

    struct DataStorage {

    /* State Variables */

        Userbase userbase;
        Able contrl;
        DoitToken doit;

        uint8 BASE;

        uint GEN;

        bytes32 intention;
        uint plansCount;
        uint curatedPlansCount;
        uint promiseCount;
        uint orderCount;
        uint fulfillmentCount;
        uint verificationCount;

        bytes32 currentChallenge;                         // The coin starts with a challenge
        uint timeOfLastProof;                             // Variable to keep track of when rewards were given
        uint difficulty;                                 // Difficulty starts reasonably low
        uint256 amount;

        /// @dev `Initialised data structures
        /// @notice `Creator && Doer lookup` is the type that defines a strategy model of an actual agent
        // @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
        // Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
        // experience is period from qualification in seconds
        // reputaion is PGP trust level flag !!! CITE RFC PART
        // talent is user declared string of talents

        mapping(bytes32 => UserDefined.Plans) plans;

        mapping(bytes32 => address[]) promises;

        // bytes32[] public allPlans;

    }

/* State Variables */

    // Storage public data;
  
    

/* Events */

    event SetPlan(address indexed _from, address indexed _sender, address indexed _creator, bytes32 _intention, bytes32 _planData);
    event SetService(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId, bytes32 _serviceData);
    event SetPromise(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
    event SetOrder(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
    event SetFulfillment(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);
    event SetVerification(address indexed _from, address indexed _sender, bytes32 _intention, bytes32 _serviceId);

/* Modifiers */

    // modifier onlyCreator {
    //     require(data.userbase.isDoer(msg.sender) == IS.CREATOR);
    //     _;
    // }

    // modifier onlyDoer {
    //     require(data.userbase.isDoer(msg.sender) != IS.CREATOR);
    //     _;
    // }

    // modifier onlyCurator {
    //     require(data.userbase.isDoer(msg.sender) == IS.CURATOR);
    //     _;
    // }

    // modifier onlyTrustee {
    //     require(data.userbase.isDoer(msg.sender) == IS.ACTIVE);
    //     _;
    // }

    // modifier onlyProver {
    //     require(data.userbase.isDoer(msg.sender) == IS.PROVER);
    //     _;
    // }
/* Functions */

    // function Database(Able _ctrl) public  {
    //     cName = CONTRACTNAME;
    //     contrl = _ctrl;
    //     owner = contrl.owner();
    //     controller = contrl.controller();
    //     ContractEvent(this,msg.sender,tx.origin);
    // }

/////////////////
// All METAS
/////////////////

    // function setAllPlans(bytes32 _planId) external onlyController {
    // 	allPlans.push(_planId);
    // }

    function setPromise(DataStorage storage self, bytes32 _serviceId) public {
        require(self.promiseCount++ < 2^256);
        self.promises[_serviceId].push(tx.origin);
    }

    function getBase(DataStorage storage self) public  returns (uint8) {
        return BASE;
    }

/////////////////
// All ASSERTS
/////////////////

    function isPlanning(DataStorage storage self, bytes32 _intention) view public returns (uint256) {
        return uint256(self.plans[_intention].state);
    }
    

/////////////////
// All GETTERS FOR FUTURE USE
/////////////////

    /// @notice Get the initialisation data of a plan created by a Creator.
    /// @param _intention The query condition of the contract
    //  @dev `anybody` can retrive the plan data in the contract Plan has five levels


    function plan(DataStorage storage self, bytes32 _intention)
    view public returns (UserDefined.Plan) {
        return self.plans[_intention].plan;
    }

    function state(DataStorage storage self, bytes32 _intention)
    view public returns (UserDefined.Project) {
        return self.plans[_intention].state;
    }
    
    function goal(DataStorage storage self, bytes32 _intention)
    view public returns (bytes32 goal_) {
        return self.plans[_intention].plan.postCondition.goal;
    }

    function precondition(DataStorage storage self, bytes32 _intention, bytes32 _serviceId)
    view public returns (UserDefined.Merits) {
        return self.plans[_intention].services[_serviceId].definition.preCondition.merits;
    }

    function precondition(DataStorage storage self, bytes32 _intention, bytes32 _serviceId, UserDefined.KBase _index)
    view public returns (UserDefined.Qualification) {
        return self.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)];
    }

    function postcondition(DataStorage storage self, bytes32 _intention, bytes32 _serviceId)
    view public returns (UserDefined.Desire) {
        return self.plans[_intention].services[_serviceId].definition.postCondition;
    }

    function metas(DataStorage storage self, bytes32 _intention, bytes32 _serviceId)
    view public returns (UserDefined.Metas) {
        return self.plans[_intention].services[_serviceId].definition.metas;
    }

    function promise(DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _address)
    view public returns (UserDefined.Promise) {
        return self.plans[_intention].services[_serviceId].procure[_address].promise;
    }

    function fulfillment(DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _doer)
    view public returns (UserDefined.Fulfillment) {
        return self.plans[_intention].services[_serviceId].procure[_doer].fulfillment;
    }

    function verification(DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _doer, address _prover)
    view public returns (UserDefined.Verification) {
        return self.plans[_intention].services[_serviceId].procure[_doer].verification[_prover];
    }


//////////////////////////////
// ALL GETTERS FOR CURRENT USE
//////////////////////////////


    function getPlan(DataStorage storage self, bytes32 _intention)
    view public returns (
    bytes32 preCondition,
    uint time,
    uint budget,
    bytes32 projectUrl,
    address creator,
    address curator) {
        return (
            self.plans[_intention].plan.preCondition,
            self.plans[_intention].plan.time,
            self.plans[_intention].plan.budget,
            self.plans[_intention].plan.projectUrl,
            self.plans[_intention].plan.creator,
            self.plans[_intention].plan.curator);
    }

    function getStatus(DataStorage storage self, bytes32 _intention)
    view public returns  (UserDefined.Project, bytes32 goal_, bool success) {
        return (
            self.plans[_intention].state,
            self.plans[_intention].plan.postCondition.goal,
            self.plans[_intention].plan.postCondition.status);
    }

    function getPrecondition(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId)
    view public returns (
    uint experience,
    bytes32 reputation,
    bytes32 talent,
    uint8 index) {
        return (
            self.plans[_intention].services[_serviceId].definition.preCondition.merits.experience,
            self.plans[_intention].services[_serviceId].definition.preCondition.merits.reputation,
            self.plans[_intention].services[_serviceId].definition.preCondition.merits.talent,
            self.plans[_intention].services[_serviceId].definition.preCondition.merits.index);
    }

    function getPrecondition(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, UserDefined.KBase _index)
    view public returns (
    bytes32 country,
    bytes32 cAuthority,
    bytes32 score) {
        return (
            self.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].country,
            self.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].cAuthority,
            self.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)].score);
    }

    function getPostcondition(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId)
    view public returns  (
    bytes32 goal_,
    bool status_) {
        return (
            self.plans[_intention].services[_serviceId].definition.postCondition.goal,
            self.plans[_intention].services[_serviceId].definition.postCondition.status);
    }

    function getMetas(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId)
    view public returns  (
    uint timeSoft, // preferred timeline
    uint expire,
    bytes32 hash,
    bytes32 serviceUrl,
    address doer) {
        return (
            self.plans[_intention].services[_serviceId].definition.metas.timeSoft,
            self.plans[_intention].services[_serviceId].definition.metas.expire,
            self.plans[_intention].services[_serviceId].definition.metas.hash,
            self.plans[_intention].services[_serviceId].definition.metas.serviceUrl,
            self.plans[_intention].services[_serviceId].definition.metas.doer);
    }

    function getPromise(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _address)
    view public returns  (
    UserDefined.IS state_,			// Intention type,
    bytes32 service,	// Intention type,
    uint256 payout, 	// Intention type,
    uint timeHard,
    bytes32 hash) {
        return (
            self.plans[_intention].services[_serviceId].procure[_address].promise.thing.state,
            self.plans[_intention].services[_serviceId].procure[_address].promise.thing.service,
            self.plans[_intention].services[_serviceId].procure[_address].promise.thing.payout,
            self.plans[_intention].services[_serviceId].procure[_address].promise.timeHard,
            self.plans[_intention].services[_serviceId].procure[_address].promise.hash);
    }
    
    function getOrder(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId)
    view public returns  (
        bytes32 Sig,
        uint8 V,
        bytes32 R,
        bytes32 S) {
        return (
            self.plans[_intention].services[_serviceId].order.Sig,
            self.plans[_intention].services[_serviceId].order.V,
            self.plans[_intention].services[_serviceId].order.R,
            self.plans[_intention].services[_serviceId].order.S
            );
    }

    function getFulfillment(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _doer)
    view public returns  (
    bytes32 proof,
    UserDefined.Level rubric,
    uint timestamp,
    bytes32 hash) {
        return (
            self.plans[_intention].services[_serviceId].procure[_doer].fulfillment.proof,
            self.plans[_intention].services[_serviceId].procure[_doer].fulfillment.rubric,
            self.plans[_intention].services[_serviceId].procure[_doer].fulfillment.timestamp,
            self.plans[_intention].services[_serviceId].procure[_doer].fulfillment.hash);
    }

    function getVerification(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _doer, address _prover)
    view public returns  (
    bytes32 verity,
    bool complete,
    uint timestamp,
    bytes32 hash) {
        return (
            self.plans[_intention].services[_serviceId].procure[_doer].verification[_prover].verity,
            self.plans[_intention].services[_serviceId].procure[_doer].verification[_prover].complete,
            self.plans[_intention].services[_serviceId].procure[_doer].verification[_prover].timestamp,
            self.plans[_intention].services[_serviceId].procure[_doer].verification[_prover].hash);
    }

/////////////////
// All SETTERS
/////////////////

    /// @notice Get the initialisation data of a plan created by a Creator.
    /// @param _intention The query condition of the contract
    //  @dev `anybody` can retrive the plan data in the contract Plan has five levels
    function setPlan(
        DataStorage storage self, bytes32 _intention, UserDefined.Plan _planData, UserDefined.Project _state)
    public {
        require(uint(self.plans[_intention].state) == 0); // This is a new plan? // Cannot overwrite incomplete Plan // succesful plan??
        self.plans[_intention].plan = _planData;
        self.plans[_intention].state = _state;
        emit SetPlan(
            tx.origin,
            msg.sender,
            self.plans[_intention].plan.creator,
            _intention,
            self.plans[_intention].plan.postCondition.goal);
            require(self.plansCount++ < 2^256);

    }
    
    function setPlan(
        DataStorage storage self, bytes32 _intention, address _address) 
    public {
        self.plans[_intention].plan.curator = _address;
    }
    
    function setPlan(
        DataStorage storage self, bytes32 _intention, UserDefined.Project _state) 
    public {
        self.plans[_intention].state = _state;
    }
    
    function setPlan(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _address) 
    public {
        self.plans[_intention].services[_serviceId].definition.metas.doer = _address;
    }
    
    
    function setPlan(DataStorage storage self, bytes32 _intention, address _address, bytes1 _desire) returns (bool) {
        
        bytes32 _goal_;
        bool _status_ ;
        (_goal_,_status_) = Doers(_address).getDesire(_desire);
        require(_goal_ == self.plans[_intention].plan.postCondition.goal && _status_ == false);

        self.plans[_intention].services[serviceId(self,_goal_)].definition.postCondition = UserDefined.Desire(_goal_,_status_);	// bytes32 nServiceId = _serviceId ^ bytes32(msg.sender);

        return setMerits(self, _intention, _address, _desire);   
    }
    
    function setMerits(DataStorage storage self, bytes32 _intention, address _address, bytes1 _desire) returns (bool) {
        
        uint _experience_;
        bytes32 _reputation_;
        bytes32 _talent_;
        uint8 _index_;
        bytes32 _hash_;
        (_experience_,_reputation_,_talent_,_index_,_hash_) = Doers(_address).merits();
        
        self.plans[_intention].services[serviceId(self,Doers(_address).desire(_desire))].definition.preCondition.merits = UserDefined.Merits(_experience_,_reputation_,_talent_,_index_,_hash_); // Creates the curators microservice
        
    }
    
    
    
    function setPlan( // This is a new plan? 
        DataStorage storage self, bytes32 _intention, uint _time, uint _budget, bytes32 _url)
    public { // Cannot overwrite incomplete Plan
        require(uint(self.plans[_intention].state) == 0);  // succesful plan??

        self.plans[_intention].plan.time = _time;
        self.plans[_intention].plan.budget = _budget;
        self.plans[_intention].plan.projectUrl = _url;
        require(self.curatedPlansCount++ < 2^256);
        // SetPlan(
        //     tx.origin,
        //     msg.sender,
        //     _intention,
        //     self.plans[_intention].plan.time,
        //     self.plans[_intention].plan.budget,
        //     self.plans[_intention].plan.projectUrl);

    }

    function setService(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, UserDefined.Merits _merits, UserDefined.Qualification _qualification, UserDefined.KBase _index)
    public {
        self.plans[_intention].services[_serviceId].definition.preCondition.merits = _merits;
        self.plans[_intention].services[_serviceId].definition.preCondition.qualification[BASE^uint8(_index)] = _qualification;
        emit SetService(
            tx.origin,
            msg.sender,
            _intention,
            _serviceId,
            bytes32(uint(_index)));
    }

    function setService(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, UserDefined.Desire _postCondition)
    public {
        self.plans[_intention].services[_serviceId].definition.postCondition = _postCondition;
        emit SetService(
            tx.origin,
            msg.sender,
            _intention,
            _serviceId,
            self.plans[_intention].services[_serviceId].definition.postCondition.goal);
    }

    function setService(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, UserDefined.Metas _metas)
    public {
        self.plans[_intention].services[_serviceId].definition.metas = _metas;
        emit SetService(
            tx.origin,
            msg.sender,
            _intention,
            _serviceId,
            self.plans[_intention].services[_serviceId].definition.metas.serviceUrl);
    }

    function setPromise(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _address, UserDefined.Promise _data)
    public {
        self.plans[_intention].services[_serviceId].procure[_address].promise = _data;
        emit SetPromise(tx.origin,msg.sender,_intention,_serviceId);
        require(self.promiseCount++ < 2^256);
    }

    function setOrder(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _address, UserDefined.Order _data)
    public {
        self.plans[_intention].services[_serviceId].order = _data;
        emit SetOrder(tx.origin,msg.sender,_intention,_serviceId);
        require(self.orderCount++ < 2^256);
    }

    function setFulfillment(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _doer, UserDefined.Fulfillment _data)
    public {
        self.plans[_intention].services[_serviceId].procure[_doer].fulfillment = _data;
        emit SetFulfillment(tx.origin,msg.sender,_intention,_serviceId);
        require(self.fulfillmentCount++ < 2^256);
    }

    function setVerification(
        DataStorage storage self, bytes32 _intention, bytes32 _serviceId, address _doer, address _prover, UserDefined.Verification _data)
    public {
        self.plans[_intention].services[_serviceId].procure[_doer].verification[_prover] = _data;
        emit SetVerification(tx.origin,msg.sender,_intention,_serviceId);
        require(self.verificationCount++ < 2^256);
    }

// /* End of Database */
// }

// ////////////////////////
// // Factor Input Contract
// ////////////////////////


// library KaziniLib {
    
    // using DatabaseLib for DatabaseLib.DataStorage;
    // DatabaseLib.DataStorage data;

/* Constants */

// 	bytes32 constant public CONTRACTNAME = "KAZINI 0.0118";

/* State Variables */

// 	Userbase internal userbase;
// 	Creators internal creators;
// 	DoitToken internal doit;
// 	Reserve internal reserve;
//     uint public promiseCount;

/* Events */

    event FactorPayout(address indexed _from, address indexed _to, uint256 _amount);
    event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);

/* Modifiers */

//     /// @notice The address of the controller is the only address that can call
//     ///  a function with this modifier
//     modifier onlyController {
//         require(msg.sender == controller);
//         _;
//         }
    
// 	modifier onlyCreator {
// 		IS createstate;
// 		bool createactive;
// 		(,createstate, createactive,) = userbase.getAgent(msg.sender);
// 		require(createactive);
// 		require(createstate == IS.CREATOR);
// 		_;
// 	}

// 	modifier onlyDoer {
// 		IS createstate;
// 		bool createactive;
// 		(,createstate, createactive,) = userbase.getAgent(msg.sender);
// 		require(createactive);
// 		require(createstate != IS.CREATOR);
// 		_;
// 	}

/* Functions */
    
//     function Kazini(
//         Able _ctrl, 
//         Userbase _ubs,
// 		DoitToken _diy,
// 		Reserve _rsv) public {
// 		cName = CONTRACTNAME;
//         contrl = _ctrl;
//         userbase = _ubs;
// 		doit = _diy;
// 		reserve = _rsv;
// 		ContractEvent(this,msg.sender,tx.origin);
// 	}

    function serviceId(
        DataStorage storage self, bytes32 _theCondQ) 
    view public returns (bytes32) {//bytes32(uint256(msg.sender) << 96) // bitwise XOR builds a map of serviceIds
        return bytes32(uint256(_theCondQ) << 96) ^ self.plans[self.intention].plan.postCondition.goal;  
    }

    function verify(
        DataStorage storage self, UserDefined.Order _lso) 
    view public returns (address) {
        return self.contrl.verify(_lso.Sig,_lso.V,_lso.R,_lso.S);
    }	

    function verified(
        DataStorage storage self, UserDefined.Order _lso) 
    view public returns (bool check) {
        self.contrl.verify(_lso.Sig,_lso.V,_lso.R,_lso.S) == msg.sender ? check = true : check = false;
    }

    /// @notice `plan` compile a plan can step down and assign some other address to this role
    /// @param _intention _desire _preConditions _projectUrl _preQualification The address of the new owner. 0x0 can be used to create
    // Add a new contract to the controller. This will not overwrite an existing contract.
    function initPlan(
        DataStorage storage self, 
        bytes32 _intention, 
        bytes1 _desire, 
        bytes32 _preConditions, 
        bytes32 _projectUrl,
        bytes32 _preQualification,
        uint8 _minIndex) 
    public returns (bool) {
        require(self.plans[_intention].state == UserDefined.Project.NULL); // This is a new plan?
        require (Doers(msg.sender).intention(true) == 0x0);
        self.intention = _intention;
        bytes32 _goal_;
        bool _status_;
        UserDefined.Desire memory _Desire_ = UserDefined.Desire(_goal_,_status_);
        (_goal_,_status_) = Doers(tx.origin).getDesire(_desire);
        self.plans[_intention].plan.postCondition = _Desire_; // Creator and project share a goal // Get this from Doers Contract direct.																	
        self.plans[_intention].plan.preCondition = _preConditions; // pCondition of the curate that will define the concept.
        self.plans[_intention].services[serviceId(self,_goal_)].definition.preCondition.merits.hash = _preQualification;
        self.plans[_intention].services[serviceId(self,_goal_)].definition.preCondition.merits.index = _minIndex;
        self.plans[_intention].plan.projectUrl = _projectUrl; // Store the prefeasibility at the main project repo.
        self.plans[_intention].state == UserDefined.Project.PENDING;
        self.plans[_intention].plan.creator = tx.origin;
        // push event for new plan
        return true;
    }
    

    function assignPlan(
        DataStorage storage self,
        bytes1 _desire, 
        UserDefined.Metas _metas_)  // preferred timelinel) 
    public returns (bool) {
        require(self.plans[self.intention].plan.curator != _metas_.doer);
        require(
            self.plans[self.intention].state == UserDefined.Project.PENDING || 
            self.plans[self.intention].state == UserDefined.Project.INITIATED); // Project is not pending or closed
                
        bytes32 _goal_;
        bool _status_ ;
        (_goal_,_status_) = Doers(_metas_.doer).getDesire(_desire);
        require(_goal_ == self.plans[self.intention].plan.postCondition.goal && _status_ == false);
        
        
//         address _doer_ = self.plans[_intention].plan.curator;
// 		require(Doers(_metas_.doer).index() > Doers(_doer_).index()); // Curate // meets or exceeds the current Curator
        
        uint8 _index_;
        bytes32 _hash_;
        uint8 _indexk_;
        (,,,_index_,_hash_) = Doers(_metas_.doer).merits();
        (,,,_indexk_,) = Doers(self.plans[self.intention].plan.curator).merits();
        require(
            _index_ > _indexk_ && 
            _index_ >= self.plans[self.intention].services[serviceId(self,_goal_)].definition.preCondition.merits.index); // Curate // meets or exceeds the current Curator

        setPlan(self, self.intention, _metas_.doer, _desire);
         // Creates the curators microservice
        self.plans[self.intention].services[serviceId(self,_goal_)].definition.metas = _metas_;
        self.plans[self.intention].plan.curator = _metas_.doer;
        if (self.plans[self.intention].state == UserDefined.Project.PENDING) {
            Doers(self.plans[self.intention].plan.creator).flipIntention(); // Adapt the creators intention from true to false
            self.plans[self.intention].state == UserDefined.Project.INITIATED;
            self.userbase.setAgent(_metas_.doer, UserDefined.IS.CURATOR);
            return true;
        }
        self.userbase.setAgent(self.plans[self.intention].plan.curator, UserDefined.IS.INACTIVE);
        self.userbase.setAgent(_metas_.doer, UserDefined.IS.CURATOR);
        return true;
    }

    
    function plan(
        DataStorage storage self,
        UserDefined.Desire _desire,
        UserDefined.Qualification _qualification,
        UserDefined.KBase _kbase
        ) 
    public returns (bool) {
        require (msg.sender == self.plans[self.intention].plan.curator);
        
        require(self.plans[self.intention].state == UserDefined.Project.INITIATED); // Project is not pending or closed
        
        require(self.plans[self.intention].services[serviceId(self,_desire.goal)].definition.metas.timeSoft > block.timestamp);

        self.plans[self.intention].services[serviceId(self,_desire.goal)].definition.postCondition = _desire;	// bytes32 nServiceId = _serviceId ^ bytes32(msg.sender);
        
        self.plans[self.intention].services[serviceId(self,_desire.goal)].definition.preCondition.qualification[uint8(_kbase)] = _qualification;
// 		return planAdv(self,_intention, _kbase, _qualification);
    }
    
    function plan(
        DataStorage storage self,
        bytes32 theCondQ,
        UserDefined.Metas _metas
        ) 
    public returns (bool) {
        require (msg.sender == self.plans[self.intention].plan.curator);
        
        require(self.plans[self.intention].state == UserDefined.Project.INITIATED); // Project is not pending or closed

        self.plans[self.intention].services[serviceId(self,theCondQ)].definition.metas = _metas;
        
        self.plans[self.intention].plan.time += _metas.timeSoft;
        self.plans[self.intention].plan.budget += 
            (self.plans[self.intention].services[serviceId(self,theCondQ)].definition.preCondition.merits.index * _metas.timeSoft * 42) / 10;

    }
    
    function plan(
        DataStorage storage self,
        bytes32 theCondQ,
        UserDefined.Merits _merits) 
    public returns (bool) {
        require (msg.sender == self.plans[self.intention].plan.curator);
        
        require(self.plans[self.intention].state == UserDefined.Project.INITIATED); // Project is not pending or closed

        self.plans[self.intention].services[serviceId(self,theCondQ)].definition.preCondition.merits = _merits;
    }
    


// 	function planAdv(
//         DataStorage storage self,
//         bytes32 theCondQ,
// 		UserDefined.KBase _kbase, 
// 		UserDefined.Qualification _qualification) 
// 	public returns (bool) {
// 	    require (msg.sender == self.plans[self.intention].plan.curator);
        
// 		self.plans[self.intention].services[serviceId(self,theCondQ)].definition.preCondition.qualification[uint8(_kbase)] = _qualification;
        
// 		return true;
// 	}

    // pCondition must be present before project is started
    // qCondition must be present before project is closed
 function makePlan(
        DataStorage storage self,
        string _projectUrl,
        uint8 _V,
        bytes32 _R,
        bytes32 _S,
        bytes32 _prerequisite)  
    public returns (bool) {
        require(self.plans[self.intention].plan.curator == tx.origin); // curate meets the pCondition
        UserDefined.Order memory _rfp_ = UserDefined.Order(self.plans[self.intention].plan.preCondition, _V, _R, _S);
        verify(self,_rfp_);
        require (verify(self,_rfp_) == self.plans[self.intention].plan.creator); // Use a merkle tree // function and base the design pCondition to the merkle tree
        self.plans[self.intention].plan.projectUrl = keccak256(_projectUrl); // additional urls of project repo.
        self.plans[self.intention].plan.preCondition = _prerequisite; // Use a merkle tree // function and base the design pCondition to the merkle tree
        // allPlans.push(_intention);
        self.plans[self.intention].state == UserDefined.Project.STARTED;
        return true;
    }  

    function promise(
        DataStorage storage self,
        bytes1 _desire, 
        bytes32 _serviceId, 
        uint _time, 
        bool _thing) 
    public returns (bool) {
        UserDefined.IS _state_;
        (,_state_,,) = self.userbase.agents(msg.sender);
        require(_state_ != UserDefined.IS.ACTIVE);
        
        require(Doers(msg.sender).index() >= self.plans[self.intention].services[_serviceId].definition.preCondition.merits.index);
        
        bytes32 _goal_;
        (_goal_,) = Doers(msg.sender).getDesire(_desire);
        require(_goal_ == self.plans[self.intention].services[_serviceId].definition.postCondition.goal);
        
        require((_time > block.timestamp) || (_time < self.plans[self.intention].services[_serviceId].definition.metas.expire));
        require(msg.value > 0);
        
        address _doer_ = self.plans[self.intention].services[_serviceId].definition.metas.doer;
        require(Doers(msg.sender).index() > Doers(_doer_).index());
        
        bytes32 eoi = keccak256(msg.sender, self.intention, _serviceId);

        uint256 cc;
        (_state_,_goal_,cc) = Doers(msg.sender).getIntention(_thing);
        self.plans[self.intention].services[_serviceId].procure[msg.sender].promise = UserDefined.Promise({
            thing: UserDefined.Intention(_state_,_goal_,cc),
            timeHard: _time,
            hash: eoi});
        self.userbase.setAllPromises(_serviceId);
        self.userbase.setAgent(self.plans[self.intention].services[_serviceId].definition.metas.doer, UserDefined.IS.INACTIVE);
        self.plans[self.intention].services[_serviceId].definition.metas.doer = msg.sender;
        self.userbase.setAgent(msg.sender,UserDefined.IS.RESERVED);
        
        self.plans[self.intention].plan.time += _time;
        self.plans[self.intention].plan.budget += (Doers(msg.sender).index() * _time * 42) / 10;
        
        self.promiseCount++;
        
        return true;
    }

    // pCondition must be present before project is started
    // qCondition must be present before project is closed
    function compilePlan(
        DataStorage storage self,
        string _projectUrl,
        uint8 _V,
        bytes32 _R,
        bytes32 _S,
        bytes32 _prerequisite) 
    public returns (bool) {
        require(self.plans[self.intention].plan.creator == tx.origin); // curate meets the pCondition
        
        UserDefined.Order memory _sdo_ = UserDefined.Order(self.plans[self.intention].plan.preCondition, _V, _R, _S);
        verify(self,_sdo_);
        require (verify(self,_sdo_) == self.plans[self.intention].plan.curator); // Use a merkle tree // function and base the design pCondition to the merkle tree

        self.plans[self.intention].plan.projectUrl = keccak256(_projectUrl); // additional urls of project repo.
        self.plans[self.intention].plan.preCondition = _prerequisite; // Use a merkle tree // function and base the design pCondition to the merkle tree
        // allPlans.push(_intention);
        self.plans[self.intention].state == UserDefined.Project.APPROVED;
        self.userbase.setAgent(msg.sender,UserDefined.IS.RESERVED);
        return true;
    }  
    

    function order(
        DataStorage storage self, 
        bytes32 _serviceId,
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s) 
    public {
        require(self.plans[self.intention].state == UserDefined.Project.APPROVED);
        require(self.plans[self.intention].services[_serviceId].definition.metas.doer == msg.sender);
        UserDefined.IS b;
        (,b,,) = self.userbase.agents(msg.sender);
        require(uint8(b) > uint8(UserDefined.IS.ACTIVE));
        require(self.contrl.verified(self.plans[self.intention].services[_serviceId].procure[msg.sender].promise.hash,_v,_r,_s));
        self.plans[self.intention].services[_serviceId].order = UserDefined.Order(self.plans[self.intention].services[_serviceId].procure[msg.sender].promise.hash,_v,_r,_s);
        self.userbase.setAgent(msg.sender,UserDefined.IS.ACTIVE);
        
        delete self.plans[self.intention].plan.time;
        delete self.plans[self.intention].plan.budget;
        
        self.plans[self.intention].plan.time += 
            self.plans[self.intention].services[_serviceId].procure[msg.sender].promise.timeHard;
            
        self.plans[self.intention].plan.budget += 
            (self.plans[self.intention].services[_serviceId].definition.preCondition.merits.index * 
                self.plans[self.intention].services[_serviceId].procure[msg.sender].promise.timeHard * 
            42) / 10;

        self.orderCount++;
    }

    function fulfill(
        DataStorage storage self,
        bytes32 _serviceId, 
        bool _check, 
        bytes32 _proof, 
        UserDefined.Level _level) 
    public returns (bool) {
        UserDefined.IS a;
        bytes32 b;
        uint c;
        UserDefined.Intention memory dd = UserDefined.Intention(a,b,c);
        (a,b,c) = Doers(self.plans[self.intention].services[_serviceId].definition.metas.doer).getIntention(_check);
        require(verified(self,self.plans[self.intention].services[_serviceId].order));
        if (dd.state != UserDefined.IS.ACTIVE) {
            address reset;
            self.plans[self.intention].services[_serviceId].definition.metas.doer = reset;
            }
        // Use merkle tree function to build order tree, rebase design plan 
        require(block.timestamp < self.plans[self.intention].services[_serviceId].definition.metas.expire);
        bytes32 verity = keccak256(msg.sender, _proof);
        self.plans[self.intention].services[_serviceId].procure[msg.sender].fulfillment = UserDefined.Fulfillment({
            proof: _proof, 
            rubric: _level, 
            timestamp: block.timestamp, 
            hash: verity});
        self.orderCount++;
        // function setReputation(Intention _service, bool self.intention) internal onlyDoer {
        //     myBDI.beliefs.reputation = _service;  !!! Working on
        return true;
    }

    function verify(
        DataStorage storage self,
        bytes32 _serviceId, 
        bytes32 _verity, 
        bytes32 _message,
        UserDefined.Intention _thing) 
    public returns(bool) {
            // Validate existing promise.
        require(self.plans[self.intention].services[_serviceId].definition.metas.doer != msg.sender);
        address doers = self.contrl.verify(
            _message,
            self.plans[self.intention].services[_serviceId].order.V,
            self.plans[self.intention].services[_serviceId].order.R,
            self.plans[self.intention].services[_serviceId].order.S);
        require(_message == self.plans[self.intention].services[_serviceId].procure[doers].promise.hash);
        require(_verity == self.plans[self.intention].services[_serviceId].procure[doers].fulfillment.hash);
        // Use merkle tree function to build as-built tree, change/configuration management
        self.plans[self.intention].services[_serviceId].procure[doers].verification[msg.sender] = UserDefined.Verification({
            verity: _verity,
            complete: true, 
            timestamp: block.timestamp, 
            hash: _verity
            });
        self.fulfillmentCount++;
        // function setReputation(Intention _service, bool self.intention) internal onlyDoer { // Oraclise function, sets the trust level
        //     myBDI.beliefs.reputation = _service;  !!! Working on             // between creator -> doer && verifier -> doer
        return true;
    }

/* OLD CODE MUTED */


    function factorPayout(
        DataStorage storage self,
        bytes32 _serviceId, 
        bytes32 sig, 
        uint nonce, 
        bytes32 r, 
        bytes32 s) 
    internal {
        bytes8 n = bytes8(keccak256(nonce, self.currentChallenge));    // Generate a random hash based on input
        require(n >= bytes8(difficulty));                   // Check if it's under the difficulty
        uint timeSinceLastProof = (now - self.timeOfLastProof);  // Calculate time since last reward was given
        require(timeSinceLastProof >= 5 seconds);         // Rewards cannot be given too quickly
        require(
            self.plans[self.intention].services[_serviceId].procure[msg.sender].verification[self.contrl.verify(sig,uint8(nonce),r,s)].timestamp < 
            self.plans[self.intention].services[_serviceId].definition.metas.expire);
        uint totalTime;
        uint payableTime;
        uint expire_ = self.plans[self.intention].services[_serviceId].definition.metas.expire;
        uint timestamp_ = self.plans[self.intention].services[_serviceId].procure[msg.sender].fulfillment.timestamp;
        uint timesoft_ = self.plans[self.intention].services[_serviceId].definition.metas.timeSoft;
        uint timehard_ = self.plans[self.intention].services[_serviceId].procure[msg.sender].promise.timeHard;
        if (timestamp_ < timesoft_) { // Completed on Schedule, Pays Maximum Payout
            payableTime = timesoft_;
        } else if (timestamp_ > timehard_) {	// Completed after deadline, enters liquidation
            totalTime = expire_ - timesoft_;
            payableTime = (((expire_ - timestamp_) / totalTime) * timesoft_);
            } else {				// Completed within the deadline, pays prorata
            totalTime = timehard_ - timesoft_;
            payableTime = (((timehard_ - timestamp_) / totalTime) * timesoft_);
        }
        self.amount += payableTime / 60 seconds * 42 / 10;  // The reward to the winner grows by the minute
        self.difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty
        self.doit.approveAndCall(msg.sender, self.amount, "");

        self.timeOfLastProof = now;                              // Reset the counter
        self.currentChallenge = keccak256(nonce, self.currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    }

}
/* End of Input Factor */

////////////////////////
// Factor Input Contract
////////////////////////


contract Kazini is BaseController { //is Database {

    using DatabaseLib for DatabaseLib.DataStorage;
    DatabaseLib.DataStorage data;

/* Constants */

    bytes32 constant public CONTRACTNAME = "KAZINI 0.0118";

/* State Variables */

    // Database data;

    Userbase internal userbase;
    Creators internal creators;
    DoitToken internal doit;
    Reserve internal reserve;
    uint public promiseCount;
    
    bytes32 intention;
    bytes32 preCondition;
    uint time;
    uint budget;
    Desire postCondition;
    bytes32 projectUrl;
    address creator;
    address curator;

/* Events */

    event FactorPayout(address indexed _from, address indexed _to, uint256 _amount);
    event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);

/* Modifiers */

    /// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyController {
        require(msg.sender == controller);
        _;
    }
    
    modifier onlyCreator {
        IS createstate;
        bool createactive;
        (,createstate, createactive,) = userbase.getAgent(msg.sender);
        require(createactive);
        require(createstate == IS.CREATOR);
        _;
    }

    modifier onlyCurator {
        IS createstate;
        bool createactive;
        (,createstate, createactive,) = userbase.getAgent(msg.sender);
        require(createactive);
        require(createstate != IS.CURATOR);
        _;
    }
    
    modifier onlyDoer {
        IS createstate;
        bool createactive;
        (,createstate, createactive,) = userbase.getAgent(msg.sender);
        require(createactive);
        require(createstate == IS.CLOSED && createstate != IS.CREATOR && createstate != IS.CURATOR);
        _;
    }
    
    modifier onlyDoerActive {
        IS createstate;
        bool createactive;
        (,createstate, createactive,) = userbase.getAgent(msg.sender);
        require(createactive);
        require(createstate == IS.ACTIVE);
        _;
    }
    
    
    modifier onlyDoerInactive {
        IS createstate;
        bool createactive;
        (,createstate, createactive,) = userbase.getAgent(msg.sender);
        require(createactive);
        require(createstate == IS.INACTIVE);
        _;
    }

/* Functions */
    
    function Kazini(
        Able _ctrl, 
        Userbase _ubs,
        DoitToken _diy,
        Reserve _rsv) 
    public {
        cName = CONTRACTNAME;
        contrl = _ctrl;
        userbase = _ubs;
        controller = address(_ctrl);
        doit = _diy;
        reserve = _rsv;
        emit ContractEvent(this,msg.sender,tx.origin);
    }

    function serviceId(bytes32 _intention) internal onlyCreator returns (bytes32) {//bytes32(uint256(msg.sender) << 96)
        return bytes32(uint256(msg.sender) << 96) ^ data.goal(_intention);  // bitwise XOR builds a map of serviceIds
    }

    function verify(Order _lso) view internal returns (address) {
        return contrl.verify(_lso.Sig,_lso.V,_lso.R,_lso.S);
    }	

    function verified(Order _lso) view internal returns (bool check) {
        contrl.verify(_lso.Sig,_lso.V,_lso.R,_lso.S) == msg.sender ? check = true : check = false;
    }

    /// @notice `plan` compile a plan can step down and assign some other address to this role
    /// @param _desire _preConditions _projectUrl _preQualification The address of the new owner. 0x0 can be used to create
    // Add a new contract to the controller. This will not overwrite an existing contract.

    function initPlan(
        bytes1 _desire, 
        bytes32 _preConditions, 
        bytes32 _projectUrl,
        bytes32 _preQualification,
        uint8 _index) 
    external payable onlyCreator returns (bool) {
        Project _project_ = data.state(Doers(msg.sender).intention(false));
        require(_project_ == Project.NULL); // This is a new plan?

        return data.initPlan({
            _intention: Doers(msg.sender).intention(false),
            _desire: _desire, 
            _preConditions: _preConditions, 
            _projectUrl: _projectUrl,
            _preQualification: _preQualification,
            _minIndex: _index
            });

        return true;
    }
    
    /// @notice `plan` compile a plan can step down and assign some other address to this role
    /// @param _intention _desire _preConditions _projectUrl _preQualification The address of the new owner. 0x0 can be used to create
    //   Add a new contract to the controller. This will not overwrite an existing contract.
    function assignPlan(
        bytes32 _intention,
        bytes1 _desire, 
        uint _timeSoft,  // preferred timeline
        uint _expire,
        bytes32 _hash,
        bytes32 _serviceUrl
        ) 
    external onlyDoerInactive returns (bool) {
        Project _project_ = data.state(_intention);
        require(_project_ == Project.PENDING); // This is a new plan?
        require(_timeSoft > block.timestamp);
        
        Metas memory _metas_ = Metas({
            timeSoft: _timeSoft,  // preferred timeline
            expire: _expire,
            hash: _hash,
            serviceUrl: _serviceUrl,
            doer: msg.sender
            });

        data.assignPlan(
            _desire,
            _metas_);
        
        return true;
    }
    
    function plan(
        bytes32 _theCondQ, 
        KBase _kbase,
        bytes32 _country, 
        bytes32 _cAuthority, 
        bytes32 _score
        ) 
    payable public onlyCurator returns (bool) {
        
        Desire memory _desire_ = Desire(_theCondQ,false);
        Qualification memory _qualification_ = Qualification(_country,_cAuthority,_score);

        data.plan(
            _desire_,
            _qualification_,
            _kbase
            );
        
        return true;
    }
    
    function plan(
        bytes32 _theCondQ,
        uint _timeSoft,  // preferred timeline
        uint _expire,
        bytes32 _hash2,
        bytes32 _serviceUrl
        ) 
    payable public onlyCurator returns (bool) {

        Metas memory _metas_ = Metas(_timeSoft,_expire,_hash2,_serviceUrl,msg.sender);
        
        data.plan(
            _theCondQ,
            _metas_
            );

        return true;
    }
    
    function plan(
        bytes32 _theCondQ,
        uint _experience, 
        bytes32 _reputation, 
        bytes32 _talent,
        uint8 _index,
        bytes32 _hash
        ) 
    payable public onlyCurator returns (bool) {
        
        Merits memory _merits_ = Merits(_experience,_reputation,_talent,_index,_hash);

        data.plan(
            _theCondQ,
            _merits_
            );

        return true;
    }

    // pCondition must be present before project is started
    // qCondition must be present before project is closed
    function makePlan(
        string _projectUrl,
        uint8 _V,
        bytes32 _R,
        bytes32 _S,
        bytes32 _prerequisite) 
    payable public onlyCurator returns (bool) {
// 	    address _curator_;
// 		(,,,,,,_curator_) = data.getPlan(intention);
// 		require(_curator_ == msg.sender); // Curate is the current Curator
        require(data.plans[data.intention].plan.curator == msg.sender); // Curate is the current Curator
        
        data.makePlan(
            _projectUrl, 
            _V,
            _R,
            _S,
            _prerequisite);
            
        return true;
    }

    function promise( 
        bytes1 _desire, 
        bytes32 _serviceId, 
        uint _time, 
        bool _thing) 
    payable public onlyDoerActive returns (bool) {
        
        data.promise(
            _desire,
            _serviceId,
            _time, 
            _thing);

        return true;
    }    

    // pCondition must be present before project is started
    // qCondition must be present before project is closed
    function compilePlan(
        string _projectUrl, 
        uint8 _V,
        bytes32 _R,
        bytes32 _S,  // preferred timeline
        bytes32 _prerequisite) payable public onlyCurator returns (bool) 
        {
        require(data.plans[data.intention].plan.curator == tx.origin); // curate meets the pCondition

        return data.compilePlan(
            _projectUrl,
            _V,
            _R,
            _S,
            _prerequisite);

    }  
    
         
    function order(
        bytes32 _serviceId, 
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s) 
    payable public onlyDoerInactive {
        
        return data.order(
            _serviceId,
            _v, 
            _r, 
            _s);

    }

    function fulfill( 
        bytes32 _serviceId, 
        bool _check, 
        bytes32 _proof, 
        Level _level) 
    payable public onlyDoer returns (bool) 
        {
        return data.fulfill(
            _serviceId, 
            _check, 
            _proof, 
            _level);

    }

    function verify(
        bytes32 _serviceId, 
        bytes32 _verity, 
        bytes32 _message,
        Intention _thing) 
    payable public onlyDoer returns(bool) 
        {
        
        return data.verify(
            _serviceId,
            _verity,
            _message,
            _thing);
    }

/* OLD CODE MUTED */
    bytes32 public currentChallenge;                         // The coin starts with a challenge
    uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
    uint public difficulty = 10**32;                         // Difficulty starts reasonably low
    uint256 amount;

    function factorPayout(bytes32 _intention, bytes32 _serviceId, bytes32 sig, uint nonce, bytes32 r, bytes32 s) internal {
        bytes8 n = bytes8(keccak256(nonce, currentChallenge));    // Generate a random hash based on input
        require(n >= bytes8(difficulty));                   // Check if it's under the difficulty
        uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
        require(timeSinceLastProof >= 5 seconds);         // Rewards cannot be given too quickly
        uint _timestampp_;
        (,,_timestampp_,) = data.getVerification(_intention,_serviceId,msg.sender,verify(sig,uint8(nonce),r,s));
        uint _expirep_;
        address _doerp_;
        (,_expirep_,,,) = data.getMetas(_intention,_serviceId); // doer is the current sdo
        require(_timestampp_ < _expirep_);
        uint totalTime;
        uint payableTime;
        uint expire_ = _expirep_;
        (,,_timestampp_,) = data.getFulfillment(_intention,_serviceId,_doerp_);
        uint timestamp_ = _timestampp_;
        (_timestampp_,,,,) = data.getMetas(_intention,_serviceId);
        uint timesoft_ = _timestampp_;
        (,,,_timestampp_,) = data.getPromise(_intention,_serviceId,msg.sender);
        uint timehard_ = _timestampp_;
        if (timestamp_ < timesoft_) { // Completed on Schedule, Pays Maximum Payout
            payableTime = timesoft_;
        } else if (timestamp_ > timehard_) {	// Completed after deadline, enters liquidation
            totalTime = expire_ - timesoft_;
            payableTime = (((expire_ - timestamp_) / totalTime) * timesoft_);
            } else {				// Completed within the deadline, pays prorata
            totalTime = timehard_ - timesoft_;
            payableTime = (((timehard_ - timestamp_) / totalTime) * timesoft_);
        }
        amount += payableTime / 60 seconds * 42 / 10;  // The reward to the winner grows by the minute
        difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty
        doit.approveAndCall(msg.sender, amount, "");

        timeOfLastProof = now;                              // Reset the counter
        currentChallenge = keccak256(nonce, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    }
/* End of Input Factor */
}


///////////////////
// Beginning of Contract
///////////////////

contract KaziniFactory {

/* Constant */
/* State Variables */

    Userbase internal userbase;
    Creators internal creator;

/* Events */

    event LogNewKazini(address indexed from, address indexed to, address indexed origin, address _newKazini);
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
    
/* Modifiers */

    modifier toPeana {
        Collector(creator.peana()).sendLog(msg.sender,this,msg.data);
        _;
    }

/* Functions */

    function KaziniFactory () {
        emit ContractEvent(this,msg.sender,tx.origin);
    }

    function makeKazini(
        Able _ctrl, 
        Userbase _ubs,
        DoitToken _diy,
        Reserve _rsv)
    public returns (address) {
        Kazini newKazini = new Kazini(_ctrl, _ubs, _diy, _rsv);
        emit LogNewKazini(this,msg.sender,tx.origin,address(newKazini));
        return newKazini;
    }

/* End of DoersFactory Contract */

}
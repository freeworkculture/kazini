pragma solidity ^0.4.19;
import "./DoitToken.sol";
//import "./ControlAbstract.sol";
// import "./Reserve.sol";
pragma experimental ABIEncoderV2;

////////////////////
// Database Contract
////////////////////


contract InputFactor is Database {

/* Constants */

	bytes32 constant public CONTRACTNAME = "Input Factor 0.0118";

/* State Variables */

    Able internal contrl;
	Database internal database;
	DoitToken internal doit;
    uint public promiseCount;

/* Events */

    // event FactorPayout(address indexed _from, address indexed _to, uint256 _amount);
    // event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    // event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    // event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
	

/* Modifiers */

    // /// @notice The address of the controller is the only address that can call
    // ///  a function with this modifier
    // modifier onlyController {
    //     require(msg.sender == controller);
    //     _;
    //     }
    
	// modifier onlyCreator {
	// 	require(isCreator(msg.sender));
	// 	_;
	// }

	// modifier onlyDoer {
	// 	require (isDoer(msg.sender)); 
	// 	_;
	// }

/* Functions */

    
    function InputFactor(
        Able _ctrl, 
        Database _db, 
        DoitToken _diy) public {
		cName = CONTRACTNAME;
        contrl = _ctrl;
        database = _db;
        doit = _diy;
		ContractEvent(this,msg.sender,tx.origin);
	}

	function serviceId(bytes32 _intention) internal view onlyCreator returns (bytes32) {
        return bytes32(msg.sender) ^ plans[_intention].plan.postCondition.goal;  // bitwise XOR builds a map of serviceIds
    }

  	function verify(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view internal returns (address) {
		bytes memory prefix = "\x19Ethereum Signed Message:\n32";
		bytes32 prefixedHash = keccak256(prefix, _message);
		return ecrecover(prefixedHash, _v, _r, _s);
	}
	function verify(Database.Order _lso) view internal returns (address) {
	    return verify(_lso.Sig,_lso.V,_lso.R,_lso.S);
	}	
	function verified(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view internal returns (bool check) {
	    verify(_message,_v, _r, _s) == msg.sender ? check = true : check = false;
	}
	function verified(Database.Order _lso) view internal returns (bool check) {
	    verify(_lso.Sig,_lso.V,_lso.R,_lso.S) == msg.sender ? check = true : check = false;
	}

	/// @notice `plan` compile a plan can step down and assign some other address to this role
    /// @param intention_ desire_ preConditions_ projectUrl_ preQualification_ The address of the new owner. 0x0 can be used to create
	// Add a new contract to the controller. This will not overwrite an existing contract.
    // function createPlan(
	// 	bytes32 intention_, 
	// 	bytes32 desire_, 
	// 	bytes32 preConditions_, 
	// 	string projectUrl_,
	// 	bytes32 preQualification_) external payable onlyCreator returns (bool) 
	// 	{
	// 		address tmpAddress;
	// 		Database.Plan memory a;
	// 		(a, ) = database.plans(intention_);
	// 		require(uint(a.state) < 0);
	// 		database.initPlan({
	// 			_intention: intention_,
	// 			_serviceId: a.postCondition.goal ^ bytes32(msg.sender),
	// 			_preCondition: preConditions_,
	// 			_postCondition: Doers(msg.sender).getDesire(desire_), // Creator and project share a goal // Get this from Doers direct. // !!! MAYBE THIS COULD BE TX.ORIGIN
	// 			_projectUrl: keccak256(projectUrl_),
	// 			_state: Database.Project.INITIATED,
	// 			_creator: msg.sender,  // !!! MAYBE THIS COULD BE TX.ORIGIN
	// 			_curator: tmpAddress,
	// 			_preQualification: preQualification_}); // pCondition of the curate that will define the concept.																
	// 		  // bitwise XOR builds a map of serviceIds !!! CONFIRM CORRECT SOURCE ADDRESS, MAY NEED A DELEGATE CALL FUNC
	// 		// push event for new plan, include serviceId,Url,
	// 		return true;
    // }

    // function serviceId(bytes32 _intention) internal view onlyCreator returns (bytes32) {
	// 	// !!! CONFIRM CORRECT SOURCE ADDRESS, MAY NEED A DELEGATE CALL FUNC
	// 	Database.Plan memory a;
	// 	(a, ) = database.plans(_intention);
    //     return a.postCondition.goal ^ bytes32(msg.sender);  // bitwise XOR builds a map of serviceIds
    // }

	/// @notice `plan` compile a plan can step down and assign some other address to this role
    /// @param _intention _desire _preConditions _projectUrl _preQualification The address of the new owner. 0x0 can be used to create
	// Add a new contract to the controller. This will not overwrite an existing contract.
    
	
	function createPlan(
		bytes32 _intention, 
		bytes1 _desire, 
		bytes32 _preConditions, 
		bytes32 _projectUrl,
		bytes32 _preQualification) external payable onlyCreator returns (bool) 
		{
			require((plans[_intention].state != Project.STARTED) || // This is 
			(plans[_intention].state != Project.CLOSED)); // a new plan?
			bytes32 a;
			bool b;
			Desire memory d = Desire(a,b);
			(a,b) = Doers(tx.origin).viewDesire(_desire);
			
			plans[_intention].plan.postCondition = d; // Creator and project share a goal // Get this from Doers direct.																	
// 			plans[_intention].plan.postCondition = Doers(tx.origin).getDesire(_desire); // Creator and project share a goal // Get this from Doers direct.																	
// 			bytes32 serviceId = plans[_intention].plan.postCondition.goal ^ bytes32(msg.sender);  // bitwise XOR builds a map of serviceIds
			plans[_intention].plan.preCondition = _preConditions; // pCondition of the curate that will define the concept.
			plans[_intention].state = Project.INITIATED;
			plans[_intention].services[serviceId(_intention)].definition.preCondition.merits.hash = _preQualification;
			bytes32 url = keccak256(_projectUrl);
			plans[_intention].plan.projectUrl = _projectUrl; // Store the prefeasibility at the main project repo.
			plans[_intention].state == Project.PENDING;
			plans[_intention].plan.creator = tx.origin;
			// push event for new plan
			return true;
    }

    function plan(
		bytes32 _intention, 
		bytes32 _theCondQ, 
        bool _theGoalG, 
        uint _experience, 
        bytes32 _reputation, 
        bytes32 _talent,
        bytes32 hash,
		KBase _kbase,
        bytes32 _country, 
        bytes32 _cAuthority, 
        bytes32 _score) public payable onlyDoer returns (bool)
		{
			require(plans[_intention].state == Project.PENDING); // Project is not pending or closed
// 			address curator_ = ;
			require(Doers(tx.origin).getBelief("index") >= Doers(plans[_intention].plan.curator).getBelief("index")); // Curate // meets or exceeds the current Curator
			// require(doers[tx.origin].beliefs.index >= plans[_intention].services[_intention ^ bytes32(plans[_intention].curator)].preCondition.index); // Curate // meets or exceeds the pCondition
			require(hash == keccak256(_experience,_reputation,_talent,_country,_cAuthority,_score));
			plans[_intention].services[serviceId(_intention)].definition.preCondition.merits.index = uint8(Doers(tx.origin).getBelief("index")); // Creates the curators microservice
			// bytes32 nServiceId = _serviceId ^ bytes32(msg.sender);
			plans[_intention].services[serviceId(_intention)].definition.postCondition = Desire(_theCondQ, _theGoalG);
			plans[_intention].services[serviceId(_intention)].definition.metas.hash = keccak256(_theCondQ, hash);
			planAdv(_intention, _experience, _reputation, _talent, hash, _kbase, _country, _cAuthority, _score);
			plans[_intention].plan.curator = tx.origin;
			return true;
	}

	function planAdv(
        bytes32 _intention, 
		uint _experience, 
		bytes32 _reputation, 
		bytes32 _talent, 
		bytes32 hash,
		KBase _kbase, 
		bytes32 _country, 
		bytes32 _cAuthority, 
		bytes32 _score) onlyDoer internal returns (bool)
        {
            plans[_intention].services[serviceId(serviceId(
				_intention))].definition.preCondition.merits = Merits(
					_experience,
					_reputation,
					_talent,
					BASE^uint8(_kbase),
					hash);
			plans[_intention].services[serviceId(serviceId(
				_intention))].definition.preCondition.qualification[uint8(_kbase)] = Qualification(
					_country,
					_cAuthority,
					_score);
			return true;
	}

    // pCondition must be present before project is started
    // qCondition must be present before project is closed
    function plan(
		bytes32 _intention, 
		bytes32 _prerequisites, 
		string _projectUrl, 
		bytes32 _verity) public payable onlyDoer returns (bool) 
		{
			require(plans[_intention].plan.curator == tx.origin); // curate meets the pCondition
			plans[_intention].plan.projectUrl = keccak256(_projectUrl); // additional urls of project repo.
			plans[_intention].plan.preCondition = keccak256(_prerequisites, plans[_intention].plan.preCondition); // Use a merkle tree // function and base the design pCondition to the merkle tree
			//plans[_intention].postCondition = keccak256(_verity, plans[_intention].postCondition);
			allPlans.push(_intention);
			plans[_intention].state == Project.STARTED;
			return true;
    }  
    

    function promise(
		bytes32 _intention, 
		bytes1 _desire, 
		bytes32 _serviceId) public payable onlyDoer returns (bool) 
		{
			require(agents[msg.sender].state != IS.ACTIVE);
			require(Doers(msg.sender).getBelief("index") >= plans[_intention].services[_serviceId].definition.preCondition.merits.index);
			bytes32 a;
			bool b;
			Desire memory c = Desire(a,b);
			(a,b) = Doers(tx.origin).viewDesire(_desire);
			
			require(c.goal == plans[_intention].services[_serviceId].definition.postCondition.goal);
			require(msg.value > 0);
			require(Doers(msg.sender).getBelief("index") > Doers(plans[_intention].services[_serviceId].definition.metas.doer).getBelief("index"));
			bytes32 eoi = keccak256(msg.sender, _intention, _serviceId);

			allPromises[msg.sender].push(_serviceId);
			agents[plans[_intention].services[_serviceId].definition.metas.doer].state = IS.INACTIVE;
			plans[_intention].services[_serviceId].definition.metas.doer = msg.sender;
			agents[msg.sender].state = IS.RESERVED;
			promiseCount++;
			return true;
	}   

    function promise(
		bytes32 _intention, 
		bytes1 _desire, 
		bytes32 _serviceId, 
		uint _time, 
		bool _thing) public payable onlyDoer returns (bool) 
		{
			
			Database.IS a;
			bytes32 b;
			uint c;
			Intention memory dd = Intention(a,b,c);
			(a,b,c) = Doers(msg.sender).viewIntention(_thing);
			
			require((_time > block.timestamp) || (_time < plans[_intention].services[_serviceId].definition.metas.expire));
			require(msg.value > 0);
			require(Doers(msg.sender).getBelief("index") > Doers(plans[_intention].services[_serviceId].definition.metas.doer).getBelief("index"));
			bytes32 eoi = keccak256(msg.sender, _intention, _serviceId);
			Order NULL;
			plans[_intention].services[_serviceId].procure[msg.sender].promise = Promise({
				thing: dd.service,
				timeHard: _time, 
				value: msg.value, 
				hash: eoi});
			return true;
	}    

    function order(bytes32 _intention, bytes32 _serviceId, bool _check, string _thing, string _proof, uint8 _v, bytes32 _r, bytes32 _s) public payable onlyDoer {
		require(plans[_intention].state == Project.APPROVED);
		require(plans[_intention].services[_serviceId].definition.metas.doer == msg.sender);
		require(uint8(agents[msg.sender].state) > uint8(IS.ACTIVE));
		require(verified(plans[_intention].services[_serviceId].procure[msg.sender].promise.hash,_v,_r,_s));
		plans[_intention].services[_serviceId].order = Order(plans[_intention].services[_serviceId].procure[msg.sender].promise.hash,_v,_r,_s);
		agents[msg.sender].state = IS.ACTIVE;
		orderCount++;
        }

    function fulfill(
		bytes32 _intention, 
		bytes32 _serviceId, 
		bool _check, 
		bytes32 _proof, 
		Database.Level _level) public payable onlyDoer returns (bool) 
		{
			Database.IS a;
			bytes32 b;
			uint c;
			Intention memory dd = Intention(a,b,c);
			(a,b,c) = Doers(plans[_intention].services[_serviceId].definition.metas.doer).viewIntention(_check);
			require(verified(plans[_intention].services[_serviceId].order));
			if (dd.state != IS.ACTIVE) {
				address reset;
				plans[_intention].services[_serviceId].definition.metas.doer = reset;
				}
			// Use merkle tree function to build order tree, rebase design plan 
			require(block.timestamp < plans[_intention].services[_serviceId].definition.metas.expire);
			bytes32 verity = keccak256(msg.sender, _proof);
			plans[_intention].services[_serviceId].procure[msg.sender].fulfillment = Fulfillment({
					proof: _proof, 
					rubric: _level, 
					timestamp: block.timestamp, 
					hash: verity});
			orderCount++;
			// function setReputation(Intention _service, bool _intention) internal onlyDoer {
			//     myBDI.beliefs.reputation = _service;  !!! Working on
			return true;
	}

    function verify(
		bytes32 _intention, 
		bytes32 _serviceId, 
		bytes32 _verity, 
		bytes32 _message_, uint8 _v, bytes32 _r, bytes32 _s,
		bytes32 _thing) public payable onlyDoer returns(bool) 
		{
			// Validate existing promise.
			require(plans[_intention].services[_serviceId].definition.metas.doer != msg.sender);
			require(verify(_message_,_v,_r,_s) == verify(plans[_intention].services[_serviceId].order));
			require(_verity == plans[_intention].services[_serviceId].procure[verify(_message_,_v,_r,_s)].fulfillment.hash);
			// Use merkle tree function to build as-built tree, change/configuration management
			plans[_intention].services[_serviceId].procure[
			    verify(_message_,_v,_r,_s)].verification[msg.sender] = Verification({
					verity: _verity,
					complete: true, 
					timestamp: block.timestamp, 
					hash: _verity
					});
					fulfillmentCount++;
			// function setReputation(Intention _service, bool _intention) internal onlyDoer { // Oraclise function, sets the trust level
			//     myBDI.beliefs.reputation = _service;  !!! Working on             // between creator -> doer && verifier -> doer
			return true;
	}

}
/* End of Input Factor */
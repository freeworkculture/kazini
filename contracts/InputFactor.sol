pragma solidity ^0.4.19;
import "./Reserve.sol";
// pragma experimental ABIEncoderV2;



contract InputFactor is Data {


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

    // address public controller;

    DoitToken doitContract;
    uint promiseCount;
    
    function InputFactor(
        Able _ctrl, 
        Database _db, 
        DoitToken _diy) {
        contrl = _ctrl;
        database = _db;
        doitContract = _diy;
        }

    function plan(bytes32 _intention, bytes32 _desire, bytes32 _preConditions, string _projectUrl) public payable onlyCreator {
        require((uint(database.getPlanData(_intention).state) != uint(Database.Project.STARTED)) || // This is 
        (uint(database.getPlanData(_intention).state) != uint(Database.Project.CLOSED))); // a new plan?
        database.getPlanData(_intention).conditionQ = Doers(tx.origin).getDesire(_desire); // Creator and project share a goal
        // plans[_intention].conditionQ = myBDI.getDesire(_desire).goal; // Creator and project share a goal
        // bytes32 serviceId = plans[_intention].conditionQ.goal ^ bytes32(msg.sender);  // bitwise XOR builds a map of serviceIds
        database.getCondPData(_intention, serviceId(_intention)).hash = _preConditions; // pCondition of the curate that will define the concept.
        bytes32 url = keccak256(_projectUrl);
        database.setPlan(_intention, url, _projectUrl); // Store the prefeasibility at the main project repo.
        uint(database.getPlanData(_intention).state) == uint(Database.Project.PENDING);
        database.getPlanData(_intention).creator = tx.origin;
        // push event for new plan
    }

    function serviceId(bytes32 _intention) internal view onlyCreator returns (bytes32) {
        return database.getPlanData(_intention).conditionQ.goal ^ bytes32(msg.sender);  // bitwise XOR builds a map of serviceIds
    }

    function plan(
        bytes32 _intention,
        bytes32 _theCondQ, 
        bool _theGoalG, 
        uint _experience, 
        bytes32 _reputation, 
        bytes32 _talent, 
        bytes32 _index, 
        bytes32 hash, 
        bytes32 _country, 
        bytes32 _cAuthority, 
        bytes32 _score) external payable onlyDoer returns (bool)
		{
			require(uint(database.getPlanData(_intention).state) == uint(Database.Project.PENDING)); // Project is not pending or closed
			require(hash == keccak256(_country,_cAuthority,_score,_experience,_reputation,_talent));
			require(Doers(tx.origin).getBelief().index >= database.getCondPData(_intention,serviceId(_intention)).index); // Curate meets or exceeds
			// Database(database).plans[_intention].service[serviceId(_intention)].conditionP = Doers(tx.origin).beliefs; // current pCondition, set new curate
			// plans[_intention].service[serviceId(_intention)].conditionP = bdi[tx.origin].beliefs; // current pCondition, set new curate
            database.setPlanSCondQ(_intention, serviceId(_intention), _theCondQ, _theGoalG);
			database.setPlanSHash(_intention, serviceId(_intention), keccak256(_theCondQ, hash));
        	database.setPlanCurator(_intention, serviceId(_intention)); // Use an Internal Database Copy Function to set Curator's Belief
			planAdv(_intention, _talent, _reputation, _experience, _index, hash, _country, _cAuthority, _score);
			return true;
		}

	function planAdv(
        bytes32 _intention, 
		bytes32 _talent, 
		bytes32 _reputation, 
		uint _experience, 
		bytes32 _index, 
		bytes32 hash, 
		bytes32 _country, 
		bytes32 _cAuthority, 
		bytes32 _score) onlyDoer internal returns (bool)
        {
            database.setPlanSCondP(_intention, serviceId(serviceId(_intention)), _country, _cAuthority, _score, keccak256(_country, _cAuthority, _score), _talent, _reputation, _experience, _index, hash);
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
            require(database.getPlanData(_intention).curator == tx.origin); // curate meets the pCondition        
            //plans[_intention].conditionQ = keccak256(_verity, plans[_intention].conditionQ);
            database.setPlan(
                _intention, 
                keccak256(_projectUrl), 
                _projectUrl
                ); // Use a merkle tree
            database.setPlan(_intention, keccak256(_prerequisites, _verity, database.getPlanData(_intention).conditionP)); // Use a merkle tree
            database.setAllPlans(_intention);
            database.getPlanData(_intention).state == Database.Project.STARTED;
            return true;
            }      

    function promise(bytes32 _intention, bytes32 _desire, bytes32 _serviceId, uint _time, bool _thing) public payable onlyDoer returns (bool) {
        require(Doers(tx.origin).getBelief().index >= database.getCondPData(_intention, _serviceId).index);
        require(Doers(tx.origin).getDesire(_desire).goal == database.getServiceData(_intention, _serviceId).conditionQ.goal);
        require((_time > block.timestamp) || (_time < database.getServiceData(_intention, _serviceId).expire));
        require(msg.value > 0);
        require(Doers(tx.origin).getBelief().index > Doers(database.getServiceData(_intention, _serviceId).taskT.doer).getBelief().index);
        bytes32 eoi = keccak256(msg.sender, _intention, _serviceId);
        database.setPlanSTaskT(
            _intention, 
            _serviceId,
            Doers(tx.origin).getIntention(_thing).service,
            _time,
            msg.value, 
            eoi);
        database.setPromises(_serviceId); 
        promiseCount++; //!!! COULD REMOVE ONE COUNTER, LEFT HERE FOR DEBUGGING
		return true;
        }

    function fulfill(bytes32 _intention, bytes32 _serviceId, bool _check, bytes32 _proof, Database.Level _level) public payable onlyDoer returns (bool) {
        // Validate existing promise.
        if (Doers(database.getServiceData(_intention, _serviceId).taskT.doer).getIntention(_check).state != 
        Database.Agent.ACTIVE) {
            database.setPlanSTaskT(_intention, _serviceId, "reset");
            }
        bytes32 lso = keccak256(msg.sender, _serviceId); // Use merkle tree function to build order tree, rebase design plan 
        require(block.timestamp < database.getServiceData(_intention, lso).expire);
        bytes32 verity = keccak256(msg.sender, _proof);
        database.setPlanSFulfillment(_intention, _serviceId, _proof, _level, verity);
		return true;
        }

    function verify(bytes32 _intention, bytes32 _serviceId, bytes32 _verity, bytes32 _thing) public payable onlyDoer returns(bool) {
        // Validate existing promise.
        // plans[_intention].service[_serviceId].fulfillment.hash = _thing;
        require(_verity == database.getFulfillmentData(_intention, _serviceId).hash);
        // _verity = keccak256(msg.sender, _verity); // Use merkle tree function to build as-built tree, change/configuration management
        database.setPlanSFVerification(_intention, _serviceId, true, keccak256(msg.sender, _verity), _thing);
        // function setReputation(Intention _service, bool _intention) internal onlyDoer { // Oraclise function, sets the trust level
        //     myBDI.beliefs.reputation = _service;  !!! Working on             // between creator -> doer && verifier -> doer
		return true;
		}

    function getPromiseCount() internal constant returns (uint) {
        return database.countPromise();
    }

    function getFulfillmentCount() internal constant returns (uint) {
        return database.countFulfillment();
    }


////////////////
// Events
////////////////

    // event FactorPayout(address indexed _from, address indexed _to, uint256 _amount);
    // event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    // event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    // event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
}
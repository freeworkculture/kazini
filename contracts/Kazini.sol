pragma solidity ^0.4.19;
import "./Reserve.sol";

////////////////////////
// Factor Input Contract
////////////////////////


contract Kazini is Database {

/* Constants */

	bytes32 constant public CONTRACTNAME = "KAZINI 0.0118";

/* State Variables */

	Userbase internal userbase;
	Creators internal creators;
	DoitToken internal doit;
	Reserve internal reserve;
	address proxyVerify;
    uint public promiseCount;

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

	modifier onlyDoer {
		IS createstate;
		bool createactive;
		(,createstate, createactive,) = userbase.getAgent(msg.sender);
		require(createactive);
		require(createstate != IS.CREATOR);
		_;
	}

    modifier ProxyVerify {
        require(msg.sender == proxyVerify);
        _;
	}

/* Functions */
    
    function Kazini(
        Able _ctrl, 
        Userbase _ubs,
		DoitToken _diy,
		Reserve _rsv,
		address _verify) public {
		cName = CONTRACTNAME;
        contrl = _ctrl;
        userbase = _ubs;
		doit = _diy;
		reserve = _rsv;
		proxyVerify = _verify;
		ContractEvent(this,msg.sender,tx.origin);
	}

	function serviceId(bytes32 _intention) internal view onlyCreator returns (bytes32) {//bytes32(uint256(msg.sender) << 96)
        return bytes32(uint256(msg.sender) << 96) ^ plans[_intention].plan.postCondition.goal;  // bitwise XOR builds a map of serviceIds
    }

	function verify(Database.Order _lso) view internal returns (address) {
	    return contrl.verify(_lso.Sig,_lso.V,_lso.R,_lso.S);
	}	

	function verified(Database.Order _lso) view internal returns (bool check) {
	    contrl.verify(_lso.Sig,_lso.V,_lso.R,_lso.S) == msg.sender ? check = true : check = false;
	}

	/// @notice `plan` compile a plan can step down and assign some other address to this role
    /// @param _intention _desire _preConditions _projectUrl _preQualification The address of the new owner. 0x0 can be used to create
	// Add a new contract to the controller. This will not overwrite an existing contract.
	function initPlan(
		bytes32 _intention, 
		bytes1 _desire, 
		bytes32 _preConditions, 
		bytes32 _projectUrl,
		bytes32 _preQualification) external payable onlyCreator returns (bool) 
		{
			require(plans[_intention].state == Project.NULL); // This is a new plan?
			bytes32 a;
			bool b;
			Desire memory cc = Desire(a,b);
			(a,b) = Doers(tx.origin).getDesire(_desire);
			plans[_intention].plan.postCondition = cc; // Creator and project share a goal // Get this from Doers Contract direct.																	
			plans[_intention].plan.preCondition = _preConditions; // pCondition of the curate that will define the concept.
			plans[_intention].state = Project.INITIATED;
			// bitwise XOR builds a map of serviceIds
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
			uint8 index;
			uint8 indexk;
			(,,,index,) = Doers(tx.origin).merits();
			(,,,indexk,) = Doers(plans[_intention].plan.curator).merits();
			require(index >= indexk); // Curate // meets or exceeds the current Curator
			require(hash == keccak256(_experience,_reputation,_talent,_country,_cAuthority,_score));
			(,,,index,) = Doers(tx.origin).merits();
			plans[_intention].services[serviceId(_intention)].definition.preCondition.merits.index = index; // Creates the curators microservice
			plans[_intention].services[serviceId(_intention)].definition.postCondition = Desire(_theCondQ, _theGoalG);	// bytes32 nServiceId = _serviceId ^ bytes32(msg.sender);
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
			// allPlans.push(_intention);
			plans[_intention].state == Project.STARTED;
			return true;
    }  

    function promise(
		bytes32 _intention, 
		bytes1 _desire, 
		bytes32 _serviceId, 
		uint _time, 
		bool _thing) public payable onlyDoer returns (bool) 
		{
			UserDefined.IS b;
			(,b,,) = userbase.agents(msg.sender);
			require(b != UserDefined.IS.ACTIVE);
			uint8 index;
			(,,,index,) = Doers(msg.sender).merits();
			require(index >= plans[_intention].services[_serviceId].definition.preCondition.merits.index);
            bytes32 a;
            (a,) = Doers(msg.sender).getDesire(_desire);
			require(a == plans[_intention].services[_serviceId].definition.postCondition.goal);
			require((_time > block.timestamp) || (_time < plans[_intention].services[_serviceId].definition.metas.expire));
			require(msg.value > 0);
			uint8 indexk;
			(,,,indexk,) = Doers(plans[_intention].services[_serviceId].definition.metas.doer).merits();
			require(index > indexk);
			bytes32 eoi = keccak256(msg.sender, _intention, _serviceId);
			Database.IS aa;
			bytes32 bb;
			uint256 cc;
			(aa,bb,cc) = Doers(msg.sender).getIntention(_thing);
			plans[_intention].services[_serviceId].procure[msg.sender].promise = Promise({
				thing: Intention(aa,bb,cc),
				timeHard: _time,
				hash: eoi});
			userbase.setAllPromises(_serviceId);
			userbase.setAgent(plans[_intention].services[_serviceId].definition.metas.doer, UserDefined.IS.INACTIVE);
			plans[_intention].services[_serviceId].definition.metas.doer = msg.sender;
			userbase.setAgent(msg.sender,UserDefined.IS.RESERVED);
			promiseCount++;
			return true;
	}    

    function order(bytes32 _intention, bytes32 _serviceId, bool _check, string _thing, string _proof, uint8 _v, bytes32 _r, bytes32 _s) public payable onlyDoer {
		require(plans[_intention].state == Project.APPROVED);
		require(plans[_intention].services[_serviceId].definition.metas.doer == msg.sender);
		UserDefined.IS b;
		(,b,,) = userbase.agents(msg.sender);
		require(uint8(b) > uint8(UserDefined.IS.ACTIVE));
		require(contrl.verified(plans[_intention].services[_serviceId].procure[msg.sender].promise.hash,_v,_r,_s));
		plans[_intention].services[_serviceId].order = Order(plans[_intention].services[_serviceId].procure[msg.sender].promise.hash,_v,_r,_s);
		userbase.setAgent(msg.sender,UserDefined.IS.ACTIVE);
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
			(a,b,c) = Doers(plans[_intention].services[_serviceId].definition.metas.doer).getIntention(_check);
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
		bytes32 _message_,
		bytes32 _thing) public payable onlyDoer returns(bool) 
		{
			Kazini(proxyVerify).verify(_intention,_serviceId,_verity,_message_,_thing);
		}

    function verify(
		bytes32 _intention, 
		bytes32 _serviceId, 
		bytes32 _verity, 
		bytes32 _message_,
		bytes32 _thing) external ProxyVerify returns(bool) 
		{
			// Validate existing promise.
			require(plans[_intention].services[_serviceId].definition.metas.doer != msg.sender);
			address doers = verify(
					_message_,
					plans[_intention].services[_serviceId].order.V,
					plans[_intention].services[_serviceId].order.R,
					plans[_intention].services[_serviceId].order.S);
			require(_message_ == plans[_intention].services[_serviceId].procure[doers].promise.hash);
			require(_verity == plans[_intention].services[_serviceId].procure[doers].fulfillment.hash);
			// Use merkle tree function to build as-built tree, change/configuration management
			plans[_intention].services[_serviceId].procure[doers].verification[msg.sender] = Verification({
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
	    require(plans[_intention].services[_serviceId].procure[msg.sender].verification[verify(sig,uint8(nonce),r,s)].timestamp < 
		plans[_intention].services[_serviceId].definition.metas.expire);
	    uint totalTime;
	    uint payableTime;
		uint expire_ = plans[_intention].services[_serviceId].definition.metas.expire;
		uint timestamp_ = plans[_intention].services[_serviceId].procure[msg.sender].fulfillment.timestamp;
		uint timesoft_ = plans[_intention].services[_serviceId].definition.metas.timeSoft;
		uint timehard_ = plans[_intention].services[_serviceId].procure[msg.sender].promise.timeHard;
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

}
/* End of Input Factor */

contract ProxyVerify is BaseController {

/* Constant */
bytes32 constant internal CONTRACTNAME = "DOERSFACTORY 0.0118";
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


	function ProxyVerify() {
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
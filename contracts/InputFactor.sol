pragma solidity ^0.4.19;

//import "./Able.sol";
//import "./Doers.sol";
import "./Creators.sol";
import "./DoitToken.sol";


contract InputFactor is Controlled {
    
    address public deployer;

    Creators public doers;

    // Service Services;

    // Plan Plans;

    // Promise Promises;

    // Fulfillment Fulfillments;

    uint public promiseCount;
    uint public fulfillmentCount;

    modifier onlyCreators {
        if (!doers.isCreator(msg.sender)) 
        revert();
        _;
    }    

    modifier onlyDoers {
        if (!doers.isDoer(msg.sender)) 
        revert();
        _;
    }

    function InputFactor(Creators abs) public {
        fulfillmentCount = 0;
        deployer = msg.sender;
        doers = abs;
        Controlled.registerContract("InpuFactors", this);
    }

    // Data -> Plan
    // Produce a Plan
        // struct Plan {
		// bytes32 conditionP;
		// mapping(bytes32 => Service) service;
        // mapping(bytes32 => Service[]) services;
        // mapping(bytes32 => string) project;
		// bytes32 conditionQ;
		// }
        // mapping(bytes32 => Plan) plans;
    // function concept(bytes32 _wish, bytes32 _goal, bytes32 _preConditions) returns (Plan); // STUB
    // Examples
    // desire(aWish, aGoal, aPreconditions, aProjectUrl);
    // url = keccak256(aUrl)
        // struct Service {
		// bytes32 conditionP;
		// Promise taskT;
		// bytes32 conditionQ;
		// } 

    function plan(bytes32 _intention, bytes32 _desire, bytes32 _preConditions, string _projectUrl, Doers sdo) public onlyCreators {
        Controlled.plans[_intention].conditionQ = Controlled.bdi[tx.origin].desires[_desire].goal; // Creator and project share a goal 
        Controlled.plans[_intention].conditionP = _preConditions; // pCondition of the curate that will define the concept.
        bytes32 url = keccak256(_projectUrl);
        Controlled.plans[_intention].project[url] = _projectUrl; // main url of the project repo.
    }

    function plan(bytes32 _intention, bytes32 _serviceId, bytes32 _pConditions, bytes32 _qConditions) public onlyDoers {
        require(Controlled.bdi[tx.origin].beliefs.hash == Controlled.plans[_intention].conditionP); // curate meets the pCondition
        Controlled.plans[_intention].service[_serviceId].conditionP = _pConditions;
        Controlled.plans[_intention].service[_serviceId].conditionQ = _qConditions;
    }
    
    // pCondition must be present before project is started
    // qCondition must be present before project is closed
    function plan(bytes32 _intention, bytes32 _prerequisites, string _projectUrl, bytes32 _verity) public onlyDoers {
        require(Controlled.bdi[tx.origin].beliefs.hash == Controlled.plans[_intention].conditionP); // curate meets the pCondition
        Controlled.plans[_intention].conditionP = keccak256(_prerequisites, Controlled.plans[_intention].conditionP);
        bytes32 url = keccak256(_projectUrl);
        Controlled.plans[_intention].project[url] = _projectUrl; // additional urls of project repo.
        Controlled.plans[_intention].conditionQ = keccak256(_verity, Controlled.plans[_intention].conditionQ);
        Controlled.allPlans.push(_intention);
    }      

    function promise(bytes32 _intention, bytes32 _desire, bytes32 _serviceId, bool _check, string _thing, uint _expire) public payable onlyDoers {
        require(Controlled.bdi[tx.origin].beliefs.hash == Controlled.plans[_intention].service[_serviceId].conditionP);
        require(Controlled.bdi[tx.origin].desires[_desire].goal == Controlled.plans[_intention].service[_serviceId].conditionQ);
        require(Controlled.bdi[tx.origin].intentions[_check].status != Controlled.Agent.ACTIVE);
        require(_expire > block.timestamp);
        require(msg.value > 0);
        bytes32 eoi = keccak256(msg.sender, _thing);
        Controlled.plans[_intention].service[eoi].taskT = Promise({doer: msg.sender, thing: _thing, expire: _expire, value: msg.value, hash: eoi});
        Controlled.Promises[msg.sender].push(eoi);
        promiseCount++;
        Controlled.promiseCount++; //!!! COULD REMOVE ONE COUNTER, LEFT HERE FOR DEBUGGING
    }

    function fulfill(bytes32 _intention, string thing, string proof) public onlyDoers {
        // Validate existing promise.
        bytes32 lso = keccak256(msg.sender, thing);
        require(block.timestamp < Controlled.plans[_intention].service[lso].taskT.expire);
        bytes32 verity = keccak256(msg.sender, proof);
        fulfillments[verity] = Fulfillment({doer: msg.sender, promise: Controlled.plans[_intention].service[lso].taskT.hash, proof: proof, timestamp: block.timestamp, hash: verity});
        fulfillmentCount++;
    }

    function getDeployer() internal constant returns (address) {
        return deployer;
    }

    function getDoers() internal constant returns (Creators) {
        return doers;
    }

    function getPromiseCount() internal constant returns (uint) {
        return promiseCount;
    }

    function getFulfillmentCount() internal constant returns (uint) {
        return fulfillmentCount;
    }
}

contract FactorPayout is DoitToken {

bytes32 public currentChallenge;                         // The coin starts with a challenge
uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
uint public difficulty = 10**32;                         // Difficulty starts reasonably low
uint256 amount;

function FactorPayout() internal {
    Controlled.registerContract("InputFactor", this);
    }

function factorPayout(uint nonce) internal {
    bytes8 n = bytes8(keccak256(nonce, currentChallenge));    // Generate a random hash based on input
    require(n >= bytes8(difficulty));                   // Check if it's under the difficulty
    uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
    require(timeSinceLastProof >= 5 seconds);         // Rewards cannot be given too quickly
    amount += timeSinceLastProof / 60 seconds * 42;  // The reward to the winner grows by the minute
    difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty
    approveAndCall(msg.sender, amount, "");

    timeOfLastProof = now;                              // Reset the counter
    currentChallenge = keccak256(nonce, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    }
}
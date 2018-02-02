pragma solidity ^0.4.19;
import "./Able.sol";
import "./DoitToken.sol";
import "./Creators.sol";
import "./ControlAbstract.sol";
pragma experimental ABIEncoderV2;


contract InputFactor is Database, DoitToken {
    
    address public deployer;

    Creators public doers;
    
    Controller contrl;

    Database public dbs;

    // enum Project { PENDING, STARTED, CLOSED }


    // Service Services;

    // Plan Plans;

    // Promise Promises;

    // Fulfillment Fulfillments;

    uint public promiseCount;
    uint public orderCount;
    uint public fulfillmentCount;

    modifier onlyCreators { // MSD from Able
        if (!doers.isCreator(msg.sender)) 
        revert();
        _;
    }    

    modifier onlyDoers {    // MSD from Creator
        if (!doers.isDoer(msg.sender)) 
        revert();
        _;
    }

    modifier onlyController {
        require(msg.sender == deployer); 
        _;}

    function InputFactor(Creators _abs, Controller _ctrl, Database _db) public {
        fulfillmentCount = 0;
        deployer = msg.sender;
        doers = _abs;
        contrl = _ctrl;
        dbs = _db;
        contrl.registerContract("InputFactor", this);
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
        //} 
        //     struct Service {
		// Belief conditionP;
		// Promise taskT;
        // bytes32 conditionQ;
        // uint timeOpt;  // preferred timeline
        // uint expire;
		// } 

    function plan(bytes32 _intention, bytes32 _desire, bytes32 _preConditions, string _projectUrl) public payable onlyCreators {
        require((uint(plans[_intention].state) != uint(Project.STARTED)) || // This is 
        (uint(plans[_intention].state) != uint(Project.CLOSED))); // a new plan?
        plans[_intention].conditionQ = bdi[tx.origin].desires[_desire]; // Creator and project share a goal
        // plans[_intention].conditionQ = myBDI.getDesire(_desire).goal; // Creator and project share a goal
        bytes32 serviceId = plans[_intention].conditionQ.goal ^ bytes32(msg.sender);  // bitwise XOR builds a map of serviceIds
        plans[_intention].service[serviceId].conditionP.hash = _preConditions; // pCondition of the curate that will define the concept.
        bytes32 url = keccak256(_projectUrl);
        plans[_intention].ipfs[url] = _projectUrl; // Store the prefeasibility at the main project repo.
        uint(plans[_intention].state) == uint(Project.PENDING);
        plans[_intention].creator = tx.origin;
        // push event for new plan
    }

    function plan(
        bytes32 _intention, 
        bytes32 _serviceId, 
        bytes32 _myQCondition, 
        bool _myGgoal, 
        uint _experience, 
        bytes32 _reputation, 
        bytes32 _talent, 
        bytes32 _index, 
        bytes32 hash, 
        bytes32 _country, 
        bytes32 _cAuthority, 
        bytes32 _score) public payable onlyDoers {
        require(uint(plans[_intention].state) == uint(Project.PENDING)); // Project is not pending or closed
        require(hash == keccak256(_country,_cAuthority,_score,_experience,_reputation,_talent));
        require(bdi[tx.origin].beliefs.index >= plans[_intention].service[_serviceId].conditionP.index); // Curate meets or exceeds
        plans[_intention].service[_serviceId].conditionP = bdi[tx.origin].beliefs; // current pCondition, set new curate
        bytes32 nServiceId = _serviceId ^ bytes32(msg.sender);
        plans[_intention].service[_serviceId].conditionQ = Desire({goal: _myQCondition, status: _myGgoal});
        Database.Belief memory beliefTmp = Database.Belief({
            talent: _talent, 
            reputation: _reputation, 
            experience: _experience, 
            index: _index, 
            hash: hash 
            });
        plans[_intention].service[nServiceId].conditionP = beliefTmp;
        Database.Qualification memory meritTmp = Database.Qualification({
            country: _country, 
            cAuthority: _cAuthority, 
            score: _score
            });
        plans[_intention].service[nServiceId].conditionP.qualification[hash] = meritTmp;
        plans[_intention].service[_serviceId].hash = keccak256(_myQCondition, hash);
        plans[_intention].curator = tx.origin;
        }
    
    // pCondition must be present before project is started
    // qCondition must be present before project is closed
    function plan(bytes32 _intention, bytes32 _prerequisites, string _projectUrl, bytes32 _verity) public payable onlyDoers {
        require(plans[_intention].curator == tx.origin); // curate meets the pCondition
        plans[_intention].conditionP = keccak256(_prerequisites, plans[_intention].conditionP); // Use a merkle tree
        bytes32 url = keccak256(_projectUrl); // function and base the design pCondition to the merkle tree
        plans[_intention].ipfs[url] = _projectUrl; // additional urls of project repo.
        //plans[_intention].conditionQ = keccak256(_verity, plans[_intention].conditionQ);
        allPlans.push(_intention);
        plans[_intention].state == Project.STARTED;
    }      

    function promise(bytes32 _intention, bytes32 _desire, bytes32 _serviceId, uint _time, bool _thing) public payable onlyDoers {
        require(bdi[tx.origin].beliefs.index >= plans[_intention].service[_serviceId].conditionP.index);
        require(bdi[tx.origin].desires[_desire].goal == plans[_intention].service[_serviceId].conditionQ.goal);
        require((_time > block.timestamp) || (_time < plans[_intention].service[_serviceId].expire));
        require(msg.value > 0);
        require(bdi[tx.origin].beliefs.index > bdi[plans[_intention].service[_serviceId].taskT.doer].beliefs.index);
        bytes32 eoi = keccak256(msg.sender, _intention, _serviceId);
        plans[_intention].service[_serviceId].taskT = Promise({
            doer: tx.origin, 
            thing: bdi[tx.origin].intentions[_thing].service, 
            timeHard: _time, 
            value: msg.value, 
            hash: eoi});
        Promises[tx.origin].push(_serviceId);
        promiseCount++;
        promiseCount++; //!!! COULD REMOVE ONE COUNTER, LEFT HERE FOR DEBUGGING
        }

    // }
    //     struct Desire {
    //     bytes32 goal;
    //     bool status;
    //     }
    // struct Intention {
    //     State status;
    //     bytes32 service;
    //     uint256 payout;
    //     }
    

    function fulfill(bytes32 _intention, bytes32 _serviceId, bool _check, bytes32 proof, Level _level) public payable onlyDoers {
        // Validate existing promise.
        if (bdi[plans[_intention].service[_serviceId].taskT.doer].intentions[_check].state != 
        State.ACTIVE) {
            Promise memory reset;
            plans[_intention].service[_serviceId].taskT = reset;
            }
        bytes32 lso = keccak256(msg.sender, _serviceId); // Use merkle tree function to build order tree, rebase design plan 
        require(block.timestamp < plans[_intention].service[lso].expire);
        bytes32 verity = keccak256(msg.sender, proof);
        plans[_intention].service[_serviceId].fulfillment = Fulfillment({doer: msg.sender, promise: plans[_intention].service[lso].taskT.hash, proof: proof, rubric: _level, timestamp: block.timestamp, hash: verity});
        orderCount++;
        }

    function verify(bytes32 _intention, bytes32 _serviceId, bytes32 _verity, bytes32 _thing) public payable onlyDoers {
        // Validate existing promise.
        plans[_intention].service[_serviceId].fulfillment.hash = _thing;
        _verity = keccak256(msg.sender, _verity); // Use merkle tree function to build as-built tree, change/configuration management
        plans[_intention].service[_serviceId].fulfillment.check[_verity] = Verification({prover: tx.origin, complete: true, timestamp: block.timestamp, hash: _verity});
        fulfillmentCount++;
        // function setReputation(Intention _service, bool _intention) internal onlyDoer {
        //     myBDI.beliefs.reputation = _service;  !!! Working on
		}

    function getDeployer() internal constant returns (address) {
        return deployer;
    }

    // function getDoers() internal constant returns (Creators) {
    //     return doers;
    // }

    function getPromiseCount() internal constant returns (uint) {
        return promiseCount;
    }

    function getFulfillmentCount() internal constant returns (uint) {
        return fulfillmentCount;
    }

    // function setDeployer(bytes23 _db) onlyController internal {
    //     dbs = contrl.databases[_db];
    //     // return true;
    // }

////////////////
// Events
////////////////
    event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
// }

// contract FactorPayout is DoitToken {

bytes32 public currentChallenge;                         // The coin starts with a challenge
uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
uint public difficulty = 10**32;                         // Difficulty starts reasonably low
uint256 amount;

// function FactorPayout() internal {
//     Controller.registerContract("FactorPayout", this);
//     }

function payout(uint nonce, bytes32 _intention, bytes32 _serviceId) internal {
    bytes8 n = bytes8(keccak256(nonce, currentChallenge));    // Generate a random hash based on input
    require(n >= bytes8(difficulty));                   // Check if it's under the difficulty
    uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
    require(timeSinceLastProof >= 5 seconds);         // Rewards cannot be given too quickly
    require(plans[_intention].service[_serviceId].fulfillment.timestamp < 
    plans[_intention].service[_serviceId].expire);
    uint totalTime;
    uint payableTime;
    if (plans[_intention].service[_serviceId].fulfillment.timestamp < 
    plans[_intention].service[_serviceId].timeSoft) {
        payableTime = plans[_intention].service[_serviceId].timeSoft;
    } else if (plans[_intention].service[_serviceId].fulfillment.timestamp > 
    plans[_intention].service[_serviceId].taskT.timeHard) {
        totalTime = plans[_intention].service[_serviceId].expire - 
        plans[_intention].service[_serviceId].timeSoft;
        payableTime = ((plans[_intention].service[_serviceId].expire - 
        plans[_intention].service[_serviceId].fulfillment.timestamp) / totalTime) * 
        plans[_intention].service[_serviceId].timeSoft;
        } else {
        totalTime = plans[_intention].service[_serviceId].taskT.timeHard - 
        plans[_intention].service[_serviceId].timeSoft;
        payableTime = ((plans[_intention].service[_serviceId].taskT.timeHard - 
        plans[_intention].service[_serviceId].fulfillment.timestamp) / totalTime) * 
        plans[_intention].service[_serviceId].timeSoft;
    }
    amount += payableTime / 60 seconds * 42 / 10;  // The reward to the winner grows by the minute
    difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty
    approveAndCall(msg.sender, amount, "");

    timeOfLastProof = now;                              // Reset the counter
    currentChallenge = keccak256(nonce, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    }
////////////////
// Events
////////////////

    event Payout(address indexed _from, address indexed _to, uint256 _amount);
}
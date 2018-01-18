pragma solidity ^0.4.19;

//import "./Able.sol";
//import "./Doers.sol";
import "./Creators.sol";
import "./DoitToken.sol";


contract InputFactor is Controlled {
    
    address public deployer;

    Creators public doers;

    Service Services;

    Promise Promises;

    Fulfillment Fulfillments;

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

    function desire(bytes32 _wish, bytes32 _goal, bytes32 _preConditions) public onlyCreators {
        Controlled.plans[_wish].conditionQ = _goal;
        Controlled.plans[_wish].conditionP = _preConditions;
    }

    function plan(bytes32 _uuid, bytes32 _wish, bytes32 _preConditions) public onlyDoers {
        require(Controlled.bdi[tx.origin].beliefs[_uuid].chck == Controlled.plans[_wish].conditionP);
        Controlled.plans[_wish].conditionP = _preConditions;
    }    

    function promise(bytes32 _wish, bytes32 _desire, bool _check, string thing, uint expire) public payable onlyDoers {
        require(Controlled.bdi[tx.origin].desires[_desire].goal == Controlled.plans[_wish].conditionQ);
        require(Controlled.bdi[tx.origin].intentions[_check].status != Controlled.Status.ACTIVE);
        require(expire > block.timestamp);
        require(msg.value > 0);
        bytes32 eoi = keccak256(msg.sender, thing);
        Controlled.plans[_wish].services[eoi].taskT = Promise({doer: msg.sender, thing: thing, expire: expire, value: msg.value, hash: eoi});
        promiseCount++;
    }

    function fulfill(bytes32 _wish, string thing, string proof) onlyDoers {
        // Validate existing promise.
        bytes32 lso = keccak256(msg.sender, thing);
        require(block.timestamp < Controlled.plans[_wish].services[lso].taskT.expire);
        bytes32 verity = keccak256(msg.sender, proof);
        fulfillments[verity] = Fulfillment({doer: msg.sender, promise: Controlled.plans[_wish].services[lso].taskT.hash, proof: proof, timestamp: block.timestamp, hash: verity});
        fulfillmentCount++;
    }

    function getDeployer() constant returns (address) {
        return deployer;
    }

    function getDoers() constant returns (Creators) {
        return doers;
    }

    function getPromiseCount() constant returns (uint) {
        return promiseCount;
    }

    function getFulfillmentCount() constant returns (uint) {
        return fulfillmentCount;
    }
}

contract FactorPayout is DoitToken {

bytes32 public currentChallenge;                         // The coin starts with a challenge
uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
uint public difficulty = 10**32;                         // Difficulty starts reasonably low
uint256 amount;

function FactorPayout() {registerContract("InputFactor", this);}

function factorPayout(uint nonce) {
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
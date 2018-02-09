pragma solidity ^0.4.18;

import "./Reserve.sol";

contract InputFactor is Reserve {
    
function InputFactor(Able _ctrl, Database _db, DoitToken _diy) {
        contrl = _ctrl;
        database = _db;
        tokenContract = _diy;
        }

function factorPayout(uint nonce, bytes32 _intention, bytes32 _serviceId) internal {
    bytes8 n = bytes8(keccak256(nonce, currentChallenge));    // Generate a random hash based on input
    require(n >= bytes8(difficulty));                   // Check if it's under the difficulty
    uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
    require(timeSinceLastProof >= 5 seconds);         // Rewards cannot be given too quickly
    // require(database.plans[_intention].service[_serviceId].fulfillment.timestamp < 
    // database.plans[_intention].service[_serviceId].expire);
    require(database.getFulfillmentTimeStamp(_intention, _serviceId) < database.getServiceExpire(_intention, _serviceId));
    uint totalTime;
    uint payableTime;
    if (database.getFulfillmentTimeStamp(_intention, _serviceId) < 
    database.getServiceTimeSoft(_intention, _serviceId)) {
        payableTime = database.getServiceTimeSoft(_intention, _serviceId);
    } else if (database.getFulfillmentTimeStamp(_intention, _serviceId) > 
    database.getServiceTaskT(_intention, _serviceId).timeHard) {
        totalTime = database.getServiceExpire(_intention, _serviceId) - 
        database.getServiceTimeSoft(_intention, _serviceId);
        payableTime = (((database.getServiceExpire(_intention, _serviceId) - 
        database.getFulfillmentTimeStamp(_intention, _serviceId)) / totalTime) * 
        database.getServiceTimeSoft(_intention, _serviceId));
        } else {
        totalTime = database.getServiceTaskT(_intention, _serviceId).timeHard - 
        database.getServiceTimeSoft(_intention, _serviceId);
        payableTime = (((database.getServiceTaskT(_intention, _serviceId).timeHard - 
        database.getFulfillmentTimeStamp(_intention, _serviceId)) / totalTime) * 
        database.getServiceTimeSoft(_intention, _serviceId));
    }
    amount += payableTime / 60 seconds * 42 / 10;  // The reward to the winner grows by the minute
    difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty
    tokenContract.approveAndCall(msg.sender, amount, "");

    timeOfLastProof = now;                              // Reset the counter
    currentChallenge = keccak256(nonce, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    }

////////////////
// Events
////////////////

    event FactorPayout(address indexed _from, address indexed _to, uint256 _amount);
}


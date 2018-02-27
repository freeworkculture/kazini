pragma solidity ^0.4.19;

/*
    Copyright 2017, Jordi Baylina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/// @title MilestoneTracker Contract
/// @author Jordi Baylina
/// @dev This contract controls the issuance of tokens for the MiniMe Token
///  Contract. This version specifically acts as a Campaign manager for raising
///  funds for non-profit causes, but it can be customized for any variety of
///  purposes.

import "./DoitToken.sol";


/// @dev `Owned` is a base level contract that assigns an `owner` that can be
///  later changed
contract Owned {
    /// @dev `owner` is the only address that can call a function with this
    /// modifier
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
        }

    address public owner;

    /// @notice The Constructor assigns the message sender to be `owner`
    function Owned() {
        owner = msg.sender;
        }

    /// @notice `owner` can step down and assign some other address to this role
    /// @param _newOwner The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function changeOwner(address _newOwner) onlyOwner {
        owner = _newOwner;
    }
}


/// @dev This is designed to control the issuance of a MiniMe Token for a
///  non-profit Campaign. This contract effectively dictates the terms of the
///  funding round.

contract Reserve is TokenController, Owned, DataController {

    uint public startFundingTime;       // In UNIX Time Format
    uint public endFundingTime;         // In UNIX Time Format
    uint public maximumFunding;         // In wei
    uint public totalCollected;         // In wei
    DoitToken public doitContract;   // The new token for this Campaign
    address public vaultAddress;        // The address to hold the funds donated

/// @notice 'Campaign()' initiates the Campaign by setting its funding
/// parameters
/// @dev There are several checks to make sure the parameters are acceptable
/// @param _startFundingTime The UNIX time that the Campaign will be able to
/// start receiving funds
/// @param _endFundingTime The UNIX time that the Campaign will stop being able
/// to receive funds
/// @param _maximumFunding In wei, the Maximum amount that the Campaign can
/// receive (currently the max is set at 10,000 ETH for the beta)
/// @param _vaultAddress The address that will store the donated funds
/// @param _tokenAddress Address of the token contract this contract controls

    function Reserve(
        uint _startFundingTime,
        uint _endFundingTime,
        uint _maximumFunding,
        address _vaultAddress,
        address _tokenAddress,
        Able _ctrl,
        Database _db
    ) {
        require((_endFundingTime >= now) &&           // Cannot end in the past
            (_endFundingTime > _startFundingTime) &&
            (_maximumFunding <= 10000 ether) &&        // The Beta is limited
            (_vaultAddress != 0));                    // To prevent burning ETH
        startFundingTime = _startFundingTime;
        endFundingTime = _endFundingTime;
        maximumFunding = _maximumFunding;
        doitContract = DoitToken(_tokenAddress);// The Deployed Token Contract
        vaultAddress = _vaultAddress;
        contrl = _ctrl;
        database = _db;
    }

/// @dev The fallback function is called when ether is sent to the contract, it
/// simply calls `doPayment()` with the address that sent the ether as the
/// `_owner`. Payable is a required solidity modifier for functions to receive
/// ether, without this modifier functions will throw if ether is sent to them

    function ()  payable {
        doPayment(msg.sender);
    }

/////////////////
// TokenController interface
/////////////////

/// @notice `proxyPayment()` allows the caller to send ether to the Campaign and
/// have the tokens created in an address of their choosing
/// @param _owner The address that will hold the newly created tokens

    function proxyPayment(address _owner) payable returns(bool) {
        doPayment(_owner);
        return true;
    }

/// @notice Notifies the controller about a transfer, for this Campaign all
///  transfers are allowed by default and no extra notifications are needed
/// @param _from The origin of the transfer
/// @param _to The destination of the transfer
/// @param _amount The amount of the transfer
/// @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) returns(bool) {
        return true;
    }

/// @notice Notifies the controller about an approval, for this Campaign all
///  approvals are allowed by default and no extra notifications are needed
/// @param _owner The address that calls `approve()`
/// @param _spender The spender in the `approve()` call
/// @param _amount The amount in the `approve()` call
/// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount)
        returns(bool)
    {
        return true;
    }


/// @dev `doPayment()` is an internal function that sends the ether that this
///  contract receives to the `vault` and creates tokens in the address of the
///  `_owner` assuming the Campaign is still accepting funds
/// @param _owner The address that will hold the newly created tokens

    function doPayment(address _owner) internal {

// First check that the Campaign is allowed to receive this donation
        require((now >= startFundingTime) &&
            (now <= endFundingTime) &&
            (doitContract.controller() != 0) &&           // Extra check
            (msg.value != 0) &&
            (totalCollected + msg.value <= maximumFunding));

//Track how much the Campaign has collected
        totalCollected += msg.value;

//Send the ether to the vault
        require (vaultAddress.send(msg.value));

// Creates an equal amount of tokens as ether sent. The new tokens are created
//  in the `_owner` address
        require (doitContract.generateTokens(_owner, msg.value));

        return;
    }

/// @notice `finalizeFunding()` ends the Campaign by calling setting the
///  controller to 0, thereby ending the issuance of new tokens and stopping the
///  Campaign from receiving more ether
/// @dev `finalizeFunding()` can only be called after the end of the funding period.

    function finalizeFunding() {
        require(now >= endFundingTime);
        doitContract.changeController(0);
    }


/// @notice `onlyOwner` changes the location that ether is sent
/// @param _newVaultAddress The address that will receive the ether sent to this
///  Campaign
    function setVault(address _newVaultAddress) onlyOwner {
        vaultAddress = _newVaultAddress;
    }

    mapping (address => bool) public frozenAccount;
    
    function InputStake(Able _ctrl, Database _db, DoitToken _diy) {
        contrl = _ctrl;
        database = _db;
        tokenContract = _diy;
        }

////////////////
// Generate and destroy tokens
////////////////

    /// @notice Generates `_amount` tokens that are assigned to `_owner`
    /// @param _owner The address that will be assigned the new tokens
    /// @param _amount The quantity of tokens generated
    /// @return True if the tokens are generated correctly
    function generateTokens(address _owner, uint _amount) public onlyController returns (bool) {
        uint curTotalSupply = totalSupply();
        require(curTotalSupply + _amount >= curTotalSupply); // Check for overflow
        uint previousBalanceTo = balanceOf(_owner);
        require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow
        updateValueAtNow(totalSupplyHistory, curTotalSupply + _amount);
        updateValueAtNow(balances[_owner], previousBalanceTo + _amount);
        Transfer(0, _owner, _amount);
        return true;
    }

    /// @notice Burns `_amount` tokens from `_owner`
    /// @param _owner The address that will lose the tokens
    /// @param _amount The quantity of tokens to burn
    /// @return True if the tokens are burned correctly
    function destroyTokens(address _owner, uint _amount
    ) onlyController public returns (bool) {
        uint curTotalSupply = totalSupply();
        require(curTotalSupply >= _amount);
        uint previousBalanceFrom = balanceOf(_owner);
        require(previousBalanceFrom >= _amount);
        updateValueAtNow(totalSupplyHistory, curTotalSupply - _amount);
        updateValueAtNow(balances[_owner], previousBalanceFrom - _amount);
        Transfer(_owner, 0, _amount);
        return true;
    }

////////////////
// Enable tokens transfers
////////////////

    /// @notice Enables token holders to transfer their tokens freely if true
    /// @param _transfersEnabled True if transfers are allowed in the clone
    function enableTransfers(bool _transfersEnabled) onlyController public {
        transfersEnabled = _transfersEnabled;
    }

////////////////
// Freeze Account
////////////////
    
    /// @notice `freeze? Prevent | Allow` `target` from sending & receiving tokens
    /// @param target Address to be frozen
    /// @param freeze either to freeze it or not
    function freezeAccount(address target, bool freeze) onlyController public {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);/// @notice Enables token holders to transfer their tokens freely if true
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _amount);
    event FrozenFunds(address target, bool frozen);

/* OLD CODE MUTED */
    // contract FactorPayout is DoitToken {

    // bytes32 public currentChallenge;                         // The coin starts with a challenge
    // uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
    // uint public difficulty = 10**32;                         // Difficulty starts reasonably low
    // uint256 amount;

    // function factorPayout(uint nonce, bytes32 _intention, bytes32 _serviceId) internal {
    //     bytes8 n = bytes8(keccak256(nonce, currentChallenge));    // Generate a random hash based on input
    //     require(n >= bytes8(difficulty));                   // Check if it's under the difficulty
    //     uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
    //     require(timeSinceLastProof >= 5 seconds);         // Rewards cannot be given too quickly
    //     // require(database.plans[_intention].service[_serviceId].fulfillment.timestamp < 
    //     // database.plans[_intention].service[_serviceId].expire);
    //     require(database.getFulfillmentData(_intention, _serviceId).timestamp < database.getServiceData(_intention, _serviceId).expire);
    //     uint totalTime;
    //     uint payableTime;
    //     if (database.getFulfillmentData(_intention, _serviceId).timestamp < 
    //     database.getServiceData(_intention, _serviceId).timeSoft) {
    //         payableTime = database.getServiceData(_intention, _serviceId).timeSoft;
    //     } else if (database.getFulfillmentData(_intention, _serviceId).timestamp > 
    //     database.getServiceData(_intention, _serviceId).taskT.timeHard) {
    //         totalTime = database.getServiceData(_intention, _serviceId).expire - 
    //         database.getServiceData(_intention, _serviceId).timeSoft;
    //         payableTime = (((database.getServiceData(_intention, _serviceId).expire - 
    //         database.getFulfillmentData(_intention, _serviceId).timestamp) / totalTime) * 
    //         database.getServiceData(_intention, _serviceId).timeSoft);
    //         } else {
    //         totalTime = database.getServiceData(_intention, _serviceId).taskT.timeHard - 
    //         database.getServiceData(_intention, _serviceId).timeSoft;
    //         payableTime = (((database.getServiceData(_intention, _serviceId).taskT.timeHard - 
    //         database.getFulfillmentData(_intention, _serviceId).timestamp) / totalTime) * 
    //         database.getServiceData(_intention, _serviceId).timeSoft);
    //     }
    //     amount += payableTime / 60 seconds * 42 / 10;  // The reward to the winner grows by the minute
    //     difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty
    //     doitContract.approveAndCall(msg.sender, amount, "");

    //     timeOfLastProof = now;                              // Reset the counter
    //     currentChallenge = keccak256(nonce, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    //     }

    // bytes32 public currentChallenge;                         // The coin starts with a challenge
    // uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
    // uint public difficulty = 10**32;                         // Difficulty starts reasonably low
    // uint256 amount;

    // function factorPayout(bytes32 _intention, bytes32 _serviceId, bytes32 sig, uint nonce, bytes32 r, bytes32 s) internal {
    //     bytes8 n = bytes8(keccak256(nonce, currentChallenge));    // Generate a random hash based on input
    //     require(n >= bytes8(difficulty));                   // Check if it's under the difficulty
    //     uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
    //     require(timeSinceLastProof >= 5 seconds);         // Rewards cannot be given too quickly
    //     // require(database.plans[_intention].service[_serviceId].fulfillment.timestamp < 
    //     // database.plans[_intention].service[_serviceId].expire);
    //     require(plans[_intention].services[_serviceId].procure[msg.sender].verification[verify(sig,uint8(nonce),r,s)].timestampV < 
    // 	plans[_intention].services[_serviceId].definition.metas.expire);
    //     uint totalTime;
    //     uint payableTime;
    // 	uint expire_ = plans[_intention].services[_serviceId].definition.metas.expire;
    // 	uint timestamp_ = plans[_intention].services[_serviceId].procure[msg.sender].fulfillment.timestamp;
    // 	uint timesoft_ = plans[_intention].services[_serviceId].definition.metas.timeSoft;
    // 	uint timehard_ = plans[_intention].services[_serviceId].procure[msg.sender].promise.timeHard;
    //     if (timestamp_ < timesoft_) { // Completed on Schedule, Pays Maximum Payout
    //         payableTime = timesoft_;
    //     } else if (timestamp_ > timehard_) {	// Completed after deadline, enters liquidation
    //         totalTime = expire_ - timesoft_;
    //         payableTime = (((expire_ - timestamp_) / totalTime) * timesoft_);
    //         } else {				// Completed within the deadline, pays prorata
    //         totalTime = timehard_ - timesoft_;
    //         payableTime = (((timehard_ - timestamp_) / totalTime) * timesoft_);
    //     }
    //     amount += payableTime / 60 seconds * 42 / 10;  // The reward to the winner grows by the minute
    //     difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty
    //     doit.approveAndCall(msg.sender, amount, "");

    //     timeOfLastProof = now;                              // Reset the counter
    //     currentChallenge = keccak256(nonce, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
//     }

////////////////
// Events
////////////////

    event FactorPayout(address indexed _from, address indexed _to, uint256 _amount);
    event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
}


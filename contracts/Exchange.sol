pragma solidity ^0.4.18;

import "./Reserve.sol";

contract Exchange {
////////////////
// Enable tokens buy/sell
////////////////
    uint256 public sellPrice;
    uint256 public buyPrice;
    DoitToken internal doit;
    Reserve internal reserve;

    function Exchange(Able _ctrl, Database _db, DoitToken _diy, Reserve _rsv) {
        contrl = _ctrl;
        database = _db;
        doit = _diy;
        reserve = _rsv;
        }

    /// @notice Allow users to buy tokens for `newBuyPrice` eth and sell tokens for `newSellPrice` eth
    /// @param newSellPrice Price the users can sell to the contract
    /// @param newBuyPrice Price users can buy from the contract
    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyController public {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }

    /// @notice Buy tokens from contract by sending ether
    function buy() payable public returns (bool success) {
        uint amount = msg.value / buyPrice;               // calculates the amount
        require(transfersEnabled);
        doTransfer(this, msg.sender, amount);              // makes the transfers
        return true;
    }

    /// @notice Sell `amount` tokens to contract
    /// @param amount amount of tokens to be sold
    function sell(uint256 amount) public returns (bool success) {
        require(transfersEnabled);
        require(this.balance >= amount * sellPrice);      // checks if the contract has enough ether to buy
        doTransfer(msg.sender, this, amount);              // makes the transfers
        msg.sender.transfer(amount * sellPrice);          // sends ether to the seller. It's important to do this last to avoid recursion attacks
        return true;
    }

/* OLD CODE MUTED */

    //     bytes32 public currentChallenge;                         // The coin starts with a challenge
    //     uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
    //     uint public difficulty = 10**32;                         // Difficulty starts reasonably low
    //     uint256 amount;
    //     // mapping(address=>Service) public services;
    //     // struct Service {
    //     // 		bool active;
    //     // 		uint lastUpdate;
    //     // 		uint256 amount;
    //     //         string status;
    //     //}

    //     function InputFactor() {registerContract("InputFactor", this);}

    //     function factorPayout(uint nonce) {
    //     bytes8 n = bytes8(keccak256(nonce, currentChallenge));    // Generate a random hash based on input
    //     require(n >= bytes8(difficulty));                   // Check if it's under the difficulty

    //     uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
    //     require(timeSinceLastProof >= 5 seconds);         // Rewards cannot be given too quickly
    //     amount += timeSinceLastProof / 60 seconds * 42;  // The reward to the winner grows by the minute
    //     difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty
    //     approveAndCall(msg.sender, amount, "");

    //     timeOfLastProof = now;                              // Reset the counter
    //     currentChallenge = keccak256(nonce, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    //     }

    //         mapping (address => bool) public frozenAccount;
        
    //     function InputStake() {registerContract("InputStake", this);}

    // ////////////////
    // // Generate and destroy tokens
    // ////////////////

    //     /// @notice Generates `_amount` tokens that are assigned to `_owner`
    //     /// @param _owner The address that will be assigned the new tokens
    //     /// @param _amount The quantity of tokens generated
    //     /// @return True if the tokens are generated correctly
    //     function generateTokens(address _owner, uint _amount) public onlyController returns (bool) {
    //         uint curTotalSupply = totalSupply();
    //         require(curTotalSupply + _amount >= curTotalSupply); // Check for overflow
    //         uint previousBalanceTo = balanceOf(_owner);
    //         require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow
    //         updateValueAtNow(totalSupplyHistory, curTotalSupply + _amount);
    //         updateValueAtNow(balances[_owner], previousBalanceTo + _amount);
    //         Transfer(0, _owner, _amount);
    //         return true;
    //     }

    //     /// @notice Burns `_amount` tokens from `_owner`
    //     /// @param _owner The address that will lose the tokens
    //     /// @param _amount The quantity of tokens to burn
    //     /// @return True if the tokens are burned correctly
    //     function destroyTokens(address _owner, uint _amount
    //     ) onlyController public returns (bool) {
    //         uint curTotalSupply = totalSupply();
    //         require(curTotalSupply >= _amount);
    //         uint previousBalanceFrom = balanceOf(_owner);
    //         require(previousBalanceFrom >= _amount);
    //         updateValueAtNow(totalSupplyHistory, curTotalSupply - _amount);
    //         updateValueAtNow(balances[_owner], previousBalanceFrom - _amount);
    //         Transfer(_owner, 0, _amount);
    //         return true;
    //     }

    // ////////////////
    // // Enable tokens transfers
    // ////////////////

    //     /// @notice Enables token holders to transfer their tokens freely if true
    //     /// @param _transfersEnabled True if transfers are allowed in the clone
    //     function enableTransfers(bool _transfersEnabled) onlyController public {
    //         transfersEnabled = _transfersEnabled;
    //     }

    // ////////////////
    // // Freeze Account
    // ////////////////
        
    //     /// @notice `freeze? Prevent | Allow` `target` from sending & receiving tokens
    //     /// @param target Address to be frozen
    //     /// @param freeze either to freeze it or not
    //     function freezeAccount(address target, bool freeze) onlyController public {
    //         frozenAccount[target] = freeze;
    //         FrozenFunds(target, freeze);/// @notice Enables token holders to transfer their tokens freely if true
//     }

        event Transfer(address indexed _from, address indexed _to, uint256 _amount);
        event FrozenFunds(address target, bool frozen);

/* END OF EXCHANGE CONTRACT */
}

pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;

import "./Reserve.sol";

contract InputStake is Reserve {
    
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

}
pragma solidity ^0.4.18;

/*
    Copyright 2016, Jordi Baylina

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

/// @title MiniMeToken Contract
/// @author Jordi Baylina
/// @dev This token contract's goal is to make it easy for anyone to clone this
///  token using the token distribution at a given block, this will allow DAO's
///  and DApps to upgrade their features in a decentralized manner without
///  affecting the original token
/// @dev It is ERC20 compliant, but still needs to under go further testing.

import "./1_Kernel.sol";
import "./2_OS_Library.sol";
import './3_ERC20_Library.sol';

contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 _amount, address _token, bytes _data) public;
}

/// @dev The actual token contract, the default controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract, which Giveth will call a "Campaign"


contract ERC20Int {
    using ERC20Lib for ERC20Lib.TokenStorage;

    ERC20Lib.TokenStorage token;

/* Events */
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

/* Structs */

/* Constants */

/* State Variables */

    string public name = "SimpleToken";
    string public symbol = "SIM";
    uint public decimals = 18;
    uint public INITIAL_SUPPLY = 10000;

/* Modifiers */

    modifier isAvailable(uint _amount) {
        require(_amount <= token.balanceOf(msg.sender));
        _;
    }

    modifier isAllowed(address _from, uint _amount) {
        require(_amount <= token.allowance(_from, msg.sender) &&
           _amount <= token.balanceOf(_from));
        _;        
    }

/* Funtions Public */

    
    function StandardToken() {
        token.init(INITIAL_SUPPLY);
        }

    // Returns token name
    // function name() public view returns(string);

    // Returns token symbol
    // function symbol() public view returns(string);

    // Returns decimal places designated for unit of token.
    // function decimalPlaces() public returns(uint);

    function totalSupply() constant returns (uint) {
        return token.totalSupply;
        }

    function balanceOf(address who) constant returns (uint) {
        return token.balanceOf(who);
        }

    function allowance(address owner, address spender) constant returns (uint) {
        return token.allowance(owner, spender);
        }

    function transfer(address to, uint value) returns (bool ok) {
        return token.transfer(to, value);
        }

    function transferFrom(address from, address to, uint value) returns (bool ok) {
        return token.transferFrom(from, to, value);
        }

    function approve(address spender, uint value) returns (bool ok) {
        return token.approve(spender, value);
        }


}
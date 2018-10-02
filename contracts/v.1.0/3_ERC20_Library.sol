/*
file:   ERC20.sol
ver:    0.2.6
updated:20-Apr-2018
author: Darryl Morris 
contributors: terraflops
email:  o0ragman0o AT gmail.com

An ERC20 compliant token with reentry protection and safe math.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.
*/

pragma solidity ^0.4.18;

import "./1_Kernel.sol";
import "./2_OS_Library.sol";

// ERC20 Standard Token Interface with safe maths and reentry protection
library ERC20Lib {
    
    using SafeMathLib for uint;

/* Events */

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

/* Structs */

    struct TokenStorage {
        mapping (address => uint) balances;
        mapping (address => mapping (address => uint)) allowed;
        uint totalSupply;
        }

/* Constants */

/* State Valiables */

/* Modifiers */

/* Function Abstracts */

    function init(TokenStorage storage self, uint _initial_supply) {
        self.totalSupply = _initial_supply;
        self.balances[msg.sender] = _initial_supply;
        }

    // Get the total token supply
    // function totalSupply() public view returns (uint);
    // function totalSupply(TokenStorage storage self) returns (uint value) {
    //     return self.totalSupply;
    // }

    function balanceOf(TokenStorage storage self, address _owner) constant returns (uint balance) {
        return self.balances[_owner];
        }

    // Send _value amount of tokens to address _to
    // function transfer(address _to, uint256 _value) public returns (bool success);
    function transfer(TokenStorage storage self, address _to, uint _value) returns (bool success) {
        self.balances[msg.sender] = self.balances[msg.sender].sub(_value);
        self.balances[_to] = self.balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
        }

    // Send _value amount of tokens from address _from to address _to
    // function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function transferFrom(TokenStorage storage self, address _from, address _to, uint _value) returns (bool success) {
        uint _allowance = self.allowed[_from][msg.sender];

        self.balances[_to] = self.balances[_to].add(_value);
        self.balances[_from] = self.balances[_from].sub(_value);
        self.allowed[_from][msg.sender] = _allowance.sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
        }

    // Allow _spender to withdraw from your account, multiple times, up to the
    // _value amount.
    // function approve(address _spender, uint256 _value) public returns (bool success);
    function approve(TokenStorage storage self, address _spender, uint _value) returns (bool success) {
        self.allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
        }

    // Returns the allowable transfer of tokens by a proxy
    // function allowance (address tokenHolders, address proxy, uint allowance) public view returns (uint);
    function allowance(TokenStorage storage self, address _owner, address _spender) constant returns (uint remaining) {
        return self.allowed[_owner][_spender];
        }
}
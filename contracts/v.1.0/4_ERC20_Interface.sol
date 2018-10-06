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


/// @dev The actual token contract, the default controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract, which Giveth will call a "Campaign"


contract ERC20 is BaseController {

    using ERC20Lib for ERC20Lib.STORAGE;

    ERC20Lib.STORAGE erc20data;

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
        require(_amount <= erc20data.balanceOf(msg.sender));
        _;
    }

    modifier isAllowed(address _from, uint _amount) {
        require(_amount <= erc20data.allowance(_from, msg.sender) &&
           _amount <= erc20data.balanceOf(_from));
        _;        
    }

/* Funtions Public */

    
    constructor (
        Able _contrl,
        string _tokenName,
        string _tokenSymbol,
        uint8 _decimalUnits,
        address _parentToken,
        uint _parentSnapShotBlock
    ) {
        erc20data.init(
            _contrl,
            _tokenName,
            _tokenSymbol,
            _decimalUnits,
            _parentToken,
            _parentSnapShotBlock
            );
        }

    // Returns token name
    // function name() public view returns(string);

    // Returns token symbol
    // function symbol() public view returns(string);

    // Returns decimal places designated for unit of token.
    // function decimalPlaces() public returns(uint);

    function totalSupply() constant returns (uint) {
        // return erc20data.totalSupply();
        return erc20data.totalSupplyAt(block.number);
        }

    function balanceOf(address _who) constant returns (uint) {
        // return erc20data.balanceOf(_who);
        return erc20data.balanceOfAt(_who, block.number);
        }

    function allowance(address _owner, address _spender) constant returns (uint) {
        return erc20data.allowance(_owner, _spender);
        }

    function transfer(address to, uint value) returns (bool ok) {
        return erc20data.transfer(to, value);
        }

    function transferFrom(address from, address to, uint value) returns (bool ok) {
        return erc20data.transferFrom(from, to, value);
        }

    function approve(address spender, uint value) returns (bool ok) {
        return erc20data.approve(spender, value);
        }
/* End of Contract ERC20 */
}
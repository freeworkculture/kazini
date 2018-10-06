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

/// @dev The token controller contract must implement these functions
interface TokenController {
    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @param _owner The address that sent the ether to create tokens
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address _owner) external payable returns(bool);

    /// @notice Notifies the controller about a token transfer allowing the
    ///  controller to react if desired
    /// @param _from The origin of the transfer
    /// @param _to The destination of the transfer
    /// @param _amount The amount of the transfer
    /// @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) external returns(bool);

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @param _owner The address that calls `approve()`
    /// @param _spender The spender in the `approve()` call
    /// @param _amount The amount in the `approve()` call
    /// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount) external
        returns(bool);
/* End of Interface TokenController */
}

contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 _amount, address _token, bytes _data) public;
/* End of Interface ApproveAndCallFallBack */
}

/**
* @title ERC20 interface
* @dev see https://github.com/ethereum/EIPs/issues/20
*/
interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender)
    external view returns (uint256);

    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value)
    external returns (bool);

    function transferFrom(address from, address to, uint256 value)
    external returns (bool);

    function totalSupplyAt(uint _blockNumber) external view returns(uint);

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
/* End of Interface IERC20 */
}

// ERC20 Standard Token Interface with safe maths and reentry protection
library ERC20Lib {
    
    using SafeMathLib for uint;

/* Events */

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

/* Structs */

    struct STORAGE {
        mapping (address => uint) balances;
        mapping (address => mapping (address => uint)) allowed;
        // uint totalSupply;

    string name;                //The Token's name: e.g. DigixDAO Tokens
    uint8 decimals;             //Number of decimals of the smallest unit
    string symbol;              //An identifier: e.g. REP

    // `parentToken` is the Token address that was cloned to produce this token;
    //  it will be 0x0 for a token that was not cloned
    IERC20 parentToken;

    // `parentSnapShotBlock` is the block number from the Parent Token that was
    //  used to determine the initial distribution of the Clone Token
    uint parentSnapShotBlock;

    // `creationBlock` is the block number that the Clone Token was created
    uint creationBlock;

    // `balances` is the map that tracks the balance of each address, in this
    //  contract when the balance changes the block number that the change
    //  occurred is also included in the map
    mapping (address => Checkpoint[]) balances2;

    // `allowed` tracks any extra transfer rights as in all ERC20 tokens
    mapping (address => mapping (address => uint256)) allowed2;

    // Tracks the history of the `totalSupply` of the token
    Checkpoint[] totalSupplyHistory;

    // Flag that determines if the token is transferable or not.
    bool transfersEnabled;

    // The factory used to create new clone tokens
    // MiniMeTokenFactory tokenFactory;


        } struct  Checkpoint {

            // `fromBlock` is the block number that the value was generated from
            uint128 fromBlock;

            // `value` is the amount of tokens at a specific block number
            uint128 value;
            }

/* Constants */

/* State Valiables */

/* Modifiers */

/* Function Abstracts */

    function init(STORAGE storage self, uint _initial_supply) {
        // self.totalSupply = _initial_supply;
        self.balances[msg.sender] = _initial_supply;
        }

    // Get the total token supply
    // function totalSupply() public view returns (uint);
    // function totalSupply(STORAGE storage self) returns (uint value) {
    //     return self.totalSupply;
    // }

    function balanceOf(STORAGE storage self, address _owner) constant returns (uint balance) {
        return self.balances[_owner];
        }

    // Send _value amount of tokens to address _to
    // function transfer(address _to, uint256 _value) public returns (bool success);
    function transfer(STORAGE storage self, address _to, uint _value) returns (bool success) {
        self.balances[msg.sender] = self.balances[msg.sender].sub(_value);
        self.balances[_to] = self.balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
        }

    // Send _value amount of tokens from address _from to address _to
    // function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function transferFrom(STORAGE storage self, address _from, address _to, uint _value) returns (bool success) {
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
    function approve(STORAGE storage self, address _spender, uint _value) returns (bool success) {
        self.allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
        }

    /// @dev This function makes it easy to get the total number of tokens
    /// @return The total number of tokens
    function totalSupply(STORAGE storage self) public constant returns (uint) {
        return totalSupplyAt(self, block.number);
    }

    /// @notice Total amount of tokens at a specific `_blockNumber`.
    /// @param _blockNumber The block number when the totalSupply is queried
    /// @return The total amount of tokens at `_blockNumber`
    function totalSupplyAt(STORAGE storage self, uint _blockNumber) public constant returns(uint) {

        // These next few lines are used when the totalSupply of the token is
        //  requested before a check point was ever created for this token, it
        //  requires that the `parentToken.totalSupplyAt` be queried at the
        //  genesis block for this token as that contains totalSupply of this
        //  token at this block number.
        if ((self.totalSupplyHistory.length == 0)
            || (self.totalSupplyHistory[0].fromBlock > _blockNumber)) {
            if (address(self.parentToken) != 0) {
                return self.parentToken.totalSupplyAt(_blockNumber.min(self.parentSnapShotBlock));
            } else {
                return 0;
            }

        // This will return the expected totalSupply during normal situations
        } else {
            return getValueAt(self.totalSupplyHistory, _blockNumber);
        }
    }


    // Returns the allowable transfer of tokens by a proxy
    // function allowance (address tokenHolders, address proxy, uint allowance) public view returns (uint);
    function allowance(STORAGE storage self, address _owner, address _spender) constant returns (uint remaining) {
        return self.allowed[_owner][_spender];
        }

////////////////
// Internal helper functions
////////////////


    /// @dev `getValueAt` retrieves the number of tokens at a given block number
    /// @param checkpoints The history of values being queried
    /// @param _block The block number to retrieve the value at
    /// @return The number of tokens being queried
    function getValueAt(Checkpoint[] storage checkpoints, uint _block
    ) constant internal returns (uint) {
        if (checkpoints.length == 0) return 0;

        // Shortcut for the actual value
        if (_block >= checkpoints[checkpoints.length-1].fromBlock)
            return checkpoints[checkpoints.length-1].value;
        if (_block < checkpoints[0].fromBlock) return 0;

        // Binary search of the value in the array
        uint min = 0;
        uint max = checkpoints.length-1;
        while (max > min) {
            uint mid = (max + min + 1)/ 2;
            if (checkpoints[mid].fromBlock<=_block) {
                min = mid;
            } else {
                max = mid-1;
            }
        }
        return checkpoints[min].value;
    }

    /// @dev `updateValueAtNow` used to update the `balances` map and the
    ///  `totalSupplyHistory`
    /// @param checkpoints The history of data being updated
    /// @param _value The new number of tokens
    function updateValueAtNow(Checkpoint[] storage checkpoints, uint _value
    ) internal  {
        if ((checkpoints.length == 0)
        || (checkpoints[checkpoints.length -1].fromBlock < block.number)) {
               Checkpoint storage newCheckPoint = checkpoints[ checkpoints.length++ ];
               newCheckPoint.fromBlock =  uint128(block.number);
               newCheckPoint.value = uint128(_value);
           } else {
               Checkpoint storage oldCheckPoint = checkpoints[checkpoints.length-1];
               oldCheckPoint.value = uint128(_value);
           }
    }
}
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

    function allowance(address owner, address spender) external view 
        returns (uint256);

    function transfer(address to, uint256 value) external 
        returns (bool);

    function approve(address spender, uint256 value) external 
        returns (bool);

    function transferFrom(address from, address to, uint256 value) external 
        returns (bool);

    function totalSupplyAt(uint _blockNumber) external view returns(uint);

    function balanceOfAt(address _owner, uint _blockNumber) external view
        returns (uint);

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

    using AddressLib for address;

/* Events */

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

/* Structs */

    struct STORAGE {
        // mapping (address => uint) balances;
        // mapping (address => mapping (address => uint)) allowed;
        // // uint totalSupply;

        string name;                //The Token's name: e.g. DigixDAO Tokens
        string symbol;              //An identifier: e.g. REP
        uint8 decimals;             //Number of decimals of the smallest unit

        // `parentToken` is the Token address that was cloned to produce this token;
        //  it will be 0x0 for a token that was not cloned
        address parentToken;

        // `parentSnapShotBlock` is the block number from the Parent Token that was
        //  used to determine the initial distribution of the Clone Token
        uint parentSnapShotBlock;

        // `creationBlock` is the block number that the Clone Token was created
        uint creationBlock;

        // `balances` is the map that tracks the balance of each address, in this
        //  contract when the balance changes the block number that the change
        //  occurred is also included in the map
        mapping (address => Checkpoint[]) balances;

        // `allowed` tracks any extra transfer rights as in all ERC20 tokens
        mapping (address => mapping (address => uint256)) allowed;

        // Tracks the history of the `totalSupply` of the token
        Checkpoint[] totalSupplyHistory;

        // Flag that determines if the token is transferable or not.
        bool transfersEnabled;

        // The factory used to create new clone tokens
        // ERC20Factory tokenFactory;

        // The controller used to create new clone tokens
        Able contrl;

        /**
        * @title TokenTimelock
        * @dev TokenTimelock is a token holder contract that will allow a
        * beneficiary to extract the tokens after a given release time
        */
        // contract TokenTimelock {
        // using SafeERC20 for IERC20;

        // // ERC20 basic token contract being held
        // IERC20 private _token;

        // timestamp when token release is enabled
        // && beneficiary of tokens after they are released
        mapping (address => mapping (bool => uint256)) vestedToken;

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

    function init(
        STORAGE storage self, 
        Able _contrl,
        string _tokenName,
        string _tokenSymbol,
        uint8 _decimalUnits,
        address _parentToken,
        uint _parentSnapShotBlock
        ) {
            self.contrl = _contrl;
            self.name = _tokenName;                                 // Set the name
            self.symbol = _tokenSymbol;                             // Set the symbol
            self.decimals = _decimalUnits;                          // Set the decimals
            self.parentToken = _parentToken;
            self.parentSnapShotBlock = _parentSnapShotBlock;
            self.creationBlock = block.number;
        }


////////////////
// ERC20 Methods
////////////////

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
                return IERC20(self.parentToken).totalSupplyAt(_blockNumber.min(self.parentSnapShotBlock));
            } else {
                return 0;
            }

        // This will return the expected totalSupply during normal situations
        } else {
            return getValueAt(self.totalSupplyHistory, _blockNumber);
        }
    }

    // /// @param _owner The address that's balance is being requested
    // /// @return The balance of `_owner` at the current block
    // function balanceOf(STORAGE storage self, address _owner) public constant returns (uint256 balance) {
    //     return balanceOfAt(_owner, block.number);
    // }
    
    /// @dev Queries the balance of `_owner` at a specific `_blockNumber`
    /// @param _owner The address from which the balance will be retrieved
    /// @param _blockNumber The block number when the balance is queried
    /// @return The balance at `_blockNumber`
    function balanceOfAt(STORAGE storage self, address _owner, uint _blockNumber) public view
        returns (uint) {

        // These next few lines are used when the balance of the token is
        //  requested before a check point was ever created for this token, it
        //  requires that the `parentToken.balanceOfAt` be queried at the
        //  genesis block for that token as this contains initial balance of
        //  this token
        if ((self.balances[_owner].length == 0)
            || (self.balances[_owner][0].fromBlock > _blockNumber)) {
            if (address(self.parentToken) != 0) {
                return IERC20(self.parentToken).balanceOfAt(_owner, _blockNumber.min(self.parentSnapShotBlock));
            } else {
                // Has no parent
                return 0;
            }

        // This will return the expected balance during normal situations
        } else {
            return getValueAt(self.balances[_owner], _blockNumber);
        }
    }

    /// @notice Send `_amount` tokens to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _amount The amount of tokens to be transferred
    /// @return Whether the transfer was successful or not
    function transfer(STORAGE storage self, address _to, uint256 _amount) public returns (bool success) {
        require(self.transfersEnabled);
        doTransfer(self, msg.sender, _to, _amount);
        return true;
    }

    /// @notice Send `_amount` tokens to `_to` from `_from` on the condition it
    ///  is approved by `_from`
    /// @param _from The address holding the tokens being transferred
    /// @param _to The address of the recipient
    /// @param _amount The amount of tokens to be transferred
    /// @return True if the transfer was successful
    function transferFrom(STORAGE storage self, address _from, address _to, uint256 _amount
    ) public returns (bool success) {

        // The controller of this contract can move tokens around at will,
        //  this is important to recognize! Confirm that you trust the
        //  controller of this contract, which in most situations should be
        //  another open source smart contract or 0x0
        if (msg.sender != Able(self.contrl).controller()) {
            require(self.transfersEnabled);

            // The standard ERC 20 transferFrom functionality
            require(self.allowed[_from][msg.sender] >= _amount);
            self.allowed[_from][msg.sender] -= _amount;
        }
        doTransfer(self, _from, _to, _amount);
        return true;
    }

    /// @dev This is the actual transfer function in the token contract, it can
    ///  only be called by other functions in this contract.
    /// @param _from The address holding the tokens being transferred
    /// @param _to The address of the recipient
    /// @param _amount The amount of tokens to be transferred
    /// @return True if the transfer was successful
    function doTransfer(STORAGE storage self, address _from, address _to, uint _amount
    ) {

           if (_amount == 0) {
               emit Transfer(_from, _to, _amount);    // Follow the spec to lounch the event when transfer 0
               return;
           }
           
           require(self.parentSnapShotBlock < block.number);

           // Do not allow transfer to 0x0 or the token contract itself
           require((_to != 0) && (_to != address(this)));

           // Check if the account is vested
           require (self.vestedToken[_from][true] >= _amount);

           // If the amount being transfered is more than the balance of the
           //  account the transfer throws
           uint256 previousBalanceFrom = balanceOfAt(self, _from, block.number);

           require(previousBalanceFrom >= _amount);

           // Alerts the token controller of the transfer
           if (Able(self.contrl).controller().isContract()) {
               require(TokenController(Able(self.contrl).controller()).onTransfer(_from, _to, _amount));
           }

           // First update the balance array with the new value for the address
           //  sending the tokens
           updateValueAtNow(self.balances[_from], previousBalanceFrom - _amount);

           // Then update the balance array with the new value for the address
           //  receiving the tokens
           uint256 previousBalanceTo = balanceOfAt(self, _to, block.number);
           require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow
           updateValueAtNow(self.balances[_to], previousBalanceTo + _amount);

           // An event to make the transfer easy to find on the blockchain
           emit Transfer(_from, _to, _amount);

    }

    /// @notice `msg.sender` approves `_spender` to spend `_amount` tokens on
    ///  its behalf. This is a modified version of the ERC20 approve function
    ///  to be a little bit safer
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _amount The amount of tokens to be approved for transfer
    /// @return True if the approval was successful
    function approve(STORAGE storage self, address _spender, uint256 _amount) public returns (bool success) {
        require(self.transfersEnabled);

        // To change the approve amount you first have to reduce the addresses`
        //  allowance to zero by calling `approve(_spender,0)` if it is not
        //  already 0 to mitigate the race condition described here:
        //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
        require((_amount == 0) || (self.allowed[msg.sender][_spender] == 0));

        // Alerts the token controller of the approve function call
        if (Able(self.contrl).controller().isContract()) {
            require(TokenController(Able(self.contrl).controller()).onApprove(msg.sender, _spender, _amount));
        }

        self.allowed[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    /// @dev This function makes it easy to read the `allowed[]` map
    /// @param _owner The address of the account that owns the token
    /// @param _spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens of _owner that _spender is allowed
    ///  to spend
    function allowance(STORAGE storage self, address _owner, address _spender
    ) public constant returns (uint256 remaining) {
        return self.allowed[_owner][_spender];
    }

///////////////////
// ERC20 Methods Extensions
///////////////////

    /// @notice `msg.sender` approves `_spender` to send `_amount` tokens on
    ///  its behalf, and then a function is triggered in the contract that is
    ///  being approved, `_spender`. This allows users to use their tokens to
    ///  interact with contracts in one function call instead of two
    /// @param _spender The address of the contract able to transfer the tokens
    /// @param _amount The amount of tokens to be approved for transfer
    /// @return True if the function call was successful
    function approveAndCall(STORAGE storage self, address _spender, uint256 _amount, bytes _extraData
    ) public returns (bool success) {
        require(approve(self, _spender, _amount));

        ApproveAndCallFallBack(_spender).receiveApproval(
            msg.sender,
            _amount,
            this,
            _extraData
        );

        return true;
    }

    // /// @dev This function makes it easy to get the total number of tokens
    // /// @return The total number of tokens
    // function totalSupply(STORAGE storage self) public constant returns (uint) {
    //     return totalSupplyAt(block.number);
    // }


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

    /**
    * @title TokenTimelock
    * @dev TokenTimelock is a token holder contract that will allow a
    * beneficiary to extract the tokens after a given release time
    */
    /**
    * @return Returns amount of tokens held by timelock to beneficiarys.
    */
    function vested(STORAGE storage self, address _address) public view returns(uint, uint) {
        return (self.vestedToken[_address][true], self.vestedToken[_address][false]);
        }

    /**
    * @notice Vest and unvest additional tokens .
    * @return The amount of cleared and uncleared effects.
    */
    function vest(STORAGE storage self, address _address,uint256 _amount) public returns(uint256) {
        return self.vestedToken[_address][false] += _amount;
        }

    function unvest(STORAGE storage self, address _address, uint256 _amount) public returns(uint256) {
        require ((self.vestedToken[_address][false] -= _amount) > 0);
        return self.vestedToken[_address][true] += _amount;
        }

    // /**
    // * @notice Transfers tokens held by timelock to beneficiary.
    // */
    // function release() public {
    //     // solium-disable-next-line security/no-block-members
    //     require(block.timestamp >= _releaseTime);

    //     uint256 amount = _token.balanceOf(address(this));
    //     require(amount > 0);

    //     _token.safeTransfer(_beneficiary, amount);
    //     }
}
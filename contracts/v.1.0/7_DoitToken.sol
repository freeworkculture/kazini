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

pragma solidity ^0.4.25;

import "./1_Kernel.sol";
import "./2_OS_Library.sol";
// import "./3_ERC20_Library.sol";
import "./4_ERC20_Interface.sol";


// /// @dev `Owned` is a base level contract that assigns an `owner` that can be
// ///  later changed
// contract Owned {
//     /// @dev `owner` is the only address that can call a function with this
//     /// modifier
//     modifier onlyOwner { require (msg.sender == owner); _; }

//     address public owner;

//     /// @notice The Constructor assigns the message sender to be `owner`
//     function Owned() { owner = msg.sender;}

//     /// @notice `owner` can step down and assign some other address to this role
//     /// @param _newOwner The address of the new owner. 0x0 can be used to create
//     ///  an unowned neutral vault, however that cannot be undone
//     function changeOwner(address _newOwner) onlyOwner {
//         owner = _newOwner;
//     }
// }


/// @dev This is designed to control the issuance of a MiniMe Token for a
///  non-profit Campaign. This contract effectively dictates the terms of the
///  funding round.

contract Campaign is TokenController, BaseController {

/* Using */

    using ERC20Lib for ERC20Lib.STORAGE;

    using ERC20Lib for ERC20Lib.Checkpoint[];

/* Events */

    event ClaimedTokens(address indexed _token, address indexed _controller, uint _amount);
    event Transfer(address indexed _from, address indexed _to, uint256 _amount);
    event NewCloneToken(address indexed _cloneToken, uint _snapshotBlock);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _amount
        );
    event ChangeToken(address indexed _previous, address indexed _current);

/* Structs */

/* Constants */

/* State Valiables */

    ERC20Lib.STORAGE erc20Data;

    Able controller;

    // The factory used to create new clone tokens
    ERC20Factory tokenFactory;

/* Modifiers */


    uint public startFundingTime;       // In UNIX Time Format
    uint public endFundingTime;         // In UNIX Time Format
    uint public maximumFunding;         // In wei
    uint public totalCollected;         // In wei
    ERC20 public tokenContract;   // The new token for this Campaign
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

    constructor (
        uint _startFundingTime,
        uint _endFundingTime,
        uint _maximumFunding,
        address _vaultAddress,
        address _tokenAddress

    ) {
        require ((_endFundingTime >= now) &&           // Cannot end in the past
            (_endFundingTime > _startFundingTime) &&
            (_maximumFunding <= 10000 ether) &&        // The Beta is limited
            (_vaultAddress != 0));                    // To prevent burning ETH
        startFundingTime = _startFundingTime;
        endFundingTime = _endFundingTime;
        maximumFunding = _maximumFunding;
        tokenContract = ERC20(_tokenAddress);// The Deployed Token Contract
        vaultAddress = _vaultAddress;
    }

/// @dev The fallback function is called when ether is sent to the contract, it
/// simply calls `doPayment()` with the address that sent the ether as the
/// `_owner`. Payable is a required solidity modifier for functions to receive
/// ether, without this modifier functions will throw if ether is sent to them

    function ()  payable {
        doPayment(msg.sender);
    }

/////////////////
// TokenController Access
/////////////////

    function changeToken(ERC20 _tokenAddress) public onlyController {
        emit ChangeToken(address(tokenContract), address(_tokenAddress));
        tokenContract = _tokenAddress;// The Deployed Token Contract
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

////////////////
// Query balance and totalSupply in History
////////////////

    function totalSupply(uint _blockNumber) constant returns (uint) {
        // return erc20Data.totalSupply();
        return erc20Data.totalSupplyAt(_blockNumber);
        }

    function balanceOf(address _who, uint _blockNumber) constant returns (uint) {
        // return erc20Data.balanceOf(_who);
        return erc20Data.balanceOfAt(_who, _blockNumber);
        }

////////////////
// Generate and destroy tokens
////////////////

    /// @notice Generates `_amount` tokens that are assigned to `_owner`
    /// @param _owner The address that will be assigned the new tokens
    /// @param _amount The quantity of tokens generated
    /// @return True if the tokens are generated correctly
    function generateTokens(address _owner, uint _amount
    ) public onlyController returns (bool) {
        uint curTotalSupply = erc20Data.totalSupplyAt(block.number);
        require(curTotalSupply + _amount >= curTotalSupply); // Check for overflow
        uint previousBalanceTo = erc20Data.balanceOfAt(_owner, block.number);
        require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow
        erc20Data.totalSupplyHistory.updateValueAtNow(curTotalSupply + _amount);
        erc20Data.balances[_owner].updateValueAtNow(previousBalanceTo + _amount);
        emit Transfer(0, _owner, _amount);
        return true;
    }


    /// @notice Burns `_amount` tokens from `_owner`
    /// @param _owner The address that will lose the tokens
    /// @param _amount The quantity of tokens to burn
    /// @return True if the tokens are burned correctly
    function destroyTokens(address _owner, uint _amount
    ) onlyController public returns (bool) {
        uint curTotalSupply = erc20Data.totalSupplyAt(block.number);
        require(curTotalSupply >= _amount);
        uint previousBalanceFrom = erc20Data.balanceOfAt(_owner, block.number);
        require(previousBalanceFrom >= _amount);
        erc20Data.totalSupplyHistory.updateValueAtNow(curTotalSupply - _amount);
        erc20Data.balances[_owner].updateValueAtNow(previousBalanceFrom - _amount);
        emit Transfer(_owner, 0, _amount);
        return true;
    }

/// @dev `doPayment()` is an internal function that sends the ether that this
///  contract receives to the `vault` and creates tokens in the address of the
///  `_owner` assuming the Campaign is still accepting funds
/// @param _owner The address that will hold the newly created tokens

    function doPayment(address _owner) internal {

// First check that the Campaign is allowed to receive this donation
        require ((now >= startFundingTime) &&
            (now <= endFundingTime) &&
            (tokenContract.controller() != 0) &&           // Extra check
            (msg.value != 0) &&
            (totalCollected + msg.value <= maximumFunding));

//Track how much the Campaign has collected
        totalCollected += msg.value;

//Send the ether to the vault
        require (vaultAddress.send(msg.value));

// Creates an equal amount of tokens as ether sent. The new tokens are created
//  in the `_owner` address
        require (generateTokens(_owner, msg.value));

        return;
    }

/// @notice `finalizeFunding()` ends the Campaign by calling setting the
///  controller to 0, thereby ending the issuance of new tokens and stopping the
///  Campaign from receiving more ether
/// @dev `finalizeFunding()` can only be called after the end of the funding period.

    function finalizeFunding(bytes32 _sig) {
        require(now >= endFundingTime);
        controller.changeController(_sig);
    }


/// @notice `onlyOwner` changes the location that ether is sent
/// @param _newVaultAddress The address that will receive the ether sent to this
///  Campaign
    function setVault(address _newVaultAddress) onlyOwner {
        vaultAddress = _newVaultAddress;
    }

//////////
// Safety Methods
//////////

    /// @notice This method can be used by the controller to extract mistakenly
    ///  sent tokens to this contract.
    /// @param _token The address of the token contract that you want to recover
    ///  set to 0 in case you want to extract ether.
    function claimTokens(address _token) public onlyController {
        if (_token == 0x0) {
            address(controller).transfer(address(this).balance);
            return;
        }

        ERC20 token = ERC20(_token);
        uint balance = token.balanceOf(this);
        token.transfer(controller, balance);
        emit ClaimedTokens(_token, controller, balance);
    }

////////////////
// Enable tokens transfers
////////////////


    /// @notice Enables token holders to transfer their tokens freely if true
    /// @param _transfersEnabled True if transfers are allowed in the clone
    function enableTransfers(bool _transfersEnabled) public onlyController {
        erc20Data.transfersEnabled = _transfersEnabled;
    }

////////////////
// Clone Token Method
////////////////

    /// @notice Creates a new clone token with the initial distribution being
    ///  this token at `_snapshotBlock`
    /// @param _cloneTokenName Name of the clone token
    /// @param _cloneDecimalUnits Number of decimals of the smallest unit
    /// @param _cloneTokenSymbol Symbol of the clone token
    /// @param _snapshotBlock Block when the distribution of the parent token is
    ///  copied to set the initial distribution of the new clone token;
    ///  if the block is zero than the actual block, the current block is used
    /// @param _transfersEnabled True if transfers are allowed in the clone
    /// @return The address of the new MiniMeToken Contract
    function createCloneToken(
        Able _contrl,
        string _cloneTokenName,
        string _cloneTokenSymbol,
        uint8 _cloneDecimalUnits,
        uint _snapshotBlock,
        bool _transfersEnabled
        ) public returns(address) {
        if (_snapshotBlock == 0) _snapshotBlock = block.number;
        ERC20 cloneToken = tokenFactory.createCloneToken(
            _contrl,
            _cloneTokenName,
            _cloneTokenSymbol,
            _cloneDecimalUnits,
            this,
            _snapshotBlock
            );
        // REVISIT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // cloneToken.setController();
        changeToken(cloneToken);

        // An event to make the token easy to find on the blockchain
        emit NewCloneToken(address(cloneToken), _snapshotBlock);
        return address(cloneToken);
    }

    /**
    * @title TokenTimelock
    * @dev TokenTimelock is a token holder contract that will allow a
    * beneficiary to extract the tokens after a given release time
    */
    /**
    * @return the token being held.
    */
    function vested(address _address) public view returns(uint, uint) {
        return erc20Data.vested(_address);
        }

    // /**
    // * @return the beneficiary of the tokens.
    // */
    // function beneficiary() public view returns(address) {
    //     return _beneficiary;
    //     }

    // /**
    // * @return the time when the tokens are released.
    // */
    // function releaseTime() public view returns(uint256) {
    //     return _releaseTime;
    //     }

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
/* End of Contract DoitToken */
}

////////////////
// MiniMeTokenFactory
////////////////

/// @dev This contract is used to generate clone contracts from a contract.
///  In solidity this is the way to create a contract from a contract of the
///  same class
contract ERC20Factory {

    /// @notice Update the DApp by creating a new token with new functionalities
    ///  the msg.sender becomes the controller of this clone token
    /// @param _parentToken Address of the token being cloned
    /// @param _snapshotBlock Block of the parent token that will
    ///  determine the initial distribution of the clone token
    /// @param _tokenName Name of the new token
    /// @param _decimalUnits Number of decimals of the new token
    /// @param _tokenSymbol Token Symbol for the new token
    /// @param _transfersEnabled If true, tokens will be able to be transferred
    /// @return The address of the new token contract
    function createCloneToken(
        Able _contrl,
        string _tokenName,
        string _tokenSymbol,
        uint8 _decimalUnits,
        address _parentToken,
        uint _snapshotBlock

        // bool _transfersEnabled
        ) public returns (ERC20) {
            ERC20 newToken = new ERC20(
                _contrl,
                _tokenName,
                _tokenSymbol,
                _decimalUnits,
                _parentToken,
                _snapshotBlock
                // _transfersEnabled
                );
        // REVISIT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // newToken.changeController(msg.sender);
        return newToken;
    }
}
/*
    
    FreeWork Culture version 1.0.0

    Copyright (c) 2017, iamnot@kazini.work
    !!! <TODO>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version. You should have received a copy 
    of the GNU General Public License along with this program.  If not, 
    see <http://www.gnu.org/licenses/>.
    
    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES 
    WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF 
    MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR 
    ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES 
    WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN 
    ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF 
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

    Third-party software credits
    Some of the components included in DOIT Token Dapp are licensed under 
    free or open source licenses. We wish to thank the contributors to those projects.

    Peana is a peer-to-anywhere bridge protocol!
 */

///////////////////
// Include Libraries and Modules
///////////////////
pragma solidity ^0.4.19;

/// @title Peana Contract
/// @author I am Not.
/// @dev This token contract's goal is to make it easy for anyone to clone this
///  _token using the token distribution at a given block, this will allow DAO's
///  and DApps to upgrade their features in a decentralized manner without
///  affecting the original token
/// @dev It is ERC20 compliant, but still needs to under go further testing.

contract Peana {
/* Constant */
/* State Variables */
/* Events */
/* Modifiers */

    event LogNewDoer(address indexed DoerFactory, bytes4 functionSelector, bytes32 indexed logSignature, address newDoer, bytes SomeDoer);
    event LogInitAgent(address indexed UserBase, bytes4 functionSelector, bytes32 indexed logSignature, address agent, bytes32 keyXOR, bytes Agent);
    event LogSetDoer(address indexed Doer, bytes4 functionSelector, bytes32 indexed logSignature, address from, bytes32 keyXOR, bytes callData);
    event LogSetKey(address indexed Doer, bytes4 functionSelector, bytes32 indexed logSignature, address Signer, address Signee, bytes32 keyXOR, bytes callData);
    event LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    event LogCuratePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address curator, bytes callData);
    event LogCompilePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address doer, bytes callData);
    event LogFulfillPlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address doer, address receiver, address witness0, address witness1, bytes callData);
    event LogVerifyPlan(address indexed Kazini, bytes4 functionSelector, bytes indexed logSignature, address prover, address verifier, address witness0, address witness1, bytes callData);
    

    



/* Functions */

    function() {
        address origin;
        address sender = msg.sender;
        address receiver;
        bytes callData = msg.data;
        bytes4 functionSelector = callData;
        bytes32 logSignature;
        execute(callData);
        
    }

    // keccak256("Deposit(address,hash256,uint256)")
    // event Deposit(
    //     address indexed _from,
    //     bytes32 indexed _id,
    //     uint _value
    // );
    // emit Deposit(msg.sender, _id, msg.value);
    // log3(
    //         bytes32(msg.value),
    //         bytes32(0x50cb9fe53daa9737b786ab3646f04d0150dc50ef4e75f59509d83667ad5adb20),
    //         bytes32(msg.sender),
    //         _id
    //     );

    function execute(bytes32) {
        if(logSignature == keccak256("LogNewDoer(address,hash32,hash256,address,hash256)"))
        LogNewDoer(address indexed DoerFactory, bytes4 functionSelector, bytes32 indexed logSignature, address newDoer, bytes SomeDoer);

    } else if (logSignature == keccak256("LogInitAgent(address,hash32,hash256,address,hash256,hash256)")) {
        LogInitAgent(address indexed UserBase, bytes4 functionSelector, bytes32 indexed logSignature, address agent, bytes32 keyXOR, bytes Agent);
   
    } else if (logSignature == keccak256("LogSetDoer(address,hash32,hash256,address,hash256,hash256)")) {
         LogSetDoer(address indexed Doer, bytes4 functionSelector, bytes32 indexed logSignature, address from, bytes32 keyXOR, bytes callData);
   
    } else if (logSignature == keccak256("LogSetKey(address,hash32,hash256,address,address,hash256,hash256)")) {
         LogSetKey(address indexed Doer, bytes4 functionSelector, bytes32 indexed logSignature, address Signer, address Signee, bytes32 keyXOR, bytes callData);
    
    } else if (logSignature == keccak256("LogInitAgent(address,hash32,hash256,address,hash256,hash256)")) {
        LogInitAgent(address indexed UserBase, bytes4 functionSelector, bytes32 indexed logSignature, address agent, bytes32 keyXOR, bytes Agent);
    
    } else if (logSignature == keccak256("updateIndex()")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("iam()")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("getDoer()")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("getBelief(KBase)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("getDesire(bytes1)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("getIntention(bool)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("init()")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("sign(address)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("sign()")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("revoke(address)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("revoke()")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("setbdi(KBase,bytes32,bytes32,bytes32,uint)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("setbdi(uint,uint,uint,uint,uint)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("setbdi(bytes32)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("setbdi(bytes1,Desire)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("setbdi(bool,Intention)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("LogCreatePlan(address,hash32,hash256,address,hash256)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("LogCreatePlan(address,hash32,hash256,address,hash256)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("LogCreatePlan(address,hash32,hash256,address,hash256)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("LogCreatePlan(address,hash32,hash256,address,hash256)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
        
    } else if (logSignature == keccak256("LogCreatePlan(address,hash32,hash256,address,hash256)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("LogCreatePlan(address,hash32,hash256,address,hash256)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("LogCreatePlan(address,hash32,hash256,address,hash256)")) {
        LogCreatePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address creator, bytes callData);
    
    } else if (logSignature == keccak256("LogCuratePlan(address,hash32,hash256,address,hash256)")) {
        LogCuratePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address curator, bytes callData);
    
    } else if (logSignature == keccak256("LogCompilePlan(address,hash32,hash256,address,hash256)")) {
        LogCompilePlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address doer, bytes callData);
   
    } else if (logSignature == keccak256("LogFulfillPlan(address,hash32,hash256,address,address,address,address,hash256)")) {
        LogFulfillPlan(address indexed Kazini, bytes4 functionSelector, bytes32 indexed logSignature, address doer, address receiver, address witness0, address witness1, bytes callData);
  
    } else if (logSignature == keccak256("LogVerifyPlan(address,hash32,hash256,address,address,address,address,hash256)")) {
        LogVerifyPlan(address indexed Kazini, bytes4 functionSelector, bytes indexed logSignature, address prover, address verifier, address witness0, address witness1, bytes callData);
    
    }
/* End of Peana Contract */
}



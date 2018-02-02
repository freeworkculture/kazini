pragma solidity ^0.4.19;
import "./Able.sol";
//pragma experimental ABIEncoderV2;

// Doers is a class library of natural or artificial entities within A multi-agent system (MAS).
// The agents are collectively capable of reaching goals that are difficult to achieve by an 
// individual agent or monolithic system. The class can be added to, modified and reconstructed, 
// without the need for detailed rewriting. 
// The nature of an agent is: 
// An identity structure
// A behaviour method
// A capability model
// 

///////////////////
// Beginning of Contract
///////////////////

contract ControlAbstract {

/// @dev The actual agent contract, the nature of the agent is identified controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract.

	function makeDoer(
		bytes32 _name, 
		bytes32 _fPrint,
        bytes32 _idNumber,
		bytes32 _email,
		bytes32 _fName,
		bytes32 _lName,
        bytes32 _hash,
		bytes32 _tag,
		bytes32 _data,
        int256 _birth,
		bool _active) public returns (Database.SomeDoer);

	function getOwner() constant public returns (address);

	function getCreator(address _address) constant public returns (bool,uint256);

	function setCreator(address _address, bool _active) internal;

	function setMyDoers(address _address, uint _allowed) internal;
	function setDoer(
		bytes32 _fPrint,
		bytes32 _idNumber,
		bytes32 _email,
		bytes32 _fName,
		bytes32 _lName,
		bytes32 _hash,
		bytes32 _tag,
		bytes32 _data,
		int256 _birth,
		bool _active
		) internal returns (Database.SomeDoer);

	function setBDI(Database.Flag _flag, bytes32 _var, bytes32 _avar, bool _bvar, int256 _cvar, Database.State _dvar, uint256 _evar) internal returns (bool);

/////////////////
// Controller interface
/////////////////

/// @dev This is designed to control the issuance and reserve of the Doit Token.
/// This contract effectively dictates the monetary operations policy.
///
/// @dev The token controller contract must implement these functions

    /// @notice Changes the controller of the contract
    /// @param _newController The new controller of the contract
    function changeController(address _newController) public;

    // Add a new contract to the controller. This will overwrite an existing contract.
    function registerContract(bytes32 name, address addr) internal returns (bool);
    
    // /// @notice Called when `_owner` sends ether to the Doit Token contract
    // /// @param _owner The address that sent the ether to create tokens
    // /// @return True if the ether is accepted, false if it throws
    // function proxyPayment(address _owner) public payable returns(bool);

    // /// @notice Notifies the controller about a token transfer allowing the
    // ///  controller to react if desired
    // /// @param _from The origin of the transfer
    // /// @param _to The destination of the transfer
    // /// @param _amount The amount of the transfer
    // /// @return False if the controller does not authorize the transfer
    // function onTransfer(address _from, address _to, uint _amount) public returns(bool);

    // /// @notice Notifies the controller about an approval allowing the
    // ///  controller to react if desired
    // /// @param _owner The address that calls `approve()`
    // /// @param _spender The spender in the `approve()` call
    // /// @param _amount The amount in the `approve()` call
    // /// @return False if the controller does not authorize the approval
    // function onApprove(address _owner, address _spender, uint _amount) public returns(bool);

	function isDoer() constant public returns (bool);

	function getInfo() constant public returns (address,address,bytes32);
	
	function getDoer() view public returns (bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,int256,bool);
	
	function getBelief() view public returns (uint256, bytes32,bytes32,bytes32,bytes32);
	
	function getQualification(bytes32 _level) view public returns (bytes32,bytes32,bytes32);

	function viewDesire(bytes32 _desire) view public returns (bytes32,bool);

	function getDesire(bytes32 _desire) view public returns (Database.Desire);

	function getIntention(bool _check) view public returns (uint256,bytes32,uint256);
	
	function getPromise() internal view returns (address,bytes32,uint,uint,bytes32);

    // enum Flag { 
	// 	experience,e,
	// 	reputation,r,
	// 	talent,t,
	// 	index,i,
	// 	hashB,HB,
	// 	country,c,
	// 	cAuthority,CA,
	// 	score,s,
	// 	hashQ,HQ,
	// 	goal,g,
	// 	statusD,SD,
	// 	statusI,SI,
	// 	service,S,
	// 	payout,p
	// 	}

	function setBDI(
		Database.Flag _flag, 
		bytes32 _goal, 
		bool _intent, bytes32 _var, 
		bool _status, 
		bytes32 _level, 
		Database.State _avar) internal returns (bool);
	
	function setDoer(Database.SomeDoer _aDoer) internal;

	function setBelief(Database.Belief _belief) internal;

	function setQualification(Database.Qualification _qualification) internal;
	
	function setDesire(Database.Desire _goal, bytes32 _desire) internal;

	function setIntention(Database.Intention _service, bool _intention) internal;
	
/// @dev The token controller contract must implement these functions
    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @param _owner The address that sent the ether to create tokens
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address _owner) public payable returns(bool);

    /// @notice Notifies the controller about a token transfer allowing the
    ///  controller to react if desired
    /// @param _from The origin of the transfer
    /// @param _to The destination of the transfer
    /// @param _amount The amount of the transfer
    /// @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) public returns(bool);

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @param _owner The address that calls `approve()`
    /// @param _spender The spender in the `approve()` call
    /// @param _amount The amount in the `approve()` call
    /// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount) public returns(bool);
}


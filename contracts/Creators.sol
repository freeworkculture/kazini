pragma solidity ^0.4.19;

import "./Able.sol";
import "./Doers.sol";

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

contract Creators is Controlled {

/// @dev The actual agent contract, the nature of the agent is identified controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract.

	string public userName;
	address ownAddress;
	
	struct Creator {
		bool active;
		uint256 myDoers;
	}
	mapping(address => Creator) creators;
	
	struct Doer {
		address doer;
		bool active;
	}
	mapping(bytes32 => Doer) doersUuid;
	mapping(address => Doer) doersAddress;
	address[] doersAccts;
	
	uint public doerCount;	// !!! Can I call length of areDoers instead??!!!

	modifier onlyCreator {
		if (!creators[msg.sender].active) 
		revert();
		_;
	}

	modifier onlyDoers {
		if (!doersAddress[msg.sender].active) 
		revert();
		_;
	}

	function Creators(string _name) internal {
		userName = _name;
		ownAddress = msg.sender;
		doerCount = 0;
		creators[msg.sender] = Creator(true, 1);
		
		//addDoer(creator);
		Controlled.registerContract("Creators", this);
	}

	function makeDoer(
		string _name,
		bytes32 _fingerPrint,
		string _email,
		int _age,
		string _fName,
		string _lName,
		bytes32 _idNumber,
        bool _active) onlyCreator public returns (Doers)
        {
			require(creators[msg.sender].myDoers > 0);
			bytes32 uuidCheck = keccak256(_age, _fName, _lName, _idNumber);
			require(!doersUuid[uuidCheck].active);
			address newDoer = new Doers(this, _name, _fingerPrint, _email, _age, _fName, _lName, _idNumber, _active);
			doersUuid[uuidCheck] = Doer(newDoer, true);
			doersAddress[newDoer].active = true;
			doersAccts.push(newDoer);
			creators[msg.sender].myDoers--;
			doerCount++;
			
            }

	function getOwner() constant public returns (address) {
        return ownAddress;
	}

	function getCreator(address _address) constant public returns (bool,uint256) {
        return (creators[_address].active, creators[_address].myDoers);
	}

	function getDoerCount() constant public returns (uint) {
		return doerCount;
	}

	function getDoers() view public returns (address[]) {
		return doersAccts;
	}

	function getPlans() view internal onlyDoers returns (address[]) {
		return doersAccts;
	}

	function isCreator(address _address) constant public returns (bool) {
		return (creators[_address].active);
	}

	function isDoer(address _address) constant public returns (bool) {
		return (doersAddress[_address].active);
	}

	function isDoer(bytes32 _uuid) constant public returns (bool) {
		return (doersUuid[_uuid].active);
	}

	function setCreator(address _address, bool _active) internal onlyController {
		creators[_address] = Creator(_active, 0);
	}

	function setMyDoers(address _address, uint _allowed) internal onlyController {
		creators[_address].myDoers += _allowed;
	}

	//function Creators() {registerContract("Creators", this);}

	// function getCreator() constant public returns (address);

	// function addDoer(address addr) public;

	// function isDoer(address addr) constant public returns (bool);

	// function getDoerCount() constant public returns (uint);
}

// interface SomeDoers {
// 	function Doers(SomeDoer _aDoer) returns (bool);
// 	}
pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;

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

	modifier onlyCreator {
		if (!Controlled.creators[msg.sender].active) 
		revert();
		_;
	}

	modifier onlyDoer {
		if (!Controlled.doersAddress[msg.sender].active) 
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
		bool _active) onlyCreator public returns (Doers) {
			require(creators[msg.sender].myDoers > 0);
			bytes32 uuidCheck = keccak256(_birth, _fName, _lName, _idNumber);
			require(!doersUuid[uuidCheck].active);
			address newDoer = new Doers(this, _name, setDoer(_fPrint,_idNumber,_email,_fName,_lName,_hash,_tag,_data,_birth,_active));
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

	function getPlans() view internal onlyDoer returns (address[]) {
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
		) internal returns (SomeDoer) {
			return SomeDoer({
				fPrint:_fPrint, 
				idNumber:_idNumber, 
				email:_email, 
				fName:_fName, 
				lName:_lName, 
				hash:_hash, 
				tag:_tag, 
				data:_data, 
				birth:_birth, 
				active:_active});
		}

	function setBDI(Flag _flag, bytes32 _var, bytes32 _avar, bool _bvar, int256 _cvar, Agent _dvar, uint256 _evar) internal onlyDoer returns (bool) {
		if ((_flag == Flag.experience) || (_flag == Flag.e)) {
			bdi[msg.sender].beliefs.experience = _cvar;
			return true;
			} else if ((_flag == Flag.reputation) || (_flag == Flag.r)) {
				bdi[msg.sender].beliefs.reputation = _var;
				return true;
			} else if ((_flag == Flag.index) || (_flag == Flag.i)) {
				bdi[msg.sender].beliefs.index = _var;
				return true;
			} else if ((_flag == Flag.hashB) || (_flag == Flag.HB)) {
				bdi[msg.sender].beliefs.hash = _var;
				return true;
			} else if ((_flag == Flag.hashQ) || (_flag == Flag.HQ)) {
				bdi[msg.sender].beliefs.qualification.hash = _var;
				return true;
			} else if ((_flag == Flag.payout) || (_flag == Flag.p)) {
				bdi[msg.sender].intentions[_bvar].payout = _evar;
				return true;
				} else {
					return false;
					}
		}

	function setQualification(Controlled.Qualification _qualification) internal onlyDoer {
		bdi[msg.sender].beliefs.qualification = _qualification;
		}
	
	function setDesire(Controlled.Desire _goal, bytes32 _desire) internal onlyDoer {
		bdi[msg.sender].desires[_desire] = _goal;
		}

	function setIntention(Controlled.Intention _service, bool _intention) internal onlyDoer {
		bdi[msg.sender].intentions[_intention] = _service;
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
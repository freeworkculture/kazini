pragma solidity ^0.4.19;
//pragma experimental ABIEncoderV2;

import "./Able.sol";

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

contract Doers is Controlled {

	address public myCreator;
	address public doer;
	string public userName;

	//uint8 public Belief;
	//struct Desire {bytes32 achievement; bool status;}
	//struct Intention {bytes32 action; bool status;}

///////////////////
/// @dev `SomeDoer` defines the Sovereignty of an agent
///////////////////

	struct SomeDoer {
		bytes32 fPrint;
		string email;
		int birth;
		string fName;
		string lName;
		bytes32 idNumber;
		bool active;	
		}
/// SomeDoer aDoer {hex, string, uint, string, string, true, now}
/// @dev Interp. aDoer {fPrint, email, birth, fName, lName, active, lastUpdate} is an agent with
					// fPrint is PGP Key fingerprint
					// email is PGP key email
					// birth is date of birth in seconds from 1970
					// fName is first name in identity document MRZ
					// lName is last name in identity document MRZ
					// status is dead or alive state of agent
					// lastUpdate is timestamp of last record entry
	SomeDoer public thisDoer;// = SomeDoer(0x4fc6c65443d1b988, "whoiamnottelling", 346896000, "Iam", "Not", false);	

	// function funcForSomeDoer(SomeDoer _aDoer) {
	// 	(...	(_aDoer.fPrint),
	// 			(_aDoer.email),
	// 			(_aDoer.birth),
	// 			(_aDoer.fName),
	// 			(_aDoer.lName),
	// 			(_aDoer.status)
	// 			}
/// Template rules used:
/// - Compound: 6 fields
///			

///////////////////
/// @dev `B-D-I` is the structure that prescribes a strategy model to an actual agent
///////////////////
///////////////////
/// @dev `B-D-I` is the structure that prescribes a strategy model to an actual agent
///////////////////
	
	/// Belief myBelief {hex, int, int8, hex}
	/// @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
					// Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
					// experience is age in seconds
					// reputaion is PGP trust level flag !!! CITE RFC PART
					// talent is user declared string of talents
	//Belief myBelief; // = Belief(myQualification, 1, 0x004, 0x00);
	// function funcForBelief(Belief _aBelief) {
	// 	(...	(_aBelief.myQualification),
	// 			(_aBelief.experience),
	// 			(_aBelief.reputation),
	// 			(_aBelief.talent),
	// 			}
/// Template rules used:
/// - Compound: 4 fields
///				
	//BDI myBDI;
	
	bytes32[] myPromises;
	uint256 promiseCount;

	modifier onlyCreator {
		if (msg.sender != myCreator) 
		revert();
		_;
	}

	modifier onlyDoer {
		if (!thisDoer.active) 
		revert();
		_;
	}
	
	function Doers(
		address _address, 
		string _name, 
		bytes32 _fPrint, 
		string _email, 
		int _birth, 
		string _fName, 
		string _lName,
		bytes32 _idNumber, 
		bool _active) public {
			myCreator = _address;
			doer = tx.origin;
			userName = _name;
			thisDoer.fPrint = _fPrint;
			thisDoer.email = _email;
			thisDoer.birth = _birth;
			thisDoer.fName = _fName;
			thisDoer.lName = _lName;
			thisDoer.idNumber = _idNumber;
			thisDoer.active = _active;
			}

	function getCreator() constant public returns (address) {
		return myCreator;
	}
	
	// function getDoer() view public returns (SomeDoer) {
	// 	return (thisDoer);
    // }
	
	// function getBelief() view public returns (Belief) {
	// 	return (Controlled.bdi[this].beliefs);
    // }

	// function getDesire(bytes32 _desire) view public returns (Desire) {
	// 	return (Controlled.bdi[this].desires[_desire]);
    // }

	// function getIntention(bool _check) view public returns (Intention) {
	// 	return (Controlled.bdi[this].intentions[_check]);
    // }

	function isDoer() constant public returns (bool) {
		if (thisDoer.active) {
			return true;}
			return false;
	}
	
	function getPromise() internal view onlyDoer returns (bytes32[]) {
		return Controlled.Promises[this];
	}

	function getPromise(bytes32 _intention, bytes32 _serviceId) internal view onlyDoer returns (Promise) {
		return Controlled.plans[_intention].service[_serviceId].taskT;
	}

	function setDoer(SomeDoer _aDoer) internal onlyController {
		thisDoer = _aDoer;
	}

	function setBDI(Belief _belief) internal onlyController {
		Controlled.bdi[this].beliefs = _belief;
	}

	function setBDI(bytes32 _desire, Desire _goal) internal onlyController {
		Controlled.bdi[this].desires[_desire] = _goal;
	}

	function setBDI(bool _intention, Intention _service) internal onlyController {
		Controlled.bdi[this].intentions[_intention] = _service;
	}
}

// interface SomeDoers {
// 	function Doers(SomeDoer _aDoer) returns (bool);
// 	}

pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;

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

contract Doers {
	
	address public Controller;
	address public myCreator;
	address public doer;
	bytes32 public userName;

	Controlled.SomeDoer public Me;// = SomeDoer(0x4fc6c65443d1b988, "whoiamnottelling", 346896000, "Iam", "Not", false);		
			
	Controlled.BDI myBDI;
	
	Controlled.Promise public myPromises;
	uint256 promiseCount;

	Controlled.Order[] myOrders;
	uint256 orderCount;

	modifier onlyCreator {
		if (msg.sender != myCreator) 
		revert();
		_;
	}

	modifier onlyDoer {
		if (!Me.active) 
		revert();
		_;
	}
	
	function Doers(
		address _address,
		bytes32 _name,
		Controlled.SomeDoer _adoer
		) public {
			myCreator = _address;
			doer = tx.origin;
			userName = _name;
			setDoer(_adoer);
			}
	
	function isDoer() constant public returns (bool) {
		if (Me.active) {
			return true;}
			return false;
			}

	function getInfo() constant public returns (address,address,bytes32) {
		return (myCreator, doer, userName);
		}
	
	function getDoer() view public returns (bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32,int256,bool) {
		return (Me.fPrint,Me.idNumber,Me.email,Me.fName,Me.lName,Me.hash,Me.tag,Me.data,Me.birth,Me.active);
		}
	
	function getBelief() view public returns (int256, bytes32,bytes32,bytes32,bytes32) {
		return (
			myBDI.beliefs.experience,
			myBDI.beliefs.reputation,
			myBDI.beliefs.talent,
			myBDI.beliefs.index,
			myBDI.beliefs.hash);
		}
	
	function getQualification(bytes32 _level, uint8 _key) view public returns (bytes32,bytes32,bytes32,bytes32) {
		return (
			myBDI.beliefs.qualification.country,
			myBDI.beliefs.qualification.cAuthority,
			myBDI.beliefs.qualification.score,
			myBDI.beliefs.qualification.hash);
		}

	function viewDesire(bytes32 _desire) view public returns (bytes32,bool) {
		return (
			myBDI.desires[_desire].goal,
			myBDI.desires[_desire].status);
			}

	function getDesire(bytes32 _desire) view public returns (Controlled.Desire) {
		return myBDI.desires[_desire];
			}		

	function getIntention(bool _check) view public returns (Controlled.Agent,bytes32,uint256) {
		return (
			myBDI.intentions[_check].status,
			myBDI.intentions[_check].service,
			myBDI.intentions[_check].payout);
			}
	
	function getPromise() internal view onlyDoer returns (address,bytes32,uint,uint,bytes32) {
		return (myPromises.doer, myPromises.thing, myPromises.timeAlt, myPromises.value, myPromises.hash);
	}

		function setBDI(Controlled.Flag _flag, bytes32 _goal, bool _intent, bytes32 _var, bool _status, Controlled.Agent _avar) internal onlyDoer returns (bool) {
		if ((_flag == Controlled.Flag.talent) || (_flag == Controlled.Flag.t)) {
				myBDI.beliefs.talent = _var;
				return true;
			} else if ((_flag == Controlled.Flag.country) || (_flag == Controlled.Flag.c)) {
				myBDI.beliefs.qualification.country = _var;
				return true;
			} else if ((_flag == Controlled.Flag.cAuthority) || (_flag == Controlled.Flag.CA)) {
				myBDI.beliefs.qualification.cAuthority = _var;
				return true;
			} else if ((_flag == Controlled.Flag.score) || (_flag == Controlled.Flag.s)) {
				myBDI.beliefs.qualification.score = _var;
				return true;
			} else if ((_flag == Controlled.Flag.goal) || (_flag == Controlled.Flag.g)) {
				myBDI.desires[_goal].goal = _var;
				return true;
			} else if ((_flag == Controlled.Flag.statusD) || (_flag == Controlled.Flag.SD)) {
				myBDI.desires[_goal].status = _status;
				return true;
			} else if ((_flag == Controlled.Flag.statusI) || (_flag == Controlled.Flag.SI)) {
				myBDI.intentions[_intent].status = _avar;
				return true;
			} else if ((_flag == Controlled.Flag.service) || (_flag == Controlled.Flag.S)) {
				myBDI.intentions[_intent].service = _var;
				return true;
				} else {
					return false;
					}
		}
	
	function setDoer(Controlled.SomeDoer _aDoer) internal onlyCreator {
		Me = _aDoer;
	}

	function setBelief(Controlled.Belief _belief) internal onlyDoer {
		myBDI.beliefs = _belief;
	}

	function setQualification(Controlled.Qualification _qualification) internal onlyDoer {
		myBDI.beliefs.qualification = _qualification;
	}
	
	function setDesire(Controlled.Desire _goal, bytes32 _desire) internal onlyDoer {
		myBDI.desires[_desire] = _goal;
	}

	function setIntention(Controlled.Intention _service, bool _intention) internal onlyDoer {
		myBDI.intentions[_intention] = _service;
	}
}

// interface SomeDoers {
// 	function Doers(SomeDoer _aDoer) returns (bool);
// 	}

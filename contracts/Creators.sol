pragma solidity ^0.4.19;

import "./Able.sol";

pragma experimental ABIEncoderV2;


///////////////////
// Beginning of Contract
///////////////////

contract Creators is Data {

/// @dev The actual agent contract, the nature of the agent is identified controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract.

	bytes32 public userName;
	address ownAddress;

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

	function Creators(Able _ctrl, Database _db, bytes32 _name) public {
		userName = _name;
		ownAddress = msg.sender;
		contrl = _ctrl;
		database = _db;
// 		contrl.registerContract("Creators", this);
// 		database = _ctrl.getDatabase();
// 		database.call.setCreator(msg.sender, Database.Creator(true, 1));
// 		database.setDoersNum(0);
		
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
		bool _active
		) onlyCreator public returns (bool,address) {
			require(database.getCreatorsNum() > 0);
			bytes32 uuidCheck = keccak256(_fPrint, _birth, _lName, _idNumber);
			require(!database.isDoer(uuidCheck));
			// Doers newDoer = new Doers(this, _name);
			// newDoer.setDoer(setDoer(_fPrint,_idNumber,_email,_fName,_lName,_hash,_tag,_data,_birth,_active));
			Doers newDoer = new Doers(_name, setDoer(_fPrint,_idNumber,_email,_fName,_lName,_hash,_tag,_data,_birth,_active));
			database.setDoersUuid(Database.Doer(newDoer, true), uuidCheck);
			database.setDoersAdd(newDoer, true);
			database.setDoersAdd(newDoer);
			database.setDoersDec();
			database.setDoersInc();
			return (true,newDoer);
            }

    // Get the address of an existing contract frrom the controller.
    function getDatabase() public view returns (Database) {
        return database;   
    }
	
	function getOwner() public view returns (address) {
        return ownAddress;
	}

	function getCreator(address _address) view public returns (bool,uint256) {
        return database.getCreators(_address);
	}

	function getDoerCount() view public returns (uint) {
		return database.countDoers();
	}

// 	function getDoers() view public returns (address[]) {
// 		return database.getDoers();
// 	}

// 	function getPlans() view internal onlyDoer returns (bytes32[]) {
// 		return database.allPlans;
// 	}

	function isCreator() public view returns (bool) { // Consider use of delegateCall
		return database.isCreator(tx.origin);
	}
	
	function isCreator(bool _active, uint _num) public {
		database.isCreator(Database.Creator({active:_active, myDoers: _num}));
	}

	function isDoer() view public returns (bool) { // Point this to oraclise service checking MSD on 
		return database.isDoer(tx.origin);	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json
	}
	
	function isDoer(address _address) view public returns (bool) { // Point this to oraclise service checking MSD on 
		return database.isDoer(_address);	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json
	}

	function isDoer(bytes32 _uuid) view public returns (bool) {
		return database.isDoer(_uuid);
	}

	function isPlanning(bytes32 _intention) view public returns (uint256) { 
        return database.isPlanning(_intention);
    }

// 	function setCreator(address _address, bool _active) internal onlyController {
// 		database.creators[_address] = database.Creator(_active, 0);
// 	}

// 	function setMyDoers(address _address, uint _allowed) internal onlyController {
// 		database.creators[_address].myDoers += _allowed;
// 	}

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
		) internal pure returns (Database.SomeDoer) {
			return Database.SomeDoer({
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

	function setBDI(
	    Database.Flag _flag, 
	    bytes32 _var, 
	    bool _bvar, 
	    uint256 _cvar, 
	    uint256 _evar, 
	    bytes32 _level) internal onlyDoer returns (bool) {
	    return database.setDoerBDI(_flag, _var, _bvar, _cvar, _evar, _level);
		}

	function setQualification(Database.Qualification _qualification) internal onlyDoer {
		database.setDoerQualify(_qualification);
		}
	
	function setDesire(Database.Desire _goal, bytes32 _desire) internal onlyDoer {
		database.setDoerDesire(_goal, _desire);
		}

	function setIntention(Database.Intention _service, bool _intention) internal onlyDoer {
		database.setDoerIntent(_service, _intention);
		}
		

	//function Creators() {registerContract("Creators", this);}

	// function getCreator() view public returns (address);

	// function addDoer(address addr) public;

	// function isDoer(address addr) view public returns (bool);

	// function getDoerCount() view public returns (uint);
}

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

	address public Controller;
	address public myCreator;
	address public doer;
	bytes32 public userName;

	Database.SomeDoer public Me;// = SomeDoer(0x4fc6c65443d1b988, "whoiamnottelling", 346896000, "Iam", "Not", false);		
			
	Database.BDI myBDI;
	
	Database.Promise public myPromises;
	uint256 promiseCount;

	Database.Fulfillment[] myOrders;
	uint256 orderCount;
	
	//Creators.Flag aflag;
	
	function Doers(
// 		address _address,
		bytes32 _name,
		Database.SomeDoer _adoer
		) public {
			myCreator = msg.sender;
			doer = tx.origin;
			userName = _name;
			setDoer(_adoer);
			}
	
	function isDoer() view public returns (bool) {
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
	
	function getBelief() view public returns (uint256, bytes32,bytes32,bytes32,bytes32) {
		return (
			myBDI.beliefs.experience,
			myBDI.beliefs.reputation,
			myBDI.beliefs.talent,
			myBDI.beliefs.index,
			myBDI.beliefs.hash);
		}
	
	function getQualification(bytes32 _level) view public returns (bytes32,bytes32,bytes32) {
		return (
			myBDI.beliefs.qualification[_level].country,
			myBDI.beliefs.qualification[_level].cAuthority,
			myBDI.beliefs.qualification[_level].score);
		}

	function getDesire(bytes32 _desire) view public returns (Database.Desire) {
		return myBDI.desires[_desire];
		}
	
	function viewDesire(bytes32 _desire) view public returns (bytes32,bool) {
		return (
			myBDI.desires[_desire].goal,
			myBDI.desires[_desire].status);
			}

	function getIntention(bool _check) view public returns (uint256,bytes32,uint256) {
		return (
			uint256(myBDI.intentions[_check].state),
			myBDI.intentions[_check].service,
			myBDI.intentions[_check].payout);
			}
	
	function getPromise() internal view onlyDoer returns (address,bytes32,uint,uint,bytes32) {
		return (myPromises.doer, myPromises.thing, myPromises.timeHard, myPromises.value, myPromises.hash);
	}

		function setBDI(
			Database.Flag _flag, bytes32 _goal, 
			bool _intent, 
			bytes32 _var, 
			bool _status,
			bytes32 _level, 
			Database.State _avar) internal onlyDoer returns (bool) {
				if ((_flag == Database.Flag.talent) || (_flag == Database.Flag.t)) {
					return true;
					} else if ((_flag == Database.Flag.country) || (_flag == Database.Flag.c)) {
						myBDI.beliefs.qualification[_level].country = _var;
						return true;
					} else if ((_flag == Database.Flag.cAuthority) || (_flag == Database.Flag.CA)) {
						myBDI.beliefs.qualification[_level].cAuthority = _var;
						return true;
					} else if ((_flag == Database.Flag.score) || (_flag == Database.Flag.s)) {
						myBDI.beliefs.qualification[_level].score = _var;
						return true;
					} else if ((_flag == Database.Flag.goal) || (_flag == Database.Flag.g)) {
						myBDI.desires[_goal].goal = _var;
						return true;
					} else if ((_flag == Database.Flag.statusD) || (_flag == Database.Flag.SD)) {
						myBDI.desires[_goal].status = _status;
						return true;
					} else if ((_flag == Database.Flag.statusI) || (_flag == Database.Flag.SI)) {
						myBDI.intentions[_intent].state = _avar;
						return true;
					} else if ((_flag == Database.Flag.service) || (_flag == Database.Flag.S)) {
						myBDI.intentions[_intent].service = _var;
						return true;
						} else {
							return false;
							}
		}
	
	function setDoer(Database.SomeDoer _aDoer) public onlyCreator {
		Me = _aDoer;
	}

	function setBelief(Database.Belief _belief) internal onlyDoer {
		myBDI.beliefs = _belief;
	}

	function setQualification(Database.Qualification _qualification) internal onlyDoer {
		bytes32 hash = keccak256(_qualification);
		myBDI.beliefs.qualification[hash] = _qualification;
	}
	
	function setDesire(Database.Desire _goal, bytes32 _desire) internal onlyDoer {
		myBDI.desires[_desire] = _goal;
	}

	function setIntention(Database.Intention _service, bool _intention) internal onlyDoer {
		myBDI.intentions[_intention] = _service;
	}
}

// interface SomeDoers {
// 	function Doers(SomeDoer _aDoer) returns (bool);
// 	}
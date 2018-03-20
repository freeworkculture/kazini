pragma solidity ^0.4.19;

//////////////////////
// Abstract Contract
//////////////////////
/// @dev `ControlAbstract` is a base level contract that declares and scopes `user defined type` 
contract ControlAbstract {

/* Constants */

/* State Variables */


/* Events */


/* Modifiers */

    
/* Functions */ 

  	function verify(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view internal returns (address);

	function verified(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view internal returns (bool success);

/* End of ControlAbstract */

}

contract UserDefined {

    /* Enums*/

	enum KBase {PRIMARY,SECONDARY,TERTIARY,CERTIFICATION,DIPLOMA,LICENSE,BACHELOR,MASTER,DOCTORATE}
    // Weights	   1,		2,		 4,		    8,		   16,	    32,		64,	    128    256
	enum IS { CLOSED, CREATOR, CURATOR, ACTIVE, INACTIVE, RESERVED, PROVER }
	enum Project { NULL, PENDING, INITIATED, APPROVED, STARTED, CLOSED }
	enum Level { POOR,SATISFACTORY,GOOD,EXCELLENT }
	enum Flag {
		experience,e,
		reputation,r,
		talent,t,
		index,i,
		hashB,HB,
		country,c,
		cAuthority,CA,
		score,s,
		hashQ,HQ,
		goal,g,
		statusD,SD,
		statusI,SI,
		service,S,
		payout,p
	}
		// 0x01	“C”	Key Certification
		// 0x02	“S”	Sign Data
		// 0x04	“E”	Encrypt Communications
		// 0x08	“E”	Encrypt Storage
		// 0x10	 	Split key
		// 0x20	“A”	Authentication
		// 0x80	 	Held by more than one person
	enum KFlag {REVOCATION, TIMESTAMP, BINARY, CANONICAL, GENERIC, PERSONA, CASUAL, POSITIVE}


/* Structs*/

/// @notice `SomeDoer` defines the basic universal structure of an agent
	// @dev Interp. aDoer {fPrint, email, birth, fName, lName, active, lastUpdate} is an agent with
	// fPrint is PGP Key fingerprint
	// email is PGP key email
	// birth is date of birth in seconds from 1970
	// fName is first name in identity document MRZ
	// lName is last name in identity document MRZ
	// state is deliberative state of agent
	// lastUpdate is timestamp of last record entry
	struct SomeDoer {
        bytes32 fPrint;
        bytes32 idNumber;
		bytes32 email;
		bytes32 fName;
		bytes32 lName;
        bytes32 uuid;
		bytes32 keyid;
        bytes32 data;
        uint age;
	}

	/// @notice `Belief_Desire_Intention` is the type that defines a strategy model of an actual agent
	// @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
	// Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
	// experience is period from qualification in seconds
	// reputaion is PGP trust level flag !!! CITE RFC PART
	// talent is user declared string of talents
	struct BDI {
        Belief beliefs;
        mapping(bytes1 => Desire) desires;
	    mapping(bool => Intention) intentions;
	} struct Belief {
		Merits merits;
		mapping(uint8 => Qualification) qualification; // Key is the keccak256 hash of the struct contents
		} struct Merits {
			uint experience;
			uint reputation;
			bytes32 talent;
			uint8 index;
			bytes32 hash;
			} struct Qualification {
			bytes32 country; //ISO3166-2:KE-XX;
			bytes32 cAuthority;
			bytes32 score;
	} struct Desire {
        bytes32 goal;
        bool status;
	} struct Intention {
        IS state;
        bytes32 service;
        uint256 payout;
	}

	/// @notice `Creator && Doer lookup` is the type that defines a strategy model of an actual agent
	// @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
	// Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
	// experience is period from qualification in seconds
	// reputaion is PGP trust level flag !!! CITE RFC PART
	// talent is user declared string of talents

    struct Agent {
        bytes32 keyId;
		IS state;
        bool active;
		uint myDoers;
	}

	/// @dev `Initialised data structures
	/// @notice `Creator && Doer lookup` is the type that defines a strategy model of an actual agent
	// @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
	// Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
	// experience is period from qualification in seconds
	// reputaion is PGP trust level flag !!! CITE RFC PART
	// talent is user declared string of talents

	/// @notice `Plan_Service_Promise_Fulfillment_Verification` is the type that defines a strategy model of an actual agent
	// @dev Interp. myBelief {Qualification, Experience, Reputation, Talent} is an agent with
	// Qualification is (<ISO 3166-1 numeric-3>,<Conferring Authority>,<Score>)
	// experience is period from qualification in seconds
	// reputaion is PGP trust level flag !!! CITE RFC PART
	// talent is user declared string of talents

    struct Plans {
		Project state;
		Plan plan;
		mapping(bytes32 => Services) services;
	} struct Plan {
			bytes32 preCondition;
			uint time;
			uint budget;
			Desire postCondition;
			bytes32 projectUrl;
			address creator;
			address curator;
	} struct Services {
		Service definition;
		Order order;
		mapping(address => Procure) procure;
		} struct Service {
			Belief preCondition;
			Desire postCondition;
			Metas metas;
			} struct Metas {
				uint timeSoft;  // preferred timeline
				uint expire;
				bytes32 hash;
				bytes32 serviceUrl;
				address doer;
		} struct Order {
		    bytes32 Sig;
		    uint8 V;
		    bytes32 R;
		    bytes32 S;
		} struct Procure {
		    Promise promise;
		    Fulfillment fulfillment;
		    mapping(address => Verification) verification; // key is hash of fulfillment
	} struct Promise {
				Intention thing;
    			uint timeHard;   // proposed timeline
    			bytes32 hash;
	} struct Fulfillment {
    			bytes32 proof;
    			Level rubric;
    			uint timestamp;
    			bytes32 hash;
	} struct Verification {
        		bytes32 verity;
        		bool complete;
        		uint timestamp;
        		bytes32 hash;
	}

	struct Reputation {
		uint refMSD; // !!! GET THIS DATA FROM DATABASE  **** MAYBE WE SHOULD JUST MEASURE THIS RELATIVE TO THE INDIVIDUAL ****
		uint refRank;  //!!! GET THIS DATA FROM DATABASE
		uint signer; //!!! GET THIS DATA FROM DATABASE
		uint signee; //!!! GET THIS DATA FROM DATABASE
		uint refTrust; //!!! GET THIS DATA FROM DATABASE
	}

}

/* Constant */
/* State Variables */
/* Events */
/* Modifiers */
/* Functions */
/* End of Contract */


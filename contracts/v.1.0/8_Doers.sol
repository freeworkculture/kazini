pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;

// Doers is a class library of natural or artificial entities within A multi-agent system (MAS).
// The agents are collectively capable of reaching goals that are difficult to achieve by an
// individual agent or monolithic system. The class can be added to, modified and reconstructed,
// without the need for detailed rewriting.
// The nature of an agent is:
// An identity structure
// A behaviour method
// A capability model
//

import "./1_Kernel.sol";
import "./2_OS_Library.sol";
import "./6_ERC721_Interface.sol";

// 5.2.3.13.  Trust Signature

//    (1 octet "level" (depth), 1 octet of trust amount)

//    Signer asserts that the key is not only valid but also trustworthy at
//    the specified level.  Level 0 has the same meaning as an ordinary
//    validity signature.  Level 1 means that the signed key is asserted to
//    be a valid trusted introducer, with the 2nd octet of the body
//    specifying the degree of trust.  Level 2 means that the signed key is
//    asserted to be trusted to issue level 1 trust signatures, i.e., that
//    it is a "meta introducer".  Generally, a level n trust signature
//    asserts that a key is trusted to issue level n-1 trust signatures.
//    The trust amount is in a range from 0-255, interpreted such that
//    values less than 120 indicate partial trust and values of 120 or
//    greater indicate complete trust.  Implementations SHOULD emit values
//    of 60 for partial trust and 120 for complete trust.

///////////////////
// Beginning of Contract
///////////////////

library DoersLib {


/* Using */



/* Constant */


    bytes32 constant internal CONTRACTNAME = "DOER 0.0118";
    uint8 constant internal rate = 10; // !!! GET THIS DATA FROM DATABASE
    uint constant internal year = 31536000; // !!! GET THIS DATA FROM DATABASE
    uint constant internal period = 31536000; // !!! GET THIS DATA FROM DATABASE

/* User Types */

    enum BE {NULL, QUALIFICATION, EXPERIENCE, REPUTATION, TALENT}

/* State Variables */

    struct STORAGE {

        Creators creator;
        // Userbase userbase;
        Userbase userbase;
        
        bytes32 MASK;
    
        address owner;
        address peana;
        address proxyKey;
        address proxyBDI;
    
        bool initialised;
        bytes32 KEYID;
        bytes32 UUID;
        uint promiseCount;
        uint orderCount;
        uint fulfillmentCount;
    
        UserDefined.SomeDoer Iam;
    
        UserDefined.BDI bdi;
    // 	mapping (bytes32 => bytes32) promises;
        UserDefined.KBase Kbase;
    
        uint8 BASE; // !!! GET THIS DATA FROM DATABASE

    
        // mapping (bool => BE) callBackState;
        // mapping (bytes32 => bool) callBackData;
        mapping (bytes32 => mapping (bool => BE)) callBackState;
    
        bytes32[] keyring;
        uint ringlength;
        UserDefined.Reputation reputation;
    
        mapping (bytes32 => uint) keyIndex;
    
        //Creators.Flag aflag;

    }

/* Events */

////////////////
// Events
////////////////
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
    event LogKeyRing(uint _length, bytes32 _data, uint _index);
    event LogSigning(address indexed _this, address indexed _sender, address indexed _origin, address _data, bytes32 _result);
    event LogSigned(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogTrusted(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogRevoking(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogSetbdi(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _keyid, bytes32 _uuid, bytes32 _callid);

/* Modifiers */

/* Functions */


/////////////////
// ABLE COMPUTE
/////////////////
// function bytesToString(bytes32 _bytes) public constant returns (string) {

    function updateIndex(STORAGE storage self) public returns (bool) {
        uint8 kbase = uint8(UserDefined.KBase.DOCTORATE);
        while (self.bdi.beliefs.qualification[kbase].cAuthority == 0x0) {
            // merit == 0 ? bdi.beliefs.index = merit : merit --;
            if (kbase == 0) {
                self.bdi.beliefs.merits.index = 1;
                return false;}
            kbase--;
        }

        uint8 T = uint8(self.bdi.beliefs.merits.talent);
        uint8 R = uint8(self.bdi.beliefs.merits.reputation);
        uint8 Q = kbase;
        uint8 q;
        if ((block.timestamp - self.bdi.beliefs.merits.experience) > year) {
            // !!! Maybe subtract Reputation and Talent first here before proceeding
            q = (Q * ((1 + rate/100) ^ uint8(self.bdi.beliefs.merits.experience / period)));
            } else {
            q = Q;
            }
        self.BASE = T + R + q;

        // Collector(creator.peana()).updateLog(keccak256("updateIndex()"),true);

    }

/////////////////
// All ASSERTERS
/////////////////

    function iam(STORAGE storage self) view public returns (bool iam_) {
        return self.creator.iam();
        // Collector(creator.peana()).updateLog(keccak256("iam()"),iam);
        // return iam_;
    }
    
    function index(STORAGE storage self) view public returns (uint8 index_) {
        return self.bdi.beliefs.merits.index;
    }
    
    function merits(STORAGE storage self) 
    view public returns (
            uint,
            bytes32,
            bytes32,
            uint8,
            bytes32) {
        return (
            self.bdi.beliefs.merits.experience,
            self.bdi.beliefs.merits.reputation,
            self.bdi.beliefs.merits.talent,
            self.bdi.beliefs.merits.index,
            self.bdi.beliefs.merits.hash
            );
    }
    
    function kbase(STORAGE storage self) view public returns (UserDefined.KBase kbase_) {
            
        uint8 _kbase_ = uint8(UserDefined.KBase.DOCTORATE);
        while (self.bdi.beliefs.qualification[_kbase_].cAuthority == 0x0) {
            // merit == 0 ? bdi.beliefs.index = merit : merit --;
            if (_kbase_ == 0) {
                return UserDefined.KBase.PRIMARY;}
            _kbase_--;
        }
        return UserDefined.KBase(_kbase_);
    }
    
    function desire(STORAGE storage self, bytes1 _desire)
    view public returns  (bytes32) {        
        return self.bdi.desires[_desire].goal;
    }
    
    function intention(STORAGE storage self, bool _intention)
    view public returns  (bytes32) {
        return self.bdi.intentions[_intention].service;
    }
    
    function intention(STORAGE storage self, bool _intention, UserDefined.IS _state)
    public returns  (UserDefined.IS) {
        return self.bdi.intentions[_intention].state = _state;
    }
    
    function flipIntention(STORAGE storage self)
    public returns  (bool) {
        self.bdi.intentions[true].state = UserDefined.IS.RESERVED;
        self.bdi.intentions[true].service = self.bdi.intentions[false].service;
        delete self.bdi.intentions[false];
        return true;
    }
    


/////////////////
// All GETTERS
/////////////////

    function getDoer(STORAGE storage self)
    view public returns  (
        bytes32 fPrint,
        bool iam_,
        bytes32 email,
        bytes32 fName,
        bytes32 lName,
        uint age,
        bytes32 data) {
            // Collector(creator.peana()).updateLog(
            //     keccak256("getDoer()"),
            //     keccak256(Iam.fPrint),
            //     keccak256(this.iam()),
            //     keccak256(Iam.email),
            //     keccak256(Iam.fName),
            //     keccak256(Iam.lName),
            //     keccak256(Iam.age),
            //     keccak256(Iam.data));
            return(
                self.Iam.fPrint,
                iam(self),
                self.Iam.email,
                self.Iam.fName,
                self.Iam.lName,
                self.Iam.age,
                self.Iam.data
                );
    }

    function getBelief(STORAGE storage self, UserDefined.KBase _kbase)
    view public returns  (
    bytes32 country_,
    bytes32 cAuthority_,
    bytes32 score_) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.beliefs.qualification[uint8(_kbase)].country,
        //     bdi.beliefs.qualification[uint8(_kbase)].cAuthority,
        //     bdi.beliefs.qualification[uint8(_kbase)].score);
        return (
            self.bdi.beliefs.qualification[uint8(_kbase)].country,
            self.bdi.beliefs.qualification[uint8(_kbase)].cAuthority,
            self.bdi.beliefs.qualification[uint8(_kbase)].score);
    }

    function getDesire(STORAGE storage self, bytes1 _desire)
    view public returns  (bytes32,bool) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.desires[_desire].goal,
        //     bdi.desires[_desire].status);        
        return (
            self.bdi.desires[_desire].goal,
            self.bdi.desires[_desire].status);
    }

    function getIntention(STORAGE storage self, bool _intention)
    view public returns  (UserDefined.IS,bytes32,uint256) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.intentions[_intention].state,
        //     bdi.intentions[_intention].service,
        //     bdi.intentions[_intention].payout);
        return (
            self.bdi.intentions[_intention].state,
            self.bdi.intentions[_intention].service,
            self.bdi.intentions[_intention].payout);
    }

/////////////////
// All SETTERS
/////////////////

    function init(STORAGE storage self) public returns (bool) {
        require(msg.sender == self.owner && !self.initialised);
        self.initialised = self.creator.initDoer();
        return self.initialised;
    }
//
    function sign(STORAGE storage self, address _address, bytes32 keyXOR) public returns (uint, bool signed) {

        // emit LogSigning(this, msg.sender, tx.origin, _address, keyXOR);

        if (Doers(_address) != msg.sender) {
            signed = _address.call(bytes4(keccak256("sign()")));
            require(signed);
            require(self.reputation.signer++ < 2^256 && self.ringlength > 0);
            return (self.reputation.signer,signed);
        } else {
            
            bytes memory callData = msg.data;
            // emit LogSigned(this, msg.sender, tx.origin, callData, keyXOR);
            if (self.keyring.length == 0) {
                self.ringlength = self.keyring.push(keyXOR | self.MASK);
                require(self.reputation.signer++ < 2^256);
                signed = false;
            } else {
                require(address(self.keyring[0]) != address(keyXOR));
                self.keyring[0] = (keyXOR | self.MASK);
                signed = true;
            }
            self.keyIndex[keyXOR] = 0;
            // emit LogKeyRing(self.ringlength,self.keyring[self.keyIndex[keyXOR]],self.keyIndex[keyXOR]);

            // Collector(creator.peana()).updateLog(
            // keccak256("sign(address)"),
            // ringlength,
            // keyring[keyIndex[keyXOR]],
            // keyIndex[keyXOR],
            // signed);

            return (self.ringlength,signed);
        }
    }

    function sign(STORAGE storage self, bytes32 keyXOR) public returns (uint, bool signed) { // padd left before using bytes32(uint256(this) << 96)
        require(msg.sender != self.owner);
        // bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        bytes memory callData = msg.data;
        // emit LogSigned(this, msg.sender, tx.origin, callData, keyXOR);

        require(self.keyring.length > 0 && self.keyring.length < 2^256);
        require(self.keyIndex[keyXOR] == 0);

        self.keyIndex[keyXOR] = (self.keyring.push(keyXOR | self.MASK) -1);
        self.ringlength = self.keyring.length;
        self.reputation.signee = self.ringlength;
        // Doers(proxyKey).incSigns(keyXOR << 32);
        signed = true;

        emit LogKeyRing(self.ringlength,self.keyring[self.keyIndex[keyXOR]],self.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("sign()"),
        //     ringlength,
        //     keyring[keyIndex[keyXOR]],
        //     keyIndex[keyXOR],
        //     signed);
        return (self.ringlength,signed);
    }

    function revoke(STORAGE storage self, address _address, bytes32 keyXOR) public returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using
        require(self.keyring.length > 0);

        bytes memory callData = msg.data;
        emit LogRevoking(this, msg.sender, tx.origin, callData, keyXOR);

        if (self.keyring.length == 1) {	//	a ^ b; == key; //	key ^ a == b
            
            require (address(keyXOR) == address(self.keyring[self.keyIndex[keyXOR]]));
            self.keyIndex[keyXOR] = 2^256;
            delete self.keyring;
            delete self.reputation.signee;
            require(self.reputation.signer-- > 0);
            self.ringlength = 0;
            revoked = false;
        } else {
            revoked = _address.call(bytes4(keccak256("revoke()")));
            require(revoked);
            require(self.reputation.signer-- > 0);
            return (self.reputation.signer,revoked);
        }

        emit LogKeyRing(self.ringlength,keyXOR,self.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("revoke(address)"),
        //     ringlength,
        //     keyXOR,
        //     keyIndex[keyXOR],
        //     revoked);
        return (self.ringlength,revoked);
    }

    function revoke(STORAGE storage self, bytes32 keyXOR) public returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using
        require(self.keyring.length > 1 && msg.sender != self.owner);
        // bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        require (address(keyXOR) == address(self.keyring[self.keyIndex[keyXOR]]));
        bytes memory callData = msg.data;
        emit LogRevoking(this, msg.sender, tx.origin, callData, keyXOR);

        self.keyring[self.keyIndex[keyXOR]] = self.keyring[self.keyring.length -1];
        self.keyIndex[((self.keyring[self.keyring.length -1] << 96) >> 96)] = self.keyIndex[keyXOR];
        delete self.keyring[self.keyring.length -1];
        self.ringlength = self.keyring.length;
        delete self.keyIndex[keyXOR];
        self.reputation.signee = self.ringlength;
        Doers(self.proxyKey).decSigns(keyXOR << 32);
        revoked == true;

        emit LogKeyRing(self.ringlength,keyXOR,self.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("revoke()"),
        //     ringlength,
        //     keyXOR,
        //     keyIndex[keyXOR],
        //     revoked);
        return (self.ringlength,revoked);
    }

    function trust(STORAGE storage self, UserDefined.Trust _level, bytes32 keyXOR) public returns (bool) {
        require((self.keyring.length > 0) && (self.keyring.length < 2^256));
        
        uint num = self.keyIndex[keyXOR];
        require (address(keyXOR) == address(self.keyring[num]));
        keyXOR = self.keyring[num];
        bytes memory callData = msg.data;
        emit LogTrusted(this, msg.sender, tx.origin, callData, keyXOR);
        // if (((keyXOR >> 192) << 240) > (creator.trust(_level) << 48)) {
        //     keyXOR &= 0xffffffffffff00ffffffffffffffffffffffffffffffffffffffffffffffffff;   // RESET THE TRUST FLAG FIRST
        // }
        keyXOR &= 0xffffffffffff00ffffffffffffffffffffffffffffffffffffffffffffffffff;   // RESET THE TRUST FLAG FIRST
        keyXOR |= self.creator.trust(_level);    // NO ADDING UP, JUST SET CUMULATIVE VALUE
        self.keyring[num] = keyXOR;
        emit LogKeyRing(self.ringlength,self.keyring[self.keyIndex[keyXOR]],self.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("trust(Trust)"),
        //     ringlength,
        //     keyring[keyIndex[keyXOR]],
        //     keyIndex[keyXOR],
        //     true);

        return true;
    }

    // function incSigns(STORAGE storage self, bytes32 _keyd) public returns (uint) {
    //     require(self.reputation.signer++ < 2^256);
    //     return self.reputation.signer;
    // }
    function decSigns(STORAGE storage self, bytes32 _keyd) public returns (uint) {
        require(self.reputation.signer-- > 0);
        return self.reputation.signer;
    }

    function setbdi(
        STORAGE storage self, 
        UserDefined.KBase _kbase,
        bytes32 _country,
        bytes32 _cAuthority,
        bytes32 _score,
        uint _year)
    public returns(bool) {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == self.owner) {
            Doers(self.proxyBDI).setbdi(_kbase,_country,_cAuthority,_score,_year);
            self.callBackState[callid][false] = BE.QUALIFICATION;
            emit LogSetbdi(this,msg.sender,tx.origin,self.Iam.keyid,self.Iam.uuid,callid);
            } else {
            require(self.callBackState[callid][false] == BE.QUALIFICATION);
            if (_kbase == UserDefined.KBase.BACHELOR) {		// exclude Bachelors from prerequisite of having a License
                require(self.bdi.beliefs.qualification[uint8(UserDefined.KBase.SECONDARY)].cAuthority != 0x0);
                } else {
                require(self.bdi.beliefs.qualification[uint8(_kbase) - 1].cAuthority != 0x0);
                }
            // IF (TO UPDATE)
            self.bdi.beliefs.qualification[uint8(_kbase)] = UserDefined.Qualification({country: _country, cAuthority: _cAuthority, score: _score});
            self.bdi.beliefs.merits.experience = _year;
            self.callBackState[callid][true] = self.callBackState[callid][false];
            delete self.callBackState[callid][false];
            // index_ = updateIndex(self);
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(KBase,bytes32,bytes32,bytes32,uint)"),
            // index_);
        }
    }

    function setbdi(
        STORAGE storage self, 
        uint _refMSD,
        uint _refRank,
        uint _refSigned,
        uint _refSigs,
        bytes32 _refTrust)
    public returns (bool) {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == self.owner) {
            Doers(self.proxyBDI).setbdi(_refMSD,_refRank,_refSigs,_refSigned,_refTrust);
            self.callBackState[callid][false] = BE.REPUTATION;
            emit LogSetbdi(this,msg.sender,tx.origin,self.Iam.keyid,self.Iam.uuid,callid);
            } else {
            require(self.callBackState[callid][false] == BE.REPUTATION);
            self.reputation.refMSD = _refMSD;
            self.reputation.refRank = _refRank;
            self.reputation.refTrust = _refTrust;
            self.bdi.beliefs.merits.reputation = _refTrust;
            self.callBackState[callid][true] = self.callBackState[callid][false];
            delete self.callBackState[callid][false];
            // index_ = updateIndex(self);
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(uint,uint,uint,uint,uint)"),
            // index_);
        }
    }

    function setbdi(STORAGE storage self, bytes32 _talent) public returns (bool) {
        bytes32 callid = keccak256(msg.data);
        if(msg.sender == self.owner) {
            Doers(self.proxyBDI).setbdi(_talent);
            self.callBackState[callid][false] = BE.TALENT;
            emit LogSetbdi(this,msg.sender,tx.origin,self.Iam.keyid,self.Iam.uuid,callid);
            } else {
            require(self.callBackState[callid][false] == BE.TALENT);
            if (self.bdi.beliefs.merits.talent == 0x0) {
                self.bdi.beliefs.merits.talent = _talent;
                Userbase(self.userbase).incTalent();
            } else {
                Userbase(self.userbase).decTalent();
                self.bdi.beliefs.merits.talent = _talent;
                Userbase(self.userbase).incTalent();
            }
            self.callBackState[callid][true] = self.callBackState[callid][false];
            delete self.callBackState[callid][false];
            // index_ = updateIndex(self);
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(bytes32)"),
            // index_);
            }
    }

    function setbdi(STORAGE storage self, bytes1 _desire, UserDefined.Desire _goal) public {
        self.bdi.desires[_desire] = _goal;
        //  Collector(creator.peana()).updateLog(
        //     keccak256("setbdi(bytes1,Desire)"),
        //     true);
    }

    function setbdi(STORAGE storage self, UserDefined.Intention _service) public {
        self.bdi.intentions[false] = _service;
        self.bdi.intentions[false].state = UserDefined.IS.INACTIVE;
        // Collector(creator.peana()).updateLog(
        //     keccak256("setbdi(bytes1,Desire)"),
        //     true);
    }


/* End of Doers Library */
}

//////////////////
// Data Controller
//////////////////
/// @dev `Data` is a base level contract that is a `database controller` that can be
///  later changed
contract DataController is BaseController {

/* State Variables */

    // Database internal database;

    Userbase internal userbase;

/* Modifiers */

    modifier onlyCreator {
        require(userbase.isDoer(msg.sender) == IS.CREATOR);
        _;
    }

    modifier onlyDoer {
        require(userbase.isDoer(msg.sender) != IS.CREATOR);
        _;
    }

/* Functions */

    /// @notice `anybody` can Get the address of an existing contract frrom the controller.
    function getDatabase() view public returns (Userbase) {
        return userbase;   
    }
/* End of Contract DataController */
}


////////////////////
// Userbase Contract
////////////////////
contract Userbase is BaseController {

/* Constants */

    bytes32 constant internal CONTRACTNAME = "USERBASE 0.0118";
    uint8 constant public BASE = 2;

/* Enums */


/* Structs */


/* State Variables */

    uint public promiseCount;
    uint public doerCount;						// !!! Can I call length of areDoers instead??!!!

    uint internal talentK; 						// Total number of all identified talents
    uint internal talentI;	  					// Total number of talents of all individuals
    uint internal talentR;						// Total number of unique talents


    mapping(bytes32 => uint) public talentF; 	// Frequency of occurence of a talent

    mapping(address => Agent) public agents;

    mapping(bytes32 => address) public uuids;

    mapping(address => bytes32[]) public allPromises;

/* Events */

    event SetPlan(address indexed _from, address indexed _sender, address indexed _creator, bytes32 _intention, bytes32 _goal);

/* Modifiers */

    modifier onlyCreator {
        require(agents[msg.sender].state == IS.CREATOR);
        _;
    }

    modifier onlyDoer {
        require (agents[msg.sender].state != IS.CREATOR);
        _;
    }

    modifier onlyCurator {
        require (agents[msg.sender].state == IS.CURATOR);
        _;
    }

    modifier onlyTrustee {
        require (agents[msg.sender].state == IS.ACTIVE);
        _;
    }

    modifier onlyProver {
        require (agents[msg.sender].state == IS.PROVER);
        _;
    }
/* Functions */

    constructor (Able _ctrl) public {
        cName = CONTRACTNAME;
        contrl = _ctrl;
        owner = contrl.owner();
        controller = contrl.controller();
        emit ContractEvent(this,msg.sender,tx.origin);
    }

/////////////////
// All ASSERTS
/////////////////

    function iam(address _address) view public returns (bool) {
        require(agents[_address].active);
        return true;
    }

    function iam(bytes32 _uuids) view external returns (bool) {
        return iam(uuids[_uuids]);
    }

    function isDoer(address _address) view public returns (IS) { // Consider use of delegateCall
        require(agents[_address].active);
        return agents[_address].state;
    }

    function isDoer(bytes32 _uuids) view external returns (IS) { // Consider use of delegateCall
        return isDoer(uuids[_uuids]);
    }

/////////////////
// All GETTERS
/////////////////

    /// @notice Get the data of all Talents in the ecosystem.
    /// @param _talent The talent whose frequency is being queried
    //  @dev `anybody` can retrive the talent data in the contract
    function getTalents(bytes32 _talent)
    view external returns  (uint talentK_, uint talentI_, uint talentR_, uint talentF_) {
        // check_condition ? true : false;
        talentK_ = talentK;
        talentI_ = talentI;
        talentR_ = talentR;
        talentF_= talentF[_talent];

    }

    /// @notice Get the number of doers that can be spawned by a Creators.
    /// The query condition of the contract
    //  @dev `anybody` can retrive the count data in the contract
    function getAgent(address _address)
    view public returns (bytes32 keyid_, IS state_, bool active_, uint myDoers_) {
        return (
            agents[_address].keyId,
            agents[_address].state,
            agents[_address].active,
            agents[_address].myDoers);
    }

    function getAgent(bytes32 _uuid)
    view external returns (address) { // Point this to oraclise service checking MSD on
        return uuids[_uuid];	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json
    }

/////////////////
// All SETTERS
/////////////////

    /// @notice Get the initialisation data of a plan created by a Creator.
    /// The query condition of the contract
    //  @dev `anybody` can retrive the plan data in the contract Plan has five levels

    /// @notice Get the initialisation data of a plan created by a Creator.
    /// The query condition of the contract
    //  @dev `anybody` can retrive the plan data in the contract Plan has five levels

    function incTalent() payable public onlyDoer returns (bool) {
        bytes32 _talent_;
        (,,_talent_,,) = Doers(msg.sender).merits();
        if (talentF[_talent_] == 0) {  // First time Doer
            require(talentR++ < 2^256);
            }
        require(talentF[_talent_]++ < 2^256);
        require(talentI++ < 2^256);
        require(talentK++ < 2^256);
    }

    function decTalent() payable public onlyDoer returns (bool) {
        bytes32 _talent_;
        (,,_talent_,,) = Doers(msg.sender).merits();
        require(talentF[_talent_]-- > 0);
        if (talentF[_talent_] == 0) {  // First time Doer
            require(talentR-- > 0);
            }
        require(talentI-- > 0);
    }

    function initCreator(address _address) public returns (bool) {
        require(doerCount++ < 2^256);
        bytes32 keyid_;
        bytes32 uuid_;
        agents[_address] = Agent({
            keyId: keyid_,
            state: IS.CREATOR,
            active: true,
            myDoers: 1
            });
        uuids[uuid_] = _address;
        return agents[_address].active;
    }

    function initAgent(Doers _address) external onlyControlled returns (bool) {
        require(doerCount++ < 2^256 && _address.ringLength() == 0); //(0) == 0x0);
        bytes32 uuid_ = _address.uuId();
        bytes32 keyid_ = _address.keyId();
        require(keyid_ != 0x0 && uuid_ != 0x0 && this.getAgent(uuid_) == 0x0);
        agents[_address] = Agent({
            keyId: keyid_,
            state: IS.INACTIVE,
            active: true,
            myDoers: 0
            });
        uuids[uuid_] = _address;
        return agents[_address].active;
    }

    function incAgent(address _address) public { // Decrement a Creators Doers
        require(agents[_address].myDoers++ < 2^256);
    }

    function decAgent(address _address) public { // Decrement a Creators Doers
        require(agents[_address].myDoers-- > 0);
    }

    function setAgent(address _address, bytes32 _keyId)
    external onlyControlled returns (bytes32) {
        return agents[_address].keyId = _keyId;
    }

    function setAgent(address _address, IS _state)
    external onlyControlled returns (IS) {
        return agents[_address].state = _state;
    }

    function setAgent(address _address, bool _active)
    external onlyControlled returns (bool) {
        return agents[_address].active = _active;
    }

    function setAgent(address _address, uint _myDoers)
    external onlyControlled returns (uint) {
        return agents[_address].myDoers = _myDoers;
    }

    function setAllPromises(bytes32 _serviceId) external onlyControlled {
        require(promiseCount++ < 2^256);
        allPromises[tx.origin].push(_serviceId);
    }

/* End of Userbase */
}


// Generic Proxy Device
contract ProxyData {
    address internal proxied;
}

contract Proxy is ProxyData {
    constructor(address _proxied) public {
        proxied = _proxied;
    }

    function () public payable {
        address addr = proxied;
        assembly {
            let freememstart := mload(0x40)
            calldatacopy(freememstart, 0, calldatasize())
            let success := delegatecall(not(0), addr, freememstart, calldatasize(), freememstart, 0)
            returndatacopy(freememstart, 0, returndatasize())
            switch success
            case 0 { revert(freememstart, returndatasize()) }
            default { return(freememstart, returndatasize()) }
        }
    }
}

contract DoersHeader is UserDefined {

/* Using */

    using StringsAndBytesLib for bytes32;

    using ERC721Lib for ERC721Lib.INTERFACE_STORAGE;

    using ERC721Lib for ERC721Lib.STORAGE;

    using ERC721Lib for ERC721Lib.METADATA_STORAGE;

    using ERC721Lib for ERC721Lib.ENUMERABLE_STORAGE;
    
    using DoersLib for DoersLib.STORAGE;

/* User Types */

    enum BE {NULL, QUALIFICATION, EXPERIENCE, REPUTATION, TALENT}

/* Events */

    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
    event LogKeyRing(uint _length, bytes32 _data, uint _index);
    event LogSigning(address indexed _this, address indexed _sender, address indexed _origin, address _data, bytes32 _result);
    event LogSigned(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogTrusted(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogRevoking(address indexed _this, address indexed _sender, address indexed _origin, bytes _data, bytes32 _result);
    event LogSetbdi(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _keyid, bytes32 _uuid, bytes32 _callid);

}

contract OwnableData {
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    address internal owner;

    constructor(address _owner)
        public
    {
        owner = _owner;
    }
}

contract Ownable is OwnableData {
    function setOwner(address newOwner)
        public
        onlyOwner
    {
        owner = newOwner;
    }
}

contract UpdatableProxyData is ProxyData, OwnableData { }

interface Update {
    function implementationBefore() external view returns (address);
    function implementationAfter() external view returns (address);
    function migrateData() external;
}

contract UpdatableProxyShared is ProxyData, Ownable {
    
    function updateProxied(Update update)
        public
        onlyOwner
    {
        require(update.implementationBefore() == proxied);
        proxied = update;
        Update(this).migrateData();
        proxied = update.implementationAfter();
    }
}

contract UpdatableProxy is Proxy, UpdatableProxyShared {
    constructor(address proxied, address owner)
        public
        Proxy(proxied)
        OwnableData(owner)
    {}
}
contract UpdatableProxyImplementation is UpdatableProxyShared {
    constructor() public OwnableData(0) {}
}

contract TimedUpdatableProxyDataInternal is UpdatableProxyData {
    uint internal updateAllowedStartTime;
    Update internal plannedUpdate;
}
contract TimedUpdatableProxyData is UpdatableProxyData {
    uint public updateAllowedStartTime;
    Update public plannedUpdate;
}
contract TimedUpdatableProxyShared is UpdatableProxyShared, TimedUpdatableProxyData {
    function planUpdate(Update update)
        public
        onlyOwner
    {
        plannedUpdate = update;
        updateAllowedStartTime = now + 30 seconds;
    }
    function updateProxied(Update update)
        public
    {
        require(
            updateAllowedStartTime != 0 &&
            now >= updateAllowedStartTime &&
            update == plannedUpdate
        );
        super.updateProxied(update);
        updateAllowedStartTime = 0;
        plannedUpdate = Update(0);
    }
}
contract TimedUpdatableProxy is UpdatableProxy, TimedUpdatableProxyShared {
    constructor(address proxied, address owner)
        public
        UpdatableProxy(proxied, owner)
    {}
}
contract TimedUpdatableProxyImplementation is TimedUpdatableProxyShared {
    constructor() public OwnableData(0) {}
}

contract DoersDataInternal is UpdatableProxyData, DoersHeader {

    bytes32 constant internal CONTRACTNAME = "DOER 0.0118";
    uint8 constant internal rate = 10; // !!! GET THIS DATA FROM DATABASE
    uint constant internal year = 31536000; // !!! GET THIS DATA FROM DATABASE
    uint constant internal period = 31536000; // !!! GET THIS DATA FROM DATABASE

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    bytes4 private constant _InterfaceId_ERC721 = 0x80ac58cd;
    /*
    * 0x80ac58cd ===
    *   bytes4(keccak256('balanceOf(address)')) ^
    *   bytes4(keccak256('ownerOf(uint256)')) ^
    *   bytes4(keccak256('approve(address,uint256)')) ^
    *   bytes4(keccak256('getApproved(uint256)')) ^
    *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
    *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
    *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
    *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
    *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
    */

    bytes4 private constant _InterfaceId_ERC721Metadata = 0x5b5e139f;
    /**
    * 0x5b5e139f ===
    *   bytes4(keccak256('name()')) ^
    *   bytes4(keccak256('symbol()')) ^
    *   bytes4(keccak256('tokenURI(uint256)'))
    */

    bytes4 private constant _InterfaceId_ERC721Enumerable = 0x780e9d63;
    /**
    * 0x780e9d63 ===
    *   bytes4(keccak256('totalSupply()')) ^
    *   bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
    *   bytes4(keccak256('tokenByIndex(uint256)'))
    */


/* Modifiers */

    modifier onlyCreator {
        require(creator.isCreator());
        _;
    }

    modifier onlyDoer {
        require (creator.isDoer());
        _;
    }

    modifier onlyOwner {
        require(creator.iam() && msg.sender == owner);
        _;
    }

    modifier ProxyKey {
        require(msg.sender == proxyKey);
        _;
    }

    modifier ProxyBDI {
        require(msg.sender == proxyKey || msg.sender == owner);
        _;
    }
    
    // modifier toPeana {
    //     Collector(creator.peana()).sendLog(msg.sender,this,msg.data);
    //     _;
    // }

/* State Variables */

    ERC721 mpsr;

    // DoersLib.STORAGE internal doersData;

    Creators internal creator;
    // Userbase userbase;
    Userbase internal userbase;
    
    bytes32 internal MASK;

    address internal owner;
    address internal peana;
    address internal proxyKey;
    address internal proxyBDI;

    bool internal initialised;
    bytes32 internal KEYID;
    bytes32 internal UUID;
    uint internal promiseCount;
    uint internal orderCount;
    uint internal fulfillmentCount;

    UserDefined.SomeDoer internal Iam;

    UserDefined.BDI internal bdi;
// 	mapping (bytes32 => bytes32) promises;
    UserDefined.KBase internal Kbase;

    uint8 BASE; // !!! GET THIS DATA FROM DATABASE


    // mapping (bool => BE) callBackState;
    // mapping (bytes32 => bool) callBackData;
    mapping (bytes32 => mapping (bool => BE)) internal callBackState;

    bytes32[] internal keyring;
    uint internal ringlength;
    UserDefined.Reputation internal reputation;

    mapping (bytes32 => uint) internal keyIndex;

    //Creators.Flag aflag;


/* Events */
    
}

contract DoersData is UpdatableProxyData, DoersHeader {

    bytes32 constant internal CONTRACTNAME = "DOER 0.0118";
    uint8 constant internal rate = 10; // !!! GET THIS DATA FROM DATABASE
    uint constant internal year = 31536000; // !!! GET THIS DATA FROM DATABASE
    uint constant internal period = 31536000; // !!! GET THIS DATA FROM DATABASE

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    bytes4 private constant _InterfaceId_ERC721 = 0x80ac58cd;
    /*
    * 0x80ac58cd ===
    *   bytes4(keccak256('balanceOf(address)')) ^
    *   bytes4(keccak256('ownerOf(uint256)')) ^
    *   bytes4(keccak256('approve(address,uint256)')) ^
    *   bytes4(keccak256('getApproved(uint256)')) ^
    *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
    *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
    *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
    *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
    *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
    */

    bytes4 private constant _InterfaceId_ERC721Metadata = 0x5b5e139f;
    /**
    * 0x5b5e139f ===
    *   bytes4(keccak256('name()')) ^
    *   bytes4(keccak256('symbol()')) ^
    *   bytes4(keccak256('tokenURI(uint256)'))
    */

    bytes4 private constant _InterfaceId_ERC721Enumerable = 0x780e9d63;
    /**
    * 0x780e9d63 ===
    *   bytes4(keccak256('totalSupply()')) ^
    *   bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
    *   bytes4(keccak256('tokenByIndex(uint256)'))
    */

/* Modifiers */

    modifier onlyCreator {
        require(creator.isCreator());
        _;
    }

    modifier onlyDoer {
        require (creator.isDoer());
        _;
    }

    modifier onlyOwner {
        require(creator.iam() && msg.sender == owner);
        _;
    }

    modifier ProxyKey {
        require(msg.sender == proxyKey);
        _;
    }

    modifier ProxyBDI {
        require(msg.sender == proxyKey || msg.sender == owner);
        _;
    }
    
    // modifier toPeana {
    //     Collector(creator.peana()).sendLog(msg.sender,this,msg.data);
    //     _;
    // }

/* State Variables */

    ERC721 mpsr;

    DoersLib.STORAGE doersData;

    Creators creator;
    // Userbase userbase;
    Userbase userbase;
    
    bytes32 MASK;

    address owner;
    address peana;
    address proxyKey;
    address proxyBDI;

    bool initialised;
    bytes32 KEYID;
    bytes32 UUID;
    uint promiseCount;
    uint orderCount;
    uint fulfillmentCount;

    UserDefined.SomeDoer Iam;

    UserDefined.BDI bdi;
// 	mapping (bytes32 => bytes32) promises;
    UserDefined.KBase Kbase;

    uint8 BASE; // !!! GET THIS DATA FROM DATABASE


    // mapping (bool => BE) callBackState;
    // mapping (bytes32 => bool) callBackData;
    mapping (bytes32 => mapping (bool => BE)) callBackState;

    bytes32[] keyring;
    uint ringlength;
    UserDefined.Reputation reputation;

    mapping (bytes32 => uint) keyIndex;

    //Creators.Flag aflag;
  
}

contract DoersProxy is Proxy, DoersDataInternal {

    constructor (
        address _proxied, 
        address _owner, 
        Creators _creator, 
        SomeDoer _adoer
        
        ) public Proxy(_proxied) OwnableData(_owner) {
            require(true/*"!!!!!!!check that this doer is not yet in userbase!!!!!!!*/ );
            creator = _creator;
            owner = tx.origin;
            MASK = _creator.DOER();
            proxyKey = _creator.proxyKey();
            proxyBDI = _creator.proxyBDI();
            Iam = _adoer;
            emit ContractEvent(this, msg.sender, tx.origin);
            }
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

// 5.2.3.13.  Trust Signature

//    (1 octet "level" (depth), 1 octet of trust amount)

//    Signer asserts that the key is not only valid but also trustworthy at
//    the specified level.  Level 0 has the same meaning as an ordinary
//    validity signature.  Level 1 means that the signed key is asserted to
//    be a valid trusted introducer, with the 2nd octet of the body
//    specifying the degree of trust.  Level 2 means that the signed key is
//    asserted to be trusted to issue level 1 trust signatures, i.e., that
//    it is a "meta introducer".  Generally, a level n trust signature
//    asserts that a key is trusted to issue level n-1 trust signatures.
//    The trust amount is in a range from 0-255, interpreted such that
//    values less than 120 indicate partial trust and values of 120 or
//    greater indicate complete trust.  Implementations SHOULD emit values
//    of 60 for partial trust and 120 for complete trust.

///////////////////
// Beginning of Contract
///////////////////

contract Doers is UpdatableProxyImplementation, DoersData {

/* Constant */

// /* User Types */

// /* Events */



/* Functions */

    // constructor (Creators _creator, SomeDoer _adoer) public {
    //     init(Creators _creator, SomeDoer _adoer);
    //     }

    // function init(Creators _creator, SomeDoer _adoer) public {
    //     // Enforce initialization behavior.
    //     require(true/*"!!!!!!!check that this doer is not yet in userbase!!!!!!!*/ );
    //     doersData.creator = _creator;
    //     doersData.owner = tx.origin;
    //     doersData.MASK = _creator.DOER();
    //     doersData.proxyKey = _creator.proxyKey();
    //     doersData.proxyBDI = _creator.proxyBDI();
    //     doersData.Iam = _adoer;
    //     erc721Metadata.init(erc165Data, _adoer.fPrint.bytes32ToString(), _adoer.email.bytes32ToString());
    //     emit ContractEvent(this, msg.sender, tx.origin);
    //     }

    /**
    * @dev Gets the token name
    * @return string representing the token name
    */
    function name() external view returns (string) {
        return Iam.email.bytes32ToString();
        }

    /**
    * @dev Gets the token symbol
    * @return string representing the token symbol
    */
    function symbol() external view returns (string) {
        return Iam.fPrint.bytes32ToString();
        }

/////////////////
// ABLE COMPUTE
/////////////////
    
    function updateIndex() internal returns (bool) {
        return doersData.updateIndex();

        // Collector(creator.peana()).updateLog(keccak256("updateIndex()"),true);

    }

/////////////////
// All ASSERTERS
/////////////////

    function iam() view public returns (bool iam_) {
        return doersData.iam();
        // Collector(creator.peana()).updateLog(keccak256("iam()"),iam);
    }
    
    function index() view public returns (uint8 index_) {
        return doersData.index();
    }
    
    function ringLength() view public returns (uint ringlength_) {
        return doersData.ringlength;
    }
    
    function uuId() view public returns (bytes32 UUID_) {
        return doersData.Iam.uuid;
    }
    
    function keyId() view public returns (bytes32 KEYID_) {
        return doersData.Iam.keyid;
    }
    
    function merits() 
    view public returns (
        uint experience_,
        bytes32 reputation_,
        bytes32 talent_,
        uint8 index_,
        bytes32 hash_) {
                
        return doersData.merits();
        
    }
    
    function kbase() view public returns (KBase kbase_) {
        return doersData.kbase();
    }
    
    function desire(bytes1 _desire)
    view external returns  (bytes32) {        
        return doersData.desire(_desire);
    }
    
    function intention(bool _intention)
    view external returns  (bytes32) {
        return doersData.intention(_intention);
    }
    
    function intention(bool _intention, IS _state)
    external returns  (IS) {
        return doersData.intention(_intention,_state);
    }
    
    function flipIntention()
    external returns  (bool) {
        return doersData.flipIntention();
    }
    


/////////////////
// All GETTERS
/////////////////

    function getDoer()
    view external returns  (
    bytes32 fPrint,
    bool iam_,
    bytes32 email,
    bytes32 fName,
    bytes32 lName,
    uint age,
    bytes32 data_) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getDoer()"),
        //     keccak256(Iam.fPrint),
        //     keccak256(this.iam()),
        //     keccak256(Iam.email),
        //     keccak256(Iam.fName),
        //     keccak256(Iam.lName),
        //     keccak256(Iam.age),
        //     keccak256(Iam.data));
        return doersData.getDoer();
    }

    function getBelief(KBase _kbase)
    view external returns  (
    bytes32 country_,
    bytes32 cAuthority_,
    bytes32 score_) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.beliefs.qualification[uint8(_kbase)].country,
        //     bdi.beliefs.qualification[uint8(_kbase)].cAuthority,
        //     bdi.beliefs.qualification[uint8(_kbase)].score);
        return doersData.getBelief(_kbase);
    }

    function getDesire(bytes1 _desire)
    view external returns  (bytes32,bool) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.desires[_desire].goal,
        //     bdi.desires[_desire].status);        
        return doersData.getDesire(_desire);
    }

    function getIntention(bool _intention)
    view external returns  (IS,bytes32,uint256) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     bdi.intentions[_intention].state,
        //     bdi.intentions[_intention].service,
        //     bdi.intentions[_intention].payout);
        return doersData.getIntention(_intention);
    }

/////////////////
// All SETTERS
/////////////////

    function init() external returns  (bool) {
        // Collector(creator.peana()).updateLog(
        //     keccak256("getBelief(KBase)"),
        //     init);
        return doersData.init();
    }
//
    function sign(address _address) public onlyOwner returns (uint, bool signed) {

        bytes32 keyXOR = bytes32(uint256(_address)) ^ bytes32(uint256(msg.sender));
        
        emit LogSigning(this, msg.sender, tx.origin, _address, keyXOR);

        return doersData.sign(_address, keyXOR);

            // Collector(creator.peana()).updateLog(
            // keccak256("sign(address)"),
            // ringlength,
            // keyring[keyIndex[keyXOR]],
            // keyIndex[keyXOR],
            // signed);
    }

    function sign() external onlyDoer returns (uint, bool signed) { // padd left before using bytes32(uint256(this) << 96)
    
        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        
        emit LogKeyRing(doersData.ringlength,doersData.keyring[doersData.keyIndex[keyXOR]],doersData.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("sign()"),
        //     ringlength,
        //     keyring[keyIndex[keyXOR]],
        //     keyIndex[keyXOR],
        //     signed);
        return doersData.sign(keyXOR);
    }

    function revoke(address _address) external onlyDoer returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using

        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        
        emit LogRevoking(this, msg.sender, tx.origin, msg.data, keyXOR);

        emit LogKeyRing(doersData.ringlength,keyXOR,doersData.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("revoke(address)"),
        //     ringlength,
        //     keyXOR,
        //     keyIndex[keyXOR],
        //     revoked);
        return doersData.revoke(_address, keyXOR);
    }

    function revoke() external onlyDoer returns (uint, bool revoked) { // pad left bytes32(uint256(this) << 96) before using

        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));
        
        emit LogRevoking(this, msg.sender, tx.origin, msg.data, keyXOR);

        emit LogKeyRing(doersData.ringlength,keyXOR,doersData.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("revoke()"),
        //     ringlength,
        //     keyXOR,
        //     keyIndex[keyXOR],
        //     revoked);
        return doersData.revoke(keyXOR);
    }

    function trust(Trust _level) returns (bool) {
        
        bytes32 keyXOR = bytes32(uint256(this)) ^ bytes32(uint256(msg.sender));

        emit LogTrusted(this, msg.sender, tx.origin, msg.data, keyXOR);

        emit LogKeyRing(doersData.ringlength,doersData.keyring[doersData.keyIndex[keyXOR]],doersData.keyIndex[keyXOR]);
        // Collector(creator.peana()).updateLog(
        //     keccak256("trust(Trust)"),
        //     ringlength,
        //     keyring[keyIndex[keyXOR]],
        //     keyIndex[keyXOR],
        //     true);

        return doersData.trust(_level, keyXOR);
    }

    // function incSigns(bytes32 _keyd) external ProxyKey returns (uint) {
    //     return doersData.incSigns(_keyd);
    // }
    
    function decSigns(bytes32 _keyd) external ProxyKey returns (uint) {
        return doersData.decSigns(_keyd);
    }

    function setbdi(
        KBase _kbase,
        bytes32 _country,
        bytes32 _cAuthority,
        bytes32 _score,
        uint _year)
    external ProxyBDI returns(bool qualification_) {
        
                return doersData.setbdi(
                    _kbase,
                    _country,
                    _cAuthority,
                    _score,
                    _year
                    );
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(KBase,bytes32,bytes32,bytes32,uint)"),
            // index_);
    }

    function setbdi(
        uint _refMSD,
        uint _refRank,
        uint _refSigned,
        uint _refSigs,
        bytes32 _refTrust)
    external ProxyBDI returns (bool reputation_) {
                return doersData.setbdi(
                    _refMSD,
                    _refRank,
                    _refSigned,
                    _refSigs,
                    _refTrust
                    );
                    
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(uint,uint,uint,uint,uint)"),
            // index_);
    }

    function setbdi(bytes32 _talent) external ProxyBDI returns (bool talent_) {

        return doersData.setbdi(_talent);
            // Collector(creator.peana()).updateLog(
            // keccak256("setbdi(bytes32)"),
            // index_);
    }

    function setbdi(bytes1 _desire, Desire _goal) public onlyDoer {
        
        return doersData.setbdi(_desire, _goal);
        //  Collector(creator.peana()).updateLog(
        //     keccak256("setbdi(bytes1,Desire)"),
        //     true);
    }

    function setbdi(Intention _service) public onlyDoer {
        
        ERC721(mpsr).mintWithTokenURI(this, _service.payout, _service.uri);
      
        return doersData.setbdi(_service);


        // Collector(creator.peana()).updateLog(
        //     keccak256("setbdi(bytes1,Desire)"),
        //     true);
    }


/* End of Doers Contract */
}

///////////////////
// Beginning of Contract
///////////////////

contract DoersFactory {

/* Using */


/* Constant */
/* State Variables */

    Able private contrl;
    Userbase private userbase;
    Creators private creator;
    Doers private masterCopy; 

/* Events */

    event LogNewDoer(address indexed from, address indexed to, address indexed origin, address _newdoer);
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
    
/* Modifiers */

    // modifier toPeana {
    //     Collector(creator.peana()).sendLog(msg.sender,this,msg.data);
    //     _;
    // }

/* Functions */

    constructor (Able _contrl, Userbase _userbase, Creators _creator, Doers _masterCopy) public {
        contrl = _contrl;
        userbase = _userbase;
        creator = _creator;
        masterCopy = _masterCopy;
        emit ContractEvent(this,msg.sender,tx.origin);
    }

// "0xca35b7d915458ef540ade6068dfe2f44e8fa733c","_fPrint","_idNumber","_email","_fName","_lName","_keyId","_data",10
    function makeDoer(
        address _introducer,
        bytes32 _fPrint,
        bytes32 _idNumber,
        bytes32 _email,
        bytes32 _fName,
        bytes32 _lName,
        bytes32 _keyId,
        bytes32 _data,
        uint _birth
        )
        public returns (Doers doers) {
            userbase.decAgent(_introducer);
            bytes32 uuidCheck = keccak256(abi.encodePacked(_fPrint, _idNumber, _lName, _birth));

            doers = Doers(new DoersProxy(masterCopy, address(contrl), creator, UserDefined.SomeDoer({
                fPrint: _fPrint,
                idNumber: _idNumber,
                email: _email,
                fName: _fName,
                lName: _lName,
                uuid: uuidCheck,
                keyid: _keyId,
                data: _data,
                age: _birth})));

            emit LogNewDoer(this,msg.sender,tx.origin,address(doers));
    }

/* End of DoersFactory Contract */

}

///////////////////
// Beginning of Contract
///////////////////

contract Creators is DataController {

/* Using */

    

/* Constant */
/* State Variables */
/* Events */
/* Modifiers */
/* Functions */
/* End of Contract */

/// @dev The actual agent contract, the nature of the agent is identified controller is the msg.sender
///  that deploys the contract, so usually this token will be deployed by a
///  token controller contract.

    bytes32 constant internal CONTRACTNAME = "CREATOR 0.0118";
    bytes32 constant public KEYID = 0x90EBAC34FC40EAC30FC9CB464A2E56;
    bytes32 constant public DOER     			   	    = 0x11ff10ff100f00ff << 192;
// 	bytes32 constant public MASK 			   		    = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    bytes32 constant public KEY_CERTIFICATION 		    = 0x01ffffffffffffff << 192; // “C”	Key Certification
    bytes32 constant public SIGN_DATA   			    = 0x02ffffffffffffff << 192; // “S”	Sign Data
    bytes32 constant public ENCRYPT_COMMUNICATIONS 	    = 0x04ffffffffffffff << 192; // “E”	Encrypt Communications
    bytes32 constant public ENCRYPT_STORAGE  		    = 0x08ffffffffffffff << 192; // “E”	Encrypt Storage
    bytes32 constant public SPLIT_KEY   			    = 0x10ffffffffffffff << 192; // Split key
    bytes32 constant public AUTHENTICATION   		    = 0x20ffffffffffffff << 192; // “A”	Authentication
    bytes32 constant public MULTI_SIGNATURE			    = 0x80ffffffffffffff << 192; // Held by more than one person
    bytes32 constant public AMOUNT 			   		    = 0xffffffffffff00ff << 192;
    bytes32 constant public BINARY_DOCUMENT             = 0xffff00ffffffffff << 192; // 0x00: Signature of a binary document.
    bytes32 constant public CANONICAL_DOCUMENT          = 0xffff01ffffffffff << 192; // 0x01: Signature of a canonical text document.
    bytes32 constant public STANDALONE_SIGNATURE        = 0xffff02ffffffffff << 192; // 0x02: Standalone signature.
    bytes32 constant public GENERIC                     = 0xffff10ffffffffff << 192; // 0x10: Generic certification of a User ID and Public-Key packet.
    bytes32 constant public PERSONA                     = 0xffff11ffffffffff << 192; // 0x11: Persona certification of a User ID and Public-Key packet.
    bytes32 constant public CASUAL                      = 0xffff12ffffffffff << 192; // 0x12: Casual certification of a User ID and Public-Key packet.
    bytes32 constant public POSITIVE                    = 0xffff13ffffffffff << 192; // 0x13: Positive certification of a User ID and Public-Key packet.
    bytes32 constant public SUBKEY_BINDING              = 0xffff18ffffffffff << 192; // 0x18: Subkey Binding Signature
    bytes32 constant public PRIMARY_KEY_BINDING         = 0xffff19ffffffffff << 192; // 0x19: Primary Key Binding Signature
    bytes32 constant public DIRECTLY_ON_KEY             = 0xffff1Fffffffffff << 192; // 0x1F: Signature directly on a key
    bytes32 constant public KEY_REVOCATION              = 0xffff20ffffffffff << 192; // 0x20: Key revocation signature
    bytes32 constant public SUBKEY_REVOCATION           = 0xffff28ffffffffff << 192; // 0x28: Subkey revocation signature
    bytes32 constant public CERTIFICATION_REVOCATION    = 0xffff30ffffffffff << 192; // 0x30: Certification revocation signature
    bytes32 constant public TIMESTAMP                   = 0xffff40ffffffffff << 192; // 0x40: Timestamp signature.
    bytes32 constant public THIRD_PARTY_CONFIRMATION    = 0xffff50ffffffffff << 192; // 0x50: Third-Party Confirmation signature.
    bytes32 constant public ORDINARY   				    = 0xffffffff100fffff << 192;
    bytes32 constant public INTRODUCER 				    = 0xffffffff010fffff << 192;
    bytes32 constant public ISSUER	   				    = 0xffffffff001fffff << 192;

    Clearance internal TRUST = Clearance({
        Zero:       0x01ff << 192,
        // Zero:       0x01ff << 192,
        Unknown:    0x03ff << 192,
        // Unknown:    0x02ff << 192,
        Generic:    0x07ff << 192,
        // Generic:    0x04ff << 192,
        Poor:       0xF0ff << 192,
        // Poor:       0x08ff << 192,
        Casual:     0xF1ff << 192,
        // Casual:     0x10ff << 192,
        Partial:    0xF3ff << 192,
        // Partial:    0x20ff << 192,
        Complete:   0xF7ff << 192,
        // Complete:   0x40ff << 192,
        Ultimate:   0xFFff << 192
        // Ultimate:   0x80ff << 192
    });

    address public proxyKey;
    address public proxyBDI;

    // mapping (address => mapping (bool => bytes)) callData;

    constructor (Able _ctrl, Userbase _ubs) public {
        cName = CONTRACTNAME;
        contrl = _ctrl;
        userbase = _ubs;
        owner = contrl.owner();
        controller = contrl.controller();
        // proxyKey = new ProxyKey();
        // proxyBDI = new ProxyBDI();
        emit ContractEvent(this,msg.sender,tx.origin);
    }

/////////////////
// All ASSERTS
/////////////////

    function isAble() view public returns (bytes32) {
        return contrl.KEYID();
    }

    function Iam() view public returns (IS) {
        return userbase.isDoer(msg.sender);
    }

    function iam() view public returns (bool) {
        return userbase.iam(msg.sender);
    }

    function isDoer() public view returns (bool) { // Consider use of delegateCall
        require (userbase.isDoer(msg.sender) != IS.CREATOR);
        return true;
    }	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

    function isDoer(bytes32 _keyid) public view returns (bool isDoer) { // Consider use of delegateCall
        require (userbase.isDoer(userbase.getAgent(_keyid)) != IS.CREATOR);
        return true;
    }	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

    function isCreator() view external returns  (bool isCreator) { // Point this to oraclise service checking MSD on
        require (userbase.isDoer(msg.sender) == IS.CREATOR);
        return true;
    } 	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

    function isCreator(bytes32 _keyid) view external returns  (bool isCreator) { // Point this to oraclise service checking MSD on
        require (userbase.isDoer(userbase.getAgent(_keyid)) == IS.CREATOR);
        return true;
    } 	// https://pgp.cs.uu.nl/paths/4b6b34649d496584/to/4f723b7662e1f7b5.json

// 	function isPlanning(bytes32 _intention) view external returns  (uint256) {
//         return userbase.isPlanning(_intention);
//     }

/////////////////
// All GETTERS
/////////////////

    /// @notice Get the active status of a Creator and its number of doers spawned.
    /// @param _address The query condition of the contract
    //  @dev `anybody` can retrive the count data in the contract
    function getAgent(address _address)
    view public returns (bytes32 keyid_, IS state_, bool active_, uint myDoers_) {
        return userbase.getAgent(_address);
    }

    function getAgent(bytes32 _uuid)
    view external returns  (bytes32 keyid_, IS state_, bool active_, uint myDoers_) {
        return userbase.getAgent(userbase.getAgent(_uuid));
    }

/////////////////
// All SETTERS
/////////////////

    function initDoer() returns (bool) {
        return userbase.initAgent(Doers(msg.sender));
    }

    function flipTo(address _address)
    external onlyOwner returns (IS) {
        if (userbase.isDoer(_address) != IS.CREATOR) {
            return userbase.setAgent(_address, IS.CREATOR);
        } else {
            return userbase.setAgent(_address, IS.INACTIVE);
        }
    }

    function numberOf(address _address, uint _allowed)
    external onlyOwner returns (uint) {
        require(userbase.isDoer(_address) == IS.CREATOR);
        return userbase.setAgent(_address, _allowed);
    }

    function toggle(address _address)
    external onlyOwner returns (bool) {
        bool active_;
        (,,active_,) = userbase.getAgent(_address);
        if (!active_) {
            return userbase.setAgent(_address, true);
        } else {
            return userbase.setAgent(_address, false);
            }
    }

    function reset(address _address, bytes32 _keyid)
    external onlyOwner returns (bytes32) {
        require(userbase.iam(_address));
        userbase.setAgent(_address, IS.INACTIVE);
        return userbase.setAgent(_address, _keyid);
    }

    function trust(Trust _level) returns (bytes32) {
        if (_level == Trust.ZERO) {
            return TRUST.Zero;
            } else if (_level == Trust.UNKNOWN ) {
                return TRUST.Unknown;
                } else if (_level == Trust.GENERIC ) {
                    return TRUST.Generic;
                    } else if (_level == Trust.POOR ) {
                        return TRUST.Poor;
                        } else if (_level == Trust.CASUAL ) {
                            return TRUST.Casual;
                            } else if (_level == Trust.PARTIAL ) {
                                return TRUST.Partial;
                                } else if (_level == Trust.COMPLETE ) {
                                    return TRUST.Complete;
                                        } else if (_level == Trust.ULTIMATE ) {
                                            return TRUST.Ultimate;
                                            }
    }

    event LogCall(address indexed from, address indexed to, address indexed origin, bytes _data);
/* END OF CREATORS CONTRACT */
}
pragma solidity ^0.4.19;
// import "./ControlAbstract.sol";
// import "./Oraclize.sol";
pragma experimental ABIEncoderV2;

//////////////////////
// BaseController
//////////////////////
/// @dev `BaseController` is a base level contract that assigns an `controller` that can be
///  later changed
contract BaseController {

/* Constants */

    bytes32 constant public VERSION = "BaseController 0.2.3";

/* State Variables */

    Able public contrl;
	address public owner;
	address public controller;
	bool mutex;
	bytes32 public cName;
	uint8 V;
	bytes32 R;
	bytes32 S;

/* Events */

    event Log(string message);
    event ChangedOwner(address indexed oldOwner, address indexed newOwner);
	event ChangedContrl(address indexed oldContrl, address indexed newContrl);
	event ChangedController(address indexed oldController, address indexed newController);
    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);
	event ContractCallEvent(address indexed _this, address indexed _sender, address indexed _origin, bytes32 _data);
	event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
	event LogNewOraclizeQuery(string description);
    event LogNewResult(string result, bytes proof);

/* Modifiers */

	/// @dev `Able` is the controller.
	/// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyController { 
        require(msg.sender == controller); 
        _; 
	}

    /// @dev `owner` is the only address that can call a function with this
    /// modifier
    modifier onlyOwner {
        require (msg.sender == owner); 
        _;
    }

    // This modifier can be used on functions with external calls to
    // prevent reentry attacks.
    // Constraints:
    //   Protected functions must have only one point of exit.
    //   Protected functions cannot use the `return` keyword
    //   Protected functions return values must be through return parameters.
    modifier preventReentry() {
        if (mutex) 
		revert();
        else 
		mutex = true;
        _;
        delete mutex;
        return;
    }

    // This modifier can be applied to pulic access state mutation functions
    // to protect against reentry if a `mutextProtect` function is already
    // on the call stack.
    modifier noReentry() {
        require(!mutex);
        _;
    }

    // Same as noReentry() but intended to be overloaded
    modifier canEnter() {
        require(!mutex);
        _;
    }
    
/* Functions */ 

    function getContrl() view public returns (Able);

    // Change the owner of a contract
    /// @notice `setOwner` can step down and assign some other address to this role
    /// @param _newOwner The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function setOwner(address _newOwner) internal returns (bool);

    /// @notice `setContrl` can step down and assign some other address to this role
    /// @param _newCtrl The address of the new owner. 0x0 can be used to create
    ///  an unowned neutral vault, however that cannot be undone
    function setContrl(Able _newCtrl) internal returns (bool);

    /// @notice `setController` can step down and assign some other address to this role
    ///  The address of the new controller is the address of the contrl. 
	///  0x0 can be used to create an unowned neutral vault, however that cannot be undone
    function setController(uint8 _v, bytes32 _r, bytes32 _s) internal returns (bool);

    /// @notice `setController` can step down and assign some other address to this role
    ///  The address of the new controller is the address of the contrl. 
	///  0x0 can be used to create an unowned neutral vault, however that cannot be undone
    function setController() internal returns (bool);

  	function verify(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view internal returns (address);

	function verified(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) view internal returns (bool success);

/* End of BaseController */
}


///////////////////
// Token Controller
///////////////////

/// @dev The token controller contract must implement these functions
contract TokenController {
    /// @notice Called when `_owner` sends ether to the Doit Token contract
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
    function onApprove(address _owner, address _spender, uint _amount) public
        returns(bool);
}


contract Able {

/* Constants */
// !!! ******** FOR TEST ONLY CHANGE TO ACTUAL 40 BYTES FPRINT ***********
	bytes32 constant public KEYID = 0x9BCB2540EBAC30FC9E9EFF3D259B64A2;
	bytes32 constant internal CONTRACTNAME = "Able";

/* State Variables */

    // This is where we keep all the contracts.

/* Events */
/* Modifiers */
/* Functions */ 

	///////////////////
	// Controller Logic

		// Change the owner of a contract
		/// @notice `owner` can step down and assign some other address to this role
		/// @param _newOwner _sig The address of the new owner. 0x0 can be used to create
		///  an unowned neutral vault, however that cannot be undone
		function changeOwner(address _newOwner, bytes32 _sig) public returns (bool);

		/// @notice `contrl` can step down and assign some other address to this role
		/// @param _newCtrl _sig The address of the new owner. 0x0 can be used to create
		///  an unowned neutral vault, however that cannot be undone
		function changeContrl(Able _newCtrl, bytes32 _sig) public returns (bool);

		/// @notice `controller` can step down and assign some other address to this role
		/// @param _sig The address of the new controller is the address of the contrl. 
		///  0x0 can be used to create an unowned neutral vault, however that cannot be undone
		function changeController(bytes32 _sig) public returns (bool);
	///////////////////


    /// @notice Get the address of an existing contract frrom the controller.
    /// @param _address The new controller of the contract
	//  @dev `Controller` can retrive a registered contract
    function getContract(address _address) view external returns (bytes32);

    /// @notice Add a new contract to the controller. This will not overwrite an existing contract.
    /// @param _address _name The address of the new owner. 0x0 can be used to create
	//  @dev `Controller` can register a contract and assign to it some role
    function registerContract(
		address _address, 
		bytes32 _name,
		bytes32 _sig) external returns (bool);

    // Remove a contract from the controller. We could also selfdestruct if we want to.
    function removeContract(address _address, bytes32 _sig) external returns (bool result);
                
    // // Make a new contract.
    // function makeContract(bytes32 _base, bytes32 _sig) public returns (address contract_) {
	// 	require(_sig == 0x0);
	// 	// require(verify(_sig,_v,_r,_s) == controller);
    //     if (_base == "database") {
    //         contract_ = new Database(contrl);
    //         contracts[contract_] = Database(contract_).cName();
    //     } else if (_base == "userbase") {
    //         contract_ = new Userbase(contrl);
    //         contracts[contract_] = Userbase(contract_).cName();
    //     } else if (_base == "creator") {
    //         contract_ = new Creators(this,userbase,_base);
    //         contracts[contract_] = Creators(contract_).cName();
    //     }
    // }
        
                
    // // Make a new creators contract.
    // function makeCreators(bytes32 _name) onlyController public returns (Creators create) {
    //     create = new Creators(this,userbase,_name);
    //     contracts[create] = create.cName();
    // }
/* End of Able */
}
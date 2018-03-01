pragma solidity ^0.4.19;

/*
file:   Reserve.sol
ver:    0.3.8
updated:8-Dec-2016
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

An DoitToken compliant token with currency
exchange functionality here called an 'Intrinsically Tradable
Token' (Reserve).

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.
*/

import "./DoitToken.sol";
import "./LibCLL.sol";

contract ReserveInterface {

    using LibCLLu for LibCLLu.CLL;

/* Constants */

    string constant public VERSION = "Reserve 0.3.8";
    uint constant HEAD = 0;
    uint constant MINNUM = uint(1);
    // use only 128 bits of uint to prevent mul overflows.
    uint constant MAXNUM = 2**128;
    uint constant MINPRICE = uint(1);
    uint constant NEG = uint(-1); //2**256 - 1
    bool constant PREV = false;
    bool constant NEXT = true;
    bool constant BID = false;
    bool constant ASK = true;

    // minimum gas required to prevent out of gas on 'take' loop
    uint constant MINGAS = 100000;

    // For staging and commiting trade details.  This saves unneccessary state
    // change gas usage during multi order takes but does increase logic
    // complexity when encountering 'trade with self' orders
    struct TradeMessage {
        bool make;
        bool side;
        uint price;
        uint tradeAmount;
        uint balance;
        uint etherBalance;
    }

/* State Variables */

    DoitToken public doit;              // The new token for this Campaign
    address public vaultAddress;        // The address to hold the funds donated 
    uint public startFundingTime;       // In UNIX Time Format
    uint public endFundingTime;         // In UNIX Time Format
    uint public maximumFunding;         // In wei
    uint public totalCollected;         // In wei
    
    // Exchange prices
    uint256 public sellPrice;
    bytes32 public realRate;
    bool public updatedRate;
    uint256 public buyPrice;

	string public oraclizeResult;
	bytes32 public oraclizeId;
	// mapping (bytes32 => bytes32) oraclizeCall;

    // To allow for trade halting by owner.
    bool public trading;

    // Mapping for ether ownership of accumulated deposits, sales and refunds.
    mapping (address => uint) etherBalance;

    // Orders are stored in circular linked list FIFO's which are mappings with
    // price as key and value as trader address.  A trader can have only one
    // order open at each price. Reordering at that price will cancel the first
    // order and push the new one onto the back of the queue.
    mapping (uint => LibCLLu.CLL) orderFIFOs;
    
    // Order amounts are stored in a seperate lookup. The keys of this mapping
    // are `sha3` hashes of the price and trader address.
    // This mapping prevents more than one order at a particular price.
    mapping (bytes32 => uint) amounts;

    // The pricebook is a linked list holding keys to lookup the price FIFO's
    LibCLLu.CLL priceBook = orderFIFOs[0];


/* Events */

    // Triggered on a make sell order
    event Ask (uint indexed price, uint amount, address indexed trader);

    // Triggered on a make buy order
    event Bid (uint indexed price, uint amount, address indexed trader);

    // Triggered on a filled order
    event Sale (uint indexed price, uint amount, address indexed buyer, address indexed seller, bool side);

    // Triggered when trading is started or halted
    event Trading(bool trading);

    event TransfersEnabled(address indexed _from, address indexed _to, bool enabled);
    event Transfer(address indexed _from, address indexed _to, uint256 _amount);
    event FrozenFunds(address target, bool frozen);
    event FactorPayout(address indexed _from, address indexed _to, uint256 _amount);
    event PlanEvent(address indexed _from, address indexed _to, uint256 _amount);
    event PromiseEvent(address indexed _from, address indexed _to, uint256 _amount);
    event Fulfill(address indexed _from, address indexed _to, uint256 _amount);
    event LogPriceUpdated(string price);
    event LogNewOraclizeQuery(string description);

/* Functions Public constant */

    /// @notice Returns best bid or ask price. 
    function spread(bool _side) public constant returns(uint);
    
    /// @notice Returns the order amount for trader `_trader` at '_price'
    /// @param _trader Address of trader
    /// @param _price Price of order
    function getAmount(uint _price, address _trader) 
        public constant returns(uint);

    /// @notice Returns the collective order volume at a `_price`.
    /// @param _price FIFO for price.
    function getPriceVolume(uint _price) public constant returns (uint);

    /// @notice Returns an array of all prices and their volumes.
    /// @dev [even] indecies are the price. [odd] are the volume. [0] is the
    /// index of the spread.
    function getBook() public constant returns (uint[]);

/* Functions Public non-constant*/

    /// @notice Will buy `_amount` tokens at or below `_price` each.
    /// @param _bidPrice Highest price to bid.
    /// @param _amount The requested amount of tokens to buy.
    /// @param _make Value of true will make order if not filled.
    function buy (uint _bidPrice, uint _amount, bool _make)
        payable returns (bool);

    /// @notice Will sell `_amount` tokens at or above `_price` each.
    /// @param _askPrice Lowest price to ask.
    /// @param _amount The requested amount of tokens to buy.
    /// @param _make A value of true will make an order if not market filled.
    function sell (uint _askPrice, uint _amount, bool _make)
        external returns (bool);

    /// @notice Will withdraw `_ether` to your account.
    /// @param _ether The amount to withdraw
    function withdraw(uint _ether)
        external returns (bool success_);

    /// @notice Cancel order at `_price`
    /// @param _price The price at which the order was placed.
    function cancel(uint _price) 
        external returns (bool);

    /// @notice Will set trading state to `_trading`
    /// @param _trading State to set trading to.
    function setTrading(bool _trading) 
        external returns (bool);

/* End of ReserveInterface Contract */ 
}


/* Doit Reserve Token code */ 
/// @dev This is designed to control the issuance of a MiniMe Token for a
///  non-profit Campaign. This contract effectively dictates the terms of the
///  funding round.

contract Reserve is DoitToken, ReserveInterface, usingOraclize {

/* Structs */

/* Modifiers */

    /// @dev Passes if token is currently trading
    modifier isTrading() {
        require(trading);
        _;
    }

    /// @dev Validate buy parameters
    modifier isValidBuy(uint _bidPrice, uint _amount) {
        if ((etherBalance[msg.sender] + msg.value) < (_amount * _bidPrice) || 
        _amount == 0 || _amount > totalSupply() ||
            _bidPrice <= MINPRICE || _bidPrice >= MAXNUM) 
            revert(); // has insufficient ether.
        _;
    }

    /// @dev Validates sell parameters. Price must be larger than 1.
    modifier isValidSell(uint _askPrice, uint _amount) {
        if (_amount > balanceOf(msg.sender) || _amount == 0 || 
        _askPrice < MINPRICE || _askPrice > MAXNUM) 
            revert();
        _;
    }
    
    /// @dev Validates ether balance
    modifier hasEther(address _member, uint _ether) {
        if (etherBalance[_member] < _ether) 
        revert();
        _;
    }

    /// @dev Validates token balance
    modifier hasBalance(address _member, uint _amount) {
        if (balanceOf(_member) < _amount) 
        revert();
        _;
    }

    /// @dev Guards callback function
    modifier onlyOraclize {
		require (msg.sender == oraclize_cbAddress());
		_;
	}

/* Functions */

    function Reserve(
        address _tokenFactory,
        address _parentToken,
        uint _parentSnapShotBlock,
        string _tokenName,
        string _tokenSymbol,
        uint8 _decimalUnits,
        string _tokenVersion,
        uint _tokenMaturity,
        bool _transfersEnabled,
        Able _ctrl
        ) 
            DoitToken(
            _tokenFactory,
            _parentToken,
            _parentSnapShotBlock,
            _tokenName,
            _tokenSymbol,
            _decimalUnits,
            _tokenVersion,
            _tokenMaturity,
            _transfersEnabled,
            _ctrl
            )
            {
        // setup pricebook and maximum spread.
        priceBook.cll[HEAD][PREV] = MINPRICE;
        priceBook.cll[MINPRICE][PREV] = MAXNUM;
        priceBook.cll[HEAD][NEXT] = MAXNUM;
        priceBook.cll[MAXNUM][NEXT] = MINPRICE;
        trading = true;
        transfer(owner, totalSupply()); //!!! WHAT IS THE RESERVE BALANCE?
    }

////////////////
// Enable tokens transfers
////////////////

    /// @notice Enables token holders to transfer their tokens freely if true
    // @param _transfersEnabled True if transfers are allowed in the clone
    function enableTransfers(bool _transfersEnabled) public onlyController {
        transfersEnabled = _transfersEnabled;
    }

////////////////
// Freeze Account
////////////////
    
    /// @notice `freeze? Prevent | Allow` `target` from sending & receiving tokens
    // @param target Address to be frozen
    // @param freeze either to freeze it or not
    function freezeAccount(address target, bool freeze) onlyController public {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);/// @notice Enables token holders to transfer their tokens freely if true
    }


////////////////
// Generate and destroy tokens
////////////////

    /// @notice Generates `_amount` tokens that are assigned to `_owner`
    // @param _owner The address that will be assigned the new tokens
    // @param _amount The quantity of tokens generated
    // @return True if the tokens are generated correctly
    function generateTokens(address _owner, uint _amount
    ) public onlyController returns (bool)
    {
        uint curTotalSupply = totalSupply();
        require(curTotalSupply + _amount >= curTotalSupply); // Check for overflow
        uint previousBalanceTo = balanceOf(_owner);
        require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow
        updateValueAtNow(totalSupplyHistory, curTotalSupply + _amount);
        updateValueAtNow(balances[_owner], previousBalanceTo + _amount);
        Transfer(0, _owner, _amount);
        return true;
    }

    /// @notice Burns `_amount` tokens from `_owner`
    // @param _owner The address that will lose the tokens
    // @param _amount The quantity of tokens to burn
    // @return True if the tokens are burned correctly
    function destroyTokens(address _owner, uint _amount
    ) onlyController public returns (bool)
    {
        uint curTotalSupply = totalSupply();
        require(curTotalSupply >= _amount);
        uint previousBalanceFrom = balanceOf(_owner);
        require(previousBalanceFrom >= _amount);
        updateValueAtNow(totalSupplyHistory, curTotalSupply - _amount);
        updateValueAtNow(balances[_owner], previousBalanceFrom - _amount);
        Transfer(_owner, 0, _amount);
        return true;
    }

////////////////////
// Clone Token Logic
////////////////////

    /// @notice Creates a new clone token with the initial distribution being
    //  this token at `_snapshotBlock`
    // @param _cloneTokenName Name of the clone token
    // @param _cloneDecimalUnits Number of decimals of the smallest unit
    // @param _cloneTokenSymbol Symbol of the clone token
    // @param _snapshotBlock Block when the distribution of the parent token is
    //  copied to set the initial distribution of the new clone token;
    //  if the block is zero than the actual block, the current block is used
    // @param _transfersEnabled True if transfers are allowed in the clone
    // @return The address of the new DoitToken Contract
    function createCloneToken(
        string _cloneTokenName,
        string _cloneTokenSymbol,
        uint8 _cloneDecimalUnits,
        string _cloneVersion,
        uint _cloneMaturity,
        uint _snapshotBlock,
        bool _transfersEnabled,
        Able _ctrl
        ) public returns(address)
        {
            if (_snapshotBlock == 0)
            _snapshotBlock = block.number;
            DoitToken cloneToken = tokenFactory.createCloneToken(
                this,
                _snapshotBlock,
                _cloneTokenName,
                _cloneTokenSymbol,
                _cloneDecimalUnits,
                _cloneVersion,
                _cloneMaturity,
                _transfersEnabled,
                _ctrl
            );

        cloneToken.changeController(msg.sender);

        // An event to make the token easy to find on the blockchain
        NewCloneToken(address(cloneToken), _snapshotBlock);
        return address(cloneToken);
    }

/////////////////////
// Fund Manager Logic
/////////////////////

    /// @notice 'Campaign()' initiates the Campaign by setting its funding
    //  parameters
    // @dev There are several checks to make sure the parameters are acceptable
    // @param _startFundingTime The UNIX time that the Campaign will be able to
    //  start receiving funds
    // @param _endFundingTime The UNIX time that the Campaign will stop being able
    //  to receive funds
    // @param _maximumFunding In wei, the Maximum amount that the Campaign can
    //  receive (currently the max is set at 10,000 ETH for the beta)
    // @param _vaultAddress The address that will store the donated funds
    // @param _tokenAddress Address of the token contract this contract controls
    function fundManager(
        uint _startFundingTime,
        uint _endFundingTime,
        uint _maximumFunding,
        address _vaultAddress,
        address _tokenAddress
        ) {
            // Cannot end in the past
            require((_endFundingTime >= now) && 
            (_endFundingTime > _startFundingTime) && 
            // The Beta is limited
            (_maximumFunding <= 10000 ether) && 
            // To prevent burning ETH
            (_vaultAddress != 0));                    
        startFundingTime = _startFundingTime;
        endFundingTime = _endFundingTime;
        maximumFunding = _maximumFunding;
        doit = DoitToken(_tokenAddress);// The Deployed Token Contract
        vaultAddress = _vaultAddress;
    }

    /// @dev The fallback function is called when ether is sent to the contract, it
    //  simply calls `doPayment()` with the address that sent the ether as the
    //  `_owner`. Payable is a required solidity modifier for functions to receive
    //  ether, without this modifier functions will throw if ether is sent to them
    function ()  payable {
        doPayment(msg.sender);
    }

    /// @notice `proxyPayment()` allows the caller to send ether to the Campaign and
    //  have the tokens created in an address of their choosing
    // @param _owner The address that will hold the newly created tokens
    function proxyPayment(address _owner) payable returns(bool) {
        doPayment(_owner);
        return true;
    }

    /// @notice Notifies the controller about a transfer, for this Campaign all
    //  transfers are allowed by default and no extra notifications are needed
    // @param _from The origin of the transfer
    // @param _to The destination of the transfer
    // @param _amount The amount of the transfer
    // @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) returns(bool) {
        return true;
    }

    /// @notice Notifies the controller about an approval, for this Campaign all
    //  approvals are allowed by default and no extra notifications are needed
    // @param _owner The address that calls `approve()`
    // @param _spender The spender in the `approve()` call
    // @param _amount The amount in the `approve()` call
    // @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount)
    returns(bool)
        {
        return true;
    }


    /// @dev `doPayment()` is an internal function that sends the ether that this
    //  contract receives to the `vault` and creates tokens in the address of the
    //  `_owner` assuming the Campaign is still accepting funds
    // @param _owner The address that will hold the newly created tokens
    function doPayment(address _owner) internal {

    // First check that the Campaign is allowed to receive this donation
        require((now >= startFundingTime) &&
            (now <= endFundingTime) &&
            (controller != 0) &&           // Extra check
            (msg.value != 0) &&
            (totalCollected + msg.value <= maximumFunding));

    //Track how much the Campaign has collected
        totalCollected += msg.value;

    //Send the ether to the vault
        require (vaultAddress.send(msg.value));

    // Creates an equal amount of tokens as ether sent. The new tokens are created
    //  in the `_owner` address
        require (generateTokens(_owner, msg.value));

        return;
    }

    /// @notice `finalizeFunding()` ends the Campaign by calling setting the
    //  controller to 0, thereby ending the issuance of new tokens and stopping the
    //  Campaign from receiving more ether
    // @dev `finalizeFunding()` can only be called after the end of the funding period.
    function finalizeFunding() {
        require(now >= endFundingTime);
        changeController(0);
    }

/////////////////
// Exchange Logic
/////////////////

    /// @notice `onlyOwner` changes the location that ether is sent
    // @param _newVaultAddress The address that will receive the ether sent to this
    //  Campaign
    function setVault(address _newVaultAddress) onlyOwner {
        vaultAddress = _newVaultAddress;
    }

    /// @notice Allow users to buy tokens for `newBuyPrice` eth and sell tokens for `newSellPrice` eth
    /// @param newSellPrice Price the users can sell to the contract
    /// @param newBuyPrice Price users can buy from the contract
    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyController public {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }

    function setPrices(bytes32 _control) onlyController public {
        realRate = _control;
    }

    function __callback(bytes32 myid, string result) {
        sellPrice = parseInt(result,3);
        updatedRate = true;
        LogPriceUpdated(result);
    }

    function setPrices() internal returns (bool) {
        if (realRate == "computed") {
            // money supply "M": that is, the total number of coins minted
            uint m = totalSupply();
            // “velocity "V"; that is, the number of transactions per day
            uint v = totalTransactions;
            // transaction volume "T": that is, the economic value of transactions per day
            uint t = m * v;
            // price level "P": that is, the price of goods and services in terms of the token
            // Velocity "V": = M * N": where "N" coins, change hands "M" times times per day
            // Hodle "H" = 1 / V": where “H” time, period that a user holds a coin before using it to make a transaction
            uint h = 1/v;
            // currency value "C" = 1/P: where “C” value, the price of the currency (inverse of the price level)
            uint c = ((t * h)/m);
            sellPrice = c;
            return true;
        } else if (realRate == "sourced") {
            updatedRate = false; 
            return updatePrice();
            }
		}

    function updatePrice() public payable returns (bool) {
            if (oraclize_getPrice("URL") > this.balance) {
            LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
			return false;
			} else {
				// Oraclize can be queried
				string memory fromCurrency = "BBc6eMv0JDgmEpODSfeusLPyoi8iBF7Axk8vrf9mNlNgxDnPHzB/udAp57ZQqGe8DmGDn8Z7v2c1TnVWT41KFYhMQDn9XKM3H5jeR3Ee9T9qcaZHQre4orpfzdhyIUApA6fzrmeirWsQL5DEQmAa+K0=";
				string memory toCurrency = "BDQ9sBW3jkEZSqJc5jTxdgkBZ7TL32siPHOIR1+GMAQ4hNjkNMp5IiStdJFh64yja0IkWpLHafdyNuMWg7qq/fqp64dClvaJuf9/XvHpcNdbJNkbza/NDkWyAw==";
				// oraclizeId = oraclize_query("URL", "json(https://pgp.cs.uu.nl/stats/8b962943fc243f3c.json).KEY");
				oraclizeId = oraclize_query("URL", strConcat(fromCurrency,toCurrency));
				// oraclizeCall[oraclizeId] = strConcat(fromCurrency,toCurrency);
				LogNewOraclizeQuery("Oraclize query was sent for REPUTATION, standing by for the answer..");
				return true;
            }
    }

    /// @notice Buy tokens from contract by sending ether
    function buy() payable public returns (bool success) {
        uint amount = msg.value / buyPrice;               // calculates the amount
        require(transfersEnabled);
        doTransfer(this, msg.sender, amount);              // makes the transfers
        return true;
    }

    /// @notice Sell `amount` tokens to contract
    /// @param amount amount of tokens to be sold
    function sell(uint256 _amount) public returns (bool success) {
        require(transfersEnabled);
        require(setPrices());
        require(updatedRate);
        require(this.balance >= _amount * sellPrice);      // checks if the contract has enough ether to buy
        require(destroyTokens(msg.sender, _amount));             // burns the tokens been liquidated
        // doTransfer(msg.sender, this, _amount);              // makes the transfers
        msg.sender.transfer(_amount * sellPrice);          // sends ether to the seller. It's important to do this last to avoid recursion attacks
        return true;
    }

///////////////////
// Input Stake Logic
////////////////////

/* Functions Getters */

    function etherBalanceOf(address _addr) public constant returns (uint) {
        return etherBalance[_addr];
    }

    function spread(bool _side) public constant returns(uint) {
        return priceBook.step(HEAD, _side);
    }

    function getAmount(uint _price, address _trader) 
        public constant returns(uint)
        {
        return amounts[sha3(_price, _trader)];
    }

    function sizeOf(uint l) constant returns (uint s) {
        if (l == 0) 
        return priceBook.sizeOf();
        return orderFIFOs[l].sizeOf();
    }
    
    function getPriceVolume(uint _price) public constant returns (uint v_) {
        uint n = orderFIFOs[_price].step(HEAD,NEXT);
        while (n != HEAD) { 
            v_ += amounts[sha3(_price, address(n))];
            n = orderFIFOs[_price].step(n, NEXT);
        }
        return;
    }

    function getBook() public constant returns (uint[]) {
        uint i; 
        uint p = priceBook.step(MINNUM, NEXT);
        uint[] memory volumes = new uint[](priceBook.sizeOf() * 2 - 2);
        while (p < MAXNUM) {
            volumes[i++] = p;
            volumes[i++] = getPriceVolume(p);
            p = priceBook.step(p, NEXT);
        }
        return volumes; 
    }
    
    function numOrdersOf(address _addr) public constant returns (uint) {
        uint c;
        uint p = MINNUM;
        while (p < MAXNUM) {
            if (amounts[sha3(p, _addr)] > 0) 
            c++;
            p = priceBook.step(p, NEXT);
        }
        return c;
    }
    
    function getOpenOrdersOf(address _addr) public constant returns (uint[]) {
        uint i;
        uint c;
        uint p = MINNUM;
        uint[] memory open = new uint[](numOrdersOf(_addr)*2);
        p = MINNUM;
        while (p < MAXNUM) {
            if (amounts[sha3(p, _addr)] > 0) {
                open[i++] = p;
                open[i++] = amounts[sha3(p, _addr)];
            }
            p = priceBook.step(p, NEXT);
        }
        return open;
    }

    function getNode(uint _list, uint _node) public constant returns(uint[2]) {
        return [orderFIFOs[_list].cll[_node][PREV], 
            orderFIFOs[_list].cll[_node][NEXT]];
    }
    
/* Functions Public */

    // Here non-constant public functions act as a security layer. They are re-entry
    // protected so cannot call each other. For this reason, they
    // are being used for parameter and enterance validation, while internal
    // functions manage the logic. This also allows for deriving contracts to
    // overload the public function with customised validations and not have to
    // worry about rewritting the logic.
    function buy (uint _bidPrice, uint _amount, bool _make)
        payable
        canEnter
        isTrading
        isValidBuy(_bidPrice, _amount)
        returns (bool)
    {
        trade(_bidPrice, _amount, BID, _make);
        return true;
    }

    function sell (uint _askPrice, uint _amount, bool _make)
        external
        canEnter
        isTrading
        isValidSell(_askPrice, _amount)
        returns (bool)
    {
        trade(_askPrice, _amount, ASK, _make);
        return true;
    }

    function withdraw(uint _ether)
        external
        canEnter
        hasEther(msg.sender, _ether)
        returns (bool success_)
    {
        etherBalance[msg.sender] -= _ether;
        safeSend(msg.sender, _ether);
        success_ = true;
    }

    function cancel(uint _price)
        external
        canEnter
        returns (bool)
    {
        TradeMessage memory tmsg;
        tmsg.price = _price;
        tmsg.balance = balanceOf(msg.sender);
        tmsg.etherBalance = etherBalance[msg.sender];
        cancelIntl(tmsg);
        transfer(msg.sender, tmsg.balance);
        etherBalance[msg.sender] = tmsg.etherBalance;
        return true;
    }
    
    function setTrading(bool _trading)
        external
        onlyOwner
        canEnter
        returns (bool)
    {
        trading = _trading;
        Trading(true);
        return true;
    }

/* Functions Internal */

    // Internal functions handle this contract's logic.
    function trade (uint _price, uint _amount, bool _side, bool _make) internal {
        TradeMessage memory tmsg;
        tmsg.price = _price;
        tmsg.tradeAmount = _amount;
        tmsg.side = _side;
        tmsg.make = _make;
        
        // Cache state balances to memory and commit to storage only once after trade.
        tmsg.balance = balanceOf(msg.sender);
        tmsg.etherBalance = etherBalance[msg.sender] + msg.value;

        take(tmsg);
        make(tmsg);
        
        transfer(msg.sender, tmsg.balance);
        etherBalance[msg.sender] = tmsg.etherBalance;
    }
    
    function take (TradeMessage tmsg) internal {
        address maker;
        bytes32 orderHash;
        uint takeAmount;
        uint takeEther;
        // use of signed math on unsigned ints is intentional
        uint sign = tmsg.side ? uint(1) : uint(-1);
        uint bestPrice = spread(!tmsg.side);

        // Loop with available gas to take orders
        while (
            tmsg.tradeAmount > 0 && 
            cmpEq(tmsg.price, bestPrice, !tmsg.side) && 
            msg.gas > MINGAS
            )
        {
            maker = address(orderFIFOs[bestPrice].step(HEAD, NEXT));
            orderHash = sha3(bestPrice, maker);
            if (tmsg.tradeAmount < amounts[orderHash]) {
                // Prepare to take partial order
                amounts[orderHash] = safeSub(amounts[orderHash], tmsg.tradeAmount);
                takeAmount = tmsg.tradeAmount;
                tmsg.tradeAmount = 0;
            } else {
                // Prepare to take full order
                takeAmount = amounts[orderHash];
                tmsg.tradeAmount = safeSub(tmsg.tradeAmount, takeAmount);
                closeOrder(bestPrice, maker);
            }
            takeEther = safeMul(bestPrice, takeAmount);
            // signed multiply on uints is intentional and so safeMaths will 
            // break here. Valid range for exit balances are 0..2**128 
            tmsg.etherBalance += takeEther * sign;
            tmsg.balance -= takeAmount * sign;
            if (tmsg.side) {
                // Sell to bidder
                if (msg.sender == maker) {
                    // bidder is self
                    tmsg.balance += takeAmount;
                } else {
                    takeAmount += balanceOf(maker);
                    transfer(maker,takeAmount);
                }
            } else {
                // Buy from asker;
                if (msg.sender == maker) {
                    // asker is self
                    tmsg.etherBalance += takeEther;
                } else {                
                    etherBalance[maker] += takeEther;
                }
            }
            Sale (bestPrice, takeAmount, msg.sender, maker, tmsg.side);
            // prep for next order
            bestPrice = spread(!tmsg.side);
        }
    }

    function make(TradeMessage tmsg)
        internal
    {
        bytes32 orderHash;
        if (tmsg.tradeAmount == 0 || !tmsg.make || msg.gas < MINGAS) 
        return;
        orderHash = sha3(tmsg.price, msg.sender);
        if (amounts[orderHash] != 0) {
            // Cancel any pre-existing owned order at this price
            cancelIntl(tmsg);
        }
        if (!orderFIFOs[tmsg.price].exists()) {
            // Register price in pricebook
            priceBook.insert(
                priceBook.seek(HEAD, tmsg.price, tmsg.side),
                tmsg.price, !tmsg.side);
        }

        amounts[orderHash] = tmsg.tradeAmount;
        orderFIFOs[tmsg.price].push(uint(msg.sender), PREV); 

        if (tmsg.side) {
            tmsg.balance -= tmsg.tradeAmount;
            Ask (tmsg.price, tmsg.tradeAmount, msg.sender);
        } else {
            tmsg.etherBalance -= tmsg.tradeAmount * tmsg.price;
            Bid (tmsg.price, tmsg.tradeAmount, msg.sender);
        }
    }

    function cancelIntl(TradeMessage tmsg) internal {
        uint amount = amounts[sha3(tmsg.price, msg.sender)];
        if (amount == 0) 
        return;
        if (tmsg.price > spread(BID)) 
        tmsg.balance += amount; // was ask
        else 
        tmsg.etherBalance += tmsg.price * amount; // was bid
        closeOrder(tmsg.price, msg.sender);
    }

    function closeOrder(uint _price, address _trader) internal {
        orderFIFOs[_price].remove(uint(_trader));
        if (!orderFIFOs[_price].exists())  {
            priceBook.remove(_price);
        }
        delete amounts[sha3(_price, _trader)];
    }
/* End of Reserve Contract */
}
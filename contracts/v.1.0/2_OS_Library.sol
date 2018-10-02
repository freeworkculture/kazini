/**
* file:   OS_Library.sol
* ver:    0.2.3
* updated:20-Apr-2018
* author: Darryl Morris 
* contributors: terraflops
* email:  o0ragman0o AT gmail.com
* 
* An inheritable contract containing math functions and comparitors.
* 
* This software is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU lesser General Public License for more details.
* <http://www.gnu.org/licenses/>.
*/

pragma solidity ^0.4.24;

/**
 * @title SafeMathLib
 * @dev Math operations with safety checks that revert on error
 */
library SafeMathLib {

/* Constants */

    string constant public VERSION = "Math 0.2.3";
    uint constant NULL = 0;
    bool constant LT = false;
    bool constant GT = true;
    // No type bool <-> int type conversion in solidity :~(
    uint constant iTRUE = 1;
    uint constant iFALSE = 0;
    uint constant iPOS = 1;
    uint constant iZERO = 0;
    uint constant iNEG = uint(-1);


/* Modifiers */

/* Functions */
    
    // @dev Parametric comparator for > or <
    // !_sym returns a < b
    // _sym  returns a > b
    function cmp(uint a, uint b, bool _sym) internal pure returns (bool)
    {
        return (a!=b) && ((a < b) != _sym);
    }

    /// @dev Parametric comparator for >= or <=
    /// !_sym returns a <= b
    /// _sym  returns a >= b
    function cmpEq(uint a, uint b, bool _sym) internal pure returns (bool)
    {
        return (a==b) || ((a < b) != _sym);
    }
    
    /// Trichotomous comparator
    /// a < b returns -1
    /// a == b returns 0
    /// a > b returns 1
/*    function triCmp(uint a, uint b) internal pure returns (bool)
    {
        uint c = a - b;
        return c & c & (0 - 1);
    }
    
    function nSign(uint a) internal pure returns (uint)
    {
        return a & 2^255;
    }
    
    function neg(uint a) internal pure returns (uint) {
        return 0 - a;
    }
*/    


  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a);
    uint256 c = a - b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }

    /// @dev Helper function to return a min betwen the two uints
    function min(uint a, uint b) pure internal returns (uint) {
        return a < b ? a : b;
    }
}

/**
 * Utility library of inline functions on addresses
 */
library AddressLib {

    /**
    * Returns whether the target address is a contract
    * @dev This function will return false if invoked during the constructor of a contract,
    * as the code is not actually created until after the constructor finishes.
    * @param account address of the account to check
    * @return whether the target address is a contract
    */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
    // XXX Currently there is no better way to check if there is a contract in an address
    // than to check the size of the code at that address.
    // See https://ethereum.stackexchange.com/a/14016/36603
    // for more details about how this works.
    // TODO Check this again before the Serenity release, because all addresses will be
    // contracts then.
    // solium-disable-next-line security/no-inline-assembly
    assembly { size := extcodesize(account) }
    return size > 0;
    }

}
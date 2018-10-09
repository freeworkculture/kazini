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

pragma solidity ^0.4.25;

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
/* End of Library SafeMathLib */
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
/* End of Library Address */
}

/**
* @title ERC165Checker
* @dev Use `using ERC165Checker for address`; to include this library
* https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md
*/
library ERC165Checker {
    // As per the EIP-165 spec, no interface should ever match 0xffffffff
    bytes4 private constant _InterfaceId_Invalid = 0xffffffff;

    bytes4 private constant _InterfaceId_ERC165 = 0x01ffc9a7;
    /**
    * 0x01ffc9a7 ===
    *   bytes4(keccak256('supportsInterface(bytes4)'))
    */

    /**
    * @notice Query if a contract supports ERC165
    * @param account The address of the contract to query for support of ERC165
    * @return true if the contract at account implements ERC165
    */
    function supportsERC165(address account)
        internal
        view
        returns (bool)
    {
        // Any contract that implements ERC165 must explicitly indicate support of
        // InterfaceId_ERC165 and explicitly indicate non-support of InterfaceId_Invalid
        return supportsERC165Interface(account, _InterfaceId_ERC165) &&
            !supportsERC165Interface(account, _InterfaceId_Invalid);
    }

    /**
    * @notice Query if a contract implements an interface, also checks support of ERC165
    * @param account The address of the contract to query for support of an interface
    * @param interfaceId The interface identifier, as specified in ERC-165
    * @return true if the contract at account indicates support of the interface with
    * identifier interfaceId, false otherwise
    * @dev Interface identification is specified in ERC-165.
    */
    function supportsInterface(address account, bytes4 interfaceId)
    internal
    view
    returns (bool)
    {
        // query support of both ERC165 as per the spec and support of _interfaceId
        return supportsERC165(account) &&
            supportsERC165Interface(account, interfaceId);
    }

    /**
    * @notice Query if a contract implements interfaces, also checks support of ERC165
    * @param account The address of the contract to query for support of an interface
    * @param interfaceIds A list of interface identifiers, as specified in ERC-165
    * @return true if the contract at account indicates support all interfaces in the
    * interfaceIds list, false otherwise
    * @dev Interface identification is specified in ERC-165.
    */
    function supportsInterfaces(address account, bytes4[] interfaceIds)
    internal
    view
    returns (bool)
    {
        // query support of ERC165 itself
        if (!supportsERC165(account)) {
            return false;
        }

        // query support of each interface in _interfaceIds
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            if (!supportsERC165Interface(account, interfaceIds[i])) {
            return false;
            }
        }

        // all interfaces supported
        return true;
        }

    /**
    * @notice Query if a contract implements an interface, does not check ERC165 support
    * @param account The address of the contract to query for support of an interface
    * @param interfaceId The interface identifier, as specified in ERC-165
    * @return true if the contract at account indicates support of the interface with
    * identifier interfaceId, false otherwise
    * @dev Assumes that account contains a contract that supports ERC165, otherwise
    * the behavior of this method is undefined. This precondition can be checked
    * with the `supportsERC165` method in this library.
    * Interface identification is specified in ERC-165.
    */
    function supportsERC165Interface(address account, bytes4 interfaceId)
    private
    view
    returns (bool)
    {
        // success determines whether the staticcall succeeded and result determines
        // whether the contract at account indicates support of _interfaceId
        (bool success, bool result) = callERC165SupportsInterface(
            account, interfaceId);

        return (success && result);
        }

    /**
    * @notice Calls the function with selector 0x01ffc9a7 (ERC165) and suppresses throw
    * @param account The address of the contract to query for support of an interface
    * @param interfaceId The interface identifier, as specified in ERC-165
    * @return success true if the STATICCALL succeeded, false otherwise
    * @return result true if the STATICCALL succeeded and the contract at account
    * indicates support of the interface with identifier interfaceId, false otherwise
    */
    function callERC165SupportsInterface(
    address account,
    bytes4 interfaceId
    )
    private
    view
    returns (bool success, bool result)
    {
        bytes memory encodedParams = abi.encodeWithSelector(
            _InterfaceId_ERC165,
            interfaceId
        );

    // solium-disable-next-line security/no-inline-assembly
    assembly {
        let encodedParams_data := add(0x20, encodedParams)
        let encodedParams_size := mload(encodedParams)

        let output := mload(0x40)  // Find empty storage location using "free memory pointer"
        mstore(output, 0x0)

        success := staticcall(
        30000,                 // 30k gas
        account,              // To addr
        encodedParams_data,
        encodedParams_size,
        output,
        0x20                   // Outputs are 32 bytes long
        )

        result := mload(output)  // Load the result
        }
        }
/* End of Libray ERC165Checker */
}

/// Library to convert between types

library StringsAndBytesLib {

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        // require(bytes(source).length <= 32); // causes error
        // but string have to be max 32 chars
        // https://ethereum.stackexchange.com/questions/9603/understanding-mload-assembly-function
        // http://solidity.readthedocs.io/en/latest/assembly.html
        assembly {
        result := mload(add(source, 32))
        }
    }//


    function isStringEqualOrShorterThan(string memory str, uint256 length) public pure returns (bool){
        return bytes(str).length <= length;
    }//


    /* bytes to string */
    function bytesArrayToString(bytes memory _bytes) public pure returns (string) {
        return string(_bytes);
    } //

    /* string to bytes */
    function stringToBytesArray(string memory str) public pure returns (bytes){
        return bytes(str);
    } //

    /* bytes32 (fixed-size array) to bytes (dynamically-sized array) */
    function bytes32ToBytes(bytes32 _bytes32) public pure returns (bytes){
        // string memory str = string(_bytes32);
        // TypeError: Explicit type conversion not allowed from "bytes32" to "string storage pointer"
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return bytesArray;
    }//

    /* bytes32 to string */
    // see also:
    // https://ethereum.stackexchange.com/questions/2519/how-to-convert-a-bytes32-to-string
    // https://ethereum.stackexchange.com/questions/1081/how-to-concatenate-a-bytes32-array-to-a-string
    function bytes32ToString(bytes32 _bytes32) public pure returns (string){
        bytes memory bytesArray = bytes32ToBytes(_bytes32);
        return string(bytesArray);
    }//


    /* ethereum address to string */
    // https://ethereum.stackexchange.com/questions/8346/convert-address-to-string
    // https://ethereum.stackexchange.com/a/8447/1964
    function addressToAsciiString(address _address) public pure returns (string) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(_address) / (2 ** (8 * (19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    } //
    function char(byte b) public pure returns (byte c) {
        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }


    function addressToString(address _address) public pure returns (string) {
        return stringsConcatenation("0x", addressToAsciiString(_address));
    }

    function messageSenderAddressToString() public constant returns (string){
        return addressToString(msg.sender);
    }

    /* --------------------- strings functions begin        */
    /* --- https://github.com/Arachnid/solidity-stringutils */

    struct slice {uint _len; uint _ptr;}

    function memcpy(uint dest, uint src, uint len) private pure {
        for (; len >= 32; len -= 32) {
            assembly {
            mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }
        uint mask = 256 ** (32 - len) - 1;
        assembly {
        let srcpart := and(mload(src), not(mask))
        let destpart := and(mload(dest), mask)
        mstore(dest, or(destpart, srcpart))
        }
    }

    /*
     * @dev Returns a slice containing the entire string.
     * @param self The string to make a slice from.
     * @return A newly allocated slice containing the entire string.
     */
    function toSlice(string self) internal pure returns (slice) {
        uint ptr;
        assembly {
        ptr := add(self, 0x20)
        }
        return slice(bytes(self).length, ptr);
    }

    /*
     * @dev Returns a newly allocated string containing the concatenation of `self` and `other`.
     * @param self The first slice to concatenate.
     * @param other The second slice to concatenate.
     * @return The concatenation of the two strings.
     */
    function concat(slice self, slice other) internal pure returns (string) {
        string memory ret = new string(self._len + other._len);
        uint retptr;
        assembly {retptr := add(ret, 32)}
        memcpy(retptr, self._ptr, self._len);
        memcpy(retptr + self._len, other._ptr, other._len);
        return ret;
    }

    /*
     * @dev Joins an array of slices, using `self` as a delimiter, returning a newly allocated string.
     * @param self The delimiter to use.
     * @param parts A list of slices to join.
     * @return A newly allocated string containing all the slices in `parts`, joined with `self`.
     */
    function join(slice self, slice[] parts) internal pure returns (string) {
        if (parts.length == 0)
        return "";
        uint length = self._len * (parts.length - 1);
        for (uint i = 0; i < parts.length; i++)
        length += parts[i]._len;
        string memory ret = new string(length);
        uint retptr;
        assembly {retptr := add(ret, 32)}
        for (i = 0; i < parts.length; i++) {
            memcpy(retptr, parts[i]._ptr, parts[i]._len);
            retptr += parts[i]._len;
            if (i < parts.length - 1) {
                memcpy(retptr, self._ptr, self._len);
                retptr += self._len;
            }
        }
        return ret;
    }
    /* --------------------- strings -- end   */

    function stringsConcatenation(string str1, string str2) public pure returns (string) {
        return concat(toSlice(str1), toSlice(str2));
    } //

    function stringsJoin(string str1, string str2, string str3) public pure returns (string) {
        slice memory delimiter = toSlice(" ");
        // see: http://solidity.readthedocs.io/en/v0.4.15/types.html#arrays
        // http://solidity.readthedocs.io/en/v0.4.15/types.html#allocating-memory-arrays
        slice[] memory slicesArray = new slice[](3);
        slicesArray[0] = toSlice(str1);
        slicesArray[1] = toSlice(str2);
        slicesArray[2] = toSlice(str3);
        string memory result = join(delimiter, slicesArray);
        return result;
    }
/* End of Library StringsAndBytesLib */
}
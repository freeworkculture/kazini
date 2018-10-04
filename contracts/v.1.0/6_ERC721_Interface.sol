/*
file:   ERC20.sol
ver:    0.2.6
updated:20-Apr-2018
author: Darryl Morris 
contributors: terraflops
email:  o0ragman0o AT gmail.com

An ERC20 compliant token with reentry protection and safe math.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.
*/

pragma solidity ^0.4.24;

import "./1_Kernel.sol";
import "./2_OS_Library.sol";
import "./5_ERC721_Library.sol";

/**
* @title ERC165
* @author Matt Condon (@shrugs)
* @dev Implements ERC165 using a lookup table.
*/
contract ERC165 is IERC165 {

/* Using */

    using ERC165Lib for bytes4;

    using ERC165Lib for ERC165Lib.STORAGE;

/* Events */

/* Structs */

/* Constants */

    bytes4 private constant _InterfaceId_ERC165 = 0x01ffc9a7;
    /**
    * 0x01ffc9a7 ===
    *   bytes4(keccak256('supportsInterface(bytes4)'))
    */

/* State Valiables */

    ERC165Lib.STORAGE erc165data;

/* Modifiers */

/* Functions */

    /**
    * @dev A contract implementing SupportsInterfaceWithLookup
    * implement ERC165 itself
    */
    constructor()
        public
    {
        erc165data.init();
    }

    /**
    * @dev implement supportsInterface(bytes4) using a lookup table
    */
    function supportsInterface(bytes4 interfaceId)
        external
        view
        returns (bool)
    {
        return erc165data.supportsInterface(interfaceId);
    }

    /**
    * @dev private method for registering an interface
    */
    function _registerInterface(bytes4 interfaceId)
        internal
    {
        return interfaceId._registerInterface(erc165data);
    }
}

/**
* @title ERC721 Non-Fungible Token Standard basic implementation
* @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
*/
contract ERC721 is ERC165, IERC721 {

/* Using */

    using ERC721Lib for ERC721Lib.STORAGE;

/* Events */

/* Structs */

/* Constants */

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

/* State Valiables */

    ERC721Lib.STORAGE erc721data;

/* Modifiers */

/* Function */

    constructor()
        public
    {
        // register the supported interfaces to conform to ERC721 via ERC165
        erc721data.init(erc165data);
    }

    /**
    * @dev Gets the balance of the specified address
    * @param owner address to query the balance of
    * @return uint256 representing the amount owned by the passed address
    */
    function balanceOf(address owner) public view returns (uint256) {
        return erc721data.balanceOf(owner);
    }

    /**
    * @dev Gets the owner of the specified token ID
    * @param tokenId uint256 ID of the token to query the owner of
    * @return owner address currently marked as the owner of the given token ID
    */
    function ownerOf(uint256 tokenId) public view returns (address) {
        return erc721data.ownerOf(tokenId);
    }

    /**
    * @dev Safely transfers the ownership of a given token ID to another address
    * If the target address is a contract, it must implement `onERC721Received`,
    * which is called upon a safe transfer, and return the magic value
    * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
    * the transfer is reverted.
    *
    * Requires the msg sender to be the owner, approved, or operator
    * @param from current owner of the token
    * @param to address to receive the ownership of the given token ID
    * @param tokenId uint256 ID of the token to be transferred
    */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        public
    {
        // solium-disable-next-line arg-overflow
        erc721data.safeTransferFrom(from, to, tokenId);
    }

    /**
    * @dev Safely transfers the ownership of a given token ID to another address
    * If the target address is a contract, it must implement `onERC721Received`,
    * which is called upon a safe transfer, and return the magic value
    * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
    * the transfer is reverted.
    * Requires the msg sender to be the owner, approved, or operator
    * @param from current owner of the token
    * @param to address to receive the ownership of the given token ID
    * @param tokenId uint256 ID of the token to be transferred
    * @param _data bytes data to send along with a safe transfer check
    */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes _data
    )
        public
    {
        erc721data.safeTransferFrom(from, to, tokenId, _data);
    }

    /**
    * @dev Transfers the ownership of a given token ID to another address
    * Usage of this method is discouraged, use `safeTransferFrom` whenever possible
    * Requires the msg sender to be the owner, approved, or operator
    * @param from current owner of the token
    * @param to address to receive the ownership of the given token ID
    * @param tokenId uint256 ID of the token to be transferred
    */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        public
    {
        erc721data.transferFrom(from, to, tokenId);
    }

    /**
    * @dev Approves another address to transfer the given token ID
    * The zero address indicates there is no approved address.
    * There can only be one approved address per token at a given time.
    * Can only be called by the token owner or an approved operator.
    * @param to address to be approved for the given token ID
    * @param tokenId uint256 ID of the token to be approved
    */
    function approve(address to, uint256 tokenId) public {
        erc721data.approve(to, tokenId);
    }

    /**
    * @dev Sets or unsets the approval of a given operator
    * An operator is allowed to transfer all tokens of the sender on their behalf
    * @param to operator address to set the approval
    * @param approved representing the status of the approval to be set
    */
    function setApprovalForAll(address to, bool approved) public {
        erc721data.setApprovalForAll(to, approved);
    }

    /**
    * @dev Gets the approved address for a token ID, or zero if no address set
    * Reverts if the token ID does not exist.
    * @param tokenId uint256 ID of the token to query the approval of
    * @return address currently approved for the given token ID
    */
    function getApproved(uint256 tokenId) public view returns (address) {
        return erc721data.getApproved(tokenId);
    }

    /**
    * @dev Tells whether an operator is approved by a given owner
    * @param owner owner address which you want to query the approval of
    * @param operator operator address which you want to query the approval of
    * @return bool whether the given operator is approved by the given owner
    */
    function isApprovedForAll(
        address owner,
        address operator
    )
        public
        view
        returns (bool)
    {
        return erc721data.isApprovedForAll(owner, operator);
    }

    /**
    * @dev Returns whether the specified token exists
    * @param tokenId uint256 ID of the token to query the existence of
    * @return whether the token exists
    */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return erc721data._exists(tokenId);
    }

    /**
    * @dev Returns whether the given spender can transfer a given token ID
    * @param spender address of the spender to query
    * @param tokenId uint256 ID of the token to be transferred
    * @return bool whether the msg.sender is approved for the given token ID,
    *  is an operator of the owner, or is the owner of the token
    */
    function _isApprovedOrOwner(
        address spender,
        uint256 tokenId
    )
        internal
        view
        returns (bool)
    {
        return erc721data._isApprovedOrOwner(spender, tokenId);
    }

    /**
    * @dev Internal function to mint a new token
    * Reverts if the given token ID already exists
    * @param to The address that will own the minted token
    * @param tokenId uint256 ID of the token to be minted by the msg.sender
    */
    function _mint(address to, uint256 tokenId) internal {
        erc721data._mint(to, tokenId);
    }

    /**
    * @dev Internal function to burn a specific token
    * Reverts if the token does not exist
    * @param tokenId uint256 ID of the token being burned by the msg.sender
    */
    function _burn(address owner, uint256 tokenId) internal {
        erc721data._burn(owner, tokenId);
    }

    /**
    * @dev Internal function to clear current approval of a given token ID
    * Reverts if the given address is not indeed the owner of the token
    * @param owner owner of the token
    * @param tokenId uint256 ID of the token to be transferred
    */
    function _clearApproval(address owner, uint256 tokenId) internal {
        erc721data._clearApproval(owner, tokenId);
    }

    /**
    * @dev Internal function to add a token ID to the list of a given address
    * @param to address representing the new owner of the given token ID
    * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
    */
    function _addTokenTo(address to, uint256 tokenId) internal {
        erc721data._addTokenTo(to, tokenId);
    }

    /**
    * @dev Internal function to remove a token ID from the list of a given address
    * @param from address representing the previous owner of the given token ID
    * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
    */
    function _removeTokenFrom(address from, uint256 tokenId) internal {
        erc721data._removeTokenFrom(from, tokenId);
    }

    /**
    * @dev Internal function to invoke `onERC721Received` on a target address
    * The call is not executed if the target address is not a contract
    * @param from address representing the previous owner of the given token ID
    * @param to target address that will receive the tokens
    * @param tokenId uint256 ID of the token to be transferred
    * @param _data bytes optional data to send along with the call
    * @return whether the call correctly returned the expected magic value
    */
    function _checkAndCallSafeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes _data
    )
        internal
        returns (bool)
    {
        return erc721data._checkAndCallSafeTransfer(from, to, tokenId, _data);
    }
}


contract ERC721Metadata is ERC165, ERC721, IERC721Metadata {

/* Using */

    using ERC721MetadataLib for ERC721MetadataLib.STORAGE;

/* Events */

/* Structs */

/* Constants */

    bytes4 private constant InterfaceId_ERC721Metadata = 0x5b5e139f;
    /**
    * 0x5b5e139f ===
    *   bytes4(keccak256('name()')) ^
    *   bytes4(keccak256('symbol()')) ^
    *   bytes4(keccak256('tokenURI(uint256)'))
    */

/* State Valiables */

    ERC721MetadataLib.STORAGE erc721metadata;

/* Modifiers */

/* Functions */

    /**
    * @dev Constructor function
    */
    constructor(string name, string symbol) public {

        // register the supported interfaces to conform to ERC721 via ERC165

        erc721metadata.init(erc165data, name, symbol);
    }

    /**
    * @dev Gets the token name
    * @return string representing the token name
    */
    function name() external view returns (string) {
        return erc721metadata.name();
    }

    /**
    * @dev Gets the token symbol
    * @return string representing the token symbol
    */
    function symbol() external view returns (string) {
        return erc721metadata.symbol();
    }

    /**
    * @dev Returns an URI for a given token ID
    * Throws if the token ID does not exist. May return an empty string.
    * @param tokenId uint256 ID of the token to query
    */
    function tokenURI(uint256 tokenId) public view returns (string) {
        return erc721metadata.tokenURI(erc721data, tokenId);
    }

    /**
    * @dev Internal function to set the token URI for a given token
    * Reverts if the token ID does not exist
    * @param tokenId uint256 ID of the token to set its URI
    * @param uri string URI to assign
    */
    function _setTokenURI(uint256 tokenId, string uri) internal {
        erc721metadata._setTokenURI(erc721data, tokenId, uri);
    }

    /**
    * @dev Internal function to burn a specific token
    * Reverts if the token does not exist
    * @param owner owner of the token to burn
    * @param tokenId uint256 ID of the token being burned by the msg.sender
    */
    function _burn(address owner, uint256 tokenId) internal {
        erc721metadata._burn(erc721data, owner, tokenId);
    }
}

contract ERC721Enumerable is ERC165, ERC721, IERC721Enumerable {

/* Using */

    using ERC721EnumerableLib for ERC721EnumerableLib.STORAGE;

/* Events */

/* Structs */

/* Constants */

    bytes4 private constant _InterfaceId_ERC721Enumerable = 0x780e9d63;
    /**
    * 0x780e9d63 ===
    *   bytes4(keccak256('totalSupply()')) ^
    *   bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
    *   bytes4(keccak256('tokenByIndex(uint256)'))
    */

/* State Valiables */

    ERC721EnumerableLib.STORAGE erc721enumerabledata;
    
/* Modifiers */

/* Functions */

    /**
    * @dev Constructor function
    */
    constructor() public {
        // register the supported interface to conform to ERC721 via ERC165
        erc721enumerabledata.init(erc165data);
    }

    /**
    * @dev Gets the token ID at a given index of the tokens list of the requested owner
    * @param owner address owning the tokens list to be accessed
    * @param index uint256 representing the index to be accessed of the requested tokens list
    * @return uint256 token ID at the given index of the tokens list owned by the requested address
    */
    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    )
        public
        view
        returns (uint256)
    {
        return erc721enumerabledata.tokenOfOwnerByIndex(erc721data, owner, index);
    }

    /**
    * @dev Gets the total amount of tokens stored by the contract
    * @return uint256 representing the total amount of tokens
    */
    function totalSupply() public view returns (uint256) {
        return erc721enumerabledata.totalSupply();
    }

    /**
    * @dev Gets the token ID at a given index of all the tokens in this contract
    * Reverts if the index is greater or equal to the total number of tokens
    * @param index uint256 representing the index to be accessed of the tokens list
    * @return uint256 token ID at the given index of the tokens list
    */
    function tokenByIndex(uint256 index) public view returns (uint256) {
        return erc721enumerabledata.tokenByIndex(index);
    }

    /**
    * @dev Internal function to add a token ID to the list of a given address
    * @param to address representing the new owner of the given token ID
    * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
    */
    function _addTokenTo(address to, uint256 tokenId) internal {
        erc721enumerabledata._addTokenTo(erc721data, to, tokenId);
    }

    /**
    * @dev Internal function to remove a token ID from the list of a given address
    * @param from address representing the previous owner of the given token ID
    * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
    */
    function _removeTokenFrom(address from, uint256 tokenId) internal {
        erc721enumerabledata._removeTokenFrom(erc721data, from, tokenId);
    }

    /**
    * @dev Internal function to mint a new token
    * Reverts if the given token ID already exists
    * @param to address the beneficiary that will own the minted token
    * @param tokenId uint256 ID of the token to be minted by the msg.sender
    */
    function _mint(address to, uint256 tokenId) internal {
        erc721enumerabledata._mint(erc721data, to, tokenId);
    }

    /**
    * @dev Internal function to burn a specific token
    * Reverts if the token does not exist
    * @param owner owner of the token to burn
    * @param tokenId uint256 ID of the token being burned by the msg.sender
    */
    function _burn(address owner, uint256 tokenId) internal {
        erc721enumerabledata._burn(erc721data, owner, tokenId);
    }
}
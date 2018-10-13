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

// /**
// * @title ERC165
// * @author Matt Condon (@shrugs)
// * @dev Implements ERC165 using a lookup table.
// */
// contract ERC165 is IERC165 {

// /* Using */

//     // using ERC172Lib for bytes4;

//     using ERC721Lib for ERC721Lib.INTERFACE_STORAGE;

// /* Events */

//     event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);

// /* Structs */

// /* Constants */

//     bytes4 private constant _InterfaceId_ERC165_ = 0x01ffc9a7;
//     /**
//     * 0x01ffc9a7 ===
//     *   bytes4(keccak256('supportsInterface(bytes4)'))
//     */

// /* State Variables */

//     ERC721Lib.INTERFACE_STORAGE erc165data;

// /* Modifiers */

// /* Functions */

//     /**
//     * @dev A contract implementing SupportsInterfaceWithLookup
//     * implement ERC165 itself
//     */
//     constructor()
//         public
//     {
//         erc165data.init(_InterfaceId_ERC165_);

//         // emit ContractEvent(this,msg.sender,tx.origin);
//     }

//     /**
//     * @dev implement supportsInterface(bytes4) using a lookup table
//     */
//     function supportsInterface(bytes4 interfaceId)
//         external
//         view
//         returns (bool)
//     {
//         return erc165data.supportsInterface(interfaceId);
//     }

//     /**
//     * @dev private method for registering an interface
//     */
//     function _registerInterface(bytes4 interfaceId)
//         public
//     {
//         return erc165data._registerInterface(interfaceId);
//     }
// }

/**
* @title ERC721 Non-Fungible Token Standard basic implementation
* @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
*/
contract ERC721 is BaseController, IERC721, IERC721Metadata, IERC721Enumerable {

/* Using */

    // using ERC165Lib for ERC165.STORAGE;

    using ERC721Lib for ERC721Lib.STORAGE;

    using ERC721Lib for ERC721Lib.METADATA_STORAGE;

    using ERC721Lib for ERC721Lib.ENUMERABLE_STORAGE;

/* Events */

    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);

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

/* State Variables */

    // ERC165.STORAGE erc165interface;
    
    ERC721Lib.STORAGE erc721data;
    
    ERC721Lib.METADATA_STORAGE erc721metadata;
    
    ERC721Lib.ENUMERABLE_STORAGE erc721enumerabledata;
    
/* Modifiers */

/* Function */

    /**
    * @dev Constructor function
    */
    constructor(string name, string symbol) public {
        
        

        // register the supported interfaces to conform to ERC721 via ERC165
        // erc165interface.init(erc165data, _InterfaceId_ERC721);
       _InterfaceId_._registerInterface(_ERC721_RECEIVED);

        // register the supported interfaces to conform to ERC721 via ERC165
        // erc165interface.init(erc165data, _InterfaceId_ERC721);
       _InterfaceId_._registerInterface(_InterfaceId_ERC721);

        // register the supported interfaces to conform to ERC721 via ERC165
        // erc721metadata.init(erc165data, _InterfaceId_ERC721Metadata, name, symbol);
        _InterfaceId_._registerInterface(_InterfaceId_ERC721Metadata);
        
        // register the supported interface to conform to ERC721 via ERC165
        // erc721enumerabledata.init(erc165data, _InterfaceId_ERC721Enumerable);
        _InterfaceId_._registerInterface(_InterfaceId_ERC721Enumerable);

        // emit ContractEvent(this,msg.sender,tx.origin);
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

/* End of Contract ERC721 */ 

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
        return erc721metadata._setTokenURI(erc721data, tokenId, uri);
    }

    /**
    * @dev Function to mint tokens
    * @param _to The address that will receive the minted tokens.
    * @param _tokenId The token id to mint.
    * @param _tokenURI The token URI of the minted token.
    * @return A boolean that indicates if the operation was successful.
    */
    function mintWithTokenURI(
        address _to,
        uint256 _tokenId,
        string _tokenURI
        )
        public returns (bool)
        {
            return erc721metadata.mintWithTokenURI(erc721data, _to, _tokenId, _tokenURI);
            }

    /**
    * @dev Internal function to burn a specific token
    * Reverts if the token does not exist
    * @param owner owner of the token to burn
    * @param tokenId uint256 ID of the token being burned by the msg.sender
    */
    function _burn(address owner, uint256 tokenId) internal {
        return erc721metadata._burn(erc721data, owner, tokenId);
        }

/* End of Contract ERC721Metadata */

//     /**
//     * @dev Constructor function
//     */
//     constructor() public {
//         // register the supported interface to conform to ERC721 via ERC165
//         erc721enumerabledata.init(erc165data, _InterfaceId_ERC721Enumerable);
//         }

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
 /* End of Contract ERC721Enumerable */
 }
 
//  /**
//  * @title Full ERC721 Token
//  * This implementation includes all the required and some optional functionality of the ERC721 standard
//  * Moreover, it includes approve all functionality using operator terminology
//  * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
//  */
// contract ERC721Full is ERC721, ERC721Enumerable, ERC721Metadata {
//   constructor(string name, string symbol) ERC721Metadata(name, symbol)
//     public
//   {
//   }
// }
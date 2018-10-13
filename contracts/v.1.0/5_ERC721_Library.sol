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

/**
* @title IERC165
* @dev https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md
*/
interface IERC165 {

    /**
    * @notice Query if a contract implements an interface
    * @param interfaceId The interface identifier, as specified in ERC-165
    * @dev Interface identification is specified in ERC-165. This function
    * uses less than 30,000 gas.
    */
    function supportsInterface(bytes4 interfaceId)
        external
        view
        returns (bool);
/* End of Contract Interface IERC165 */
}

/**
* @title ERC721 Non-Fungible Token Standard basic interface
* @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
*/
contract IERC721 /*is IERC165*/ {

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);

    function balanceOf(address owner) public view returns (uint256 balance);
    function ownerOf(uint256 tokenId) public view returns (address owner);

    function approve(address to, uint256 tokenId) public;
    function getApproved(uint256 tokenId)
        public view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) public;
    function isApprovedForAll(address owner, address operator)
        public view returns (bool);

    function transferFrom(address from, address to, uint256 tokenId) public;
    function safeTransferFrom(address from, address to, uint256 tokenId)
        public;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes data
    )
        public;
/* End of Contract Interface IERC721 */
}

/**
* @title ERC721 token receiver interface
* @dev Interface for any contract that wants to support safeTransfers
* from ERC721 asset contracts.
*/
contract IERC721Receiver {
    /**
    * @notice Handle the receipt of an NFT
    * @dev The ERC721 smart contract calls this function on the recipient
    * after a `safeTransfer`. This function MUST return the function selector,
    * otherwise the caller will revert the transaction. The selector to be
    * returned can be obtained as `this.onERC721Received.selector`. This
    * function MAY throw to revert and reject the transfer.
    * Note: the ERC721 contract address is always the message sender.
    * @param operator The address which called `safeTransferFrom` function
    * @param from The address which previously owned the token
    * @param tokenId The NFT identifier which is being transferred
    * @param data Additional data with no specified format
    * @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes data
    )
        public
        returns(bytes4);
/* End of Contract Interface IERC721Receiver */
}

    /**
    * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
    * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
    */
contract IERC721Metadata is IERC721 {
    function name() external view returns (string);
    function symbol() external view returns (string);
    function tokenURI(uint256 tokenId) public view returns (string);
/* End of Contract Interface IERC721Metadata */
}

/**
 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
 * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract IERC721Enumerable is IERC721 {
    function totalSupply() public view returns (uint256);
    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    )
        public
        view
        returns (uint256 tokenId);

    function tokenByIndex(uint256 index) public view returns (uint256);
/* End of Contract Interface IERC721Enumerable */
}


/**
* @title ERC721 Non-Fungible Token Standard basic implementation
* @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
*/
library ERC721Lib {

/* Using */

    using SafeMathLib for uint256;

    using AddressLib for address;

    // using ERC165Lib for bytes4;

/* Events */

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    event ContractEvent(address indexed _this, address indexed _sender, address indexed _origin);

/* Structs */

    struct STORAGE {
        // Mapping from token ID to owner
        mapping (uint256 => address) _tokenOwner;

        // Mapping from token ID to approved address
        mapping (uint256 => address) _tokenApprovals;

        // Mapping from owner to number of owned token
        mapping (address => uint256) _ownedTokensCount;

        // Mapping from owner to operator approvals
        mapping (address => mapping (address => bool)) _operatorApprovals;
    }
    
    struct METADATA_STORAGE {

        // Token name
        string _name;

        // Token symbol
        string _symbol;

        // Optional mapping for token URIs
        mapping(uint256 => string) _tokenURIs;

    }
    
    struct ENUMERABLE_STORAGE {
        // Mapping from owner to list of owned token IDs
        mapping(address => uint256[]) _ownedTokens;

        // Mapping from token ID to index of the owner tokens list
        mapping(uint256 => uint256) _ownedTokensIndex;

        // Array with all token ids, used for enumeration
        uint256[] _allTokens;

        // Mapping from token id to position in the allTokens array
        mapping(uint256 => uint256) _allTokensIndex;
    }

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

/* Modifiers */

/* Funtions */

    // function init (STORAGE storage self, INTERFACE_STORAGE storage llib, bytes4 _InterfaceId_)
    //     public
    // {
    //     // register the supported interfaces to conform to ERC721 via ERC165
    //     _registerInterface(llib, _InterfaceId_);

    //     emit ContractEvent(this,msg.sender,tx.origin);
    // }

    /**
    * @dev Gets the balance of the specified address
    * @param owner address to query the balance of
    * @return uint256 representing the amount owned by the passed address
    */
    function balanceOf(STORAGE storage self, address owner) view returns (uint256) {
        require(owner != address(0));
        return self._ownedTokensCount[owner];
    }

    /**
    * @dev Gets the owner of the specified token ID
    * @param tokenId uint256 ID of the token to query the owner of
    * @return owner address currently marked as the owner of the given token ID
    */
    function ownerOf(STORAGE storage self, uint256 tokenId) view returns (address) {
        address owner = self._tokenOwner[tokenId];
        require(owner != address(0));
        return owner;
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
        STORAGE storage self,
        address from,
        address to,
        uint256 tokenId
    ) {
        // solium-disable-next-line arg-overflow
        safeTransferFrom(self, from, to, tokenId, "");
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
        STORAGE storage self,
        address from,
        address to,
        uint256 tokenId,
        bytes _data
    ) {
        transferFrom(self, from, to, tokenId);
        // solium-disable-next-line arg-overflow
        require(_checkAndCallSafeTransfer(from, to, tokenId, _data));
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
        STORAGE storage self,
        address from,
        address to,
        uint256 tokenId
    ) {
        require(_isApprovedOrOwner(self, msg.sender, tokenId));
        require(to != address(0));

        _clearApproval(self, from, tokenId);
        _removeTokenFrom(self, from, tokenId);
        _addTokenTo(self, to, tokenId);

        emit Transfer(from, to, tokenId);
    }

    /**
    * @dev Approves another address to transfer the given token ID
    * The zero address indicates there is no approved address.
    * There can only be one approved address per token at a given time.
    * Can only be called by the token owner or an approved operator.
    * @param to address to be approved for the given token ID
    * @param tokenId uint256 ID of the token to be approved
    */
    function approve(STORAGE storage self, address to, uint256 tokenId) {
        address owner = ownerOf(self, tokenId);
        require(to != owner);
        require(msg.sender == owner || isApprovedForAll(self, owner, msg.sender));

        self._tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /**
    * @dev Sets or unsets the approval of a given operator
    * An operator is allowed to transfer all tokens of the sender on their behalf
    * @param to operator address to set the approval
    * @param approved representing the status of the approval to be set
    */
    function setApprovalForAll(STORAGE storage self, address to, bool approved) {
        require(to != msg.sender);
        self._operatorApprovals[msg.sender][to] = approved;
        emit ApprovalForAll(msg.sender, to, approved);
    }

    /**
    * @dev Gets the approved address for a token ID, or zero if no address set
    * Reverts if the token ID does not exist.
    * @param tokenId uint256 ID of the token to query the approval of
    * @return address currently approved for the given token ID
    */
    function getApproved(STORAGE storage self, uint256 tokenId) view returns (address) {
        require(_exists(self, tokenId));
        return self._tokenApprovals[tokenId];
    }

    /**
    * @dev Tells whether an operator is approved by a given owner
    * @param owner owner address which you want to query the approval of
    * @param operator operator address which you want to query the approval of
    * @return bool whether the given operator is approved by the given owner
    */
    function isApprovedForAll(
        STORAGE storage self,
        address owner,
        address operator
    )
        view
        returns (bool)
    {
        return self._operatorApprovals[owner][operator];
    }

////////////////
// Internal helper functions
////////////////

    /**
    * @dev Returns whether the specified token exists
    * @param tokenId uint256 ID of the token to query the existence of
    * @return whether the token exists
    */
    function _exists(STORAGE storage self, uint256 tokenId) internal view returns (bool) {
        address owner = self._tokenOwner[tokenId];
        return owner != address(0);
    }

    /**
    * @dev Returns whether the given spender can transfer a given token ID
    * @param spender address of the spender to query
    * @param tokenId uint256 ID of the token to be transferred
    * @return bool whether the msg.sender is approved for the given token ID,
    *  is an operator of the owner, or is the owner of the token
    */
    function _isApprovedOrOwner(
        STORAGE storage self,
        address spender,
        uint256 tokenId
    )
        internal
        view
        returns (bool)
    {
        address owner = ownerOf(self, tokenId);
        // Disable solium check because of
        // https://github.com/duaraghav8/Solium/issues/175
        // solium-disable-next-line operator-whitespace
        return (
        spender == owner ||
        getApproved(self, tokenId) == spender ||
        isApprovedForAll(self, owner, spender)
        );
    }

    /**
    * @dev Internal function to mint a new token
    * Reverts if the given token ID already exists
    * @param to The address that will own the minted token
    * @param tokenId uint256 ID of the token to be minted by the msg.sender
    */
    function _mint(STORAGE storage self, address to, uint256 tokenId) internal {
        require(to != address(0));
        _addTokenTo(self, to, tokenId);
        emit Transfer(address(0), to, tokenId);
    }

    /**
    * @dev Internal function to burn a specific token
    * Reverts if the token does not exist
    * @param tokenId uint256 ID of the token being burned by the msg.sender
    */
    function _burn(STORAGE storage self, address owner, uint256 tokenId) internal {
        _clearApproval(self, owner, tokenId);
        _removeTokenFrom(self, owner, tokenId);
        emit Transfer(owner, address(0), tokenId);
    }

    /**
    * @dev Internal function to clear current approval of a given token ID
    * Reverts if the given address is not indeed the owner of the token
    * @param owner owner of the token
    * @param tokenId uint256 ID of the token to be transferred
    */
    function _clearApproval(STORAGE storage self, address owner, uint256 tokenId) internal {
        require(ownerOf(self, tokenId) == owner);
        if (self._tokenApprovals[tokenId] != address(0)) {
        self._tokenApprovals[tokenId] = address(0);
        }
    }

    /**
    * @dev Internal function to add a token ID to the list of a given address
    * @param to address representing the new owner of the given token ID
    * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
    */
    function _addTokenTo(STORAGE storage self, address to, uint256 tokenId) internal {
        require(self._tokenOwner[tokenId] == address(0));
        self._tokenOwner[tokenId] = to;
        self._ownedTokensCount[to] = self._ownedTokensCount[to].add(1);
    }

    /**
    * @dev Internal function to remove a token ID from the list of a given address
    * @param from address representing the previous owner of the given token ID
    * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
    */
    function _removeTokenFrom(STORAGE storage self, address from, uint256 tokenId) internal {
        require(ownerOf(self, tokenId) == from);
        self._ownedTokensCount[from] = self._ownedTokensCount[from].sub(1);
        self._tokenOwner[tokenId] = address(0);
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
        if (!to.isContract()) {
        return true;
        }
        bytes4 retval = IERC721Receiver(to).onERC721Received(
        msg.sender, from, tokenId, _data);
        return (retval == _ERC721_RECEIVED);
    }
/* End of Library ERC721Lib */

    // function init(METADATA_STORAGE storage self, INTERFACE_STORAGE storage llib, bytes4 _InterfaceId_) {

    //     // register the supported interfaces to conform to ERC721 via ERC165
    //     _registerInterface(llib, _InterfaceId_);

    //     emit ContractEvent(this,msg.sender,tx.origin);
    // }

    /**
    * @dev Gets the token name
    * @return string representing the token name
    */
    function name(METADATA_STORAGE storage self) view returns (string) {
        return self._name;
    }

    /**
    * @dev Gets the token symbol
    * @return string representing the token symbol
    */
    function symbol(METADATA_STORAGE storage self) view returns (string) {
        return self._symbol;
    }

    /**
    * @dev Returns an URI for a given token ID
    * Throws if the token ID does not exist. May return an empty string.
    * @param tokenId uint256 ID of the token to query
    */
    function tokenURI(METADATA_STORAGE storage self, ERC721Lib.STORAGE storage llib, uint256 tokenId) view returns (string) {
        require(_exists(llib, tokenId));
        return self._tokenURIs[tokenId];
    }

    /**
    * @dev Internal function to set the token URI for a given token
    * Reverts if the token ID does not exist
    * @param tokenId uint256 ID of the token to set its URI
    * @param uri string URI to assign
    */
    function _setTokenURI(METADATA_STORAGE storage self, ERC721Lib.STORAGE storage llib, uint256 tokenId, string uri) internal {
        require(_exists(llib, tokenId));
        self._tokenURIs[tokenId] = uri;
    }

    /**
    * @dev Function to mint tokens
    * @param to The address that will receive the minted tokens.
    * @param tokenId The token id to mint.
    * @param tokenURI The token URI of the minted token.
    * @return A boolean that indicates if the operation was successful.
    */
    function mintWithTokenURI(
        METADATA_STORAGE storage self,
        ERC721Lib.STORAGE storage llib,
        address to,
        uint256 tokenId,
        string tokenURI
        )
        public returns (bool)
        {
            _mint(llib, to, tokenId);
            _setTokenURI(self, llib, tokenId, tokenURI);
            return true;
            }

    /**
    * @dev Internal function to burn a specific token
    * Reverts if the token does not exist
    * @param owner owner of the token to burn
    * @param tokenId uint256 ID of the token being burned by the msg.sender
    */
    function _burn(METADATA_STORAGE storage self, ERC721Lib.STORAGE storage llib, address owner, uint256 tokenId) internal {
        // super._burn(owner, tokenId);
        _burn(llib, owner, tokenId);

        // Clear metadata (if any)
        if (bytes(self._tokenURIs[tokenId]).length != 0) {
        delete self._tokenURIs[tokenId];
        }
    }
/* End of Library ERC721MetadataLib */

    // function init(ENUMERABLE_STORAGE storage self, INTERFACE_STORAGE storage llib, bytes4 _InterfaceId_) public {

    //     // register the supported interface to conform to ERC721 via ERC165
    //     _registerInterface(llib, _InterfaceId_);

    //     emit ContractEvent(this,msg.sender,tx.origin);
    // }

    /**
    * @dev Gets the token ID at a given index of the tokens list of the requested owner
    * @param owner address owning the tokens list to be accessed
    * @param index uint256 representing the index to be accessed of the requested tokens list
    * @return uint256 token ID at the given index of the tokens list owned by the requested address
    */
    function tokenOfOwnerByIndex(
        ENUMERABLE_STORAGE storage self,
        ERC721Lib.STORAGE storage llib,
        address owner,
        uint256 index
    )
        public
        view
        returns (uint256)
    {
        require(index < balanceOf(llib, owner));
        return self._ownedTokens[owner][index];
    }

    /**
    * @dev Gets the total amount of tokens stored by the contract
    * @return uint256 representing the total amount of tokens
    */
    function totalSupply(ENUMERABLE_STORAGE storage self) public view returns (uint256) {
        return self._allTokens.length;
    }

    /**
    * @dev Gets the token ID at a given index of all the tokens in this contract
    * Reverts if the index is greater or equal to the total number of tokens
    * @param index uint256 representing the index to be accessed of the tokens list
    * @return uint256 token ID at the given index of the tokens list
    */
    function tokenByIndex(ENUMERABLE_STORAGE storage self, uint256 index) public view returns (uint256) {
        require(index < totalSupply(self));
        return self._allTokens[index];
    }

    /**
    * @dev Internal function to add a token ID to the list of a given address
    * @param to address representing the new owner of the given token ID
    * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
    */
    function _addTokenTo(ENUMERABLE_STORAGE storage self, ERC721Lib.STORAGE storage llib, address to, uint256 tokenId) internal {
        // super._addTokenTo(to, tokenId);
        _addTokenTo(llib, to, tokenId);
        uint256 length = self._ownedTokens[to].length;
        self._ownedTokens[to].push(tokenId);
        self._ownedTokensIndex[tokenId] = length;
    }

    /**
    * @dev Internal function to remove a token ID from the list of a given address
    * @param from address representing the previous owner of the given token ID
    * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
    */
    function _removeTokenFrom(ENUMERABLE_STORAGE storage self, ERC721Lib.STORAGE storage llib, address from, uint256 tokenId) internal {
        // super._removeTokenFrom(from, tokenId);
        _removeTokenFrom(llib, from, tokenId);

        // To prevent a gap in the array, we store the last token in the index of the token to delete, and
        // then delete the last slot.
        uint256 tokenIndex = self._ownedTokensIndex[tokenId];
        uint256 lastTokenIndex = self._ownedTokens[from].length.sub(1);
        uint256 lastToken = self._ownedTokens[from][lastTokenIndex];

        self._ownedTokens[from][tokenIndex] = lastToken;
        // This also deletes the contents at the last position of the array
        self._ownedTokens[from].length--;

        // Note that this will handle single-element arrays. In that case, both tokenIndex and lastTokenIndex are going to
        // be zero. Then we can make sure that we will remove tokenId from the ownedTokens list since we are first swapping
        // the lastToken to the first position, and then dropping the element placed in the last position of the list

        self._ownedTokensIndex[tokenId] = 0;
        self._ownedTokensIndex[lastToken] = tokenIndex;
    }

    /**
    * @dev Internal function to mint a new token
    * Reverts if the given token ID already exists
    * @param to address the beneficiary that will own the minted token
    * @param tokenId uint256 ID of the token to be minted by the msg.sender
    */
    function _mint(ENUMERABLE_STORAGE storage self, ERC721Lib.STORAGE storage llib, address to, uint256 tokenId) internal {
        // super._mint(to, tokenId);
        _mint(llib, to, tokenId);

        self._allTokensIndex[tokenId] = self._allTokens.length;
        self._allTokens.push(tokenId);
    }

    /**
    * @dev Internal function to burn a specific token
    * Reverts if the token does not exist
    * @param owner owner of the token to burn
    * @param tokenId uint256 ID of the token being burned by the msg.sender
    */
    function _burn(ENUMERABLE_STORAGE storage self, ERC721Lib.STORAGE storage llib, address owner, uint256 tokenId) internal {
        // super._burn(owner, tokenId);
        _burn(llib, owner, tokenId);

        // Reorg all tokens array
        uint256 tokenIndex = self._allTokensIndex[tokenId];
        uint256 lastTokenIndex = self._allTokens.length.sub(1);
        uint256 lastToken = self._allTokens[lastTokenIndex];

        self._allTokens[tokenIndex] = lastToken;
        self._allTokens[lastTokenIndex] = 0;

        self._allTokens.length--;
        self._allTokensIndex[tokenId] = 0;
        self._allTokensIndex[lastToken] = tokenIndex;
    }
/* End of Library ERC721EnumerableLib */
}
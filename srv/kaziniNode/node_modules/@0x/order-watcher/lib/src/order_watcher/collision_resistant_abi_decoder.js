"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var TOKEN_TYPE_COLLISION = "Token can't be marked as ERC20 and ERC721 at the same time";
/**
 * ERC20 and ERC721 have some events with different args but colliding signature.
 * For exmaple:
 * Transfer(_from address, _to address, _value uint256)
 * Transfer(_from address, _to address, _tokenId uint256)
 * Both have the signature:
 * Transfer(address,address,uint256)
 *
 * In order to correctly decode those events we need to know the token type by address in advance.
 * You can pass it by calling `this.addERC20Token(address)` or `this.addERC721Token(address)`
 */
var CollisionResistanceAbiDecoder = /** @class */ (function () {
    function CollisionResistanceAbiDecoder(erc20Abi, erc721Abi, abis) {
        this._knownERC20Tokens = new Set();
        this._knownERC721Tokens = new Set();
        this._erc20AbiDecoder = new utils_1.AbiDecoder([erc20Abi]);
        this._erc721AbiDecoder = new utils_1.AbiDecoder([erc721Abi]);
        this._restAbiDecoder = new utils_1.AbiDecoder(abis);
    }
    CollisionResistanceAbiDecoder.prototype.tryToDecodeLogOrNoop = function (log) {
        if (this._knownERC20Tokens.has(log.address)) {
            var maybeDecodedERC20Log = this._erc20AbiDecoder.tryToDecodeLogOrNoop(log);
            return maybeDecodedERC20Log;
        }
        else if (this._knownERC721Tokens.has(log.address)) {
            var maybeDecodedERC721Log = this._erc721AbiDecoder.tryToDecodeLogOrNoop(log);
            return maybeDecodedERC721Log;
        }
        else {
            var maybeDecodedLog = this._restAbiDecoder.tryToDecodeLogOrNoop(log);
            return maybeDecodedLog;
        }
    };
    // Hints the ABI decoder that a particular token address is ERC20 and events from it should be decoded as ERC20 events
    CollisionResistanceAbiDecoder.prototype.addERC20Token = function (address) {
        if (this._knownERC721Tokens.has(address)) {
            throw new Error(TOKEN_TYPE_COLLISION);
        }
        this._knownERC20Tokens.add(address);
    };
    // Hints the ABI decoder that a particular token address is ERC721 and events from it should be decoded as ERC721 events
    CollisionResistanceAbiDecoder.prototype.addERC721Token = function (address) {
        if (this._knownERC20Tokens.has(address)) {
            throw new Error(TOKEN_TYPE_COLLISION);
        }
        this._knownERC721Tokens.add(address);
    };
    return CollisionResistanceAbiDecoder;
}());
exports.CollisionResistanceAbiDecoder = CollisionResistanceAbiDecoder;
//# sourceMappingURL=collision_resistant_abi_decoder.js.map
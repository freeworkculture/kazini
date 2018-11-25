"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var abi_gen_wrappers_1 = require("@0x/abi-gen-wrappers");
var contract_artifacts_1 = require("@0x/contract-artifacts");
var json_schemas_1 = require("@0x/json-schemas");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var method_opts_schema_1 = require("../schemas/method_opts_schema");
var tx_opts_schema_1 = require("../schemas/tx_opts_schema");
var types_1 = require("../types");
var assert_1 = require("../utils/assert");
var constants_1 = require("../utils/constants");
var utils_2 = require("../utils/utils");
var contract_wrapper_1 = require("./contract_wrapper");
/**
 * This class includes all the functionality related to interacting with ERC721 token contracts.
 * All ERC721 method calls are supported, along with some convenience methods for getting/setting allowances
 * to the 0x ERC721 Proxy smart contract.
 */
var ERC721TokenWrapper = /** @class */ (function (_super) {
    __extends(ERC721TokenWrapper, _super);
    /**
     * Instantiate ERC721TokenWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param networkId Desired networkId
     * @param erc721ProxyWrapper The ERC721ProxyWrapper instance to use
     * @param blockPollingIntervalMs The block polling interval to use for active subscriptions
     */
    function ERC721TokenWrapper(web3Wrapper, networkId, erc721ProxyWrapper, blockPollingIntervalMs) {
        var _this = _super.call(this, web3Wrapper, networkId, blockPollingIntervalMs) || this;
        _this.abi = contract_artifacts_1.ERC721Token.compilerOutput.abi;
        _this._tokenContractsByAddress = {};
        _this._erc721ProxyWrapper = erc721ProxyWrapper;
        return _this;
    }
    /**
     * Count all NFTs assigned to an owner
     * NFTs assigned to the zero address are considered invalid, and this function throws for queries about the zero address.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address whose balance you would like to check.
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  The number of NFTs owned by `ownerAddress`, possibly zero
     */
    ERC721TokenWrapper.prototype.getTokenCountAsync = function (tokenAddress, ownerAddress, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, normalizedOwnerAddress, tokenContract, txData, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        assert_1.assert.isETHAddressHex('ownerAddress', ownerAddress);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        normalizedTokenAddress = tokenAddress.toLowerCase();
                        normalizedOwnerAddress = ownerAddress.toLowerCase();
                        return [4 /*yield*/, this._getTokenContractAsync(normalizedTokenAddress)];
                    case 1:
                        tokenContract = _a.sent();
                        txData = {};
                        return [4 /*yield*/, tokenContract.balanceOf.callAsync(normalizedOwnerAddress, txData, methodOpts.defaultBlock)];
                    case 2:
                        balance = _a.sent();
                        // Wrap BigNumbers returned from web3 with our own (later) version of BigNumber
                        balance = new utils_1.BigNumber(balance);
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    /**
     * Find the owner of an NFT
     * NFTs assigned to zero address are considered invalid, and queries about them do throw.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   tokenId         The identifier for an NFT
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  The address of the owner of the NFT
     */
    ERC721TokenWrapper.prototype.getOwnerOfAsync = function (tokenAddress, tokenId, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, tokenContract, txData, tokenOwner, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        assert_1.assert.isBigNumber('tokenId', tokenId);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        normalizedTokenAddress = tokenAddress.toLowerCase();
                        return [4 /*yield*/, this._getTokenContractAsync(normalizedTokenAddress)];
                    case 1:
                        tokenContract = _a.sent();
                        txData = {};
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, tokenContract.ownerOf.callAsync(tokenId, txData, methodOpts.defaultBlock)];
                    case 3:
                        tokenOwner = _a.sent();
                        return [2 /*return*/, tokenOwner];
                    case 4:
                        err_1 = _a.sent();
                        throw new Error(types_1.ContractWrappersError.ERC721OwnerNotFound);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Query if an address is an authorized operator for all NFT's of `ownerAddress`
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address of the token owner.
     * @param   operatorAddress The hex encoded user Ethereum address of the operator you'd like to check if approved.
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  True if `operatorAddress` is an approved operator for `ownerAddress`, false otherwise
     */
    ERC721TokenWrapper.prototype.isApprovedForAllAsync = function (tokenAddress, ownerAddress, operatorAddress, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, normalizedOwnerAddress, normalizedOperatorAddress, tokenContract, txData, isApprovedForAll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        assert_1.assert.isETHAddressHex('ownerAddress', ownerAddress);
                        assert_1.assert.isETHAddressHex('operatorAddress', operatorAddress);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        normalizedTokenAddress = tokenAddress.toLowerCase();
                        normalizedOwnerAddress = ownerAddress.toLowerCase();
                        normalizedOperatorAddress = operatorAddress.toLowerCase();
                        return [4 /*yield*/, this._getTokenContractAsync(normalizedTokenAddress)];
                    case 1:
                        tokenContract = _a.sent();
                        txData = {};
                        return [4 /*yield*/, tokenContract.isApprovedForAll.callAsync(normalizedOwnerAddress, normalizedOperatorAddress, txData, methodOpts.defaultBlock)];
                    case 2:
                        isApprovedForAll = _a.sent();
                        return [2 /*return*/, isApprovedForAll];
                }
            });
        });
    };
    /**
     * Query if 0x proxy is an authorized operator for all NFT's of `ownerAddress`
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address of the token owner.
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  True if `operatorAddress` is an approved operator for `ownerAddress`, false otherwise
     */
    ERC721TokenWrapper.prototype.isProxyApprovedForAllAsync = function (tokenAddress, ownerAddress, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var proxyAddress, isProxyApprovedForAll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proxyAddress = this._erc721ProxyWrapper.address;
                        return [4 /*yield*/, this.isApprovedForAllAsync(tokenAddress, ownerAddress, proxyAddress, methodOpts)];
                    case 1:
                        isProxyApprovedForAll = _a.sent();
                        return [2 /*return*/, isProxyApprovedForAll];
                }
            });
        });
    };
    /**
     * Get the approved address for a single NFT. Returns undefined if no approval was set
     * Throws if `_tokenId` is not a valid NFT
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   tokenId         The identifier for an NFT
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  The approved address for this NFT, or the undefined if there is none
     */
    ERC721TokenWrapper.prototype.getApprovedIfExistsAsync = function (tokenAddress, tokenId, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, tokenContract, txData, approvedAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        assert_1.assert.isBigNumber('tokenId', tokenId);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        normalizedTokenAddress = tokenAddress.toLowerCase();
                        return [4 /*yield*/, this._getTokenContractAsync(normalizedTokenAddress)];
                    case 1:
                        tokenContract = _a.sent();
                        txData = {};
                        return [4 /*yield*/, tokenContract.getApproved.callAsync(tokenId, txData, methodOpts.defaultBlock)];
                    case 2:
                        approvedAddress = _a.sent();
                        if (approvedAddress === constants_1.constants.NULL_ADDRESS) {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/, approvedAddress];
                }
            });
        });
    };
    /**
     * Checks if 0x proxy is approved for a single NFT
     * Throws if `_tokenId` is not a valid NFT
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   tokenId         The identifier for an NFT
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  True if 0x proxy is approved
     */
    ERC721TokenWrapper.prototype.isProxyApprovedAsync = function (tokenAddress, tokenId, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var proxyAddress, approvedAddress, isProxyApproved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proxyAddress = this._erc721ProxyWrapper.address;
                        return [4 /*yield*/, this.getApprovedIfExistsAsync(tokenAddress, tokenId, methodOpts)];
                    case 1:
                        approvedAddress = _a.sent();
                        isProxyApproved = approvedAddress === proxyAddress;
                        return [2 /*return*/, isProxyApproved];
                }
            });
        });
    };
    /**
     * Enable or disable approval for a third party ("operator") to manage all of `ownerAddress`'s assets.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the ApprovalForAll event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address of the token owner.
     * @param   operatorAddress The hex encoded user Ethereum address of the operator you'd like to set approval for.
     * @param   isApproved      The boolean variable to set the approval to.
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    ERC721TokenWrapper.prototype.setApprovalForAllAsync = function (tokenAddress, ownerAddress, operatorAddress, isApproved, txOpts) {
        if (txOpts === void 0) { txOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, normalizedOwnerAddress, normalizedOperatorAddress, tokenContract, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('ownerAddress', ownerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.isETHAddressHex('operatorAddress', operatorAddress);
                        assert_1.assert.isBoolean('isApproved', isApproved);
                        assert_1.assert.doesConformToSchema('txOpts', txOpts, tx_opts_schema_1.txOptsSchema);
                        normalizedTokenAddress = tokenAddress.toLowerCase();
                        normalizedOwnerAddress = ownerAddress.toLowerCase();
                        normalizedOperatorAddress = operatorAddress.toLowerCase();
                        return [4 /*yield*/, this._getTokenContractAsync(normalizedTokenAddress)];
                    case 2:
                        tokenContract = _a.sent();
                        return [4 /*yield*/, tokenContract.setApprovalForAll.sendTransactionAsync(normalizedOperatorAddress, isApproved, utils_2.utils.removeUndefinedProperties({
                                gas: txOpts.gasLimit,
                                gasPrice: txOpts.gasPrice,
                                from: normalizedOwnerAddress,
                            }))];
                    case 3:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Enable or disable approval for a third party ("operator") to manage all of `ownerAddress`'s assets.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the ApprovalForAll event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address of the token owner.
     * @param   operatorAddress The hex encoded user Ethereum address of the operator you'd like to set approval for.
     * @param   isApproved      The boolean variable to set the approval to.
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    ERC721TokenWrapper.prototype.setProxyApprovalForAllAsync = function (tokenAddress, ownerAddress, isApproved, txOpts) {
        if (txOpts === void 0) { txOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var proxyAddress, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proxyAddress = this._erc721ProxyWrapper.address;
                        return [4 /*yield*/, this.setApprovalForAllAsync(tokenAddress, ownerAddress, proxyAddress, isApproved, txOpts)];
                    case 1:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Set or reaffirm the approved address for an NFT
     * The zero address indicates there is no approved address. Throws unless `msg.sender` is the current NFT owner,
     * or an authorized operator of the current owner.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the Approval event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   approvedAddress The hex encoded user Ethereum address you'd like to set approval for.
     * @param   tokenId         The identifier for an NFT
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    ERC721TokenWrapper.prototype.setApprovalAsync = function (tokenAddress, approvedAddress, tokenId, txOpts) {
        if (txOpts === void 0) { txOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, normalizedApprovedAddress, tokenContract, tokenOwnerAddress, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        assert_1.assert.isETHAddressHex('approvedAddress', approvedAddress);
                        assert_1.assert.isBigNumber('tokenId', tokenId);
                        assert_1.assert.doesConformToSchema('txOpts', txOpts, tx_opts_schema_1.txOptsSchema);
                        normalizedTokenAddress = tokenAddress.toLowerCase();
                        normalizedApprovedAddress = approvedAddress.toLowerCase();
                        return [4 /*yield*/, this._getTokenContractAsync(normalizedTokenAddress)];
                    case 1:
                        tokenContract = _a.sent();
                        return [4 /*yield*/, tokenContract.ownerOf.callAsync(tokenId)];
                    case 2:
                        tokenOwnerAddress = _a.sent();
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('tokenOwnerAddress', tokenOwnerAddress, this._web3Wrapper)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tokenContract.approve.sendTransactionAsync(normalizedApprovedAddress, tokenId, utils_2.utils.removeUndefinedProperties({
                                gas: txOpts.gasLimit,
                                gasPrice: txOpts.gasPrice,
                                from: tokenOwnerAddress,
                            }))];
                    case 4:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Set or reaffirm 0x proxy as an approved address for an NFT
     * Throws unless `msg.sender` is the current NFT owner, or an authorized operator of the current owner.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the Approval event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   tokenId         The identifier for an NFT
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    ERC721TokenWrapper.prototype.setProxyApprovalAsync = function (tokenAddress, tokenId, txOpts) {
        if (txOpts === void 0) { txOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var proxyAddress, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proxyAddress = this._erc721ProxyWrapper.address;
                        return [4 /*yield*/, this.setApprovalAsync(tokenAddress, proxyAddress, tokenId, txOpts)];
                    case 1:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Enable or disable approval for a third party ("operator") to manage all of `ownerAddress`'s assets.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the ApprovalForAll event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   receiverAddress The hex encoded Ethereum address of the user to send the NFT to.
     * @param   senderAddress The hex encoded Ethereum address of the user to send the NFT to.
     * @param   tokenId         The identifier for an NFT
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    ERC721TokenWrapper.prototype.transferFromAsync = function (tokenAddress, receiverAddress, senderAddress, tokenId, txOpts) {
        if (txOpts === void 0) { txOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, normalizedReceiverAddress, normalizedSenderAddress, tokenContract, ownerAddress, isApprovedForAll, approvedAddress, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        assert_1.assert.isETHAddressHex('receiverAddress', receiverAddress);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('senderAddress', senderAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('txOpts', txOpts, tx_opts_schema_1.txOptsSchema);
                        normalizedTokenAddress = tokenAddress.toLowerCase();
                        normalizedReceiverAddress = receiverAddress.toLowerCase();
                        normalizedSenderAddress = senderAddress.toLowerCase();
                        return [4 /*yield*/, this._getTokenContractAsync(normalizedTokenAddress)];
                    case 2:
                        tokenContract = _a.sent();
                        return [4 /*yield*/, this.getOwnerOfAsync(tokenAddress, tokenId)];
                    case 3:
                        ownerAddress = _a.sent();
                        if (!(normalizedSenderAddress !== ownerAddress)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.isApprovedForAllAsync(normalizedTokenAddress, ownerAddress, normalizedSenderAddress)];
                    case 4:
                        isApprovedForAll = _a.sent();
                        if (!!isApprovedForAll) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getApprovedIfExistsAsync(normalizedTokenAddress, tokenId)];
                    case 5:
                        approvedAddress = _a.sent();
                        if (approvedAddress !== normalizedSenderAddress) {
                            throw new Error(types_1.ContractWrappersError.ERC721NoApproval);
                        }
                        _a.label = 6;
                    case 6: return [4 /*yield*/, tokenContract.transferFrom.sendTransactionAsync(ownerAddress, normalizedReceiverAddress, tokenId, utils_2.utils.removeUndefinedProperties({
                            gas: txOpts.gasLimit,
                            gasPrice: txOpts.gasPrice,
                            from: normalizedSenderAddress,
                        }))];
                    case 7:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Subscribe to an event type emitted by the Token contract.
     * @param   tokenAddress        The hex encoded address where the ERC721 token is deployed.
     * @param   eventName           The token contract event you would like to subscribe to.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param   callback            Callback that gets called when a log is added/removed
     * @param   isVerbose           Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    ERC721TokenWrapper.prototype.subscribe = function (tokenAddress, eventName, indexFilterValues, callback, isVerbose) {
        if (isVerbose === void 0) { isVerbose = false; }
        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
        assert_1.assert.doesBelongToStringEnum('eventName', eventName, abi_gen_wrappers_1.ERC721TokenEvents);
        assert_1.assert.doesConformToSchema('indexFilterValues', indexFilterValues, json_schemas_1.schemas.indexFilterValuesSchema);
        assert_1.assert.isFunction('callback', callback);
        var normalizedTokenAddress = tokenAddress.toLowerCase();
        var subscriptionToken = this._subscribe(normalizedTokenAddress, eventName, indexFilterValues, contract_artifacts_1.ERC721Token.compilerOutput.abi, callback, isVerbose);
        return subscriptionToken;
    };
    /**
     * Cancel a subscription
     * @param   subscriptionToken Subscription token returned by `subscribe()`
     */
    ERC721TokenWrapper.prototype.unsubscribe = function (subscriptionToken) {
        assert_1.assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
        this._unsubscribe(subscriptionToken);
    };
    /**
     * Cancels all existing subscriptions
     */
    ERC721TokenWrapper.prototype.unsubscribeAll = function () {
        _super.prototype._unsubscribeAll.call(this);
    };
    /**
     * Gets historical logs without creating a subscription
     * @param   tokenAddress        An address of the token that emitted the logs.
     * @param   eventName           The token contract event you would like to subscribe to.
     * @param   blockRange          Block range to get logs from.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return  Array of logs that match the parameters
     */
    ERC721TokenWrapper.prototype.getLogsAsync = function (tokenAddress, eventName, blockRange, indexFilterValues) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        assert_1.assert.doesBelongToStringEnum('eventName', eventName, abi_gen_wrappers_1.ERC721TokenEvents);
                        assert_1.assert.doesConformToSchema('blockRange', blockRange, json_schemas_1.schemas.blockRangeSchema);
                        assert_1.assert.doesConformToSchema('indexFilterValues', indexFilterValues, json_schemas_1.schemas.indexFilterValuesSchema);
                        normalizedTokenAddress = tokenAddress.toLowerCase();
                        return [4 /*yield*/, this._getLogsAsync(normalizedTokenAddress, eventName, blockRange, indexFilterValues, contract_artifacts_1.ERC721Token.compilerOutput.abi)];
                    case 1:
                        logs = _a.sent();
                        return [2 /*return*/, logs];
                }
            });
        });
    };
    ERC721TokenWrapper.prototype._getTokenContractAsync = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTokenAddress, tokenContract, contractInstance;
            return __generator(this, function (_a) {
                normalizedTokenAddress = tokenAddress.toLowerCase();
                tokenContract = this._tokenContractsByAddress[normalizedTokenAddress];
                if (!_.isUndefined(tokenContract)) {
                    return [2 /*return*/, tokenContract];
                }
                contractInstance = new abi_gen_wrappers_1.ERC721TokenContract(this.abi, normalizedTokenAddress, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                tokenContract = contractInstance;
                this._tokenContractsByAddress[normalizedTokenAddress] = tokenContract;
                return [2 /*return*/, tokenContract];
            });
        });
    };
    return ERC721TokenWrapper;
}(contract_wrapper_1.ContractWrapper));
exports.ERC721TokenWrapper = ERC721TokenWrapper;
//# sourceMappingURL=erc721_token_wrapper.js.map
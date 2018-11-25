"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var abi_gen_wrappers_1 = require("@0x/abi-gen-wrappers");
var artifacts = require("@0x/contract-artifacts");
var order_utils_1 = require("@0x/order-utils");
var order_factory_1 = require("@0x/order-utils/lib/src/order_factory");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var _ = require("lodash");
var constants_1 = require("./constants");
var FillScenarios = /** @class */ (function () {
    function FillScenarios(provider, userAddresses, zrxTokenAddress, exchangeAddress, erc20ProxyAddress, erc721ProxyAddress) {
        this._web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
        this._userAddresses = userAddresses;
        this._coinbase = userAddresses[0];
        this._zrxTokenAddress = zrxTokenAddress;
        this._exchangeAddress = exchangeAddress;
        this._erc20ProxyAddress = erc20ProxyAddress;
        this._erc721ProxyAddress = erc721ProxyAddress;
    }
    FillScenarios.prototype.createFillableSignedOrderAsync = function (makerAssetData, takerAssetData, makerAddress, takerAddress, fillableAmount, expirationTimeSeconds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createAsymmetricFillableSignedOrderAsync(makerAssetData, takerAssetData, makerAddress, takerAddress, fillableAmount, fillableAmount, expirationTimeSeconds)];
            });
        });
    };
    FillScenarios.prototype.createFillableSignedOrderWithFeesAsync = function (makerAssetData, takerAssetData, makerFee, takerFee, makerAddress, takerAddress, fillableAmount, feeRecipientAddress, expirationTimeSeconds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._createAsymmetricFillableSignedOrderWithFeesAsync(makerAssetData, takerAssetData, makerFee, takerFee, makerAddress, takerAddress, fillableAmount, fillableAmount, feeRecipientAddress, expirationTimeSeconds)];
            });
        });
    };
    FillScenarios.prototype.createAsymmetricFillableSignedOrderAsync = function (makerAssetData, takerAssetData, makerAddress, takerAddress, makerFillableAmount, takerFillableAmount, expirationTimeSeconds) {
        return __awaiter(this, void 0, void 0, function () {
            var makerFee, takerFee, feeRecipientAddress;
            return __generator(this, function (_a) {
                makerFee = new utils_1.BigNumber(0);
                takerFee = new utils_1.BigNumber(0);
                feeRecipientAddress = constants_1.constants.NULL_ADDRESS;
                return [2 /*return*/, this._createAsymmetricFillableSignedOrderWithFeesAsync(makerAssetData, takerAssetData, makerFee, takerFee, makerAddress, takerAddress, makerFillableAmount, takerFillableAmount, feeRecipientAddress, expirationTimeSeconds)];
            });
        });
    };
    FillScenarios.prototype.createPartiallyFilledSignedOrderAsync = function (makerAssetData, takerAssetData, takerAddress, fillableAmount, partialFillAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, makerAddress, signedOrder, exchangeInstance, orderWithoutExchangeAddress, txHash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(this._userAddresses, 1), makerAddress = _a[0];
                        return [4 /*yield*/, this.createAsymmetricFillableSignedOrderAsync(makerAssetData, takerAssetData, makerAddress, takerAddress, fillableAmount, fillableAmount)];
                    case 1:
                        signedOrder = _b.sent();
                        exchangeInstance = new abi_gen_wrappers_1.ExchangeContract(artifacts.Exchange.compilerOutput.abi, signedOrder.exchangeAddress, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                        orderWithoutExchangeAddress = _.omit(signedOrder, [
                            'signature',
                            'exchangeAddress',
                        ]);
                        return [4 /*yield*/, exchangeInstance.fillOrder.sendTransactionAsync(orderWithoutExchangeAddress, partialFillAmount, signedOrder.signature, { from: takerAddress })];
                    case 2:
                        txHash = _b.sent();
                        return [4 /*yield*/, this._web3Wrapper.awaitTransactionSuccessAsync(txHash, constants_1.constants.AWAIT_TRANSACTION_MINED_MS)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, signedOrder];
                }
            });
        });
    };
    FillScenarios.prototype._createAsymmetricFillableSignedOrderWithFeesAsync = function (makerAssetData, takerAssetData, makerFee, takerFee, makerAddress, takerAddress, makerFillableAmount, takerFillableAmount, feeRecipientAddress, expirationTimeSeconds) {
        return __awaiter(this, void 0, void 0, function () {
            var decodedMakerAssetData, decodedTakerAssetData, takerTokenAddress, senderAddress, signedOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decodedMakerAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(makerAssetData);
                        if (!(decodedMakerAssetData.assetProxyId === types_1.AssetProxyId.ERC20)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._increaseERC20BalanceAndAllowanceAsync(decodedMakerAssetData.tokenAddress, makerAddress, makerFillableAmount)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!makerFillableAmount.equals(1)) {
                            throw new Error("ERC721 makerFillableAmount should be equal 1. Found: " + makerFillableAmount);
                        }
                        return [4 /*yield*/, this._increaseERC721BalanceAndAllowanceAsync(decodedMakerAssetData.tokenAddress, makerAddress, 
                            // tslint:disable-next-line:no-unnecessary-type-assertion
                            decodedMakerAssetData.tokenId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        decodedTakerAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(takerAssetData);
                        if (!(decodedTakerAssetData.assetProxyId === types_1.AssetProxyId.ERC20)) return [3 /*break*/, 6];
                        takerTokenAddress = decodedTakerAssetData.tokenAddress;
                        return [4 /*yield*/, this._increaseERC20BalanceAndAllowanceAsync(takerTokenAddress, takerAddress, takerFillableAmount)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!takerFillableAmount.equals(1)) {
                            throw new Error("ERC721 takerFillableAmount should be equal 1. Found: " + takerFillableAmount);
                        }
                        return [4 /*yield*/, this._increaseERC721BalanceAndAllowanceAsync(decodedTakerAssetData.tokenAddress, takerAddress, 
                            // tslint:disable-next-line:no-unnecessary-type-assertion
                            decodedMakerAssetData.tokenId)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: 
                    // Fees
                    return [4 /*yield*/, Promise.all([
                            this._increaseERC20BalanceAndAllowanceAsync(this._zrxTokenAddress, makerAddress, makerFee),
                            this._increaseERC20BalanceAndAllowanceAsync(this._zrxTokenAddress, takerAddress, takerFee),
                        ])];
                    case 9:
                        // Fees
                        _a.sent();
                        senderAddress = constants_1.constants.NULL_ADDRESS;
                        return [4 /*yield*/, order_factory_1.orderFactory.createSignedOrderAsync(this._web3Wrapper.getProvider(), makerAddress, makerFillableAmount, makerAssetData, takerFillableAmount, takerAssetData, this._exchangeAddress, {
                                takerAddress: takerAddress,
                                senderAddress: senderAddress,
                                makerFee: makerFee,
                                takerFee: takerFee,
                                feeRecipientAddress: feeRecipientAddress,
                                expirationTimeSeconds: expirationTimeSeconds,
                            })];
                    case 10:
                        signedOrder = _a.sent();
                        return [2 /*return*/, signedOrder];
                }
            });
        });
    };
    FillScenarios.prototype._increaseERC721BalanceAndAllowanceAsync = function (tokenAddress, address, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._increaseERC721BalanceAsync(tokenAddress, address, tokenId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._increaseERC721AllowanceAsync(tokenAddress, address, tokenId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FillScenarios.prototype._increaseERC721AllowanceAsync = function (tokenAddress, address, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var erc721Token, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        erc721Token = new abi_gen_wrappers_1.DummyERC721TokenContract(artifacts.DummyERC721Token.compilerOutput.abi, tokenAddress, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                        return [4 /*yield*/, erc721Token.approve.sendTransactionAsync(this._erc721ProxyAddress, tokenId, {
                                from: address,
                            })];
                    case 1:
                        txHash = _a.sent();
                        return [4 /*yield*/, this._web3Wrapper.awaitTransactionSuccessAsync(txHash, constants_1.constants.AWAIT_TRANSACTION_MINED_MS)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FillScenarios.prototype._increaseERC721BalanceAsync = function (tokenAddress, address, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var erc721Token, currentOwner, err_1, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        erc721Token = new abi_gen_wrappers_1.DummyERC721TokenContract(artifacts.DummyERC721Token.compilerOutput.abi, tokenAddress, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 6]);
                        return [4 /*yield*/, erc721Token.ownerOf.callAsync(tokenId)];
                    case 2:
                        currentOwner = _a.sent();
                        if (currentOwner !== address) {
                            throw new Error("Token " + tokenAddress + ":" + tokenId + " is already owner by " + currentOwner);
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        err_1 = _a.sent();
                        return [4 /*yield*/, erc721Token.mint.sendTransactionAsync(address, tokenId, { from: this._coinbase })];
                    case 4:
                        txHash = _a.sent();
                        return [4 /*yield*/, this._web3Wrapper.awaitTransactionSuccessAsync(txHash, constants_1.constants.AWAIT_TRANSACTION_MINED_MS)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FillScenarios.prototype._increaseERC20BalanceAndAllowanceAsync = function (tokenAddress, address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (amount.isZero() || address === constants_1.constants.NULL_ADDRESS) {
                            return [2 /*return*/]; // noop
                        }
                        return [4 /*yield*/, Promise.all([
                                this._increaseERC20BalanceAsync(tokenAddress, address, amount),
                                this._increaseERC20AllowanceAsync(tokenAddress, address, amount),
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FillScenarios.prototype._increaseERC20BalanceAsync = function (tokenAddress, address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var erc20Token, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        erc20Token = new abi_gen_wrappers_1.DummyERC20TokenContract(artifacts.DummyERC20Token.compilerOutput.abi, tokenAddress, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                        return [4 /*yield*/, erc20Token.transfer.sendTransactionAsync(address, amount, {
                                from: this._coinbase,
                            })];
                    case 1:
                        txHash = _a.sent();
                        return [4 /*yield*/, this._web3Wrapper.awaitTransactionSuccessAsync(txHash, constants_1.constants.AWAIT_TRANSACTION_MINED_MS)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FillScenarios.prototype._increaseERC20AllowanceAsync = function (tokenAddress, address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var erc20Token, oldMakerAllowance, newMakerAllowance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        erc20Token = new abi_gen_wrappers_1.DummyERC20TokenContract(artifacts.DummyERC20Token.compilerOutput.abi, tokenAddress, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                        return [4 /*yield*/, erc20Token.allowance.callAsync(address, this._erc20ProxyAddress)];
                    case 1:
                        oldMakerAllowance = _a.sent();
                        newMakerAllowance = oldMakerAllowance.plus(amount);
                        return [4 /*yield*/, erc20Token.approve.sendTransactionAsync(this._erc20ProxyAddress, newMakerAllowance, {
                                from: address,
                            })];
                    case 2:
                        txHash = _a.sent();
                        return [4 /*yield*/, this._web3Wrapper.awaitTransactionSuccessAsync(txHash, constants_1.constants.AWAIT_TRANSACTION_MINED_MS)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FillScenarios;
}());
exports.FillScenarios = FillScenarios;
//# sourceMappingURL=fill_scenarios.js.map
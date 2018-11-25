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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var order_utils_1 = require("@0x/order-utils");
var types_1 = require("@0x/types");
var ethereum_types_1 = require("ethereum-types");
var _ = require("lodash");
var asset_balance_and_proxy_allowance_fetcher_1 = require("../fetchers/asset_balance_and_proxy_allowance_fetcher");
var order_filled_cancelled_fetcher_1 = require("../fetchers/order_filled_cancelled_fetcher");
var method_opts_schema_1 = require("../schemas/method_opts_schema");
var order_tx_opts_schema_1 = require("../schemas/order_tx_opts_schema");
var tx_opts_schema_1 = require("../schemas/tx_opts_schema");
var validate_order_fillable_opts_schema_1 = require("../schemas/validate_order_fillable_opts_schema");
var types_2 = require("../types");
var assert_1 = require("../utils/assert");
var contract_addresses_1 = require("../utils/contract_addresses");
var decorators_1 = require("../utils/decorators");
var transaction_encoder_1 = require("../utils/transaction_encoder");
var contract_wrapper_1 = require("./contract_wrapper");
/**
 * This class includes all the functionality related to calling methods, sending transactions and subscribing to
 * events of the 0x V2 Exchange smart contract.
 */
var ExchangeWrapper = /** @class */ (function (_super) {
    __extends(ExchangeWrapper, _super);
    /**
     * Instantiate ExchangeWrapper
     * @param web3Wrapper Web3Wrapper instance to use.
     * @param networkId Desired networkId.
     * @param erc20TokenWrapper ERC20TokenWrapper instance to use.
     * @param erc721TokenWrapper ERC721TokenWrapper instance to use.
     * @param address The address of the Exchange contract. If undefined, will
     * default to the known address corresponding to the networkId.
     * @param zrxTokenAddress The address of the ZRXToken contract. If
     * undefined, will default to the known address corresponding to the
     * networkId.
     * @param blockPollingIntervalMs The block polling interval to use for active subscriptions.
     */
    function ExchangeWrapper(web3Wrapper, networkId, erc20TokenWrapper, erc721TokenWrapper, address, zrxTokenAddress, blockPollingIntervalMs) {
        var _this = _super.call(this, web3Wrapper, networkId, blockPollingIntervalMs) || this;
        _this.abi = contract_artifacts_1.Exchange.compilerOutput.abi;
        _this._erc20TokenWrapper = erc20TokenWrapper;
        _this._erc721TokenWrapper = erc721TokenWrapper;
        _this.address = _.isUndefined(address) ? contract_addresses_1._getDefaultContractAddresses(networkId).exchange : address;
        _this.zrxTokenAddress = _.isUndefined(zrxTokenAddress)
            ? contract_addresses_1._getDefaultContractAddresses(networkId).zrxToken
            : zrxTokenAddress;
        return _this;
    }
    /**
     * Retrieve the address of an asset proxy by signature.
     * @param   proxyId        The 4 bytes signature of an asset proxy
     * @param   methodOpts     Optional arguments this method accepts.
     * @return  The address of an asset proxy for a given signature
     */
    ExchangeWrapper.prototype.getAssetProxyBySignatureAsync = function (proxyId, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeContract, txData, assetProxy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesBelongToStringEnum('proxyId', proxyId, types_1.AssetProxyId);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeContract = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeContract.getAssetProxy.callAsync(proxyId, txData, methodOpts.defaultBlock)];
                    case 2:
                        assetProxy = _a.sent();
                        return [2 /*return*/, assetProxy];
                }
            });
        });
    };
    /**
     * Retrieve the takerAssetAmount of an order that has already been filled.
     * @param   orderHash    The hex encoded orderHash for which you would like to retrieve the filled takerAssetAmount.
     * @param   methodOpts   Optional arguments this method accepts.
     * @return  The amount of the order (in taker asset base units) that has already been filled.
     */
    ExchangeWrapper.prototype.getFilledTakerAssetAmountAsync = function (orderHash, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeContract, txData, filledTakerAssetAmountInBaseUnits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('orderHash', orderHash, json_schemas_1.schemas.orderHashSchema);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeContract = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeContract.filled.callAsync(orderHash, txData, methodOpts.defaultBlock)];
                    case 2:
                        filledTakerAssetAmountInBaseUnits = _a.sent();
                        return [2 /*return*/, filledTakerAssetAmountInBaseUnits];
                }
            });
        });
    };
    /**
     * Retrieve the exchange contract version
     * @param   methodOpts   Optional arguments this method accepts.
     * @return  Version
     */
    ExchangeWrapper.prototype.getVersionAsync = function (methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeContract, txData, version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeContract = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeContract.VERSION.callAsync(txData, methodOpts.defaultBlock)];
                    case 2:
                        version = _a.sent();
                        return [2 /*return*/, version];
                }
            });
        });
    };
    /**
     * Retrieve the set order epoch for a given makerAddress & senderAddress pair.
     * Orders can be bulk cancelled by setting the order epoch to a value lower then the salt value of orders one wishes to cancel.
     * @param   makerAddress  Maker address
     * @param   senderAddress Sender address
     * @param   methodOpts    Optional arguments this method accepts.
     * @return  Order epoch. Defaults to 0.
     */
    ExchangeWrapper.prototype.getOrderEpochAsync = function (makerAddress, senderAddress, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeContract, txData, orderEpoch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('makerAddress', makerAddress);
                        assert_1.assert.isETHAddressHex('senderAddress', senderAddress);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeContract = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeContract.orderEpoch.callAsync(makerAddress, senderAddress, txData, methodOpts.defaultBlock)];
                    case 2:
                        orderEpoch = _a.sent();
                        return [2 /*return*/, orderEpoch];
                }
            });
        });
    };
    /**
     * Check if an order has been cancelled. Order cancellations are binary
     * @param   orderHash    The hex encoded orderHash for which you would like to retrieve the cancelled takerAmount.
     * @param   methodOpts   Optional arguments this method accepts.
     * @return  Whether the order has been cancelled.
     */
    ExchangeWrapper.prototype.isCancelledAsync = function (orderHash, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeContract, txData, isCancelled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('orderHash', orderHash, json_schemas_1.schemas.orderHashSchema);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeContract = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeContract.cancelled.callAsync(orderHash, txData, methodOpts.defaultBlock)];
                    case 2:
                        isCancelled = _a.sent();
                        return [2 /*return*/, isCancelled];
                }
            });
        });
    };
    /**
     * Fills a signed order with an amount denominated in baseUnits of the taker asset.
     * @param   signedOrder           An object that conforms to the SignedOrder interface.
     * @param   takerAssetFillAmount  The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress          The user Ethereum address who would like to fill this order. Must be available via the supplied
     *                                Provider provided at instantiation.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.fillOrderAsync = function (signedOrder, takerAssetFillAmount, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
                        assert_1.assert.isValidBaseUnitAmount('takerAssetFillAmount', takerAssetFillAmount);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.fillOrder.callAsync(signedOrder, takerAssetFillAmount, signedOrder.signature, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.fillOrder.sendTransactionAsync(signedOrder, takerAssetFillAmount, signedOrder.signature, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * No-throw version of fillOrderAsync. This version will not throw if the fill fails. This allows the caller to save gas at the expense of not knowing the reason the fill failed.
     * @param   signedOrder          An object that conforms to the SignedOrder interface.
     * @param   takerAssetFillAmount The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress         The user Ethereum address who would like to fill this order.
     *                               Must be available via the supplied Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.fillOrderNoThrowAsync = function (signedOrder, takerAssetFillAmount, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
                        assert_1.assert.isValidBaseUnitAmount('takerAssetFillAmount', takerAssetFillAmount);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.fillOrderNoThrow.callAsync(signedOrder, takerAssetFillAmount, signedOrder.signature, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.fillOrderNoThrow.sendTransactionAsync(signedOrder, takerAssetFillAmount, signedOrder.signature, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Attempts to fill a specific amount of an order. If the entire amount specified cannot be filled,
     * the fill order is abandoned.
     * @param   signedOrder          An object that conforms to the SignedOrder interface.
     * @param   takerAssetFillAmount The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress         The user Ethereum address who would like to fill this order. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.fillOrKillOrderAsync = function (signedOrder, takerAssetFillAmount, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
                        assert_1.assert.isValidBaseUnitAmount('takerAssetFillAmount', takerAssetFillAmount);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.fillOrKillOrder.callAsync(signedOrder, takerAssetFillAmount, signedOrder.signature, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.fillOrKillOrder.sendTransactionAsync(signedOrder, takerAssetFillAmount, signedOrder.signature, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Executes a 0x transaction. Transaction messages exist for the purpose of calling methods on the Exchange contract
     * in the context of another address (see [ZEIP18](https://github.com/0xProject/ZEIPs/issues/18)).
     * This is especially useful for implementing filter contracts.
     * @param   salt                  Salt
     * @param   signerAddress         Signer address
     * @param   data                  Transaction data
     * @param   signature             Signature
     * @param   senderAddress         Sender address
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.executeTransactionAsync = function (salt, signerAddress, data, signature, senderAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedSenderAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isBigNumber('salt', salt);
                        assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
                        assert_1.assert.isHexString('data', data);
                        assert_1.assert.isHexString('signature', signature);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('senderAddress', senderAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedSenderAddress = senderAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.executeTransaction.callAsync(salt, signerAddress, data, signature, {
                                from: normalizedSenderAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.executeTransaction.sendTransactionAsync(salt, signerAddress, data, signature, {
                            from: normalizedSenderAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Batch version of fillOrderAsync. Executes multiple fills atomically in a single transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress          The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                                Provider provided at instantiation.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.batchFillOrdersAsync = function (signedOrders, takerAssetFillAmounts, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, signatures, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        _.forEach(takerAssetFillAmounts, function (takerAssetFillAmount) {
                            return assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
                        });
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.batchFillOrders.callAsync(signedOrders, takerAssetFillAmounts, signatures, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.batchFillOrders.sendTransactionAsync(signedOrders, takerAssetFillAmounts, signatures, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Synchronously executes multiple calls to fillOrder until total amount of makerAsset is bought by taker.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   makerAssetFillAmount Maker asset fill amount.
     * @param   takerAddress         The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.marketBuyOrdersAsync = function (signedOrders, makerAssetFillAmount, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, signatures, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        assert_1.assert.isBigNumber('makerAssetFillAmount', makerAssetFillAmount);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.marketBuyOrders.callAsync(signedOrders, makerAssetFillAmount, signatures, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.marketBuyOrders.sendTransactionAsync(signedOrders, makerAssetFillAmount, signatures, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Synchronously executes multiple calls to fillOrder until total amount of makerAsset is bought by taker.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   takerAssetFillAmount Taker asset fill amount.
     * @param   takerAddress         The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.marketSellOrdersAsync = function (signedOrders, takerAssetFillAmount, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, signatures, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.marketSellOrders.callAsync(signedOrders, takerAssetFillAmount, signatures, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.marketSellOrders.sendTransactionAsync(signedOrders, takerAssetFillAmount, signatures, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * No throw version of marketBuyOrdersAsync
     * @param   signedOrders         An array of signed orders to fill.
     * @param   makerAssetFillAmount Maker asset fill amount.
     * @param   takerAddress         The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.marketBuyOrdersNoThrowAsync = function (signedOrders, makerAssetFillAmount, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, signatures, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        assert_1.assert.isBigNumber('makerAssetFillAmount', makerAssetFillAmount);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.marketBuyOrdersNoThrow.callAsync(signedOrders, makerAssetFillAmount, signatures, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.marketBuyOrdersNoThrow.sendTransactionAsync(signedOrders, makerAssetFillAmount, signatures, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * No throw version of marketSellOrdersAsync
     * @param   signedOrders         An array of signed orders to fill.
     * @param   takerAssetFillAmount Taker asset fill amount.
     * @param   takerAddress         The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.marketSellOrdersNoThrowAsync = function (signedOrders, takerAssetFillAmount, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, signatures, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.marketSellOrdersNoThrow.callAsync(signedOrders, takerAssetFillAmount, signatures, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.marketSellOrdersNoThrow.sendTransactionAsync(signedOrders, takerAssetFillAmount, signatures, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * No throw version of batchFillOrdersAsync
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress          The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                                Provider provided at instantiation.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.batchFillOrdersNoThrowAsync = function (signedOrders, takerAssetFillAmounts, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, signatures, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        _.forEach(takerAssetFillAmounts, function (takerAssetFillAmount) {
                            return assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
                        });
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.batchFillOrdersNoThrow.callAsync(signedOrders, takerAssetFillAmounts, signatures, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.batchFillOrdersNoThrow.sendTransactionAsync(signedOrders, takerAssetFillAmounts, signatures, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Batch version of fillOrKillOrderAsync. Executes multiple fills atomically in a single transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress          The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                                Provider provided at instantiation.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.batchFillOrKillOrdersAsync = function (signedOrders, takerAssetFillAmounts, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, signatures, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        _.forEach(takerAssetFillAmounts, function (takerAssetFillAmount) {
                            return assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
                        });
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.batchFillOrKillOrders.callAsync(signedOrders, takerAssetFillAmounts, signatures, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.batchFillOrKillOrders.sendTransactionAsync(signedOrders, takerAssetFillAmounts, signatures, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Batch version of cancelOrderAsync. Executes multiple cancels atomically in a single transaction.
     * @param   orders                An array of orders to cancel.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.batchCancelOrdersAsync = function (orders, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var makerAddresses, makerAddress, normalizedMakerAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('orders', orders, json_schemas_1.schemas.ordersSchema);
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        makerAddresses = _.map(orders, function (order) { return order.makerAddress; });
                        makerAddress = makerAddresses[0];
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('makerAddress', makerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        normalizedMakerAddress = makerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.batchCancelOrders.callAsync(orders, {
                                from: normalizedMakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.batchCancelOrders.sendTransactionAsync(orders, {
                            from: normalizedMakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Match two complementary orders that have a profitable spread.
     * Each order is filled at their respective price point. However, the calculations are carried out as though
     * the orders are both being filled at the right order's price point.
     * The profit made by the left order goes to the taker (whoever matched the two orders).
     * @param leftSignedOrder  First order to match.
     * @param rightSignedOrder Second order to match.
     * @param takerAddress     The address that sends the transaction and gets the spread.
     * @param orderTransactionOpts Optional arguments this method accepts.
     * @return Transaction hash.
     */
    ExchangeWrapper.prototype.matchOrdersAsync = function (leftSignedOrder, rightSignedOrder, takerAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('leftSignedOrder', leftSignedOrder, json_schemas_1.schemas.signedOrderSchema);
                        assert_1.assert.doesConformToSchema('rightSignedOrder', rightSignedOrder, json_schemas_1.schemas.signedOrderSchema);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        if (rightSignedOrder.makerAssetData !== leftSignedOrder.takerAssetData ||
                            rightSignedOrder.takerAssetData !== leftSignedOrder.makerAssetData) {
                            throw new Error(types_2.ExchangeWrapperError.AssetDataMismatch);
                        }
                        else {
                            // Smart contracts assigns the asset data from the left order to the right one so we can save gas on reducing the size of call data
                            rightSignedOrder.makerAssetData = '0x';
                            rightSignedOrder.takerAssetData = '0x';
                        }
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.matchOrders.callAsync(leftSignedOrder, rightSignedOrder, leftSignedOrder.signature, rightSignedOrder.signature, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.matchOrders.sendTransactionAsync(leftSignedOrder, rightSignedOrder, leftSignedOrder.signature, rightSignedOrder.signature, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Approves a hash on-chain using any valid signature type.
     * After presigning a hash, the preSign signature type will become valid for that hash and signer.
     * @param hash          Hash to pre-sign
     * @param signerAddress Address that should have signed the given hash.
     * @param signature     Proof that the hash has been signed by signer.
     * @param senderAddress Address that should send the transaction.
     * @param orderTransactionOpts Optional arguments this method accepts.
     * @returns Transaction hash.
     */
    ExchangeWrapper.prototype.preSignAsync = function (hash, signerAddress, signature, senderAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTakerAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isHexString('hash', hash);
                        assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
                        assert_1.assert.isHexString('signature', signature);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('senderAddress', senderAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedTakerAddress = senderAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.preSign.callAsync(hash, signerAddress, signature, {
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.preSign.sendTransactionAsync(hash, signerAddress, signature, {
                            from: normalizedTakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Checks if the signature is valid.
     * @param hash          Hash to pre-sign
     * @param signerAddress Address that should have signed the given hash.
     * @param signature     Proof that the hash has been signed by signer.
     * @param methodOpts    Optional arguments this method accepts.
     * @returns If the signature is valid
     */
    ExchangeWrapper.prototype.isValidSignatureAsync = function (hash, signerAddress, signature, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeInstance, txData, isValidSignature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isHexString('hash', hash);
                        assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
                        assert_1.assert.isHexString('signature', signature);
                        assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeInstance = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeInstance.isValidSignature.callAsync(hash, signerAddress, signature, txData, methodOpts.defaultBlock)];
                    case 2:
                        isValidSignature = _a.sent();
                        return [2 /*return*/, isValidSignature];
                }
            });
        });
    };
    /**
     * Checks if the validator is allowed by the signer.
     * @param validatorAddress  Address of a validator
     * @param signerAddress     Address of a signer
     * @param methodOpts        Optional arguments this method accepts.
     * @returns If the validator is allowed
     */
    ExchangeWrapper.prototype.isAllowedValidatorAsync = function (signerAddress, validatorAddress, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedSignerAddress, normalizedValidatorAddress, exchangeInstance, txData, isValidSignature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
                        assert_1.assert.isETHAddressHex('validatorAddress', validatorAddress);
                        if (!_.isUndefined(methodOpts)) {
                            assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        }
                        normalizedSignerAddress = signerAddress.toLowerCase();
                        normalizedValidatorAddress = validatorAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeInstance = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeInstance.allowedValidators.callAsync(normalizedSignerAddress, normalizedValidatorAddress, txData, methodOpts.defaultBlock)];
                    case 2:
                        isValidSignature = _a.sent();
                        return [2 /*return*/, isValidSignature];
                }
            });
        });
    };
    /**
     * Check whether the hash is pre-signed on-chain.
     * @param hash          Hash to check if pre-signed
     * @param signerAddress Address that should have signed the given hash.
     * @param methodOpts    Optional arguments this method accepts.
     * @returns Whether the hash is pre-signed.
     */
    ExchangeWrapper.prototype.isPreSignedAsync = function (hash, signerAddress, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeInstance, txData, isPreSigned;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isHexString('hash', hash);
                        assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
                        if (!_.isUndefined(methodOpts)) {
                            assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        }
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeInstance = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeInstance.preSigned.callAsync(hash, signerAddress, txData, methodOpts.defaultBlock)];
                    case 2:
                        isPreSigned = _a.sent();
                        return [2 /*return*/, isPreSigned];
                }
            });
        });
    };
    /**
     * Checks if transaction is already executed.
     * @param transactionHash  Transaction hash to check
     * @param signerAddress    Address that should have signed the given hash.
     * @param methodOpts       Optional arguments this method accepts.
     * @returns If transaction is already executed.
     */
    ExchangeWrapper.prototype.isTransactionExecutedAsync = function (transactionHash, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeInstance, txData, isExecuted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isHexString('transactionHash', transactionHash);
                        if (!_.isUndefined(methodOpts)) {
                            assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        }
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeInstance = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeInstance.transactions.callAsync(transactionHash, txData, methodOpts.defaultBlock)];
                    case 2:
                        isExecuted = _a.sent();
                        return [2 /*return*/, isExecuted];
                }
            });
        });
    };
    /**
     * Get order info
     * @param order         Order
     * @param methodOpts    Optional arguments this method accepts.
     * @returns Order info
     */
    ExchangeWrapper.prototype.getOrderInfoAsync = function (order, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeInstance, txData, orderInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.orderSchema);
                        if (!_.isUndefined(methodOpts)) {
                            assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        }
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeInstance = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeInstance.getOrderInfo.callAsync(order, txData, methodOpts.defaultBlock)];
                    case 2:
                        orderInfo = _a.sent();
                        return [2 /*return*/, orderInfo];
                }
            });
        });
    };
    /**
     * Get order info for multiple orders
     * @param orders         Orders
     * @param methodOpts    Optional arguments this method accepts.
     * @returns Array of Order infos
     */
    ExchangeWrapper.prototype.getOrdersInfoAsync = function (orders, methodOpts) {
        if (methodOpts === void 0) { methodOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exchangeInstance, txData, ordersInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('orders', orders, json_schemas_1.schemas.ordersSchema);
                        if (!_.isUndefined(methodOpts)) {
                            assert_1.assert.doesConformToSchema('methodOpts', methodOpts, method_opts_schema_1.methodOptsSchema);
                        }
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeInstance = _a.sent();
                        txData = {};
                        return [4 /*yield*/, exchangeInstance.getOrdersInfo.callAsync(orders, txData, methodOpts.defaultBlock)];
                    case 2:
                        ordersInfo = _a.sent();
                        return [2 /*return*/, ordersInfo];
                }
            });
        });
    };
    /**
     * Cancel a given order.
     * @param   order           An object that conforms to the Order or SignedOrder interface. The order you would like to cancel.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.cancelOrderAsync = function (order, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedMakerAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.orderSchema);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('order.maker', order.makerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedMakerAddress = order.makerAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.cancelOrder.callAsync(order, {
                                from: normalizedMakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.cancelOrder.sendTransactionAsync(order, {
                            from: normalizedMakerAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Sets the signature validator approval
     * @param   validatorAddress        Validator contract address.
     * @param   isApproved              Boolean value to set approval to.
     * @param   senderAddress           Sender address.
     * @param   orderTransactionOpts    Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.setSignatureValidatorApprovalAsync = function (validatorAddress, isApproved, senderAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedSenderAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('validatorAddress', validatorAddress);
                        assert_1.assert.isBoolean('isApproved', isApproved);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('senderAddress', senderAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedSenderAddress = senderAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.setSignatureValidatorApproval.callAsync(validatorAddress, isApproved, {
                                from: normalizedSenderAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.setSignatureValidatorApproval.sendTransactionAsync(validatorAddress, isApproved, {
                            from: normalizedSenderAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Cancels all orders created by makerAddress with a salt less than or equal to the targetOrderEpoch
     * and senderAddress equal to msg.sender (or null address if msg.sender == makerAddress).
     * @param   targetOrderEpoch             Target order epoch.
     * @param   senderAddress                Address that should send the transaction.
     * @param   orderTransactionOpts         Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    ExchangeWrapper.prototype.cancelOrdersUpToAsync = function (targetOrderEpoch, senderAddress, orderTransactionOpts) {
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedSenderAddress, exchangeInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isBigNumber('targetOrderEpoch', targetOrderEpoch);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('senderAddress', senderAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        normalizedSenderAddress = senderAddress.toLowerCase();
                        return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 2:
                        exchangeInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, exchangeInstance.cancelOrdersUpTo.callAsync(targetOrderEpoch, {
                                from: normalizedSenderAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, exchangeInstance.cancelOrdersUpTo.sendTransactionAsync(targetOrderEpoch, {
                            from: normalizedSenderAddress,
                            gas: orderTransactionOpts.gasLimit,
                            gasPrice: orderTransactionOpts.gasPrice,
                        })];
                    case 5:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Subscribe to an event type emitted by the Exchange contract.
     * @param   eventName           The exchange contract event you would like to subscribe to.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param   callback            Callback that gets called when a log is added/removed
     * @param   isVerbose           Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    ExchangeWrapper.prototype.subscribe = function (eventName, indexFilterValues, callback, isVerbose) {
        if (isVerbose === void 0) { isVerbose = false; }
        assert_1.assert.doesBelongToStringEnum('eventName', eventName, abi_gen_wrappers_1.ExchangeEvents);
        assert_1.assert.doesConformToSchema('indexFilterValues', indexFilterValues, json_schemas_1.schemas.indexFilterValuesSchema);
        assert_1.assert.isFunction('callback', callback);
        var subscriptionToken = this._subscribe(this.address, eventName, indexFilterValues, contract_artifacts_1.Exchange.compilerOutput.abi, callback, isVerbose);
        return subscriptionToken;
    };
    /**
     * Cancel a subscription
     * @param   subscriptionToken Subscription token returned by `subscribe()`
     */
    ExchangeWrapper.prototype.unsubscribe = function (subscriptionToken) {
        this._unsubscribe(subscriptionToken);
    };
    /**
     * Cancels all existing subscriptions
     */
    ExchangeWrapper.prototype.unsubscribeAll = function () {
        _super.prototype._unsubscribeAll.call(this);
    };
    /**
     * Gets historical logs without creating a subscription
     * @param   eventName           The exchange contract event you would like to subscribe to.
     * @param   blockRange          Block range to get logs from.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return  Array of logs that match the parameters
     */
    ExchangeWrapper.prototype.getLogsAsync = function (eventName, blockRange, indexFilterValues) {
        return __awaiter(this, void 0, void 0, function () {
            var logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesBelongToStringEnum('eventName', eventName, abi_gen_wrappers_1.ExchangeEvents);
                        assert_1.assert.doesConformToSchema('blockRange', blockRange, json_schemas_1.schemas.blockRangeSchema);
                        assert_1.assert.doesConformToSchema('indexFilterValues', indexFilterValues, json_schemas_1.schemas.indexFilterValuesSchema);
                        return [4 /*yield*/, this._getLogsAsync(this.address, eventName, blockRange, indexFilterValues, contract_artifacts_1.Exchange.compilerOutput.abi)];
                    case 1:
                        logs = _a.sent();
                        return [2 /*return*/, logs];
                }
            });
        });
    };
    /**
     * Validate if the supplied order is fillable, and throw if it isn't
     * @param signedOrder SignedOrder of interest
     * @param opts ValidateOrderFillableOpts options (e.g expectedFillTakerTokenAmount.
     * If it isn't supplied, we check if the order is fillable for a non-zero amount)
     */
    ExchangeWrapper.prototype.validateOrderFillableOrThrowAsync = function (signedOrder, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var balanceAllowanceFetcher, balanceAllowanceStore, exchangeTradeSimulator, expectedFillTakerTokenAmountIfExists, filledCancelledFetcher, orderValidationUtils;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
                        assert_1.assert.doesConformToSchema('opts', opts, validate_order_fillable_opts_schema_1.validateOrderFillableOptsSchema);
                        balanceAllowanceFetcher = new asset_balance_and_proxy_allowance_fetcher_1.AssetBalanceAndProxyAllowanceFetcher(this._erc20TokenWrapper, this._erc721TokenWrapper, ethereum_types_1.BlockParamLiteral.Latest);
                        balanceAllowanceStore = new order_utils_1.BalanceAndProxyAllowanceLazyStore(balanceAllowanceFetcher);
                        exchangeTradeSimulator = new order_utils_1.ExchangeTransferSimulator(balanceAllowanceStore);
                        expectedFillTakerTokenAmountIfExists = opts.expectedFillTakerTokenAmount;
                        filledCancelledFetcher = new order_filled_cancelled_fetcher_1.OrderFilledCancelledFetcher(this, ethereum_types_1.BlockParamLiteral.Latest);
                        orderValidationUtils = new order_utils_1.OrderValidationUtils(filledCancelledFetcher, this._web3Wrapper.getProvider());
                        return [4 /*yield*/, orderValidationUtils.validateOrderFillableOrThrowAsync(exchangeTradeSimulator, signedOrder, this.getZRXAssetData(), expectedFillTakerTokenAmountIfExists)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate a call to FillOrder and throw if it wouldn't succeed
     * @param signedOrder SignedOrder of interest
     * @param fillTakerAssetAmount Amount we'd like to fill the order for
     * @param takerAddress The taker of the order
     */
    ExchangeWrapper.prototype.validateFillOrderThrowIfInvalidAsync = function (signedOrder, fillTakerAssetAmount, takerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var balanceAllowanceFetcher, balanceAllowanceStore, exchangeTradeSimulator, filledCancelledFetcher, orderValidationUtils;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        balanceAllowanceFetcher = new asset_balance_and_proxy_allowance_fetcher_1.AssetBalanceAndProxyAllowanceFetcher(this._erc20TokenWrapper, this._erc721TokenWrapper, ethereum_types_1.BlockParamLiteral.Latest);
                        balanceAllowanceStore = new order_utils_1.BalanceAndProxyAllowanceLazyStore(balanceAllowanceFetcher);
                        exchangeTradeSimulator = new order_utils_1.ExchangeTransferSimulator(balanceAllowanceStore);
                        filledCancelledFetcher = new order_filled_cancelled_fetcher_1.OrderFilledCancelledFetcher(this, ethereum_types_1.BlockParamLiteral.Latest);
                        orderValidationUtils = new order_utils_1.OrderValidationUtils(filledCancelledFetcher, this._web3Wrapper.getProvider());
                        return [4 /*yield*/, orderValidationUtils.validateFillOrderThrowIfInvalidAsync(exchangeTradeSimulator, this._web3Wrapper.getProvider(), signedOrder, fillTakerAssetAmount, takerAddress, this.getZRXAssetData())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the ZRX asset data used by the exchange contract.
     * @return ZRX asset data
     */
    ExchangeWrapper.prototype.getZRXAssetData = function () {
        var zrxAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(this.zrxTokenAddress);
        return zrxAssetData;
    };
    /**
     * Returns a Transaction Encoder. Transaction messages exist for the purpose of calling methods on the Exchange contract
     * in the context of another address.
     * @return TransactionEncoder
     */
    ExchangeWrapper.prototype.transactionEncoderAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var exchangeInstance, encoder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getExchangeContractAsync()];
                    case 1:
                        exchangeInstance = _a.sent();
                        encoder = new transaction_encoder_1.TransactionEncoder(exchangeInstance);
                        return [2 /*return*/, encoder];
                }
            });
        });
    };
    // tslint:enable:no-unused-variable
    ExchangeWrapper.prototype._getExchangeContractAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contractInstance;
            return __generator(this, function (_a) {
                if (!_.isUndefined(this._exchangeContractIfExists)) {
                    return [2 /*return*/, this._exchangeContractIfExists];
                }
                contractInstance = new abi_gen_wrappers_1.ExchangeContract(this.abi, this.address, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                this._exchangeContractIfExists = contractInstance;
                return [2 /*return*/, this._exchangeContractIfExists];
            });
        });
    };
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "fillOrderAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "fillOrderNoThrowAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "fillOrKillOrderAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "executeTransactionAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "batchFillOrdersAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "marketBuyOrdersAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "marketSellOrdersAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "marketBuyOrdersNoThrowAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "marketSellOrdersNoThrowAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "batchFillOrdersNoThrowAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "batchFillOrKillOrdersAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "batchCancelOrdersAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "matchOrdersAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "preSignAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "isValidSignatureAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "isAllowedValidatorAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "isPreSignedAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "isTransactionExecutedAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "getOrderInfoAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "getOrdersInfoAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "cancelOrderAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "setSignatureValidatorApprovalAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ExchangeWrapper.prototype, "cancelOrdersUpToAsync", null);
    return ExchangeWrapper;
}(contract_wrapper_1.ContractWrapper)); // tslint:disable:max-file-line-count
exports.ExchangeWrapper = ExchangeWrapper;
//# sourceMappingURL=exchange_wrapper.js.map
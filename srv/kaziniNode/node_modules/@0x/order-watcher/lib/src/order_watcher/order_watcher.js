"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var artifacts = require("@0x/contract-artifacts");
var contract_wrappers_1 = require("@0x/contract-wrappers");
var json_schemas_1 = require("@0x/json-schemas");
var order_utils_1 = require("@0x/order-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var ethereum_types_1 = require("ethereum-types");
var _ = require("lodash");
var order_watcher_partial_config_schema_1 = require("../schemas/order_watcher_partial_config_schema");
var types_2 = require("../types");
var assert_1 = require("../utils/assert");
var collision_resistant_abi_decoder_1 = require("./collision_resistant_abi_decoder");
var dependent_order_hashes_tracker_1 = require("./dependent_order_hashes_tracker");
var event_watcher_1 = require("./event_watcher");
var expiration_watcher_1 = require("./expiration_watcher");
var MILLISECONDS_IN_A_SECOND = 1000;
var DEFAULT_ORDER_WATCHER_CONFIG = {
    orderExpirationCheckingIntervalMs: 50,
    eventPollingIntervalMs: 200,
    expirationMarginMs: 0,
    // tslint:disable-next-line:custom-no-magic-numbers
    cleanupJobIntervalMs: 1000 * 60 * 60,
    isVerbose: true,
};
var STATE_LAYER = ethereum_types_1.BlockParamLiteral.Latest;
/**
 * This class includes all the functionality related to watching a set of orders
 * for potential changes in order validity/fillability. The orderWatcher notifies
 * the subscriber of these changes so that a final decision can be made on whether
 * the order should be deemed invalid.
 */
var OrderWatcher = /** @class */ (function () {
    /**
     * Instantiate a new OrderWatcher
     * @param provider Web3 provider to use for JSON RPC calls
     * @param networkId NetworkId to watch orders on
     * @param contractAddresses Optional contract addresses. Defaults to known
     * addresses based on networkId.
     * @param partialConfig Optional configurations
     */
    function OrderWatcher(provider, networkId, contractAddresses, partialConfig) {
        if (partialConfig === void 0) { partialConfig = DEFAULT_ORDER_WATCHER_CONFIG; }
        this._orderStateByOrderHashCache = {};
        this._orderByOrderHash = {};
        assert_1.assert.isWeb3Provider('provider', provider);
        assert_1.assert.isNumber('networkId', networkId);
        assert_1.assert.doesConformToSchema('partialConfig', partialConfig, order_watcher_partial_config_schema_1.orderWatcherPartialConfigSchema);
        var config = __assign({}, DEFAULT_ORDER_WATCHER_CONFIG, partialConfig);
        this._provider = provider;
        this._collisionResistantAbiDecoder = new collision_resistant_abi_decoder_1.CollisionResistanceAbiDecoder(artifacts.ERC20Token.compilerOutput.abi, artifacts.ERC721Token.compilerOutput.abi, [artifacts.WETH9.compilerOutput.abi, artifacts.Exchange.compilerOutput.abi]);
        var contractWrappers = new contract_wrappers_1.ContractWrappers(provider, {
            networkId: networkId,
            // Note(albrow): We let the contract-wrappers package handle
            // default values for contractAddresses.
            contractAddresses: contractAddresses,
        });
        this._eventWatcher = new event_watcher_1.EventWatcher(provider, config.eventPollingIntervalMs, STATE_LAYER, config.isVerbose);
        var balanceAndProxyAllowanceFetcher = new contract_wrappers_1.AssetBalanceAndProxyAllowanceFetcher(contractWrappers.erc20Token, contractWrappers.erc721Token, STATE_LAYER);
        this._balanceAndProxyAllowanceLazyStore = new order_utils_1.BalanceAndProxyAllowanceLazyStore(balanceAndProxyAllowanceFetcher);
        var orderFilledCancelledFetcher = new contract_wrappers_1.OrderFilledCancelledFetcher(contractWrappers.exchange, STATE_LAYER);
        this._orderFilledCancelledLazyStore = new order_utils_1.OrderFilledCancelledLazyStore(orderFilledCancelledFetcher);
        this._orderStateUtils = new order_utils_1.OrderStateUtils(balanceAndProxyAllowanceFetcher, orderFilledCancelledFetcher);
        var expirationMarginIfExistsMs = _.isUndefined(config) ? undefined : config.expirationMarginMs;
        this._expirationWatcher = new expiration_watcher_1.ExpirationWatcher(expirationMarginIfExistsMs, config.orderExpirationCheckingIntervalMs);
        this._cleanupJobInterval = config.cleanupJobIntervalMs;
        var zrxTokenAddress = order_utils_1.assetDataUtils.decodeERC20AssetData(orderFilledCancelledFetcher.getZRXAssetData())
            .tokenAddress;
        this._dependentOrderHashesTracker = new dependent_order_hashes_tracker_1.DependentOrderHashesTracker(zrxTokenAddress);
    }
    /**
     * Add an order to the orderWatcher. Before the order is added, it's
     * signature is verified.
     * @param   signedOrder     The order you wish to start watching.
     */
    OrderWatcher.prototype.addOrderAsync = function (signedOrder) {
        return __awaiter(this, void 0, void 0, function () {
            var orderHash, expirationUnixTimestampMs, orderAssetDatas;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
                        orderHash = order_utils_1.orderHashUtils.getOrderHashHex(signedOrder);
                        return [4 /*yield*/, assert_1.assert.isValidSignatureAsync(this._provider, orderHash, signedOrder.signature, signedOrder.makerAddress)];
                    case 1:
                        _a.sent();
                        expirationUnixTimestampMs = signedOrder.expirationTimeSeconds.times(MILLISECONDS_IN_A_SECOND);
                        this._expirationWatcher.addOrder(orderHash, expirationUnixTimestampMs);
                        this._orderByOrderHash[orderHash] = signedOrder;
                        this._dependentOrderHashesTracker.addToDependentOrderHashes(signedOrder);
                        orderAssetDatas = [signedOrder.makerAssetData, signedOrder.takerAssetData];
                        _.each(orderAssetDatas, function (assetData) {
                            var decodedAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(assetData);
                            if (decodedAssetData.assetProxyId === types_1.AssetProxyId.ERC20) {
                                _this._collisionResistantAbiDecoder.addERC20Token(decodedAssetData.tokenAddress);
                            }
                            else if (decodedAssetData.assetProxyId === types_1.AssetProxyId.ERC721) {
                                _this._collisionResistantAbiDecoder.addERC721Token(decodedAssetData.tokenAddress);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes an order from the orderWatcher
     * @param   orderHash     The orderHash of the order you wish to stop watching.
     */
    OrderWatcher.prototype.removeOrder = function (orderHash) {
        assert_1.assert.doesConformToSchema('orderHash', orderHash, json_schemas_1.schemas.orderHashSchema);
        var signedOrder = this._orderByOrderHash[orderHash];
        if (_.isUndefined(signedOrder)) {
            return; // noop
        }
        this._dependentOrderHashesTracker.removeFromDependentOrderHashes(signedOrder);
        delete this._orderByOrderHash[orderHash];
        this._expirationWatcher.removeOrder(orderHash);
        delete this._orderStateByOrderHashCache[orderHash];
    };
    /**
     * Starts an orderWatcher subscription. The callback will be called every time a watched order's
     * backing blockchain state has changed. This is a call-to-action for the caller to re-validate the order.
     * @param   callback            Receives the orderHash of the order that should be re-validated, together
     *                              with all the order-relevant blockchain state needed to re-validate the order.
     */
    OrderWatcher.prototype.subscribe = function (callback) {
        var _this = this;
        assert_1.assert.isFunction('callback', callback);
        if (!_.isUndefined(this._callbackIfExists)) {
            throw new Error(types_2.OrderWatcherError.SubscriptionAlreadyPresent);
        }
        this._callbackIfExists = callback;
        this._eventWatcher.subscribe(this._onEventWatcherCallbackAsync.bind(this));
        this._expirationWatcher.subscribe(this._onOrderExpired.bind(this));
        this._cleanupJobIntervalIdIfExists = utils_1.intervalUtils.setAsyncExcludingInterval(this._cleanupAsync.bind(this), this._cleanupJobInterval, function (err) {
            _this.unsubscribe();
            callback(err);
        });
    };
    /**
     * Ends an orderWatcher subscription.
     */
    OrderWatcher.prototype.unsubscribe = function () {
        if (_.isUndefined(this._callbackIfExists) || _.isUndefined(this._cleanupJobIntervalIdIfExists)) {
            throw new Error(types_2.OrderWatcherError.SubscriptionNotFound);
        }
        this._balanceAndProxyAllowanceLazyStore.deleteAll();
        this._orderFilledCancelledLazyStore.deleteAll();
        delete this._callbackIfExists;
        this._eventWatcher.unsubscribe();
        this._expirationWatcher.unsubscribe();
        utils_1.intervalUtils.clearAsyncExcludingInterval(this._cleanupJobIntervalIdIfExists);
    };
    /**
     * Gets statistics of the OrderWatcher Instance.
     */
    OrderWatcher.prototype.getStats = function () {
        return {
            orderCount: _.size(this._orderByOrderHash),
        };
    };
    OrderWatcher.prototype._cleanupAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, _b, _c, orderHash, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _b = __values(_.keys(this._orderByOrderHash)), _c = _b.next();
                        _d.label = 1;
                    case 1:
                        if (!!_c.done) return [3 /*break*/, 4];
                        orderHash = _c.value;
                        this._cleanupOrderRelatedState(orderHash);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync([orderHash])];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _c = _b.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    OrderWatcher.prototype._cleanupOrderRelatedState = function (orderHash) {
        var signedOrder = this._orderByOrderHash[orderHash];
        this._orderFilledCancelledLazyStore.deleteFilledTakerAmount(orderHash);
        this._orderFilledCancelledLazyStore.deleteIsCancelled(orderHash);
        this._balanceAndProxyAllowanceLazyStore.deleteBalance(signedOrder.makerAssetData, signedOrder.makerAddress);
        this._balanceAndProxyAllowanceLazyStore.deleteProxyAllowance(signedOrder.makerAssetData, signedOrder.makerAddress);
        this._balanceAndProxyAllowanceLazyStore.deleteBalance(signedOrder.takerAssetData, signedOrder.takerAddress);
        this._balanceAndProxyAllowanceLazyStore.deleteProxyAllowance(signedOrder.takerAssetData, signedOrder.takerAddress);
        var zrxAssetData = this._orderFilledCancelledLazyStore.getZRXAssetData();
        if (!signedOrder.makerFee.isZero()) {
            this._balanceAndProxyAllowanceLazyStore.deleteBalance(zrxAssetData, signedOrder.makerAddress);
            this._balanceAndProxyAllowanceLazyStore.deleteProxyAllowance(zrxAssetData, signedOrder.makerAddress);
        }
        if (!signedOrder.takerFee.isZero()) {
            this._balanceAndProxyAllowanceLazyStore.deleteBalance(zrxAssetData, signedOrder.takerAddress);
            this._balanceAndProxyAllowanceLazyStore.deleteProxyAllowance(zrxAssetData, signedOrder.takerAddress);
        }
    };
    OrderWatcher.prototype._onOrderExpired = function (orderHash) {
        var orderState = {
            isValid: false,
            orderHash: orderHash,
            error: types_1.ExchangeContractErrs.OrderFillExpired,
        };
        if (!_.isUndefined(this._orderByOrderHash[orderHash])) {
            this.removeOrder(orderHash);
            if (!_.isUndefined(this._callbackIfExists)) {
                this._callbackIfExists(null, orderState);
            }
        }
    };
    OrderWatcher.prototype._onEventWatcherCallbackAsync = function (err, logIfExists) {
        return __awaiter(this, void 0, void 0, function () {
            var maybeDecodedLog, isLogDecoded, decodedLog, transactionHash, _a, args, tokenAssetData, orderHashes, args, tokenAssetData, orderHashes, args, tokenAssetData, orderHashes, args, tokenAssetData, orderHashes, args, tokenAddress, orderHashes, args, tokenAssetData, orderHashes, args, tokenAssetData, orderHashes, args, orderHash, isOrderWatched, args, orderHash, isOrderWatched, args, orderHashes;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!_.isNull(err)) {
                            if (!_.isUndefined(this._callbackIfExists)) {
                                this._callbackIfExists(err);
                            }
                            return [2 /*return*/];
                        }
                        maybeDecodedLog = this._collisionResistantAbiDecoder.tryToDecodeLogOrNoop(
                        // At this moment we are sure that no error occured and log is defined.
                        logIfExists);
                        isLogDecoded = !_.isUndefined(maybeDecodedLog.event);
                        if (!isLogDecoded) {
                            return [2 /*return*/]; // noop
                        }
                        decodedLog = maybeDecodedLog;
                        transactionHash = decodedLog.transactionHash;
                        _a = decodedLog.event;
                        switch (_a) {
                            case contract_wrappers_1.ERC20TokenEvents.Approval: return [3 /*break*/, 1];
                            case contract_wrappers_1.ERC721TokenEvents.Approval: return [3 /*break*/, 1];
                            case contract_wrappers_1.ERC20TokenEvents.Transfer: return [3 /*break*/, 5];
                            case contract_wrappers_1.ERC721TokenEvents.Transfer: return [3 /*break*/, 5];
                            case contract_wrappers_1.ERC721TokenEvents.ApprovalForAll: return [3 /*break*/, 9];
                            case contract_wrappers_1.WETH9Events.Deposit: return [3 /*break*/, 11];
                            case contract_wrappers_1.WETH9Events.Withdrawal: return [3 /*break*/, 13];
                            case contract_wrappers_1.ExchangeEvents.Fill: return [3 /*break*/, 15];
                            case contract_wrappers_1.ExchangeEvents.Cancel: return [3 /*break*/, 18];
                            case contract_wrappers_1.ExchangeEvents.CancelUpTo: return [3 /*break*/, 21];
                        }
                        return [3 /*break*/, 23];
                    case 1:
                        if (!!_.isUndefined(decodedLog.args._value)) return [3 /*break*/, 3];
                        args = decodedLog.args;
                        tokenAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(decodedLog.address);
                        this._balanceAndProxyAllowanceLazyStore.deleteProxyAllowance(tokenAssetData, args._owner);
                        orderHashes = this._dependentOrderHashesTracker.getDependentOrderHashesByAssetDataByMaker(args._owner, tokenAssetData);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync(orderHashes, transactionHash)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 24];
                    case 3:
                        args = decodedLog.args;
                        tokenAssetData = order_utils_1.assetDataUtils.encodeERC721AssetData(decodedLog.address, args._tokenId);
                        this._balanceAndProxyAllowanceLazyStore.deleteProxyAllowance(tokenAssetData, args._owner);
                        orderHashes = this._dependentOrderHashesTracker.getDependentOrderHashesByAssetDataByMaker(args._owner, tokenAssetData);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync(orderHashes, transactionHash)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 24];
                    case 5:
                        if (!!_.isUndefined(decodedLog.args._value)) return [3 /*break*/, 7];
                        args = decodedLog.args;
                        tokenAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(decodedLog.address);
                        this._balanceAndProxyAllowanceLazyStore.deleteBalance(tokenAssetData, args._from);
                        this._balanceAndProxyAllowanceLazyStore.deleteBalance(tokenAssetData, args._to);
                        orderHashes = this._dependentOrderHashesTracker.getDependentOrderHashesByAssetDataByMaker(args._from, tokenAssetData);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync(orderHashes, transactionHash)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 24];
                    case 7:
                        args = decodedLog.args;
                        tokenAssetData = order_utils_1.assetDataUtils.encodeERC721AssetData(decodedLog.address, args._tokenId);
                        this._balanceAndProxyAllowanceLazyStore.deleteBalance(tokenAssetData, args._from);
                        this._balanceAndProxyAllowanceLazyStore.deleteBalance(tokenAssetData, args._to);
                        orderHashes = this._dependentOrderHashesTracker.getDependentOrderHashesByAssetDataByMaker(args._from, tokenAssetData);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync(orderHashes, transactionHash)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 24];
                    case 9:
                        args = decodedLog.args;
                        tokenAddress = decodedLog.address;
                        this._balanceAndProxyAllowanceLazyStore.deleteAllERC721ProxyAllowance(tokenAddress, args._owner);
                        orderHashes = this._dependentOrderHashesTracker.getDependentOrderHashesByERC721ByMaker(args._owner, tokenAddress);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync(orderHashes, transactionHash)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 24];
                    case 11:
                        args = decodedLog.args;
                        tokenAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(decodedLog.address);
                        this._balanceAndProxyAllowanceLazyStore.deleteBalance(tokenAssetData, args._owner);
                        orderHashes = this._dependentOrderHashesTracker.getDependentOrderHashesByAssetDataByMaker(args._owner, tokenAssetData);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync(orderHashes, transactionHash)];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 24];
                    case 13:
                        args = decodedLog.args;
                        tokenAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(decodedLog.address);
                        this._balanceAndProxyAllowanceLazyStore.deleteBalance(tokenAssetData, args._owner);
                        orderHashes = this._dependentOrderHashesTracker.getDependentOrderHashesByAssetDataByMaker(args._owner, tokenAssetData);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync(orderHashes, transactionHash)];
                    case 14:
                        _b.sent();
                        return [3 /*break*/, 24];
                    case 15:
                        args = decodedLog.args;
                        this._orderFilledCancelledLazyStore.deleteFilledTakerAmount(args.orderHash);
                        orderHash = args.orderHash;
                        isOrderWatched = !_.isUndefined(this._orderByOrderHash[orderHash]);
                        if (!isOrderWatched) return [3 /*break*/, 17];
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync([orderHash], transactionHash)];
                    case 16:
                        _b.sent();
                        _b.label = 17;
                    case 17: return [3 /*break*/, 24];
                    case 18:
                        args = decodedLog.args;
                        this._orderFilledCancelledLazyStore.deleteIsCancelled(args.orderHash);
                        orderHash = args.orderHash;
                        isOrderWatched = !_.isUndefined(this._orderByOrderHash[orderHash]);
                        if (!isOrderWatched) return [3 /*break*/, 20];
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync([orderHash], transactionHash)];
                    case 19:
                        _b.sent();
                        _b.label = 20;
                    case 20: return [3 /*break*/, 24];
                    case 21:
                        args = decodedLog.args;
                        this._orderFilledCancelledLazyStore.deleteAllIsCancelled();
                        orderHashes = this._dependentOrderHashesTracker.getDependentOrderHashesByMaker(args.makerAddress);
                        return [4 /*yield*/, this._emitRevalidateOrdersAsync(orderHashes, transactionHash)];
                    case 22:
                        _b.sent();
                        return [3 /*break*/, 24];
                    case 23: throw utils_1.errorUtils.spawnSwitchErr('decodedLog.event', decodedLog.event);
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    OrderWatcher.prototype._emitRevalidateOrdersAsync = function (orderHashes, transactionHash) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, orderHashes_1, orderHashes_1_1, orderHash, signedOrder, orderState, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        orderHashes_1 = __values(orderHashes), orderHashes_1_1 = orderHashes_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!orderHashes_1_1.done) return [3 /*break*/, 4];
                        orderHash = orderHashes_1_1.value;
                        signedOrder = this._orderByOrderHash[orderHash];
                        return [4 /*yield*/, this._orderStateUtils.getOpenOrderStateAsync(signedOrder, transactionHash)];
                    case 2:
                        orderState = _b.sent();
                        if (_.isUndefined(this._callbackIfExists)) {
                            return [3 /*break*/, 4]; // Unsubscribe was called
                        }
                        if (_.isEqual(orderState, this._orderStateByOrderHashCache[orderHash])) {
                            // Actual order state didn't change
                            return [3 /*break*/, 3];
                        }
                        else {
                            this._orderStateByOrderHashCache[orderHash] = orderState;
                        }
                        this._callbackIfExists(null, orderState);
                        _b.label = 3;
                    case 3:
                        orderHashes_1_1 = orderHashes_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (orderHashes_1_1 && !orderHashes_1_1.done && (_a = orderHashes_1.return)) _a.call(orderHashes_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return OrderWatcher;
}());
exports.OrderWatcher = OrderWatcher;
//# sourceMappingURL=order_watcher.js.map
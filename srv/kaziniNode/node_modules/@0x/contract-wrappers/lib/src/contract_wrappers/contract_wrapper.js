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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var ethereum_types_1 = require("ethereum-types");
var ethereumjs_blockstream_1 = require("ethereumjs-blockstream");
var _ = require("lodash");
var types_1 = require("../types");
var constants_1 = require("../utils/constants");
var filter_utils_1 = require("../utils/filter_utils");
var ContractWrapper = /** @class */ (function () {
    function ContractWrapper(web3Wrapper, networkId, blockPollingIntervalMs) {
        this._web3Wrapper = web3Wrapper;
        this._networkId = networkId;
        this._blockPollingIntervalMs = _.isUndefined(blockPollingIntervalMs)
            ? constants_1.constants.DEFAULT_BLOCK_POLLING_INTERVAL
            : blockPollingIntervalMs;
        this._filters = {};
        this._filterCallbacks = {};
        this._blockAndLogStreamerIfExists = undefined;
        this._onLogAddedSubscriptionToken = undefined;
        this._onLogRemovedSubscriptionToken = undefined;
    }
    ContractWrapper._onBlockAndLogStreamerError = function (isVerbose, err) {
        // Since Blockstream errors are all recoverable, we simply log them if the verbose
        // config is passed in.
        if (isVerbose) {
            utils_1.logUtils.warn(err);
        }
    };
    ContractWrapper.prototype._unsubscribeAll = function () {
        var _this = this;
        var filterTokens = _.keys(this._filterCallbacks);
        _.each(filterTokens, function (filterToken) {
            _this._unsubscribe(filterToken);
        });
    };
    ContractWrapper.prototype._unsubscribe = function (filterToken, err) {
        if (_.isUndefined(this._filters[filterToken])) {
            throw new Error(types_1.ContractWrappersError.SubscriptionNotFound);
        }
        if (!_.isUndefined(err)) {
            var callback = this._filterCallbacks[filterToken];
            callback(err, undefined);
        }
        delete this._filters[filterToken];
        delete this._filterCallbacks[filterToken];
        if (_.isEmpty(this._filters)) {
            this._stopBlockAndLogStream();
        }
    };
    ContractWrapper.prototype._subscribe = function (address, eventName, indexFilterValues, abi, callback, isVerbose) {
        if (isVerbose === void 0) { isVerbose = false; }
        var filter = filter_utils_1.filterUtils.getFilter(address, eventName, indexFilterValues, abi);
        if (_.isUndefined(this._blockAndLogStreamerIfExists)) {
            this._startBlockAndLogStream(isVerbose);
        }
        var filterToken = filter_utils_1.filterUtils.generateUUID();
        this._filters[filterToken] = filter;
        this._filterCallbacks[filterToken] = callback;
        return filterToken;
    };
    ContractWrapper.prototype._getLogsAsync = function (address, eventName, blockRange, indexFilterValues, abi) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, logs, logsWithDecodedArguments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = filter_utils_1.filterUtils.getFilter(address, eventName, indexFilterValues, abi, blockRange);
                        return [4 /*yield*/, this._web3Wrapper.getLogsAsync(filter)];
                    case 1:
                        logs = _a.sent();
                        logsWithDecodedArguments = _.map(logs, this._tryToDecodeLogOrNoop.bind(this));
                        return [2 /*return*/, logsWithDecodedArguments];
                }
            });
        });
    };
    ContractWrapper.prototype._tryToDecodeLogOrNoop = function (log) {
        var abiDecoder = new utils_1.AbiDecoder([this.abi]);
        var logWithDecodedArgs = abiDecoder.tryToDecodeLogOrNoop(log);
        return logWithDecodedArgs;
    };
    ContractWrapper.prototype._onLogStateChanged = function (isRemoved, rawLog) {
        var _this = this;
        var log = web3_wrapper_1.marshaller.unmarshalLog(rawLog);
        _.forEach(this._filters, function (filter, filterToken) {
            if (filter_utils_1.filterUtils.matchesFilter(log, filter)) {
                var decodedLog = _this._tryToDecodeLogOrNoop(log);
                var logEvent = {
                    log: decodedLog,
                    isRemoved: isRemoved,
                };
                _this._filterCallbacks[filterToken](null, logEvent);
            }
        });
    };
    ContractWrapper.prototype._startBlockAndLogStream = function (isVerbose) {
        if (!_.isUndefined(this._blockAndLogStreamerIfExists)) {
            throw new Error(types_1.ContractWrappersError.SubscriptionAlreadyPresent);
        }
        this._blockAndLogStreamerIfExists = new ethereumjs_blockstream_1.BlockAndLogStreamer(this._blockstreamGetBlockOrNullAsync.bind(this), this._blockstreamGetLogsAsync.bind(this), ContractWrapper._onBlockAndLogStreamerError.bind(this, isVerbose));
        var catchAllLogFilter = {};
        this._blockAndLogStreamerIfExists.addLogFilter(catchAllLogFilter);
        this._blockAndLogStreamIntervalIfExists = utils_1.intervalUtils.setAsyncExcludingInterval(this._reconcileBlockAsync.bind(this), this._blockPollingIntervalMs, ContractWrapper._onBlockAndLogStreamerError.bind(this, isVerbose));
        var isRemoved = false;
        this._onLogAddedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogAdded(this._onLogStateChanged.bind(this, isRemoved));
        isRemoved = true;
        this._onLogRemovedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogRemoved(this._onLogStateChanged.bind(this, isRemoved));
    };
    // This method only exists in order to comply with the expected interface of Blockstream's constructor
    ContractWrapper.prototype._blockstreamGetBlockOrNullAsync = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var shouldIncludeTransactionData, blockOrNull;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shouldIncludeTransactionData = false;
                        return [4 /*yield*/, this._web3Wrapper.sendRawPayloadAsync({
                                method: 'eth_getBlockByHash',
                                params: [hash, shouldIncludeTransactionData],
                            })];
                    case 1:
                        blockOrNull = _a.sent();
                        return [2 /*return*/, blockOrNull];
                }
            });
        });
    };
    // This method only exists in order to comply with the expected interface of Blockstream's constructor
    ContractWrapper.prototype._blockstreamGetLatestBlockOrNullAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var shouldIncludeTransactionData, blockOrNull;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shouldIncludeTransactionData = false;
                        return [4 /*yield*/, this._web3Wrapper.sendRawPayloadAsync({
                                method: 'eth_getBlockByNumber',
                                params: [ethereum_types_1.BlockParamLiteral.Latest, shouldIncludeTransactionData],
                            })];
                    case 1:
                        blockOrNull = _a.sent();
                        return [2 /*return*/, blockOrNull];
                }
            });
        });
    };
    // This method only exists in order to comply with the expected interface of Blockstream's constructor
    ContractWrapper.prototype._blockstreamGetLogsAsync = function (filterOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3Wrapper.sendRawPayloadAsync({
                            method: 'eth_getLogs',
                            params: [filterOptions],
                        })];
                    case 1:
                        logs = _a.sent();
                        return [2 /*return*/, logs];
                }
            });
        });
    };
    ContractWrapper.prototype._stopBlockAndLogStream = function () {
        if (_.isUndefined(this._blockAndLogStreamerIfExists)) {
            throw new Error(types_1.ContractWrappersError.SubscriptionNotFound);
        }
        this._blockAndLogStreamerIfExists.unsubscribeFromOnLogAdded(this._onLogAddedSubscriptionToken);
        this._blockAndLogStreamerIfExists.unsubscribeFromOnLogRemoved(this._onLogRemovedSubscriptionToken);
        utils_1.intervalUtils.clearAsyncExcludingInterval(this._blockAndLogStreamIntervalIfExists);
        delete this._blockAndLogStreamerIfExists;
    };
    ContractWrapper.prototype._reconcileBlockAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var latestBlockOrNull;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._blockstreamGetLatestBlockOrNullAsync()];
                    case 1:
                        latestBlockOrNull = _a.sent();
                        if (_.isNull(latestBlockOrNull)) {
                            return [2 /*return*/]; // noop
                        }
                        if (!!_.isUndefined(this._blockAndLogStreamerIfExists)) return [3 /*break*/, 3];
                        // If we clear the interval while fetching the block - this._blockAndLogStreamer will be undefined
                        return [4 /*yield*/, this._blockAndLogStreamerIfExists.reconcileNewBlock(latestBlockOrNull)];
                    case 2:
                        // If we clear the interval while fetching the block - this._blockAndLogStreamer will be undefined
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ContractWrapper;
}());
exports.ContractWrapper = ContractWrapper;
//# sourceMappingURL=contract_wrapper.js.map
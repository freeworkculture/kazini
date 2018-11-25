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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var ethereum_types_1 = require("ethereum-types");
var ethereumjs_blockstream_1 = require("ethereumjs-blockstream");
var _ = require("lodash");
var types_1 = require("../types");
var assert_1 = require("../utils/assert");
var DEFAULT_EVENT_POLLING_INTERVAL_MS = 200;
var LogEventState;
(function (LogEventState) {
    LogEventState[LogEventState["Removed"] = 0] = "Removed";
    LogEventState[LogEventState["Added"] = 1] = "Added";
})(LogEventState || (LogEventState = {}));
/**
 * The EventWatcher watches for blockchain events at the specified block confirmation
 * depth.
 */
var EventWatcher = /** @class */ (function () {
    function EventWatcher(provider, pollingIntervalIfExistsMs, stateLayer, isVerbose) {
        this._isVerbose = isVerbose;
        this._web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
        this._pollingIntervalMs = _.isUndefined(pollingIntervalIfExistsMs)
            ? DEFAULT_EVENT_POLLING_INTERVAL_MS
            : pollingIntervalIfExistsMs;
        this._blockAndLogStreamerIfExists = undefined;
        this._blockAndLogStreamIntervalIfExists = undefined;
        this._onLogAddedSubscriptionToken = undefined;
        this._onLogRemovedSubscriptionToken = undefined;
    }
    EventWatcher.prototype.subscribe = function (callback) {
        assert_1.assert.isFunction('callback', callback);
        if (!_.isUndefined(this._blockAndLogStreamIntervalIfExists)) {
            throw new Error(types_1.OrderWatcherError.SubscriptionAlreadyPresent);
        }
        this._startBlockAndLogStream(callback);
    };
    EventWatcher.prototype.unsubscribe = function () {
        if (_.isUndefined(this._blockAndLogStreamIntervalIfExists)) {
            throw new Error(types_1.OrderWatcherError.SubscriptionNotFound);
        }
        this._stopBlockAndLogStream();
    };
    EventWatcher.prototype._startBlockAndLogStream = function (callback) {
        if (!_.isUndefined(this._blockAndLogStreamerIfExists)) {
            throw new Error(types_1.OrderWatcherError.SubscriptionAlreadyPresent);
        }
        this._blockAndLogStreamerIfExists = new ethereumjs_blockstream_1.BlockAndLogStreamer(this._blockstreamGetBlockOrNullAsync.bind(this), this._blockstreamGetLogsAsync.bind(this), this._onBlockAndLogStreamerError.bind(this));
        var catchAllLogFilter = {};
        this._blockAndLogStreamerIfExists.addLogFilter(catchAllLogFilter);
        this._blockAndLogStreamIntervalIfExists = utils_1.intervalUtils.setAsyncExcludingInterval(this._reconcileBlockAsync.bind(this), this._pollingIntervalMs, this._onBlockAndLogStreamerError.bind(this));
        var isRemoved = false;
        this._onLogAddedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogAdded(this._onLogStateChangedAsync.bind(this, callback, isRemoved));
        isRemoved = true;
        this._onLogRemovedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogRemoved(this._onLogStateChangedAsync.bind(this, callback, isRemoved));
    };
    // This method only exists in order to comply with the expected interface of Blockstream's constructor
    EventWatcher.prototype._blockstreamGetBlockOrNullAsync = function (hash) {
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
    EventWatcher.prototype._blockstreamGetLatestBlockOrNullAsync = function () {
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
    EventWatcher.prototype._blockstreamGetLogsAsync = function (filterOptions) {
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
    EventWatcher.prototype._stopBlockAndLogStream = function () {
        if (_.isUndefined(this._blockAndLogStreamerIfExists)) {
            throw new Error(types_1.OrderWatcherError.SubscriptionNotFound);
        }
        this._blockAndLogStreamerIfExists.unsubscribeFromOnLogAdded(this._onLogAddedSubscriptionToken);
        this._blockAndLogStreamerIfExists.unsubscribeFromOnLogRemoved(this._onLogRemovedSubscriptionToken);
        utils_1.intervalUtils.clearAsyncExcludingInterval(this._blockAndLogStreamIntervalIfExists);
        delete this._blockAndLogStreamerIfExists;
        delete this._blockAndLogStreamIntervalIfExists;
    };
    EventWatcher.prototype._onLogStateChangedAsync = function (callback, isRemoved, rawLog) {
        return __awaiter(this, void 0, void 0, function () {
            var log;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log = web3_wrapper_1.marshaller.unmarshalLog(rawLog);
                        return [4 /*yield*/, this._emitDifferencesAsync(log, isRemoved ? LogEventState.Removed : LogEventState.Added, callback)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EventWatcher.prototype._reconcileBlockAsync = function () {
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
    EventWatcher.prototype._emitDifferencesAsync = function (log, logEventState, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var logEvent;
            return __generator(this, function (_a) {
                logEvent = __assign({ removed: logEventState === LogEventState.Removed }, log);
                if (!_.isUndefined(this._blockAndLogStreamIntervalIfExists)) {
                    callback(null, logEvent);
                }
                return [2 /*return*/];
            });
        });
    };
    EventWatcher.prototype._onBlockAndLogStreamerError = function (err) {
        // Since Blockstream errors are all recoverable, we simply log them if the verbose
        // config is passed in.
        if (this._isVerbose) {
            utils_1.logUtils.warn(err);
        }
    };
    return EventWatcher;
}());
exports.EventWatcher = EventWatcher;
//# sourceMappingURL=event_watcher.js.map
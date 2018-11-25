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
var _ = require("lodash");
var types_1 = require("../types");
var assert_1 = require("../utils/assert");
var utils_1 = require("../utils/utils");
var contract_wrapper_1 = require("./contract_wrapper");
/**
 * This class includes all the functionality related to interacting with a wrapped Ether ERC20 token contract.
 * The caller can convert ETH into the equivalent number of wrapped ETH ERC20 tokens and back.
 */
var EtherTokenWrapper = /** @class */ (function (_super) {
    __extends(EtherTokenWrapper, _super);
    /**
     * Instantiate EtherTokenWrapper.
     * @param web3Wrapper Web3Wrapper instance to use
     * @param networkId Desired networkId
     * @param erc20TokenWrapper The ERC20TokenWrapper instance to use
     * @param blockPollingIntervalMs The block polling interval to use for active subscriptions
     */
    function EtherTokenWrapper(web3Wrapper, networkId, erc20TokenWrapper, blockPollingIntervalMs) {
        var _this = _super.call(this, web3Wrapper, networkId, blockPollingIntervalMs) || this;
        _this.abi = contract_artifacts_1.WETH9.compilerOutput.abi;
        _this._etherTokenContractsByAddress = {};
        _this._erc20TokenWrapper = erc20TokenWrapper;
        return _this;
    }
    /**
     * Deposit ETH into the Wrapped ETH smart contract and issues the equivalent number of wrapped ETH tokens
     * to the depositor address. These wrapped ETH tokens can be used in 0x trades and are redeemable for 1-to-1
     * for ETH.
     * @param   etherTokenAddress   EtherToken address you wish to deposit into.
     * @param   amountInWei         Amount of ETH in Wei the caller wishes to deposit.
     * @param   depositor           The hex encoded user Ethereum address that would like to make the deposit.
     * @param   txOpts              Transaction parameters.
     * @return Transaction hash.
     */
    EtherTokenWrapper.prototype.depositAsync = function (etherTokenAddress, amountInWei, depositor, txOpts) {
        if (txOpts === void 0) { txOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedEtherTokenAddress, normalizedDepositorAddress, ethBalanceInWei, wethContract, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('etherTokenAddress', etherTokenAddress);
                        assert_1.assert.isValidBaseUnitAmount('amountInWei', amountInWei);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('depositor', depositor, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        normalizedEtherTokenAddress = etherTokenAddress.toLowerCase();
                        normalizedDepositorAddress = depositor.toLowerCase();
                        return [4 /*yield*/, this._web3Wrapper.getBalanceInWeiAsync(normalizedDepositorAddress)];
                    case 2:
                        ethBalanceInWei = _a.sent();
                        assert_1.assert.assert(ethBalanceInWei.gte(amountInWei), types_1.ContractWrappersError.InsufficientEthBalanceForDeposit);
                        return [4 /*yield*/, this._getEtherTokenContractAsync(normalizedEtherTokenAddress)];
                    case 3:
                        wethContract = _a.sent();
                        return [4 /*yield*/, wethContract.deposit.sendTransactionAsync(utils_1.utils.removeUndefinedProperties({
                                from: normalizedDepositorAddress,
                                value: amountInWei,
                                gas: txOpts.gasLimit,
                                gasPrice: txOpts.gasPrice,
                            }))];
                    case 4:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Withdraw ETH to the withdrawer's address from the wrapped ETH smart contract in exchange for the
     * equivalent number of wrapped ETH tokens.
     * @param   etherTokenAddress   EtherToken address you wish to withdraw from.
     * @param   amountInWei  Amount of ETH in Wei the caller wishes to withdraw.
     * @param   withdrawer   The hex encoded user Ethereum address that would like to make the withdrawal.
     * @param   txOpts       Transaction parameters.
     * @return Transaction hash.
     */
    EtherTokenWrapper.prototype.withdrawAsync = function (etherTokenAddress, amountInWei, withdrawer, txOpts) {
        if (txOpts === void 0) { txOpts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedEtherTokenAddress, normalizedWithdrawerAddress, WETHBalanceInBaseUnits, wethContract, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isValidBaseUnitAmount('amountInWei', amountInWei);
                        assert_1.assert.isETHAddressHex('etherTokenAddress', etherTokenAddress);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('withdrawer', withdrawer, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        normalizedEtherTokenAddress = etherTokenAddress.toLowerCase();
                        normalizedWithdrawerAddress = withdrawer.toLowerCase();
                        return [4 /*yield*/, this._erc20TokenWrapper.getBalanceAsync(normalizedEtherTokenAddress, normalizedWithdrawerAddress)];
                    case 2:
                        WETHBalanceInBaseUnits = _a.sent();
                        assert_1.assert.assert(WETHBalanceInBaseUnits.gte(amountInWei), types_1.ContractWrappersError.InsufficientWEthBalanceForWithdrawal);
                        return [4 /*yield*/, this._getEtherTokenContractAsync(normalizedEtherTokenAddress)];
                    case 3:
                        wethContract = _a.sent();
                        return [4 /*yield*/, wethContract.withdraw.sendTransactionAsync(amountInWei, utils_1.utils.removeUndefinedProperties({
                                from: normalizedWithdrawerAddress,
                                gas: txOpts.gasLimit,
                                gasPrice: txOpts.gasPrice,
                            }))];
                    case 4:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                }
            });
        });
    };
    /**
     * Gets historical logs without creating a subscription
     * @param   etherTokenAddress   An address of the ether token that emitted the logs.
     * @param   eventName           The ether token contract event you would like to subscribe to.
     * @param   blockRange          Block range to get logs from.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{_owner: aUserAddressHex}`
     * @return  Array of logs that match the parameters
     */
    EtherTokenWrapper.prototype.getLogsAsync = function (etherTokenAddress, eventName, blockRange, indexFilterValues) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedEtherTokenAddress, logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('etherTokenAddress', etherTokenAddress);
                        normalizedEtherTokenAddress = etherTokenAddress.toLowerCase();
                        assert_1.assert.doesBelongToStringEnum('eventName', eventName, abi_gen_wrappers_1.WETH9Events);
                        assert_1.assert.doesConformToSchema('blockRange', blockRange, json_schemas_1.schemas.blockRangeSchema);
                        assert_1.assert.doesConformToSchema('indexFilterValues', indexFilterValues, json_schemas_1.schemas.indexFilterValuesSchema);
                        return [4 /*yield*/, this._getLogsAsync(normalizedEtherTokenAddress, eventName, blockRange, indexFilterValues, contract_artifacts_1.WETH9.compilerOutput.abi)];
                    case 1:
                        logs = _a.sent();
                        return [2 /*return*/, logs];
                }
            });
        });
    };
    /**
     * Subscribe to an event type emitted by the Token contract.
     * @param   etherTokenAddress   The hex encoded address where the ether token is deployed.
     * @param   eventName           The ether token contract event you would like to subscribe to.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{_owner: aUserAddressHex}`
     * @param   callback            Callback that gets called when a log is added/removed
     * @param   isVerbose           Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    EtherTokenWrapper.prototype.subscribe = function (etherTokenAddress, eventName, indexFilterValues, callback, isVerbose) {
        if (isVerbose === void 0) { isVerbose = false; }
        assert_1.assert.isETHAddressHex('etherTokenAddress', etherTokenAddress);
        var normalizedEtherTokenAddress = etherTokenAddress.toLowerCase();
        assert_1.assert.doesBelongToStringEnum('eventName', eventName, abi_gen_wrappers_1.WETH9Events);
        assert_1.assert.doesConformToSchema('indexFilterValues', indexFilterValues, json_schemas_1.schemas.indexFilterValuesSchema);
        assert_1.assert.isFunction('callback', callback);
        var subscriptionToken = this._subscribe(normalizedEtherTokenAddress, eventName, indexFilterValues, contract_artifacts_1.WETH9.compilerOutput.abi, callback, isVerbose);
        return subscriptionToken;
    };
    /**
     * Cancel a subscription
     * @param   subscriptionToken Subscription token returned by `subscribe()`
     */
    EtherTokenWrapper.prototype.unsubscribe = function (subscriptionToken) {
        assert_1.assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
        this._unsubscribe(subscriptionToken);
    };
    /**
     * Cancels all existing subscriptions
     */
    EtherTokenWrapper.prototype.unsubscribeAll = function () {
        _super.prototype._unsubscribeAll.call(this);
    };
    EtherTokenWrapper.prototype._getEtherTokenContractAsync = function (etherTokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var etherTokenContract, contractInstance;
            return __generator(this, function (_a) {
                etherTokenContract = this._etherTokenContractsByAddress[etherTokenAddress];
                if (!_.isUndefined(etherTokenContract)) {
                    return [2 /*return*/, etherTokenContract];
                }
                contractInstance = new abi_gen_wrappers_1.WETH9Contract(this.abi, etherTokenAddress, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                etherTokenContract = contractInstance;
                this._etherTokenContractsByAddress[etherTokenAddress] = etherTokenContract;
                return [2 /*return*/, etherTokenContract];
            });
        });
    };
    return EtherTokenWrapper;
}(contract_wrapper_1.ContractWrapper));
exports.EtherTokenWrapper = EtherTokenWrapper;
//# sourceMappingURL=ether_token_wrapper.js.map
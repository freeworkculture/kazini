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
var _ = require("lodash");
var order_tx_opts_schema_1 = require("../schemas/order_tx_opts_schema");
var tx_opts_schema_1 = require("../schemas/tx_opts_schema");
var assert_1 = require("../utils/assert");
var calldata_optimization_utils_1 = require("../utils/calldata_optimization_utils");
var constants_1 = require("../utils/constants");
var contract_addresses_1 = require("../utils/contract_addresses");
var decorators_1 = require("../utils/decorators");
var utils_1 = require("../utils/utils");
var contract_wrapper_1 = require("./contract_wrapper");
/**
 * This class includes the functionality related to interacting with the Forwarder contract.
 */
var ForwarderWrapper = /** @class */ (function (_super) {
    __extends(ForwarderWrapper, _super);
    /**
     * Instantiate ForwarderWrapper
     * @param web3Wrapper Web3Wrapper instance to use.
     * @param networkId Desired networkId.
     * @param address The address of the Exchange contract. If undefined, will
     * default to the known address corresponding to the networkId.
     * @param zrxTokenAddress The address of the ZRXToken contract. If
     * undefined, will default to the known address corresponding to the
     * networkId.
     * @param etherTokenAddress The address of a WETH (Ether token) contract. If
     * undefined, will default to the known address corresponding to the
     * networkId.
     */
    function ForwarderWrapper(web3Wrapper, networkId, address, zrxTokenAddress, etherTokenAddress) {
        var _this = _super.call(this, web3Wrapper, networkId) || this;
        _this.abi = contract_artifacts_1.Forwarder.compilerOutput.abi;
        _this.address = _.isUndefined(address) ? contract_addresses_1._getDefaultContractAddresses(networkId).exchange : address;
        _this.zrxTokenAddress = _.isUndefined(zrxTokenAddress)
            ? contract_addresses_1._getDefaultContractAddresses(networkId).zrxToken
            : zrxTokenAddress;
        _this.etherTokenAddress = _.isUndefined(etherTokenAddress)
            ? contract_addresses_1._getDefaultContractAddresses(networkId).etherToken
            : etherTokenAddress;
        return _this;
    }
    /**
     * Purchases as much of orders' makerAssets as possible by selling up to 95% of transaction's ETH value.
     * Any ZRX required to pay fees for primary orders will automatically be purchased by this contract.
     * 5% of ETH value is reserved for paying fees to order feeRecipients (in ZRX) and forwarding contract feeRecipient (in ETH).
     * Any ETH not spent will be refunded to sender.
     * @param   signedOrders            An array of objects that conform to the SignedOrder interface. All orders must specify the same makerAsset.
     *                                  All orders must specify WETH as the takerAsset
     * @param   takerAddress            The user Ethereum address who would like to fill this order. Must be available via the supplied
     *                                  Provider provided at instantiation.
     * @param   ethAmount               The amount of eth to send with the transaction (in wei).
     * @param   signedFeeOrders         An array of objects that conform to the SignedOrder interface. All orders must specify ZRX as makerAsset and WETH as takerAsset.
     *                                  Used to purchase ZRX for primary order fees.
     * @param   feePercentage           The percentage of WETH sold that will payed as fee to forwarding contract feeRecipient.
     *                                  Defaults to 0.
     * @param   feeRecipientAddress     The address that will receive ETH when signedFeeOrders are filled.
     * @param   orderTransactionOpts    Transaction parameters.
     * @return  Transaction hash.
     */
    ForwarderWrapper.prototype.marketSellOrdersWithEthAsync = function (signedOrders, takerAddress, ethAmount, signedFeeOrders, feePercentage, feeRecipientAddress, orderTransactionOpts) {
        if (signedFeeOrders === void 0) { signedFeeOrders = []; }
        if (feePercentage === void 0) { feePercentage = 0; }
        if (feeRecipientAddress === void 0) { feeRecipientAddress = constants_1.constants.NULL_ADDRESS; }
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var formattedFeePercentage, normalizedTakerAddress, normalizedFeeRecipientAddress, optimizedMarketOrders, optimizedFeeOrders, signatures, feeSignatures, forwarderContractInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // type assertions
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.isBigNumber('ethAmount', ethAmount);
                        assert_1.assert.doesConformToSchema('signedFeeOrders', signedFeeOrders, json_schemas_1.schemas.signedOrdersSchema);
                        assert_1.assert.isNumber('feePercentage', feePercentage);
                        assert_1.assert.isETHAddressHex('feeRecipientAddress', feeRecipientAddress);
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        // other assertions
                        assert_1.assert.ordersCanBeUsedForForwarderContract(signedOrders, this.etherTokenAddress);
                        assert_1.assert.feeOrdersCanBeUsedForForwarderContract(signedFeeOrders, this.zrxTokenAddress, this.etherTokenAddress);
                        formattedFeePercentage = utils_1.utils.numberPercentageToEtherTokenAmountPercentage(feePercentage);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        normalizedFeeRecipientAddress = feeRecipientAddress.toLowerCase();
                        optimizedMarketOrders = calldata_optimization_utils_1.calldataOptimizationUtils.optimizeForwarderOrders(signedOrders);
                        optimizedFeeOrders = calldata_optimization_utils_1.calldataOptimizationUtils.optimizeForwarderFeeOrders(signedFeeOrders);
                        signatures = _.map(optimizedMarketOrders, function (order) { return order.signature; });
                        feeSignatures = _.map(optimizedFeeOrders, function (order) { return order.signature; });
                        return [4 /*yield*/, this._getForwarderContractAsync()];
                    case 2:
                        forwarderContractInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, forwarderContractInstance.marketSellOrdersWithEth.callAsync(optimizedMarketOrders, signatures, optimizedFeeOrders, feeSignatures, formattedFeePercentage, normalizedFeeRecipientAddress, {
                                value: ethAmount,
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, forwarderContractInstance.marketSellOrdersWithEth.sendTransactionAsync(optimizedMarketOrders, signatures, optimizedFeeOrders, feeSignatures, formattedFeePercentage, feeRecipientAddress, {
                            value: ethAmount,
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
     * Attempt to purchase makerAssetFillAmount of makerAsset by selling ethAmount provided with transaction.
     * Any ZRX required to pay fees for primary orders will automatically be purchased by the contract.
     * Any ETH not spent will be refunded to sender.
     * @param   signedOrders            An array of objects that conform to the SignedOrder interface. All orders must specify the same makerAsset.
     *                                  All orders must specify WETH as the takerAsset
     * @param   makerAssetFillAmount    The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress            The user Ethereum address who would like to fill this order. Must be available via the supplied
     *                                  Provider provided at instantiation.
     * @param   ethAmount               The amount of eth to send with the transaction (in wei).
     * @param   signedFeeOrders         An array of objects that conform to the SignedOrder interface. All orders must specify ZRX as makerAsset and WETH as takerAsset.
     *                                  Used to purchase ZRX for primary order fees.
     * @param   feePercentage           The percentage of WETH sold that will payed as fee to forwarding contract feeRecipient.
     *                                  Defaults to 0.
     * @param   feeRecipientAddress     The address that will receive ETH when signedFeeOrders are filled.
     * @param   orderTransactionOpts    Transaction parameters.
     * @return  Transaction hash.
     */
    ForwarderWrapper.prototype.marketBuyOrdersWithEthAsync = function (signedOrders, makerAssetFillAmount, takerAddress, ethAmount, signedFeeOrders, feePercentage, feeRecipientAddress, orderTransactionOpts) {
        if (signedFeeOrders === void 0) { signedFeeOrders = []; }
        if (feePercentage === void 0) { feePercentage = 0; }
        if (feeRecipientAddress === void 0) { feeRecipientAddress = constants_1.constants.NULL_ADDRESS; }
        if (orderTransactionOpts === void 0) { orderTransactionOpts = { shouldValidate: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var formattedFeePercentage, normalizedTakerAddress, normalizedFeeRecipientAddress, optimizedMarketOrders, optimizedFeeOrders, signatures, feeSignatures, forwarderContractInstance, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // type assertions
                        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
                        assert_1.assert.isBigNumber('makerAssetFillAmount', makerAssetFillAmount);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('takerAddress', takerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        assert_1.assert.isBigNumber('ethAmount', ethAmount);
                        assert_1.assert.doesConformToSchema('signedFeeOrders', signedFeeOrders, json_schemas_1.schemas.signedOrdersSchema);
                        assert_1.assert.isNumber('feePercentage', feePercentage);
                        assert_1.assert.isETHAddressHex('feeRecipientAddress', feeRecipientAddress);
                        assert_1.assert.doesConformToSchema('orderTransactionOpts', orderTransactionOpts, order_tx_opts_schema_1.orderTxOptsSchema, [tx_opts_schema_1.txOptsSchema]);
                        // other assertions
                        assert_1.assert.ordersCanBeUsedForForwarderContract(signedOrders, this.etherTokenAddress);
                        assert_1.assert.feeOrdersCanBeUsedForForwarderContract(signedFeeOrders, this.zrxTokenAddress, this.etherTokenAddress);
                        formattedFeePercentage = utils_1.utils.numberPercentageToEtherTokenAmountPercentage(feePercentage);
                        normalizedTakerAddress = takerAddress.toLowerCase();
                        normalizedFeeRecipientAddress = feeRecipientAddress.toLowerCase();
                        optimizedMarketOrders = calldata_optimization_utils_1.calldataOptimizationUtils.optimizeForwarderOrders(signedOrders);
                        optimizedFeeOrders = calldata_optimization_utils_1.calldataOptimizationUtils.optimizeForwarderFeeOrders(signedFeeOrders);
                        signatures = _.map(optimizedMarketOrders, function (order) { return order.signature; });
                        feeSignatures = _.map(optimizedFeeOrders, function (order) { return order.signature; });
                        return [4 /*yield*/, this._getForwarderContractAsync()];
                    case 2:
                        forwarderContractInstance = _a.sent();
                        if (!orderTransactionOpts.shouldValidate) return [3 /*break*/, 4];
                        return [4 /*yield*/, forwarderContractInstance.marketBuyOrdersWithEth.callAsync(optimizedMarketOrders, makerAssetFillAmount, signatures, optimizedFeeOrders, feeSignatures, formattedFeePercentage, normalizedFeeRecipientAddress, {
                                value: ethAmount,
                                from: normalizedTakerAddress,
                                gas: orderTransactionOpts.gasLimit,
                                gasPrice: orderTransactionOpts.gasPrice,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, forwarderContractInstance.marketBuyOrdersWithEth.sendTransactionAsync(optimizedMarketOrders, makerAssetFillAmount, signatures, optimizedFeeOrders, feeSignatures, formattedFeePercentage, feeRecipientAddress, {
                            value: ethAmount,
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
    ForwarderWrapper.prototype._getForwarderContractAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contractInstance;
            return __generator(this, function (_a) {
                if (!_.isUndefined(this._forwarderContractIfExists)) {
                    return [2 /*return*/, this._forwarderContractIfExists];
                }
                contractInstance = new abi_gen_wrappers_1.ForwarderContract(this.abi, this.address, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                this._forwarderContractIfExists = contractInstance;
                return [2 /*return*/, this._forwarderContractIfExists];
            });
        });
    };
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ForwarderWrapper.prototype, "marketSellOrdersWithEthAsync", null);
    __decorate([
        decorators_1.decorators.asyncZeroExErrorHandler
    ], ForwarderWrapper.prototype, "marketBuyOrdersWithEthAsync", null);
    return ForwarderWrapper;
}(contract_wrapper_1.ContractWrapper));
exports.ForwarderWrapper = ForwarderWrapper;
//# sourceMappingURL=forwarder_wrapper.js.map
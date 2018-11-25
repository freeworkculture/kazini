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
// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unused-variable
// tslint:disable:no-unbound-method
var base_contract_1 = require("@0x/base-contract");
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var ethers = require("ethers");
var _ = require("lodash");
// tslint:enable:no-unused-variable
/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
var ForwarderContract = /** @class */ (function (_super) {
    __extends(ForwarderContract, _super);
    function ForwarderContract(abi, address, provider, txDefaults) {
        var _this = _super.call(this, 'Forwarder', abi, address, provider, txDefaults) || this;
        _this.marketBuyOrdersWithEth = {
            sendTransactionAsync: function (orders, makerAssetFillAmount, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, inputAbi, encodedData, txDataWithDefaults, txHash;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                inputAbi = self._lookupAbi('marketBuyOrdersWithEth(tuple[],uint256,bytes[],tuple[],bytes[],uint256,address)').inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [orders,
                                    makerAssetFillAmount,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ], base_contract_1.BaseContract._bigNumberToString.bind(self)), 7), orders = _a[0], makerAssetFillAmount = _a[1], signatures = _a[2], feeOrders = _a[3], feeSignatures = _a[4], feePercentage = _a[5], feeRecipient = _a[6];
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, [orders,
                                    makerAssetFillAmount,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                encodedData = self._lookupEthersInterface('marketBuyOrdersWithEth(tuple[],uint256,bytes[],tuple[],bytes[],uint256,address)').functions.marketBuyOrdersWithEth.encode([orders,
                                    makerAssetFillAmount,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, txData, { data: encodedData }), self._web3Wrapper.getContractDefaults(), self.marketBuyOrdersWithEth.estimateGasAsync.bind(self, orders, makerAssetFillAmount, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient))];
                            case 1:
                                txDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                            case 2:
                                txHash = _b.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (orders, makerAssetFillAmount, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, inputAbi, encodedData, txDataWithDefaults, gas;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                inputAbi = self._lookupAbi('marketBuyOrdersWithEth(tuple[],uint256,bytes[],tuple[],bytes[],uint256,address)').inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [orders,
                                    makerAssetFillAmount,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ], base_contract_1.BaseContract._bigNumberToString), 7), orders = _a[0], makerAssetFillAmount = _a[1], signatures = _a[2], feeOrders = _a[3], feeSignatures = _a[4], feePercentage = _a[5], feeRecipient = _a[6];
                                encodedData = self._lookupEthersInterface('marketBuyOrdersWithEth(tuple[],uint256,bytes[],tuple[],bytes[],uint256,address)').functions.marketBuyOrdersWithEth.encode([orders,
                                    makerAssetFillAmount,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, txData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                txDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.estimateGasAsync(txDataWithDefaults)];
                            case 2:
                                gas = _b.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (orders, makerAssetFillAmount, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient) {
                var _a;
                var self = this;
                var inputAbi = self._lookupAbi('marketBuyOrdersWithEth(tuple[],uint256,bytes[],tuple[],bytes[],uint256,address)').inputs;
                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [orders,
                    makerAssetFillAmount,
                    signatures,
                    feeOrders,
                    feeSignatures,
                    feePercentage,
                    feeRecipient
                ], base_contract_1.BaseContract._bigNumberToString), 7), orders = _a[0], makerAssetFillAmount = _a[1], signatures = _a[2], feeOrders = _a[3], feeSignatures = _a[4], feePercentage = _a[5], feeRecipient = _a[6];
                var abiEncodedTransactionData = self._lookupEthersInterface('marketBuyOrdersWithEth(tuple[],uint256,bytes[],tuple[],bytes[],uint256,address)').functions.marketBuyOrdersWithEth.encode([orders,
                    makerAssetFillAmount,
                    signatures,
                    feeOrders,
                    feeSignatures,
                    feePercentage,
                    feeRecipient
                ]);
                return abiEncodedTransactionData;
            },
            callAsync: function (orders, makerAssetFillAmount, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient, callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, functionSignature, inputAbi, ethersFunction, encodedData, callDataWithDefaults, rawCallResult, resultArray, outputAbi;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                functionSignature = 'marketBuyOrdersWithEth(tuple[],uint256,bytes[],tuple[],bytes[],uint256,address)';
                                inputAbi = self._lookupAbi(functionSignature).inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [orders,
                                    makerAssetFillAmount,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ], base_contract_1.BaseContract._bigNumberToString.bind(self)), 7), orders = _a[0], makerAssetFillAmount = _a[1], signatures = _a[2], feeOrders = _a[3], feeSignatures = _a[4], feePercentage = _a[5], feeRecipient = _a[6];
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, [orders,
                                    makerAssetFillAmount,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                ethersFunction = self._lookupEthersInterface(functionSignature).functions.marketBuyOrdersWithEth;
                                encodedData = ethersFunction.encode([orders,
                                    makerAssetFillAmount,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, callData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                callDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)];
                            case 2:
                                rawCallResult = _b.sent();
                                base_contract_1.BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
                                resultArray = ethersFunction.decode(rawCallResult);
                                outputAbi = _.find(self.abi, { name: 'marketBuyOrdersWithEth' }).outputs;
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._lowercaseAddress.bind(this));
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._bnToBigNumber.bind(this));
                                return [2 /*return*/, resultArray];
                        }
                    });
                });
            },
        };
        _this.withdrawAsset = {
            sendTransactionAsync: function (assetData, amount, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, inputAbi, encodedData, txDataWithDefaults, txHash;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                inputAbi = self._lookupAbi('withdrawAsset(bytes,uint256)').inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [assetData,
                                    amount
                                ], base_contract_1.BaseContract._bigNumberToString.bind(self)), 2), assetData = _a[0], amount = _a[1];
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, [assetData,
                                    amount
                                ]);
                                encodedData = self._lookupEthersInterface('withdrawAsset(bytes,uint256)').functions.withdrawAsset.encode([assetData,
                                    amount
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, txData, { data: encodedData }), self._web3Wrapper.getContractDefaults(), self.withdrawAsset.estimateGasAsync.bind(self, assetData, amount))];
                            case 1:
                                txDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                            case 2:
                                txHash = _b.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (assetData, amount, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, inputAbi, encodedData, txDataWithDefaults, gas;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                inputAbi = self._lookupAbi('withdrawAsset(bytes,uint256)').inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [assetData,
                                    amount
                                ], base_contract_1.BaseContract._bigNumberToString), 2), assetData = _a[0], amount = _a[1];
                                encodedData = self._lookupEthersInterface('withdrawAsset(bytes,uint256)').functions.withdrawAsset.encode([assetData,
                                    amount
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, txData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                txDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.estimateGasAsync(txDataWithDefaults)];
                            case 2:
                                gas = _b.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (assetData, amount) {
                var _a;
                var self = this;
                var inputAbi = self._lookupAbi('withdrawAsset(bytes,uint256)').inputs;
                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [assetData,
                    amount
                ], base_contract_1.BaseContract._bigNumberToString), 2), assetData = _a[0], amount = _a[1];
                var abiEncodedTransactionData = self._lookupEthersInterface('withdrawAsset(bytes,uint256)').functions.withdrawAsset.encode([assetData,
                    amount
                ]);
                return abiEncodedTransactionData;
            },
            callAsync: function (assetData, amount, callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, functionSignature, inputAbi, ethersFunction, encodedData, callDataWithDefaults, rawCallResult, resultArray, outputAbi;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                functionSignature = 'withdrawAsset(bytes,uint256)';
                                inputAbi = self._lookupAbi(functionSignature).inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [assetData,
                                    amount
                                ], base_contract_1.BaseContract._bigNumberToString.bind(self)), 2), assetData = _a[0], amount = _a[1];
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, [assetData,
                                    amount
                                ]);
                                ethersFunction = self._lookupEthersInterface(functionSignature).functions.withdrawAsset;
                                encodedData = ethersFunction.encode([assetData,
                                    amount
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, callData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                callDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)];
                            case 2:
                                rawCallResult = _b.sent();
                                base_contract_1.BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
                                resultArray = ethersFunction.decode(rawCallResult);
                                outputAbi = _.find(self.abi, { name: 'withdrawAsset' }).outputs;
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._lowercaseAddress.bind(this));
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._bnToBigNumber.bind(this));
                                return [2 /*return*/, resultArray];
                        }
                    });
                });
            },
        };
        _this.owner = {
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, functionSignature, inputAbi, ethersFunction, encodedData, callDataWithDefaults, rawCallResult, resultArray, outputAbi;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                functionSignature = 'owner()';
                                inputAbi = self._lookupAbi(functionSignature).inputs;
                                base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [], base_contract_1.BaseContract._bigNumberToString.bind(self));
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, []);
                                ethersFunction = self._lookupEthersInterface(functionSignature).functions.owner;
                                encodedData = ethersFunction.encode([]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, callData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                callDataWithDefaults = _a.sent();
                                return [4 /*yield*/, self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)];
                            case 2:
                                rawCallResult = _a.sent();
                                base_contract_1.BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
                                resultArray = ethersFunction.decode(rawCallResult);
                                outputAbi = _.find(self.abi, { name: 'owner' }).outputs;
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._lowercaseAddress.bind(this));
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._bnToBigNumber.bind(this));
                                return [2 /*return*/, resultArray[0]];
                        }
                    });
                });
            },
        };
        _this.marketSellOrdersWithEth = {
            sendTransactionAsync: function (orders, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, inputAbi, encodedData, txDataWithDefaults, txHash;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                inputAbi = self._lookupAbi('marketSellOrdersWithEth(tuple[],bytes[],tuple[],bytes[],uint256,address)').inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [orders,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ], base_contract_1.BaseContract._bigNumberToString.bind(self)), 6), orders = _a[0], signatures = _a[1], feeOrders = _a[2], feeSignatures = _a[3], feePercentage = _a[4], feeRecipient = _a[5];
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, [orders,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                encodedData = self._lookupEthersInterface('marketSellOrdersWithEth(tuple[],bytes[],tuple[],bytes[],uint256,address)').functions.marketSellOrdersWithEth.encode([orders,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, txData, { data: encodedData }), self._web3Wrapper.getContractDefaults(), self.marketSellOrdersWithEth.estimateGasAsync.bind(self, orders, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient))];
                            case 1:
                                txDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                            case 2:
                                txHash = _b.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (orders, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, inputAbi, encodedData, txDataWithDefaults, gas;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                inputAbi = self._lookupAbi('marketSellOrdersWithEth(tuple[],bytes[],tuple[],bytes[],uint256,address)').inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [orders,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ], base_contract_1.BaseContract._bigNumberToString), 6), orders = _a[0], signatures = _a[1], feeOrders = _a[2], feeSignatures = _a[3], feePercentage = _a[4], feeRecipient = _a[5];
                                encodedData = self._lookupEthersInterface('marketSellOrdersWithEth(tuple[],bytes[],tuple[],bytes[],uint256,address)').functions.marketSellOrdersWithEth.encode([orders,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, txData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                txDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.estimateGasAsync(txDataWithDefaults)];
                            case 2:
                                gas = _b.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (orders, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient) {
                var _a;
                var self = this;
                var inputAbi = self._lookupAbi('marketSellOrdersWithEth(tuple[],bytes[],tuple[],bytes[],uint256,address)').inputs;
                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [orders,
                    signatures,
                    feeOrders,
                    feeSignatures,
                    feePercentage,
                    feeRecipient
                ], base_contract_1.BaseContract._bigNumberToString), 6), orders = _a[0], signatures = _a[1], feeOrders = _a[2], feeSignatures = _a[3], feePercentage = _a[4], feeRecipient = _a[5];
                var abiEncodedTransactionData = self._lookupEthersInterface('marketSellOrdersWithEth(tuple[],bytes[],tuple[],bytes[],uint256,address)').functions.marketSellOrdersWithEth.encode([orders,
                    signatures,
                    feeOrders,
                    feeSignatures,
                    feePercentage,
                    feeRecipient
                ]);
                return abiEncodedTransactionData;
            },
            callAsync: function (orders, signatures, feeOrders, feeSignatures, feePercentage, feeRecipient, callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, functionSignature, inputAbi, ethersFunction, encodedData, callDataWithDefaults, rawCallResult, resultArray, outputAbi;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                functionSignature = 'marketSellOrdersWithEth(tuple[],bytes[],tuple[],bytes[],uint256,address)';
                                inputAbi = self._lookupAbi(functionSignature).inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [orders,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ], base_contract_1.BaseContract._bigNumberToString.bind(self)), 6), orders = _a[0], signatures = _a[1], feeOrders = _a[2], feeSignatures = _a[3], feePercentage = _a[4], feeRecipient = _a[5];
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, [orders,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                ethersFunction = self._lookupEthersInterface(functionSignature).functions.marketSellOrdersWithEth;
                                encodedData = ethersFunction.encode([orders,
                                    signatures,
                                    feeOrders,
                                    feeSignatures,
                                    feePercentage,
                                    feeRecipient
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, callData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                callDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)];
                            case 2:
                                rawCallResult = _b.sent();
                                base_contract_1.BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
                                resultArray = ethersFunction.decode(rawCallResult);
                                outputAbi = _.find(self.abi, { name: 'marketSellOrdersWithEth' }).outputs;
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._lowercaseAddress.bind(this));
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._bnToBigNumber.bind(this));
                                return [2 /*return*/, resultArray];
                        }
                    });
                });
            },
        };
        _this.transferOwnership = {
            sendTransactionAsync: function (newOwner, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, inputAbi, encodedData, txDataWithDefaults, txHash;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                inputAbi = self._lookupAbi('transferOwnership(address)').inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [newOwner
                                ], base_contract_1.BaseContract._bigNumberToString.bind(self)), 1), newOwner = _a[0];
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, [newOwner
                                ]);
                                encodedData = self._lookupEthersInterface('transferOwnership(address)').functions.transferOwnership.encode([newOwner
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, txData, { data: encodedData }), self._web3Wrapper.getContractDefaults(), self.transferOwnership.estimateGasAsync.bind(self, newOwner))];
                            case 1:
                                txDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                            case 2:
                                txHash = _b.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (newOwner, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, inputAbi, encodedData, txDataWithDefaults, gas;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                inputAbi = self._lookupAbi('transferOwnership(address)').inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [newOwner
                                ], base_contract_1.BaseContract._bigNumberToString), 1), newOwner = _a[0];
                                encodedData = self._lookupEthersInterface('transferOwnership(address)').functions.transferOwnership.encode([newOwner
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, txData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                txDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.estimateGasAsync(txDataWithDefaults)];
                            case 2:
                                gas = _b.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (newOwner) {
                var _a;
                var self = this;
                var inputAbi = self._lookupAbi('transferOwnership(address)').inputs;
                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [newOwner
                ], base_contract_1.BaseContract._bigNumberToString), 1), newOwner = _a[0];
                var abiEncodedTransactionData = self._lookupEthersInterface('transferOwnership(address)').functions.transferOwnership.encode([newOwner
                ]);
                return abiEncodedTransactionData;
            },
            callAsync: function (newOwner, callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var _a, self, functionSignature, inputAbi, ethersFunction, encodedData, callDataWithDefaults, rawCallResult, resultArray, outputAbi;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                self = this;
                                functionSignature = 'transferOwnership(address)';
                                inputAbi = self._lookupAbi(functionSignature).inputs;
                                _a = __read(base_contract_1.BaseContract._formatABIDataItemList(inputAbi, [newOwner
                                ], base_contract_1.BaseContract._bigNumberToString.bind(self)), 1), newOwner = _a[0];
                                base_contract_1.BaseContract.strictArgumentEncodingCheck(inputAbi, [newOwner
                                ]);
                                ethersFunction = self._lookupEthersInterface(functionSignature).functions.transferOwnership;
                                encodedData = ethersFunction.encode([newOwner
                                ]);
                                return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync(__assign({ to: self.address }, callData, { data: encodedData }), self._web3Wrapper.getContractDefaults())];
                            case 1:
                                callDataWithDefaults = _b.sent();
                                return [4 /*yield*/, self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)];
                            case 2:
                                rawCallResult = _b.sent();
                                base_contract_1.BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
                                resultArray = ethersFunction.decode(rawCallResult);
                                outputAbi = _.find(self.abi, { name: 'transferOwnership' }).outputs;
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._lowercaseAddress.bind(this));
                                resultArray = base_contract_1.BaseContract._formatABIDataItemList(outputAbi, resultArray, base_contract_1.BaseContract._bnToBigNumber.bind(this));
                                return [2 /*return*/, resultArray];
                        }
                    });
                });
            },
        };
        utils_1.classUtils.bindAll(_this, ['_ethersInterfacesByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
        return _this;
    }
    ForwarderContract.deployFrom0xArtifactAsync = function (artifact, provider, txDefaults, _exchange, _zrxAssetData, _wethAssetData) {
        return __awaiter(this, void 0, void 0, function () {
            var bytecode, abi;
            return __generator(this, function (_a) {
                if (_.isUndefined(artifact.compilerOutput)) {
                    throw new Error('Compiler output not found in the artifact file');
                }
                bytecode = artifact.compilerOutput.evm.bytecode.object;
                abi = artifact.compilerOutput.abi;
                return [2 /*return*/, ForwarderContract.deployAsync(bytecode, abi, provider, txDefaults, _exchange, _zrxAssetData, _wethAssetData)];
            });
        });
    };
    ForwarderContract.deployAsync = function (bytecode, abi, provider, txDefaults, _exchange, _zrxAssetData, _wethAssetData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, constructorAbi, iface, deployInfo, txData, web3Wrapper, txDataWithDefaults, txHash, txReceipt, contractInstance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        constructorAbi = base_contract_1.BaseContract._lookupConstructorAbi(abi);
                        _a = __read(base_contract_1.BaseContract._formatABIDataItemList(constructorAbi.inputs, [_exchange,
                            _zrxAssetData,
                            _wethAssetData
                        ], base_contract_1.BaseContract._bigNumberToString), 3), _exchange = _a[0], _zrxAssetData = _a[1], _wethAssetData = _a[2];
                        iface = new ethers.utils.Interface(abi);
                        deployInfo = iface.deployFunction;
                        txData = deployInfo.encode(bytecode, [_exchange,
                            _zrxAssetData,
                            _wethAssetData
                        ]);
                        web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
                        return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToTxDataAsync({ data: txData }, txDefaults, web3Wrapper.estimateGasAsync.bind(web3Wrapper))];
                    case 1:
                        txDataWithDefaults = _b.sent();
                        return [4 /*yield*/, web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                    case 2:
                        txHash = _b.sent();
                        utils_1.logUtils.log("transactionHash: " + txHash);
                        return [4 /*yield*/, web3Wrapper.awaitTransactionSuccessAsync(txHash)];
                    case 3:
                        txReceipt = _b.sent();
                        utils_1.logUtils.log("Forwarder successfully deployed at " + txReceipt.contractAddress);
                        contractInstance = new ForwarderContract(abi, txReceipt.contractAddress, provider, txDefaults);
                        contractInstance.constructorArgs = [_exchange,
                            _zrxAssetData,
                            _wethAssetData
                        ];
                        return [2 /*return*/, contractInstance];
                }
            });
        });
    };
    return ForwarderContract;
}(base_contract_1.BaseContract)); // tslint:disable:max-file-line-count
exports.ForwarderContract = ForwarderContract;
// tslint:enable:no-unbound-method
//# sourceMappingURL=forwarder.js.map
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
var assert_1 = require("../utils/assert");
var contract_addresses_1 = require("../utils/contract_addresses");
var contract_wrapper_1 = require("./contract_wrapper");
/**
 * This class includes the functionality related to interacting with the OrderValidator contract.
 */
var OrderValidatorWrapper = /** @class */ (function (_super) {
    __extends(OrderValidatorWrapper, _super);
    /**
     * Instantiate OrderValidatorWrapper
     * @param web3Wrapper Web3Wrapper instance to use.
     * @param networkId Desired networkId.
     * @param address The address of the OrderValidator contract. If undefined,
     * will default to the known address corresponding to the networkId.
     */
    function OrderValidatorWrapper(web3Wrapper, networkId, address) {
        var _this = _super.call(this, web3Wrapper, networkId) || this;
        _this.abi = contract_artifacts_1.OrderValidator.compilerOutput.abi;
        _this.address = _.isUndefined(address) ? contract_addresses_1._getDefaultContractAddresses(networkId).exchange : address;
        return _this;
    }
    /**
     * Get an object conforming to OrderAndTraderInfo containing on-chain information of the provided order and address
     * @param   order           An object conforming to SignedOrder
     * @param   takerAddress    An ethereum address
     * @return  OrderAndTraderInfo
     */
    OrderValidatorWrapper.prototype.getOrderAndTraderInfoAsync = function (order, takerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var OrderValidatorContractInstance, orderAndTraderInfo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.signedOrderSchema);
                        assert_1.assert.isETHAddressHex('takerAddress', takerAddress);
                        return [4 /*yield*/, this._getOrderValidatorContractAsync()];
                    case 1:
                        OrderValidatorContractInstance = _a.sent();
                        return [4 /*yield*/, OrderValidatorContractInstance.getOrderAndTraderInfo.callAsync(order, takerAddress)];
                    case 2:
                        orderAndTraderInfo = _a.sent();
                        result = {
                            orderInfo: orderAndTraderInfo[0],
                            traderInfo: orderAndTraderInfo[1],
                        };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get an array of objects conforming to OrderAndTraderInfo containing on-chain information of the provided orders and addresses
     * @param   orders          An array of objects conforming to SignedOrder
     * @param   takerAddresses  An array of ethereum addresses
     * @return  array of OrderAndTraderInfo
     */
    OrderValidatorWrapper.prototype.getOrdersAndTradersInfoAsync = function (orders, takerAddresses) {
        return __awaiter(this, void 0, void 0, function () {
            var OrderValidatorContractInstance, ordersAndTradersInfo, orderInfos, traderInfos, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('orders', orders, json_schemas_1.schemas.signedOrdersSchema);
                        _.forEach(takerAddresses, function (takerAddress, index) {
                            return assert_1.assert.isETHAddressHex("takerAddresses[" + index + "]", takerAddress);
                        });
                        assert_1.assert.assert(orders.length === takerAddresses.length, 'Expected orders.length to equal takerAddresses.length');
                        return [4 /*yield*/, this._getOrderValidatorContractAsync()];
                    case 1:
                        OrderValidatorContractInstance = _a.sent();
                        return [4 /*yield*/, OrderValidatorContractInstance.getOrdersAndTradersInfo.callAsync(orders, takerAddresses)];
                    case 2:
                        ordersAndTradersInfo = _a.sent();
                        orderInfos = ordersAndTradersInfo[0];
                        traderInfos = ordersAndTradersInfo[1];
                        result = _.map(orderInfos, function (orderInfo, index) {
                            var traderInfo = traderInfos[index];
                            return {
                                orderInfo: orderInfo,
                                traderInfo: traderInfo,
                            };
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get an object conforming to TraderInfo containing on-chain balance and allowances for maker and taker of order
     * @param   order           An object conforming to SignedOrder
     * @param   takerAddress    An ethereum address
     * @return  TraderInfo
     */
    OrderValidatorWrapper.prototype.getTraderInfoAsync = function (order, takerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var OrderValidatorContractInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.signedOrderSchema);
                        assert_1.assert.isETHAddressHex('takerAddress', takerAddress);
                        return [4 /*yield*/, this._getOrderValidatorContractAsync()];
                    case 1:
                        OrderValidatorContractInstance = _a.sent();
                        return [4 /*yield*/, OrderValidatorContractInstance.getTraderInfo.callAsync(order, takerAddress)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get an array of objects conforming to TraderInfo containing on-chain balance and allowances for maker and taker of order
     * @param   orders          An array of objects conforming to SignedOrder
     * @param   takerAddresses  An array of ethereum addresses
     * @return  array of TraderInfo
     */
    OrderValidatorWrapper.prototype.getTradersInfoAsync = function (orders, takerAddresses) {
        return __awaiter(this, void 0, void 0, function () {
            var OrderValidatorContractInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('orders', orders, json_schemas_1.schemas.signedOrdersSchema);
                        _.forEach(takerAddresses, function (takerAddress, index) {
                            return assert_1.assert.isETHAddressHex("takerAddresses[" + index + "]", takerAddress);
                        });
                        assert_1.assert.assert(orders.length === takerAddresses.length, 'Expected orders.length to equal takerAddresses.length');
                        return [4 /*yield*/, this._getOrderValidatorContractAsync()];
                    case 1:
                        OrderValidatorContractInstance = _a.sent();
                        return [4 /*yield*/, OrderValidatorContractInstance.getTradersInfo.callAsync(orders, takerAddresses)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get an object conforming to BalanceAndAllowance containing on-chain balance and allowance for some address and assetData
     * @param   address     An ethereum address
     * @param   assetData   An encoded string that can be decoded by a specified proxy contract
     * @return  BalanceAndAllowance
     */
    OrderValidatorWrapper.prototype.getBalanceAndAllowanceAsync = function (address, assetData) {
        return __awaiter(this, void 0, void 0, function () {
            var OrderValidatorContractInstance, balanceAndAllowance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('address', address);
                        assert_1.assert.isHexString('assetData', assetData);
                        return [4 /*yield*/, this._getOrderValidatorContractAsync()];
                    case 1:
                        OrderValidatorContractInstance = _a.sent();
                        return [4 /*yield*/, OrderValidatorContractInstance.getBalanceAndAllowance.callAsync(address, assetData)];
                    case 2:
                        balanceAndAllowance = _a.sent();
                        result = {
                            balance: balanceAndAllowance[0],
                            allowance: balanceAndAllowance[1],
                        };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get an array of objects conforming to BalanceAndAllowance containing on-chain balance and allowance for some address and array of assetDatas
     * @param   address     An ethereum address
     * @param   assetDatas  An array of encoded strings that can be decoded by a specified proxy contract
     * @return  BalanceAndAllowance
     */
    OrderValidatorWrapper.prototype.getBalancesAndAllowancesAsync = function (address, assetDatas) {
        return __awaiter(this, void 0, void 0, function () {
            var OrderValidatorContractInstance, balancesAndAllowances, balances, allowances, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('address', address);
                        _.forEach(assetDatas, function (assetData, index) { return assert_1.assert.isHexString("assetDatas[" + index + "]", assetData); });
                        return [4 /*yield*/, this._getOrderValidatorContractAsync()];
                    case 1:
                        OrderValidatorContractInstance = _a.sent();
                        return [4 /*yield*/, OrderValidatorContractInstance.getBalancesAndAllowances.callAsync(address, assetDatas)];
                    case 2:
                        balancesAndAllowances = _a.sent();
                        balances = balancesAndAllowances[0];
                        allowances = balancesAndAllowances[1];
                        result = _.map(balances, function (balance, index) {
                            var allowance = allowances[index];
                            return {
                                balance: balance,
                                allowance: allowance,
                            };
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get owner address of tokenId by calling `token.ownerOf(tokenId)`, but returns a null owner instead of reverting on an unowned token.
     * @param   tokenAddress    An ethereum address
     * @param   tokenId         An ERC721 tokenId
     * @return  Owner of tokenId or null address if unowned
     */
    OrderValidatorWrapper.prototype.getERC721TokenOwnerAsync = function (tokenAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var OrderValidatorContractInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex('tokenAddress', tokenAddress);
                        assert_1.assert.isBigNumber('tokenId', tokenId);
                        return [4 /*yield*/, this._getOrderValidatorContractAsync()];
                    case 1:
                        OrderValidatorContractInstance = _a.sent();
                        return [4 /*yield*/, OrderValidatorContractInstance.getERC721TokenOwner.callAsync(tokenAddress, tokenId)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    OrderValidatorWrapper.prototype._getOrderValidatorContractAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contractInstance;
            return __generator(this, function (_a) {
                if (!_.isUndefined(this._orderValidatorContractIfExists)) {
                    return [2 /*return*/, this._orderValidatorContractIfExists];
                }
                contractInstance = new abi_gen_wrappers_1.OrderValidatorContract(this.abi, this.address, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
                this._orderValidatorContractIfExists = contractInstance;
                return [2 /*return*/, this._orderValidatorContractIfExists];
            });
        });
    };
    return OrderValidatorWrapper;
}(contract_wrapper_1.ContractWrapper));
exports.OrderValidatorWrapper = OrderValidatorWrapper;
//# sourceMappingURL=order_validator_wrapper.js.map
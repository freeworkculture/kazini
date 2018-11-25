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
var assert_1 = require("@0x/assert");
var order_utils_1 = require("@0x/order-utils");
var _ = require("lodash");
var constants_1 = require("./constants");
exports.assert = __assign({}, assert_1.assert, { isValidSignatureAsync: function (provider, orderHash, signature, signerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, order_utils_1.signatureUtils.isValidSignatureAsync(provider, orderHash, signature, signerAddress)];
                    case 1:
                        isValid = _a.sent();
                        assert_1.assert.assert(isValid, "Expected order with hash '" + orderHash + "' to have a valid signature");
                        return [2 /*return*/];
                }
            });
        });
    },
    isValidSubscriptionToken: function (variableName, subscriptionToken) {
        var uuidRegex = new RegExp('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$');
        var isValid = uuidRegex.test(subscriptionToken);
        assert_1.assert.assert(isValid, "Expected " + variableName + " to be a valid subscription token");
    },
    isSenderAddressAsync: function (variableName, senderAddressHex, web3Wrapper) {
        return __awaiter(this, void 0, void 0, function () {
            var isSenderAddressAvailable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isETHAddressHex(variableName, senderAddressHex);
                        return [4 /*yield*/, web3Wrapper.isSenderAddressAvailableAsync(senderAddressHex)];
                    case 1:
                        isSenderAddressAvailable = _a.sent();
                        assert_1.assert.assert(isSenderAddressAvailable, "Specified " + variableName + " " + senderAddressHex + " isn't available through the supplied web3 provider");
                        return [2 /*return*/];
                }
            });
        });
    },
    ordersCanBeUsedForForwarderContract: function (orders, etherTokenAddress) {
        assert_1.assert.assert(!_.isEmpty(orders), 'Expected at least 1 signed order. Found no orders');
        exports.assert.ordersHaveAtMostOneUniqueValueForProperty(orders, 'makerAssetData');
        exports.assert.allTakerAssetDatasAreErc20Token(orders, etherTokenAddress);
        exports.assert.allTakerAddressesAreNull(orders);
    },
    feeOrdersCanBeUsedForForwarderContract: function (orders, zrxTokenAddress, etherTokenAddress) {
        if (!_.isEmpty(orders)) {
            exports.assert.allMakerAssetDatasAreErc20Token(orders, zrxTokenAddress);
            exports.assert.allTakerAssetDatasAreErc20Token(orders, etherTokenAddress);
        }
    },
    allTakerAddressesAreNull: function (orders) {
        exports.assert.ordersHaveAtMostOneUniqueValueForProperty(orders, 'takerAddress', constants_1.constants.NULL_ADDRESS);
    },
    allMakerAssetDatasAreErc20Token: function (orders, tokenAddress) {
        exports.assert.ordersHaveAtMostOneUniqueValueForProperty(orders, 'makerAssetData', order_utils_1.assetDataUtils.encodeERC20AssetData(tokenAddress));
    },
    allTakerAssetDatasAreErc20Token: function (orders, tokenAddress) {
        exports.assert.ordersHaveAtMostOneUniqueValueForProperty(orders, 'takerAssetData', order_utils_1.assetDataUtils.encodeERC20AssetData(tokenAddress));
    },
    /*
     * Asserts that all the orders have the same value for the provided propertyName
     * If the value parameter is provided, this asserts that all orders have the prope
    */
    ordersHaveAtMostOneUniqueValueForProperty: function (orders, propertyName, value) {
        var allValues = _.map(orders, function (order) { return _.get(order, propertyName); });
        assert_1.assert.hasAtMostOneUniqueValue(allValues, "Expected all orders to have the same " + propertyName + " field. Found the following " + propertyName + " values: " + JSON.stringify(allValues));
        if (!_.isUndefined(value)) {
            var firstValue = _.head(allValues);
            assert_1.assert.assert(firstValue === value, "Expected all orders to have a " + propertyName + " field with value: " + value + ". Found: " + firstValue);
        }
    } });
//# sourceMappingURL=assert.js.map
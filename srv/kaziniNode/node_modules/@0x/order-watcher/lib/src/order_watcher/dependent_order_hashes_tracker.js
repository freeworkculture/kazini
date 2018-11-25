"use strict";
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-unnecessary-type-assertion
var order_utils_1 = require("@0x/order-utils");
var types_1 = require("@0x/types");
var _ = require("lodash");
/**
 */
var DependentOrderHashesTracker = /** @class */ (function () {
    function DependentOrderHashesTracker(zrxTokenAddress) {
        // `_orderHashesByMakerAddress` is redundant and could be generated from
        // `_orderHashesByERC20ByMakerAddress` and `_orderHashesByERC721AddressByTokenIdByMakerAddress`
        // on the fly by merging all the entries together but it's more complex and computationally heavy.
        // We might change that in future if we're move memory-constrained.
        this._orderHashesByMakerAddress = {};
        this._orderHashesByERC20ByMakerAddress = {};
        this._orderHashesByERC721AddressByTokenIdByMakerAddress = {};
        this._zrxTokenAddress = zrxTokenAddress;
    }
    DependentOrderHashesTracker.prototype.getDependentOrderHashesByERC721ByMaker = function (makerAddress, tokenAddress) {
        var orderHashSets = _.values(this._orderHashesByERC721AddressByTokenIdByMakerAddress[makerAddress][tokenAddress]);
        var orderHashList = _.reduce(orderHashSets, function (accumulator, orderHashSet) { return __spread(accumulator, orderHashSet); }, []);
        var uniqueOrderHashList = _.uniq(orderHashList);
        return uniqueOrderHashList;
    };
    DependentOrderHashesTracker.prototype.getDependentOrderHashesByMaker = function (makerAddress) {
        var dependentOrderHashes = Array.from(this._orderHashesByMakerAddress[makerAddress] || {});
        return dependentOrderHashes;
    };
    DependentOrderHashesTracker.prototype.getDependentOrderHashesByAssetDataByMaker = function (makerAddress, assetData) {
        var decodedAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(assetData);
        var dependentOrderHashes = decodedAssetData.assetProxyId === types_1.AssetProxyId.ERC20
            ? this._getDependentOrderHashesByERC20AssetData(makerAddress, assetData)
            : this._getDependentOrderHashesByERC721AssetData(makerAddress, assetData);
        return dependentOrderHashes;
    };
    DependentOrderHashesTracker.prototype.addToDependentOrderHashes = function (signedOrder) {
        var decodedMakerAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(signedOrder.makerAssetData);
        if (decodedMakerAssetData.assetProxyId === types_1.AssetProxyId.ERC20) {
            this._addToERC20DependentOrderHashes(signedOrder, decodedMakerAssetData.tokenAddress);
        }
        else {
            this._addToERC721DependentOrderHashes(signedOrder, decodedMakerAssetData.tokenAddress, decodedMakerAssetData.tokenId);
        }
        this._addToERC20DependentOrderHashes(signedOrder, this._zrxTokenAddress);
        this._addToMakerDependentOrderHashes(signedOrder);
    };
    DependentOrderHashesTracker.prototype.removeFromDependentOrderHashes = function (signedOrder) {
        var decodedMakerAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(signedOrder.makerAssetData);
        if (decodedMakerAssetData.assetProxyId === types_1.AssetProxyId.ERC20) {
            this._removeFromERC20DependentOrderhashes(signedOrder, decodedMakerAssetData.tokenAddress);
        }
        else {
            this._removeFromERC721DependentOrderhashes(signedOrder, decodedMakerAssetData.tokenAddress, decodedMakerAssetData.tokenId);
        }
        // If makerToken === ZRX then we already removed it and we don't need to remove it again.
        if (decodedMakerAssetData.tokenAddress !== this._zrxTokenAddress) {
            this._removeFromERC20DependentOrderhashes(signedOrder, this._zrxTokenAddress);
        }
        this._removeFromMakerDependentOrderhashes(signedOrder);
    };
    DependentOrderHashesTracker.prototype._getDependentOrderHashesByERC20AssetData = function (makerAddress, erc20AssetData) {
        var tokenAddress = order_utils_1.assetDataUtils.decodeERC20AssetData(erc20AssetData).tokenAddress;
        var dependentOrderHashes = [];
        if (!_.isUndefined(this._orderHashesByERC20ByMakerAddress[makerAddress]) &&
            !_.isUndefined(this._orderHashesByERC20ByMakerAddress[makerAddress][tokenAddress])) {
            dependentOrderHashes = Array.from(this._orderHashesByERC20ByMakerAddress[makerAddress][tokenAddress]);
        }
        return dependentOrderHashes;
    };
    DependentOrderHashesTracker.prototype._getDependentOrderHashesByERC721AssetData = function (makerAddress, erc721AssetData) {
        var tokenAddress = order_utils_1.assetDataUtils.decodeERC721AssetData(erc721AssetData).tokenAddress;
        var tokenId = order_utils_1.assetDataUtils.decodeERC721AssetData(erc721AssetData).tokenId;
        var dependentOrderHashes = [];
        if (!_.isUndefined(this._orderHashesByERC721AddressByTokenIdByMakerAddress[makerAddress]) &&
            !_.isUndefined(this._orderHashesByERC721AddressByTokenIdByMakerAddress[makerAddress][tokenAddress]) &&
            !_.isUndefined(this._orderHashesByERC721AddressByTokenIdByMakerAddress[makerAddress][tokenAddress][tokenId.toString()])) {
            dependentOrderHashes = Array.from(this._orderHashesByERC721AddressByTokenIdByMakerAddress[makerAddress][tokenAddress][tokenId.toString()]);
        }
        return dependentOrderHashes;
    };
    DependentOrderHashesTracker.prototype._addToERC20DependentOrderHashes = function (signedOrder, erc20TokenAddress) {
        var orderHash = order_utils_1.orderHashUtils.getOrderHashHex(signedOrder);
        if (_.isUndefined(this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress])) {
            this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress] = {};
        }
        if (_.isUndefined(this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress][erc20TokenAddress])) {
            this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress][erc20TokenAddress] = new Set();
        }
        this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress][erc20TokenAddress].add(orderHash);
    };
    DependentOrderHashesTracker.prototype._addToERC721DependentOrderHashes = function (signedOrder, erc721TokenAddress, tokenId) {
        var orderHash = order_utils_1.orderHashUtils.getOrderHashHex(signedOrder);
        if (_.isUndefined(this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress])) {
            this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress] = {};
        }
        if (_.isUndefined(this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress])) {
            this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress] = {};
        }
        if (_.isUndefined(this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress][tokenId.toString()])) {
            this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress][tokenId.toString()] = new Set();
        }
        this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress][tokenId.toString()].add(orderHash);
    };
    DependentOrderHashesTracker.prototype._addToMakerDependentOrderHashes = function (signedOrder) {
        var orderHash = order_utils_1.orderHashUtils.getOrderHashHex(signedOrder);
        if (_.isUndefined(this._orderHashesByMakerAddress[signedOrder.makerAddress])) {
            this._orderHashesByMakerAddress[signedOrder.makerAddress] = new Set();
        }
        this._orderHashesByMakerAddress[signedOrder.makerAddress].add(orderHash);
    };
    DependentOrderHashesTracker.prototype._removeFromERC20DependentOrderhashes = function (signedOrder, erc20TokenAddress) {
        var orderHash = order_utils_1.orderHashUtils.getOrderHashHex(signedOrder);
        this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress][erc20TokenAddress].delete(orderHash);
        if (_.isEmpty(this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress][erc20TokenAddress])) {
            delete this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress][erc20TokenAddress];
        }
        if (_.isEmpty(this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress])) {
            delete this._orderHashesByERC20ByMakerAddress[signedOrder.makerAddress];
        }
    };
    DependentOrderHashesTracker.prototype._removeFromERC721DependentOrderhashes = function (signedOrder, erc721TokenAddress, tokenId) {
        var orderHash = order_utils_1.orderHashUtils.getOrderHashHex(signedOrder);
        this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress][tokenId.toString()].delete(orderHash);
        if (_.isEmpty(this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress][tokenId.toString()])) {
            delete this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress][tokenId.toString()];
        }
        if (_.isEmpty(this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress])) {
            delete this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress][erc721TokenAddress];
        }
        if (_.isEmpty(this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress])) {
            delete this._orderHashesByERC721AddressByTokenIdByMakerAddress[signedOrder.makerAddress];
        }
    };
    DependentOrderHashesTracker.prototype._removeFromMakerDependentOrderhashes = function (signedOrder) {
        var orderHash = order_utils_1.orderHashUtils.getOrderHashHex(signedOrder);
        this._orderHashesByMakerAddress[signedOrder.makerAddress].delete(orderHash);
        if (_.isEmpty(this._orderHashesByMakerAddress[signedOrder.makerAddress])) {
            delete this._orderHashesByMakerAddress[signedOrder.makerAddress];
        }
    };
    return DependentOrderHashesTracker;
}());
exports.DependentOrderHashesTracker = DependentOrderHashesTracker;
//# sourceMappingURL=dependent_order_hashes_tracker.js.map
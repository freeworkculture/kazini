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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var constants_1 = require("./constants");
exports.calldataOptimizationUtils = {
    /**
     * Takes an array of orders and outputs an array of equivalent orders where all takerAssetData are '0x' and
     * all makerAssetData are '0x' except for that of the first order, which retains its original value
     * @param   orders         An array of SignedOrder objects
     * @returns optimized orders
     */
    optimizeForwarderOrders: function (orders) {
        var optimizedOrders = _.map(orders, function (order, index) {
            return transformOrder(order, {
                makerAssetData: index === 0 ? order.makerAssetData : constants_1.constants.NULL_BYTES,
                takerAssetData: constants_1.constants.NULL_BYTES,
            });
        });
        return optimizedOrders;
    },
    /**
     * Takes an array of orders and outputs an array of equivalent orders where all takerAssetData are '0x' and
     * all makerAssetData are '0x'
     * @param   orders         An array of SignedOrder objects
     * @returns optimized orders
     */
    optimizeForwarderFeeOrders: function (orders) {
        var optimizedOrders = _.map(orders, function (order, index) {
            return transformOrder(order, {
                makerAssetData: constants_1.constants.NULL_BYTES,
                takerAssetData: constants_1.constants.NULL_BYTES,
            });
        });
        return optimizedOrders;
    },
};
var transformOrder = function (order, partialOrder) {
    return __assign({}, order, partialOrder);
};
//# sourceMappingURL=calldata_optimization_utils.js.map
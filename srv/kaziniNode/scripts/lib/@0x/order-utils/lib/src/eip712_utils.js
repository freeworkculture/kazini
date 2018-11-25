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
var assert_1 = require("@0x/assert");
var json_schemas_1 = require("@0x/json-schemas");
var _ = require("lodash");
var constants_1 = require("./constants");
exports.eip712Utils = {
    /**
     * Creates a EIP712TypedData object specific to the 0x protocol for use with signTypedData.
     * @param   primaryType The primary type found in message
     * @param   types The additional types for the data in message
     * @param   message The contents of the message
     * @param   exchangeAddress The address of the exchange contract
     * @return  A typed data object
     */
    createTypedData: function (primaryType, types, message, exchangeAddress) {
        assert_1.assert.isETHAddressHex('exchangeAddress', exchangeAddress);
        assert_1.assert.isString('primaryType', primaryType);
        var typedData = {
            types: __assign({ EIP712Domain: constants_1.constants.EIP712_DOMAIN_SCHEMA.parameters }, types),
            domain: {
                name: constants_1.constants.EIP712_DOMAIN_NAME,
                version: constants_1.constants.EIP712_DOMAIN_VERSION,
                verifyingContract: exchangeAddress,
            },
            message: message,
            primaryType: primaryType,
        };
        assert_1.assert.doesConformToSchema('typedData', typedData, json_schemas_1.schemas.eip712TypedDataSchema);
        return typedData;
    },
    /**
     * Creates an Order EIP712TypedData object for use with signTypedData.
     * @param   Order the order
     * @return  A typed data object
     */
    createOrderTypedData: function (order) {
        assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.orderSchema, [json_schemas_1.schemas.hexSchema]);
        var normalizedOrder = _.mapValues(order, function (value) {
            return !_.isString(value) ? value.toString() : value;
        });
        var typedData = exports.eip712Utils.createTypedData(constants_1.constants.EIP712_ORDER_SCHEMA.name, { Order: constants_1.constants.EIP712_ORDER_SCHEMA.parameters }, normalizedOrder, order.exchangeAddress);
        return typedData;
    },
    /**
     * Creates an ExecuteTransaction EIP712TypedData object for use with signTypedData and
     * 0x Exchange executeTransaction.
     * @param   ZeroExTransaction the 0x transaction
     * @param   exchangeAddress The address of the exchange contract
     * @return  A typed data object
     */
    createZeroExTransactionTypedData: function (zeroExTransaction, exchangeAddress) {
        assert_1.assert.isETHAddressHex('exchangeAddress', exchangeAddress);
        assert_1.assert.doesConformToSchema('zeroExTransaction', zeroExTransaction, json_schemas_1.schemas.zeroExTransactionSchema);
        var normalizedTransaction = _.mapValues(zeroExTransaction, function (value) {
            return !_.isString(value) ? value.toString() : value;
        });
        var typedData = exports.eip712Utils.createTypedData(constants_1.constants.EIP712_ZEROEX_TRANSACTION_SCHEMA.name, { ZeroExTransaction: constants_1.constants.EIP712_ZEROEX_TRANSACTION_SCHEMA.parameters }, normalizedTransaction, exchangeAddress);
        return typedData;
    },
};
//# sourceMappingURL=eip712_utils.js.map
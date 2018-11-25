"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_schemas_1 = require("@0x/json-schemas");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var assert_1 = require("./assert");
var eip712_utils_1 = require("./eip712_utils");
var INVALID_TAKER_FORMAT = 'instance.takerAddress is not of a type(s) string';
exports.orderHashUtils = {
    /**
     * Checks if the supplied hex encoded order hash is valid.
     * Note: Valid means it has the expected format, not that an order with the orderHash exists.
     * Use this method when processing orderHashes submitted as user input.
     * @param   orderHash    Hex encoded orderHash.
     * @return  Whether the supplied orderHash has the expected format.
     */
    isValidOrderHash: function (orderHash) {
        // Since this method can be called to check if any arbitrary string conforms to an orderHash's
        // format, we only assert that we were indeed passed a string.
        assert_1.assert.isString('orderHash', orderHash);
        var schemaValidator = new json_schemas_1.SchemaValidator();
        var isValid = schemaValidator.validate(orderHash, json_schemas_1.schemas.orderHashSchema).valid;
        return isValid;
    },
    /**
     * Computes the orderHash for a supplied order.
     * @param   order   An object that conforms to the Order or SignedOrder interface definitions.
     * @return  Hex encoded string orderHash from hashing the supplied order.
     */
    getOrderHashHex: function (order) {
        try {
            assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.orderSchema, [json_schemas_1.schemas.hexSchema]);
        }
        catch (error) {
            if (_.includes(error.message, INVALID_TAKER_FORMAT)) {
                var errMsg = 'Order taker must be of type string. If you want anyone to be able to fill an order - pass ZeroEx.NULL_ADDRESS';
                throw new Error(errMsg);
            }
            throw error;
        }
        var orderHashBuff = exports.orderHashUtils.getOrderHashBuffer(order);
        var orderHashHex = "0x" + orderHashBuff.toString('hex');
        return orderHashHex;
    },
    /**
     * Computes the orderHash for a supplied order
     * @param   order   An object that conforms to the Order or SignedOrder interface definitions.
     * @return  A Buffer containing the resulting orderHash from hashing the supplied order
     */
    getOrderHashBuffer: function (order) {
        var typedData = eip712_utils_1.eip712Utils.createOrderTypedData(order);
        var orderHashBuff = utils_1.signTypedDataUtils.generateTypedDataHash(typedData);
        return orderHashBuff;
    },
};
//# sourceMappingURL=order_hash.js.map
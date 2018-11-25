"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_schemas_1 = require("@0x/json-schemas");
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var assert_1 = require("./assert");
/**
 * Transaction Encoder. Transaction messages exist for the purpose of calling methods on the Exchange contract
 * in the context of another address. For example, UserA can encode and sign a fillOrder transaction and UserB
 * can submit this to the blockchain. The Exchange context executes as if UserA had directly submitted this transaction.
 */
var TransactionEncoder = /** @class */ (function () {
    function TransactionEncoder(exchangeInstance) {
        this._exchangeInstance = exchangeInstance;
    }
    /**
     * Encodes the transaction data for use with the Exchange contract.
     * @param data The ABI Encoded 0x Exchange method. I.e fillOrder
     * @param salt A random value to provide uniqueness and prevent replay attacks.
     * @param signerAddress The address which will sign this transaction.
     * @return An unsigned hex encoded transaction for use in 0x Exchange executeTransaction.
     */
    TransactionEncoder.prototype.getTransactionHex = function (data, salt, signerAddress) {
        var exchangeAddress = this._getExchangeContract().address;
        var executeTransactionData = {
            salt: salt,
            signerAddress: signerAddress,
            data: data,
        };
        var typedData = order_utils_1.eip712Utils.createZeroExTransactionTypedData(executeTransactionData, exchangeAddress);
        var eip712MessageBuffer = utils_1.signTypedDataUtils.generateTypedDataHash(typedData);
        var messageHex = "0x" + eip712MessageBuffer.toString('hex');
        return messageHex;
    };
    /**
     * Encodes a fillOrder transaction.
     * @param  signedOrder           An object that conforms to the SignedOrder interface.
     * @param  takerAssetFillAmount  The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.fillOrderTx = function (signedOrder, takerAssetFillAmount) {
        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
        assert_1.assert.isValidBaseUnitAmount('takerAssetFillAmount', takerAssetFillAmount);
        var abiEncodedData = this._getExchangeContract().fillOrder.getABIEncodedTransactionData(signedOrder, takerAssetFillAmount, signedOrder.signature);
        return abiEncodedData;
    };
    /**
     * Encodes a fillOrderNoThrow transaction.
     * @param  signedOrder           An object that conforms to the SignedOrder interface.
     * @param  takerAssetFillAmount  The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.fillOrderNoThrowTx = function (signedOrder, takerAssetFillAmount) {
        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
        assert_1.assert.isValidBaseUnitAmount('takerAssetFillAmount', takerAssetFillAmount);
        var abiEncodedData = this._getExchangeContract().fillOrderNoThrow.getABIEncodedTransactionData(signedOrder, takerAssetFillAmount, signedOrder.signature);
        return abiEncodedData;
    };
    /**
     * Encodes a fillOrKillOrder transaction.
     * @param  signedOrder           An object that conforms to the SignedOrder interface.
     * @param  takerAssetFillAmount  The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.fillOrKillOrderTx = function (signedOrder, takerAssetFillAmount) {
        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
        assert_1.assert.isValidBaseUnitAmount('takerAssetFillAmount', takerAssetFillAmount);
        var abiEncodedData = this._getExchangeContract().fillOrKillOrder.getABIEncodedTransactionData(signedOrder, takerAssetFillAmount, signedOrder.signature);
        return abiEncodedData;
    };
    /**
     * Encodes a batchFillOrders transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.batchFillOrdersTx = function (signedOrders, takerAssetFillAmounts) {
        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
        _.forEach(takerAssetFillAmounts, function (takerAssetFillAmount) {
            return assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
        });
        var signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
        var abiEncodedData = this._getExchangeContract().batchFillOrders.getABIEncodedTransactionData(signedOrders, takerAssetFillAmounts, signatures);
        return abiEncodedData;
    };
    /**
     * Encodes a batchFillOrKillOrders transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.batchFillOrKillOrdersTx = function (signedOrders, takerAssetFillAmounts) {
        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
        _.forEach(takerAssetFillAmounts, function (takerAssetFillAmount) {
            return assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
        });
        var signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
        var abiEncodedData = this._getExchangeContract().batchFillOrKillOrders.getABIEncodedTransactionData(signedOrders, takerAssetFillAmounts, signatures);
        return abiEncodedData;
    };
    /**
     * Encodes a batchFillOrdersNoThrow transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.batchFillOrdersNoThrowTx = function (signedOrders, takerAssetFillAmounts) {
        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
        _.forEach(takerAssetFillAmounts, function (takerAssetFillAmount) {
            return assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
        });
        var signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
        var abiEncodedData = this._getExchangeContract().batchFillOrdersNoThrow.getABIEncodedTransactionData(signedOrders, takerAssetFillAmounts, signatures);
        return abiEncodedData;
    };
    /**
     * Encodes a batchCancelOrders transaction.
     * @param   signedOrders An array of orders to cancel.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.batchCancelOrdersTx = function (signedOrders) {
        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
        var abiEncodedData = this._getExchangeContract().batchCancelOrders.getABIEncodedTransactionData(signedOrders);
        return abiEncodedData;
    };
    /**
     * Encodes a cancelOrdersUpTo transaction.
     * @param  targetOrderEpoch Target order epoch.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.cancelOrdersUpToTx = function (targetOrderEpoch) {
        assert_1.assert.isBigNumber('targetOrderEpoch', targetOrderEpoch);
        var abiEncodedData = this._getExchangeContract().cancelOrdersUpTo.getABIEncodedTransactionData(targetOrderEpoch);
        return abiEncodedData;
    };
    /**
     * Encodes a cancelOrder transaction.
     * @param  order An object that conforms to the Order or SignedOrder interface. The order you would like to cancel.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.cancelOrderTx = function (order) {
        assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.orderSchema);
        var abiEncodedData = this._getExchangeContract().cancelOrder.getABIEncodedTransactionData(order);
        return abiEncodedData;
    };
    /**
     * Encodes a marketSellOrders transaction.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   takerAssetFillAmount Taker asset fill amount.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.marketSellOrdersTx = function (signedOrders, takerAssetFillAmount) {
        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
        assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
        var signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
        var abiEncodedData = this._getExchangeContract().marketSellOrders.getABIEncodedTransactionData(signedOrders, takerAssetFillAmount, signatures);
        return abiEncodedData;
    };
    /**
     * Encodes a marketSellOrdersNoThrow transaction.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   takerAssetFillAmount Taker asset fill amount.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.marketSellOrdersNoThrowTx = function (signedOrders, takerAssetFillAmount) {
        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
        assert_1.assert.isBigNumber('takerAssetFillAmount', takerAssetFillAmount);
        var signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
        var abiEncodedData = this._getExchangeContract().marketSellOrdersNoThrow.getABIEncodedTransactionData(signedOrders, takerAssetFillAmount, signatures);
        return abiEncodedData;
    };
    /**
     * Encodes a maketBuyOrders transaction.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   makerAssetFillAmount Maker asset fill amount.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.marketBuyOrdersTx = function (signedOrders, makerAssetFillAmount) {
        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
        assert_1.assert.isBigNumber('makerAssetFillAmount', makerAssetFillAmount);
        var signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
        var abiEncodedData = this._getExchangeContract().marketBuyOrders.getABIEncodedTransactionData(signedOrders, makerAssetFillAmount, signatures);
        return abiEncodedData;
    };
    /**
     * Encodes a maketBuyOrdersNoThrow transaction.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   makerAssetFillAmount Maker asset fill amount.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.marketBuyOrdersNoThrowTx = function (signedOrders, makerAssetFillAmount) {
        assert_1.assert.doesConformToSchema('signedOrders', signedOrders, json_schemas_1.schemas.signedOrdersSchema);
        assert_1.assert.isBigNumber('makerAssetFillAmount', makerAssetFillAmount);
        var signatures = _.map(signedOrders, function (signedOrder) { return signedOrder.signature; });
        var abiEncodedData = this._getExchangeContract().marketBuyOrdersNoThrow.getABIEncodedTransactionData(signedOrders, makerAssetFillAmount, signatures);
        return abiEncodedData;
    };
    /**
     * Encodes a preSign transaction.
     * @param hash          Hash to pre-sign
     * @param signerAddress Address that should have signed the given hash.
     * @param signature     Proof that the hash has been signed by signer.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.preSignTx = function (hash, signerAddress, signature) {
        assert_1.assert.isHexString('hash', hash);
        assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
        assert_1.assert.isHexString('signature', signature);
        var abiEncodedData = this._getExchangeContract().preSign.getABIEncodedTransactionData(hash, signerAddress, signature);
        return abiEncodedData;
    };
    /**
     * Encodes a setSignatureValidatorApproval transaction.
     * @param   validatorAddress        Validator contract address.
     * @param   isApproved              Boolean value to set approval to.
     * @return Hex encoded abi of the function call.
     */
    TransactionEncoder.prototype.setSignatureValidatorApprovalTx = function (validatorAddress, isApproved) {
        assert_1.assert.isETHAddressHex('validatorAddress', validatorAddress);
        assert_1.assert.isBoolean('isApproved', isApproved);
        var abiEncodedData = this._getExchangeContract().setSignatureValidatorApproval.getABIEncodedTransactionData(validatorAddress, isApproved);
        return abiEncodedData;
    };
    TransactionEncoder.prototype._getExchangeContract = function () {
        return this._exchangeInstance;
    };
    return TransactionEncoder;
}());
exports.TransactionEncoder = TransactionEncoder;
//# sourceMappingURL=transaction_encoder.js.map
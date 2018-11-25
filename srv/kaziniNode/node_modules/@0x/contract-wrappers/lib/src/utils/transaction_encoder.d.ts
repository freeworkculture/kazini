import { ExchangeContract } from '@0x/abi-gen-wrappers';
import { Order, SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
/**
 * Transaction Encoder. Transaction messages exist for the purpose of calling methods on the Exchange contract
 * in the context of another address. For example, UserA can encode and sign a fillOrder transaction and UserB
 * can submit this to the blockchain. The Exchange context executes as if UserA had directly submitted this transaction.
 */
export declare class TransactionEncoder {
    private readonly _exchangeInstance;
    constructor(exchangeInstance: ExchangeContract);
    /**
     * Encodes the transaction data for use with the Exchange contract.
     * @param data The ABI Encoded 0x Exchange method. I.e fillOrder
     * @param salt A random value to provide uniqueness and prevent replay attacks.
     * @param signerAddress The address which will sign this transaction.
     * @return An unsigned hex encoded transaction for use in 0x Exchange executeTransaction.
     */
    getTransactionHex(data: string, salt: BigNumber, signerAddress: string): string;
    /**
     * Encodes a fillOrder transaction.
     * @param  signedOrder           An object that conforms to the SignedOrder interface.
     * @param  takerAssetFillAmount  The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    fillOrderTx(signedOrder: SignedOrder, takerAssetFillAmount: BigNumber): string;
    /**
     * Encodes a fillOrderNoThrow transaction.
     * @param  signedOrder           An object that conforms to the SignedOrder interface.
     * @param  takerAssetFillAmount  The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    fillOrderNoThrowTx(signedOrder: SignedOrder, takerAssetFillAmount: BigNumber): string;
    /**
     * Encodes a fillOrKillOrder transaction.
     * @param  signedOrder           An object that conforms to the SignedOrder interface.
     * @param  takerAssetFillAmount  The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    fillOrKillOrderTx(signedOrder: SignedOrder, takerAssetFillAmount: BigNumber): string;
    /**
     * Encodes a batchFillOrders transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    batchFillOrdersTx(signedOrders: SignedOrder[], takerAssetFillAmounts: BigNumber[]): string;
    /**
     * Encodes a batchFillOrKillOrders transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    batchFillOrKillOrdersTx(signedOrders: SignedOrder[], takerAssetFillAmounts: BigNumber[]): string;
    /**
     * Encodes a batchFillOrdersNoThrow transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @return Hex encoded abi of the function call.
     */
    batchFillOrdersNoThrowTx(signedOrders: SignedOrder[], takerAssetFillAmounts: BigNumber[]): string;
    /**
     * Encodes a batchCancelOrders transaction.
     * @param   signedOrders An array of orders to cancel.
     * @return Hex encoded abi of the function call.
     */
    batchCancelOrdersTx(signedOrders: SignedOrder[]): string;
    /**
     * Encodes a cancelOrdersUpTo transaction.
     * @param  targetOrderEpoch Target order epoch.
     * @return Hex encoded abi of the function call.
     */
    cancelOrdersUpToTx(targetOrderEpoch: BigNumber): string;
    /**
     * Encodes a cancelOrder transaction.
     * @param  order An object that conforms to the Order or SignedOrder interface. The order you would like to cancel.
     * @return Hex encoded abi of the function call.
     */
    cancelOrderTx(order: Order | SignedOrder): string;
    /**
     * Encodes a marketSellOrders transaction.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   takerAssetFillAmount Taker asset fill amount.
     * @return Hex encoded abi of the function call.
     */
    marketSellOrdersTx(signedOrders: SignedOrder[], takerAssetFillAmount: BigNumber): string;
    /**
     * Encodes a marketSellOrdersNoThrow transaction.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   takerAssetFillAmount Taker asset fill amount.
     * @return Hex encoded abi of the function call.
     */
    marketSellOrdersNoThrowTx(signedOrders: SignedOrder[], takerAssetFillAmount: BigNumber): string;
    /**
     * Encodes a maketBuyOrders transaction.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   makerAssetFillAmount Maker asset fill amount.
     * @return Hex encoded abi of the function call.
     */
    marketBuyOrdersTx(signedOrders: SignedOrder[], makerAssetFillAmount: BigNumber): string;
    /**
     * Encodes a maketBuyOrdersNoThrow transaction.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   makerAssetFillAmount Maker asset fill amount.
     * @return Hex encoded abi of the function call.
     */
    marketBuyOrdersNoThrowTx(signedOrders: SignedOrder[], makerAssetFillAmount: BigNumber): string;
    /**
     * Encodes a preSign transaction.
     * @param hash          Hash to pre-sign
     * @param signerAddress Address that should have signed the given hash.
     * @param signature     Proof that the hash has been signed by signer.
     * @return Hex encoded abi of the function call.
     */
    preSignTx(hash: string, signerAddress: string, signature: string): string;
    /**
     * Encodes a setSignatureValidatorApproval transaction.
     * @param   validatorAddress        Validator contract address.
     * @param   isApproved              Boolean value to set approval to.
     * @return Hex encoded abi of the function call.
     */
    setSignatureValidatorApprovalTx(validatorAddress: string, isApproved: boolean): string;
    private _getExchangeContract;
}
//# sourceMappingURL=transaction_encoder.d.ts.map
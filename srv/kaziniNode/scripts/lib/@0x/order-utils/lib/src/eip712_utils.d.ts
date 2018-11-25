import { EIP712Object, EIP712TypedData, EIP712Types, Order, ZeroExTransaction } from '@0x/types';
export declare const eip712Utils: {
    /**
     * Creates a EIP712TypedData object specific to the 0x protocol for use with signTypedData.
     * @param   primaryType The primary type found in message
     * @param   types The additional types for the data in message
     * @param   message The contents of the message
     * @param   exchangeAddress The address of the exchange contract
     * @return  A typed data object
     */
    createTypedData: (primaryType: string, types: EIP712Types, message: EIP712Object, exchangeAddress: string) => EIP712TypedData;
    /**
     * Creates an Order EIP712TypedData object for use with signTypedData.
     * @param   Order the order
     * @return  A typed data object
     */
    createOrderTypedData: (order: Order) => EIP712TypedData;
    /**
     * Creates an ExecuteTransaction EIP712TypedData object for use with signTypedData and
     * 0x Exchange executeTransaction.
     * @param   ZeroExTransaction the 0x transaction
     * @param   exchangeAddress The address of the exchange contract
     * @return  A typed data object
     */
    createZeroExTransactionTypedData: (zeroExTransaction: ZeroExTransaction, exchangeAddress: string) => EIP712TypedData;
};
//# sourceMappingURL=eip712_utils.d.ts.map
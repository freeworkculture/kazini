import { ExchangeEventArgs, ExchangeEvents } from '@0x/abi-gen-wrappers';
import { AssetProxyId, Order, SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BlockRange, EventCallback, IndexedFilterValues, MethodOpts, OrderInfo, OrderTransactionOpts, ValidateOrderFillableOpts } from '../types';
import { TransactionEncoder } from '../utils/transaction_encoder';
import { ContractWrapper } from './contract_wrapper';
import { ERC20TokenWrapper } from './erc20_token_wrapper';
import { ERC721TokenWrapper } from './erc721_token_wrapper';
/**
 * This class includes all the functionality related to calling methods, sending transactions and subscribing to
 * events of the 0x V2 Exchange smart contract.
 */
export declare class ExchangeWrapper extends ContractWrapper {
    abi: ContractAbi;
    address: string;
    zrxTokenAddress: string;
    private _exchangeContractIfExists?;
    private readonly _erc721TokenWrapper;
    private readonly _erc20TokenWrapper;
    /**
     * Instantiate ExchangeWrapper
     * @param web3Wrapper Web3Wrapper instance to use.
     * @param networkId Desired networkId.
     * @param erc20TokenWrapper ERC20TokenWrapper instance to use.
     * @param erc721TokenWrapper ERC721TokenWrapper instance to use.
     * @param address The address of the Exchange contract. If undefined, will
     * default to the known address corresponding to the networkId.
     * @param zrxTokenAddress The address of the ZRXToken contract. If
     * undefined, will default to the known address corresponding to the
     * networkId.
     * @param blockPollingIntervalMs The block polling interval to use for active subscriptions.
     */
    constructor(web3Wrapper: Web3Wrapper, networkId: number, erc20TokenWrapper: ERC20TokenWrapper, erc721TokenWrapper: ERC721TokenWrapper, address?: string, zrxTokenAddress?: string, blockPollingIntervalMs?: number);
    /**
     * Retrieve the address of an asset proxy by signature.
     * @param   proxyId        The 4 bytes signature of an asset proxy
     * @param   methodOpts     Optional arguments this method accepts.
     * @return  The address of an asset proxy for a given signature
     */
    getAssetProxyBySignatureAsync(proxyId: AssetProxyId, methodOpts?: MethodOpts): Promise<string>;
    /**
     * Retrieve the takerAssetAmount of an order that has already been filled.
     * @param   orderHash    The hex encoded orderHash for which you would like to retrieve the filled takerAssetAmount.
     * @param   methodOpts   Optional arguments this method accepts.
     * @return  The amount of the order (in taker asset base units) that has already been filled.
     */
    getFilledTakerAssetAmountAsync(orderHash: string, methodOpts?: MethodOpts): Promise<BigNumber>;
    /**
     * Retrieve the exchange contract version
     * @param   methodOpts   Optional arguments this method accepts.
     * @return  Version
     */
    getVersionAsync(methodOpts?: MethodOpts): Promise<string>;
    /**
     * Retrieve the set order epoch for a given makerAddress & senderAddress pair.
     * Orders can be bulk cancelled by setting the order epoch to a value lower then the salt value of orders one wishes to cancel.
     * @param   makerAddress  Maker address
     * @param   senderAddress Sender address
     * @param   methodOpts    Optional arguments this method accepts.
     * @return  Order epoch. Defaults to 0.
     */
    getOrderEpochAsync(makerAddress: string, senderAddress: string, methodOpts?: MethodOpts): Promise<BigNumber>;
    /**
     * Check if an order has been cancelled. Order cancellations are binary
     * @param   orderHash    The hex encoded orderHash for which you would like to retrieve the cancelled takerAmount.
     * @param   methodOpts   Optional arguments this method accepts.
     * @return  Whether the order has been cancelled.
     */
    isCancelledAsync(orderHash: string, methodOpts?: MethodOpts): Promise<boolean>;
    /**
     * Fills a signed order with an amount denominated in baseUnits of the taker asset.
     * @param   signedOrder           An object that conforms to the SignedOrder interface.
     * @param   takerAssetFillAmount  The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress          The user Ethereum address who would like to fill this order. Must be available via the supplied
     *                                Provider provided at instantiation.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    fillOrderAsync(signedOrder: SignedOrder, takerAssetFillAmount: BigNumber, takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * No-throw version of fillOrderAsync. This version will not throw if the fill fails. This allows the caller to save gas at the expense of not knowing the reason the fill failed.
     * @param   signedOrder          An object that conforms to the SignedOrder interface.
     * @param   takerAssetFillAmount The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress         The user Ethereum address who would like to fill this order.
     *                               Must be available via the supplied Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    fillOrderNoThrowAsync(signedOrder: SignedOrder, takerAssetFillAmount: BigNumber, takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Attempts to fill a specific amount of an order. If the entire amount specified cannot be filled,
     * the fill order is abandoned.
     * @param   signedOrder          An object that conforms to the SignedOrder interface.
     * @param   takerAssetFillAmount The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress         The user Ethereum address who would like to fill this order. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    fillOrKillOrderAsync(signedOrder: SignedOrder, takerAssetFillAmount: BigNumber, takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Executes a 0x transaction. Transaction messages exist for the purpose of calling methods on the Exchange contract
     * in the context of another address (see [ZEIP18](https://github.com/0xProject/ZEIPs/issues/18)).
     * This is especially useful for implementing filter contracts.
     * @param   salt                  Salt
     * @param   signerAddress         Signer address
     * @param   data                  Transaction data
     * @param   signature             Signature
     * @param   senderAddress         Sender address
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    executeTransactionAsync(salt: BigNumber, signerAddress: string, data: string, signature: string, senderAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Batch version of fillOrderAsync. Executes multiple fills atomically in a single transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress          The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                                Provider provided at instantiation.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    batchFillOrdersAsync(signedOrders: SignedOrder[], takerAssetFillAmounts: BigNumber[], takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Synchronously executes multiple calls to fillOrder until total amount of makerAsset is bought by taker.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   makerAssetFillAmount Maker asset fill amount.
     * @param   takerAddress         The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    marketBuyOrdersAsync(signedOrders: SignedOrder[], makerAssetFillAmount: BigNumber, takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Synchronously executes multiple calls to fillOrder until total amount of makerAsset is bought by taker.
     * @param   signedOrders         An array of signed orders to fill.
     * @param   takerAssetFillAmount Taker asset fill amount.
     * @param   takerAddress         The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    marketSellOrdersAsync(signedOrders: SignedOrder[], takerAssetFillAmount: BigNumber, takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * No throw version of marketBuyOrdersAsync
     * @param   signedOrders         An array of signed orders to fill.
     * @param   makerAssetFillAmount Maker asset fill amount.
     * @param   takerAddress         The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    marketBuyOrdersNoThrowAsync(signedOrders: SignedOrder[], makerAssetFillAmount: BigNumber, takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * No throw version of marketSellOrdersAsync
     * @param   signedOrders         An array of signed orders to fill.
     * @param   takerAssetFillAmount Taker asset fill amount.
     * @param   takerAddress         The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                               Provider provided at instantiation.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    marketSellOrdersNoThrowAsync(signedOrders: SignedOrder[], takerAssetFillAmount: BigNumber, takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * No throw version of batchFillOrdersAsync
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress          The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                                Provider provided at instantiation.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    batchFillOrdersNoThrowAsync(signedOrders: SignedOrder[], takerAssetFillAmounts: BigNumber[], takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Batch version of fillOrKillOrderAsync. Executes multiple fills atomically in a single transaction.
     * @param   signedOrders          An array of signed orders to fill.
     * @param   takerAssetFillAmounts The amounts of the orders (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress          The user Ethereum address who would like to fill these orders. Must be available via the supplied
     *                                Provider provided at instantiation.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    batchFillOrKillOrdersAsync(signedOrders: SignedOrder[], takerAssetFillAmounts: BigNumber[], takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Batch version of cancelOrderAsync. Executes multiple cancels atomically in a single transaction.
     * @param   orders                An array of orders to cancel.
     * @param   orderTransactionOpts  Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    batchCancelOrdersAsync(orders: Array<Order | SignedOrder>, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Match two complementary orders that have a profitable spread.
     * Each order is filled at their respective price point. However, the calculations are carried out as though
     * the orders are both being filled at the right order's price point.
     * The profit made by the left order goes to the taker (whoever matched the two orders).
     * @param leftSignedOrder  First order to match.
     * @param rightSignedOrder Second order to match.
     * @param takerAddress     The address that sends the transaction and gets the spread.
     * @param orderTransactionOpts Optional arguments this method accepts.
     * @return Transaction hash.
     */
    matchOrdersAsync(leftSignedOrder: SignedOrder, rightSignedOrder: SignedOrder, takerAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Approves a hash on-chain using any valid signature type.
     * After presigning a hash, the preSign signature type will become valid for that hash and signer.
     * @param hash          Hash to pre-sign
     * @param signerAddress Address that should have signed the given hash.
     * @param signature     Proof that the hash has been signed by signer.
     * @param senderAddress Address that should send the transaction.
     * @param orderTransactionOpts Optional arguments this method accepts.
     * @returns Transaction hash.
     */
    preSignAsync(hash: string, signerAddress: string, signature: string, senderAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Checks if the signature is valid.
     * @param hash          Hash to pre-sign
     * @param signerAddress Address that should have signed the given hash.
     * @param signature     Proof that the hash has been signed by signer.
     * @param methodOpts    Optional arguments this method accepts.
     * @returns If the signature is valid
     */
    isValidSignatureAsync(hash: string, signerAddress: string, signature: string, methodOpts?: MethodOpts): Promise<boolean>;
    /**
     * Checks if the validator is allowed by the signer.
     * @param validatorAddress  Address of a validator
     * @param signerAddress     Address of a signer
     * @param methodOpts        Optional arguments this method accepts.
     * @returns If the validator is allowed
     */
    isAllowedValidatorAsync(signerAddress: string, validatorAddress: string, methodOpts?: MethodOpts): Promise<boolean>;
    /**
     * Check whether the hash is pre-signed on-chain.
     * @param hash          Hash to check if pre-signed
     * @param signerAddress Address that should have signed the given hash.
     * @param methodOpts    Optional arguments this method accepts.
     * @returns Whether the hash is pre-signed.
     */
    isPreSignedAsync(hash: string, signerAddress: string, methodOpts?: MethodOpts): Promise<boolean>;
    /**
     * Checks if transaction is already executed.
     * @param transactionHash  Transaction hash to check
     * @param signerAddress    Address that should have signed the given hash.
     * @param methodOpts       Optional arguments this method accepts.
     * @returns If transaction is already executed.
     */
    isTransactionExecutedAsync(transactionHash: string, methodOpts?: MethodOpts): Promise<boolean>;
    /**
     * Get order info
     * @param order         Order
     * @param methodOpts    Optional arguments this method accepts.
     * @returns Order info
     */
    getOrderInfoAsync(order: Order | SignedOrder, methodOpts?: MethodOpts): Promise<OrderInfo>;
    /**
     * Get order info for multiple orders
     * @param orders         Orders
     * @param methodOpts    Optional arguments this method accepts.
     * @returns Array of Order infos
     */
    getOrdersInfoAsync(orders: Array<Order | SignedOrder>, methodOpts?: MethodOpts): Promise<OrderInfo[]>;
    /**
     * Cancel a given order.
     * @param   order           An object that conforms to the Order or SignedOrder interface. The order you would like to cancel.
     * @param   orderTransactionOpts Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    cancelOrderAsync(order: Order | SignedOrder, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Sets the signature validator approval
     * @param   validatorAddress        Validator contract address.
     * @param   isApproved              Boolean value to set approval to.
     * @param   senderAddress           Sender address.
     * @param   orderTransactionOpts    Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    setSignatureValidatorApprovalAsync(validatorAddress: string, isApproved: boolean, senderAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Cancels all orders created by makerAddress with a salt less than or equal to the targetOrderEpoch
     * and senderAddress equal to msg.sender (or null address if msg.sender == makerAddress).
     * @param   targetOrderEpoch             Target order epoch.
     * @param   senderAddress                Address that should send the transaction.
     * @param   orderTransactionOpts         Optional arguments this method accepts.
     * @return  Transaction hash.
     */
    cancelOrdersUpToAsync(targetOrderEpoch: BigNumber, senderAddress: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Subscribe to an event type emitted by the Exchange contract.
     * @param   eventName           The exchange contract event you would like to subscribe to.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param   callback            Callback that gets called when a log is added/removed
     * @param   isVerbose           Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends ExchangeEventArgs>(eventName: ExchangeEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean): string;
    /**
     * Cancel a subscription
     * @param   subscriptionToken Subscription token returned by `subscribe()`
     */
    unsubscribe(subscriptionToken: string): void;
    /**
     * Cancels all existing subscriptions
     */
    unsubscribeAll(): void;
    /**
     * Gets historical logs without creating a subscription
     * @param   eventName           The exchange contract event you would like to subscribe to.
     * @param   blockRange          Block range to get logs from.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return  Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends ExchangeEventArgs>(eventName: ExchangeEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    /**
     * Validate if the supplied order is fillable, and throw if it isn't
     * @param signedOrder SignedOrder of interest
     * @param opts ValidateOrderFillableOpts options (e.g expectedFillTakerTokenAmount.
     * If it isn't supplied, we check if the order is fillable for a non-zero amount)
     */
    validateOrderFillableOrThrowAsync(signedOrder: SignedOrder, opts?: ValidateOrderFillableOpts): Promise<void>;
    /**
     * Validate a call to FillOrder and throw if it wouldn't succeed
     * @param signedOrder SignedOrder of interest
     * @param fillTakerAssetAmount Amount we'd like to fill the order for
     * @param takerAddress The taker of the order
     */
    validateFillOrderThrowIfInvalidAsync(signedOrder: SignedOrder, fillTakerAssetAmount: BigNumber, takerAddress: string): Promise<void>;
    /**
     * Returns the ZRX asset data used by the exchange contract.
     * @return ZRX asset data
     */
    getZRXAssetData(): string;
    /**
     * Returns a Transaction Encoder. Transaction messages exist for the purpose of calling methods on the Exchange contract
     * in the context of another address.
     * @return TransactionEncoder
     */
    transactionEncoderAsync(): Promise<TransactionEncoder>;
    private _getExchangeContractAsync;
}
//# sourceMappingURL=exchange_wrapper.d.ts.map
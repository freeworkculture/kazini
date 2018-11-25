import { ContractAddresses } from '@0x/contract-addresses';
import { SignedOrder, Stats } from '@0x/types';
import { Provider } from 'ethereum-types';
import { OnOrderStateChangeCallback, OrderWatcherConfig } from '../types';
/**
 * This class includes all the functionality related to watching a set of orders
 * for potential changes in order validity/fillability. The orderWatcher notifies
 * the subscriber of these changes so that a final decision can be made on whether
 * the order should be deemed invalid.
 */
export declare class OrderWatcher {
    private readonly _dependentOrderHashesTracker;
    private readonly _orderStateByOrderHashCache;
    private readonly _orderByOrderHash;
    private readonly _eventWatcher;
    private readonly _provider;
    private readonly _collisionResistantAbiDecoder;
    private readonly _expirationWatcher;
    private readonly _orderStateUtils;
    private readonly _orderFilledCancelledLazyStore;
    private readonly _balanceAndProxyAllowanceLazyStore;
    private readonly _cleanupJobInterval;
    private _cleanupJobIntervalIdIfExists?;
    private _callbackIfExists?;
    /**
     * Instantiate a new OrderWatcher
     * @param provider Web3 provider to use for JSON RPC calls
     * @param networkId NetworkId to watch orders on
     * @param contractAddresses Optional contract addresses. Defaults to known
     * addresses based on networkId.
     * @param partialConfig Optional configurations
     */
    constructor(provider: Provider, networkId: number, contractAddresses?: ContractAddresses, partialConfig?: Partial<OrderWatcherConfig>);
    /**
     * Add an order to the orderWatcher. Before the order is added, it's
     * signature is verified.
     * @param   signedOrder     The order you wish to start watching.
     */
    addOrderAsync(signedOrder: SignedOrder): Promise<void>;
    /**
     * Removes an order from the orderWatcher
     * @param   orderHash     The orderHash of the order you wish to stop watching.
     */
    removeOrder(orderHash: string): void;
    /**
     * Starts an orderWatcher subscription. The callback will be called every time a watched order's
     * backing blockchain state has changed. This is a call-to-action for the caller to re-validate the order.
     * @param   callback            Receives the orderHash of the order that should be re-validated, together
     *                              with all the order-relevant blockchain state needed to re-validate the order.
     */
    subscribe(callback: OnOrderStateChangeCallback): void;
    /**
     * Ends an orderWatcher subscription.
     */
    unsubscribe(): void;
    /**
     * Gets statistics of the OrderWatcher Instance.
     */
    getStats(): Stats;
    private _cleanupAsync;
    private _cleanupOrderRelatedState;
    private _onOrderExpired;
    private _onEventWatcherCallbackAsync;
    private _emitRevalidateOrdersAsync;
}
//# sourceMappingURL=order_watcher.d.ts.map
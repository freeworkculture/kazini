import { BigNumber } from '@0x/utils';
/**
 * This class includes the functionality to detect expired orders.
 * It stores them in a min heap by expiration time and checks for expired ones every `orderExpirationCheckingIntervalMs`
 */
export declare class ExpirationWatcher {
    private readonly _orderHashByExpirationRBTree;
    private readonly _expiration;
    private readonly _orderExpirationCheckingIntervalMs;
    private readonly _expirationMarginMs;
    private _orderExpirationCheckingIntervalIdIfExists?;
    constructor(expirationMarginIfExistsMs?: number, orderExpirationCheckingIntervalIfExistsMs?: number);
    subscribe(callback: (orderHash: string) => void): void;
    unsubscribe(): void;
    addOrder(orderHash: string, expirationUnixTimestampMs: BigNumber): void;
    removeOrder(orderHash: string): void;
    private _pruneExpiredOrders;
}
//# sourceMappingURL=expiration_watcher.d.ts.map
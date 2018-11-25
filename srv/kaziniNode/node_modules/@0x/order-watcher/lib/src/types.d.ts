import { OrderState } from '@0x/types';
import { LogEntryEvent } from 'ethereum-types';
export declare enum OrderWatcherError {
    SubscriptionAlreadyPresent = "SUBSCRIPTION_ALREADY_PRESENT",
    SubscriptionNotFound = "SUBSCRIPTION_NOT_FOUND"
}
export declare type EventWatcherCallback = (err: null | Error, log?: LogEntryEvent) => void;
/**
 * orderExpirationCheckingIntervalMs: How often to check for expired orders. Default=50.
 * eventPollingIntervalMs: How often to poll the Ethereum node for new events. Default=200.
 * expirationMarginMs: Amount of time before order expiry that you'd like to be notified
 * of an orders expiration. Default=0.
 * cleanupJobIntervalMs: How often to run a cleanup job which revalidates all the orders. Default=1hr.
 * isVerbose: Weather the order watcher should be verbose. Default=true.
 */
export interface OrderWatcherConfig {
    orderExpirationCheckingIntervalMs: number;
    eventPollingIntervalMs: number;
    expirationMarginMs: number;
    cleanupJobIntervalMs: number;
    isVerbose: boolean;
}
export declare type OnOrderStateChangeCallback = (err: Error | null, orderState?: OrderState) => void;
export declare enum InternalOrderWatcherError {
    NoAbiDecoder = "NO_ABI_DECODER",
    ZrxNotInTokenRegistry = "ZRX_NOT_IN_TOKEN_REGISTRY",
    WethNotInTokenRegistry = "WETH_NOT_IN_TOKEN_REGISTRY"
}
//# sourceMappingURL=types.d.ts.map
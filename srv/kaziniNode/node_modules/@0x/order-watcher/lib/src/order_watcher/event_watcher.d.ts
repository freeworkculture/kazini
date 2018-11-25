import { BlockParamLiteral, Provider } from 'ethereum-types';
import { EventWatcherCallback } from '../types';
/**
 * The EventWatcher watches for blockchain events at the specified block confirmation
 * depth.
 */
export declare class EventWatcher {
    private readonly _web3Wrapper;
    private readonly _isVerbose;
    private _blockAndLogStreamerIfExists;
    private _blockAndLogStreamIntervalIfExists?;
    private _onLogAddedSubscriptionToken;
    private _onLogRemovedSubscriptionToken;
    private readonly _pollingIntervalMs;
    constructor(provider: Provider, pollingIntervalIfExistsMs: undefined | number, stateLayer: BlockParamLiteral, isVerbose: boolean);
    subscribe(callback: EventWatcherCallback): void;
    unsubscribe(): void;
    private _startBlockAndLogStream;
    private _blockstreamGetBlockOrNullAsync;
    private _blockstreamGetLatestBlockOrNullAsync;
    private _blockstreamGetLogsAsync;
    private _stopBlockAndLogStream;
    private _onLogStateChangedAsync;
    private _reconcileBlockAsync;
    private _emitDifferencesAsync;
    private _onBlockAndLogStreamerError;
}
//# sourceMappingURL=event_watcher.d.ts.map
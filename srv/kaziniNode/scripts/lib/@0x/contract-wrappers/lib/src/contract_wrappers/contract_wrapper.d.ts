import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogEntry, LogWithDecodedArgs, RawLog } from 'ethereum-types';
import { BlockRange, ContractEventArgs, ContractEvents, EventCallback, IndexedFilterValues } from '../types';
export declare abstract class ContractWrapper {
    abstract abi: ContractAbi;
    protected _networkId: number;
    protected _web3Wrapper: Web3Wrapper;
    private _blockAndLogStreamerIfExists;
    private readonly _blockPollingIntervalMs;
    private _blockAndLogStreamIntervalIfExists?;
    private readonly _filters;
    private readonly _filterCallbacks;
    private _onLogAddedSubscriptionToken;
    private _onLogRemovedSubscriptionToken;
    private static _onBlockAndLogStreamerError;
    constructor(web3Wrapper: Web3Wrapper, networkId: number, blockPollingIntervalMs?: number);
    protected _unsubscribeAll(): void;
    protected _unsubscribe(filterToken: string, err?: Error): void;
    protected _subscribe<ArgsType extends ContractEventArgs>(address: string, eventName: ContractEvents, indexFilterValues: IndexedFilterValues, abi: ContractAbi, callback: EventCallback<ArgsType>, isVerbose?: boolean): string;
    protected _getLogsAsync<ArgsType extends ContractEventArgs>(address: string, eventName: ContractEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues, abi: ContractAbi): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    protected _tryToDecodeLogOrNoop<ArgsType extends ContractEventArgs>(log: LogEntry): LogWithDecodedArgs<ArgsType> | RawLog;
    private _onLogStateChanged;
    private _startBlockAndLogStream;
    private _blockstreamGetBlockOrNullAsync;
    private _blockstreamGetLatestBlockOrNullAsync;
    private _blockstreamGetLogsAsync;
    private _stopBlockAndLogStream;
    private _reconcileBlockAsync;
}
//# sourceMappingURL=contract_wrapper.d.ts.map
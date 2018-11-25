import { EventAbi, FilterObject, LogEntry } from 'ethereum-types';
import { BlockRange, ContractEvents, IndexedFilterValues } from '../types';
export declare const filterUtils: {
    generateUUID(): string;
    getFilter(address: string, eventName: ContractEvents, indexFilterValues: IndexedFilterValues, abi: import("ethereum-types").AbiDefinition[], blockRange?: BlockRange | undefined): FilterObject;
    getEventSignatureFromAbiByName(eventAbi: EventAbi): string;
    getTopicsForIndexedArgs(abi: EventAbi, indexFilterValues: IndexedFilterValues): (string | null)[];
    matchesFilter(log: LogEntry, filter: FilterObject): boolean;
    doesMatchTopics(logTopics: string[], filterTopics: (string | string[] | null)[]): boolean;
    matchesTopic(logTopic: string, filterTopic: string | string[] | null): boolean;
};
//# sourceMappingURL=filter_utils.d.ts.map
import { BaseContract } from '@0x/base-contract';
import { BlockParamLiteral, CallData, ContractAbi, ContractArtifact, DecodedLogArgs, Provider, TxData } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
export declare type ERC721ProxyEventArgs = ERC721ProxyAuthorizedAddressAddedEventArgs | ERC721ProxyAuthorizedAddressRemovedEventArgs;
export declare enum ERC721ProxyEvents {
    AuthorizedAddressAdded = "AuthorizedAddressAdded",
    AuthorizedAddressRemoved = "AuthorizedAddressRemoved"
}
export interface ERC721ProxyAuthorizedAddressAddedEventArgs extends DecodedLogArgs {
    target: string;
    caller: string;
}
export interface ERC721ProxyAuthorizedAddressRemovedEventArgs extends DecodedLogArgs {
    target: string;
    caller: string;
}
export declare class ERC721ProxyContract extends BaseContract {
    addAuthorizedAddress: {
        sendTransactionAsync(target: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(target: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(target: string): string;
        callAsync(target: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    authorities: {
        callAsync(index_0: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    removeAuthorizedAddress: {
        sendTransactionAsync(target: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(target: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(target: string): string;
        callAsync(target: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    owner: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    removeAuthorizedAddressAtIndex: {
        sendTransactionAsync(target: string, index: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(target: string, index: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(target: string, index: BigNumber): string;
        callAsync(target: string, index: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    getProxyId: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    authorized: {
        callAsync(index_0: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    getAuthorizedAddresses: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string[]>;
    };
    transferOwnership: {
        sendTransactionAsync(newOwner: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(newOwner: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(newOwner: string): string;
        callAsync(newOwner: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    static deployFrom0xArtifactAsync(artifact: ContractArtifact, provider: Provider, txDefaults: Partial<TxData>): Promise<ERC721ProxyContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, provider: Provider, txDefaults: Partial<TxData>): Promise<ERC721ProxyContract>;
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>);
}
//# sourceMappingURL=erc721_proxy.d.ts.map
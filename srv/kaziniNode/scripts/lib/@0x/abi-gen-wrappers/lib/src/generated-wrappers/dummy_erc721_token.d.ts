import { BaseContract } from '@0x/base-contract';
import { BlockParamLiteral, CallData, ContractAbi, ContractArtifact, DecodedLogArgs, Provider, TxData } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
export declare type DummyERC721TokenEventArgs = DummyERC721TokenTransferEventArgs | DummyERC721TokenApprovalEventArgs | DummyERC721TokenApprovalForAllEventArgs;
export declare enum DummyERC721TokenEvents {
    Transfer = "Transfer",
    Approval = "Approval",
    ApprovalForAll = "ApprovalForAll"
}
export interface DummyERC721TokenTransferEventArgs extends DecodedLogArgs {
    _from: string;
    _to: string;
    _tokenId: BigNumber;
}
export interface DummyERC721TokenApprovalEventArgs extends DecodedLogArgs {
    _owner: string;
    _approved: string;
    _tokenId: BigNumber;
}
export interface DummyERC721TokenApprovalForAllEventArgs extends DecodedLogArgs {
    _owner: string;
    _operator: string;
    _approved: boolean;
}
export declare class DummyERC721TokenContract extends BaseContract {
    name: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    getApproved: {
        callAsync(_tokenId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    approve: {
        sendTransactionAsync(_approved: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_approved: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_approved: string, _tokenId: BigNumber): string;
        callAsync(_approved: string, _tokenId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    transferFrom: {
        sendTransactionAsync(_from: string, _to: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_from: string, _to: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_from: string, _to: string, _tokenId: BigNumber): string;
        callAsync(_from: string, _to: string, _tokenId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    mint: {
        sendTransactionAsync(_to: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_to: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_to: string, _tokenId: BigNumber): string;
        callAsync(_to: string, _tokenId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    safeTransferFrom1: {
        sendTransactionAsync(_from: string, _to: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_from: string, _to: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_from: string, _to: string, _tokenId: BigNumber): string;
        callAsync(_from: string, _to: string, _tokenId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    ownerOf: {
        callAsync(_tokenId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    balanceOf: {
        callAsync(_owner: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    owner: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    symbol: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    burn: {
        sendTransactionAsync(_owner: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_owner: string, _tokenId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_owner: string, _tokenId: BigNumber): string;
        callAsync(_owner: string, _tokenId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    setApprovalForAll: {
        sendTransactionAsync(_operator: string, _approved: boolean, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_operator: string, _approved: boolean, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_operator: string, _approved: boolean): string;
        callAsync(_operator: string, _approved: boolean, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    safeTransferFrom2: {
        sendTransactionAsync(_from: string, _to: string, _tokenId: BigNumber, _data: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_from: string, _to: string, _tokenId: BigNumber, _data: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_from: string, _to: string, _tokenId: BigNumber, _data: string): string;
        callAsync(_from: string, _to: string, _tokenId: BigNumber, _data: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    isApprovedForAll: {
        callAsync(_owner: string, _operator: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    transferOwnership: {
        sendTransactionAsync(newOwner: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(newOwner: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(newOwner: string): string;
        callAsync(newOwner: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    static deployFrom0xArtifactAsync(artifact: ContractArtifact, provider: Provider, txDefaults: Partial<TxData>, _name: string, _symbol: string): Promise<DummyERC721TokenContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, provider: Provider, txDefaults: Partial<TxData>, _name: string, _symbol: string): Promise<DummyERC721TokenContract>;
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>);
}
//# sourceMappingURL=dummy_erc721_token.d.ts.map
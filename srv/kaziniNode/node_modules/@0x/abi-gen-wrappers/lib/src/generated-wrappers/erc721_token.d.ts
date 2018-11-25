import { BaseContract } from '@0x/base-contract';
import { BlockParamLiteral, CallData, ContractAbi, ContractArtifact, DecodedLogArgs, Provider, TxData } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
export declare type ERC721TokenEventArgs = ERC721TokenTransferEventArgs | ERC721TokenApprovalEventArgs | ERC721TokenApprovalForAllEventArgs;
export declare enum ERC721TokenEvents {
    Transfer = "Transfer",
    Approval = "Approval",
    ApprovalForAll = "ApprovalForAll"
}
export interface ERC721TokenTransferEventArgs extends DecodedLogArgs {
    _from: string;
    _to: string;
    _tokenId: BigNumber;
}
export interface ERC721TokenApprovalEventArgs extends DecodedLogArgs {
    _owner: string;
    _approved: string;
    _tokenId: BigNumber;
}
export interface ERC721TokenApprovalForAllEventArgs extends DecodedLogArgs {
    _owner: string;
    _operator: string;
    _approved: boolean;
}
export declare class ERC721TokenContract extends BaseContract {
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
    static deployFrom0xArtifactAsync(artifact: ContractArtifact, provider: Provider, txDefaults: Partial<TxData>): Promise<ERC721TokenContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, provider: Provider, txDefaults: Partial<TxData>): Promise<ERC721TokenContract>;
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>);
}
//# sourceMappingURL=erc721_token.d.ts.map
import { BaseContract } from '@0x/base-contract';
import { BlockParamLiteral, CallData, ContractAbi, ContractArtifact, DecodedLogArgs, Provider, TxData, TxDataPayable } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
export declare type WETH9EventArgs = WETH9ApprovalEventArgs | WETH9TransferEventArgs | WETH9DepositEventArgs | WETH9WithdrawalEventArgs;
export declare enum WETH9Events {
    Approval = "Approval",
    Transfer = "Transfer",
    Deposit = "Deposit",
    Withdrawal = "Withdrawal"
}
export interface WETH9ApprovalEventArgs extends DecodedLogArgs {
    _owner: string;
    _spender: string;
    _value: BigNumber;
}
export interface WETH9TransferEventArgs extends DecodedLogArgs {
    _from: string;
    _to: string;
    _value: BigNumber;
}
export interface WETH9DepositEventArgs extends DecodedLogArgs {
    _owner: string;
    _value: BigNumber;
}
export interface WETH9WithdrawalEventArgs extends DecodedLogArgs {
    _owner: string;
    _value: BigNumber;
}
export declare class WETH9Contract extends BaseContract {
    name: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    approve: {
        sendTransactionAsync(guy: string, wad: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(guy: string, wad: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(guy: string, wad: BigNumber): string;
        callAsync(guy: string, wad: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    totalSupply: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    transferFrom: {
        sendTransactionAsync(src: string, dst: string, wad: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(src: string, dst: string, wad: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(src: string, dst: string, wad: BigNumber): string;
        callAsync(src: string, dst: string, wad: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    withdraw: {
        sendTransactionAsync(wad: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(wad: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(wad: BigNumber): string;
        callAsync(wad: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    decimals: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<number>;
    };
    balanceOf: {
        callAsync(index_0: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    symbol: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    transfer: {
        sendTransactionAsync(dst: string, wad: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(dst: string, wad: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(dst: string, wad: BigNumber): string;
        callAsync(dst: string, wad: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    deposit: {
        sendTransactionAsync(txData?: Partial<TxDataPayable>): Promise<string>;
        estimateGasAsync(txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(): string;
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    allowance: {
        callAsync(index_0: string, index_1: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    static deployFrom0xArtifactAsync(artifact: ContractArtifact, provider: Provider, txDefaults: Partial<TxData>): Promise<WETH9Contract>;
    static deployAsync(bytecode: string, abi: ContractAbi, provider: Provider, txDefaults: Partial<TxData>): Promise<WETH9Contract>;
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>);
}
//# sourceMappingURL=weth9.d.ts.map
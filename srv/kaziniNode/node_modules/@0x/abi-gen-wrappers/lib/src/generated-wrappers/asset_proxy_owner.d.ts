import { BaseContract } from '@0x/base-contract';
import { BlockParamLiteral, CallData, ContractAbi, ContractArtifact, DecodedLogArgs, Provider, TxData } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
export declare type AssetProxyOwnerEventArgs = AssetProxyOwnerAssetProxyRegistrationEventArgs | AssetProxyOwnerConfirmationTimeSetEventArgs | AssetProxyOwnerTimeLockChangeEventArgs | AssetProxyOwnerConfirmationEventArgs | AssetProxyOwnerRevocationEventArgs | AssetProxyOwnerSubmissionEventArgs | AssetProxyOwnerExecutionEventArgs | AssetProxyOwnerExecutionFailureEventArgs | AssetProxyOwnerDepositEventArgs | AssetProxyOwnerOwnerAdditionEventArgs | AssetProxyOwnerOwnerRemovalEventArgs | AssetProxyOwnerRequirementChangeEventArgs;
export declare enum AssetProxyOwnerEvents {
    AssetProxyRegistration = "AssetProxyRegistration",
    ConfirmationTimeSet = "ConfirmationTimeSet",
    TimeLockChange = "TimeLockChange",
    Confirmation = "Confirmation",
    Revocation = "Revocation",
    Submission = "Submission",
    Execution = "Execution",
    ExecutionFailure = "ExecutionFailure",
    Deposit = "Deposit",
    OwnerAddition = "OwnerAddition",
    OwnerRemoval = "OwnerRemoval",
    RequirementChange = "RequirementChange"
}
export interface AssetProxyOwnerAssetProxyRegistrationEventArgs extends DecodedLogArgs {
    assetProxyContract: string;
    isRegistered: boolean;
}
export interface AssetProxyOwnerConfirmationTimeSetEventArgs extends DecodedLogArgs {
    transactionId: BigNumber;
    confirmationTime: BigNumber;
}
export interface AssetProxyOwnerTimeLockChangeEventArgs extends DecodedLogArgs {
    secondsTimeLocked: BigNumber;
}
export interface AssetProxyOwnerConfirmationEventArgs extends DecodedLogArgs {
    sender: string;
    transactionId: BigNumber;
}
export interface AssetProxyOwnerRevocationEventArgs extends DecodedLogArgs {
    sender: string;
    transactionId: BigNumber;
}
export interface AssetProxyOwnerSubmissionEventArgs extends DecodedLogArgs {
    transactionId: BigNumber;
}
export interface AssetProxyOwnerExecutionEventArgs extends DecodedLogArgs {
    transactionId: BigNumber;
}
export interface AssetProxyOwnerExecutionFailureEventArgs extends DecodedLogArgs {
    transactionId: BigNumber;
}
export interface AssetProxyOwnerDepositEventArgs extends DecodedLogArgs {
    sender: string;
    value: BigNumber;
}
export interface AssetProxyOwnerOwnerAdditionEventArgs extends DecodedLogArgs {
    owner: string;
}
export interface AssetProxyOwnerOwnerRemovalEventArgs extends DecodedLogArgs {
    owner: string;
}
export interface AssetProxyOwnerRequirementChangeEventArgs extends DecodedLogArgs {
    required: BigNumber;
}
export declare class AssetProxyOwnerContract extends BaseContract {
    owners: {
        callAsync(index_0: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    removeOwner: {
        sendTransactionAsync(owner: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(owner: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(owner: string): string;
        callAsync(owner: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    revokeConfirmation: {
        sendTransactionAsync(transactionId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(transactionId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(transactionId: BigNumber): string;
        callAsync(transactionId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    isOwner: {
        callAsync(index_0: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    confirmations: {
        callAsync(index_0: BigNumber, index_1: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    executeRemoveAuthorizedAddressAtIndex: {
        sendTransactionAsync(transactionId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(transactionId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(transactionId: BigNumber): string;
        callAsync(transactionId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    secondsTimeLocked: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    getTransactionCount: {
        callAsync(pending: boolean, executed: boolean, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    registerAssetProxy: {
        sendTransactionAsync(assetProxyContract: string, isRegistered: boolean, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(assetProxyContract: string, isRegistered: boolean, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(assetProxyContract: string, isRegistered: boolean): string;
        callAsync(assetProxyContract: string, isRegistered: boolean, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    addOwner: {
        sendTransactionAsync(owner: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(owner: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(owner: string): string;
        callAsync(owner: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    isConfirmed: {
        callAsync(transactionId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    changeTimeLock: {
        sendTransactionAsync(_secondsTimeLocked: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_secondsTimeLocked: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_secondsTimeLocked: BigNumber): string;
        callAsync(_secondsTimeLocked: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    isAssetProxyRegistered: {
        callAsync(index_0: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<boolean>;
    };
    getConfirmationCount: {
        callAsync(transactionId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    transactions: {
        callAsync(index_0: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<[string, BigNumber, string, boolean]>;
    };
    getOwners: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string[]>;
    };
    getTransactionIds: {
        callAsync(from: BigNumber, to: BigNumber, pending: boolean, executed: boolean, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber[]>;
    };
    getConfirmations: {
        callAsync(transactionId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string[]>;
    };
    transactionCount: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    changeRequirement: {
        sendTransactionAsync(_required: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(_required: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(_required: BigNumber): string;
        callAsync(_required: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    confirmTransaction: {
        sendTransactionAsync(transactionId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(transactionId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(transactionId: BigNumber): string;
        callAsync(transactionId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    submitTransaction: {
        sendTransactionAsync(destination: string, value: BigNumber, data: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(destination: string, value: BigNumber, data: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(destination: string, value: BigNumber, data: string): string;
        callAsync(destination: string, value: BigNumber, data: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    confirmationTimes: {
        callAsync(index_0: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    MAX_OWNER_COUNT: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    required: {
        callAsync(callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<BigNumber>;
    };
    replaceOwner: {
        sendTransactionAsync(owner: string, newOwner: string, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(owner: string, newOwner: string, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(owner: string, newOwner: string): string;
        callAsync(owner: string, newOwner: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    executeTransaction: {
        sendTransactionAsync(transactionId: BigNumber, txData?: Partial<TxData>): Promise<string>;
        estimateGasAsync(transactionId: BigNumber, txData?: Partial<TxData>): Promise<number>;
        getABIEncodedTransactionData(transactionId: BigNumber): string;
        callAsync(transactionId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<void>;
    };
    static deployFrom0xArtifactAsync(artifact: ContractArtifact, provider: Provider, txDefaults: Partial<TxData>, _owners: string[], _assetProxyContracts: string[], _required: BigNumber, _secondsTimeLocked: BigNumber): Promise<AssetProxyOwnerContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, provider: Provider, txDefaults: Partial<TxData>, _owners: string[], _assetProxyContracts: string[], _required: BigNumber, _secondsTimeLocked: BigNumber): Promise<AssetProxyOwnerContract>;
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>);
}
//# sourceMappingURL=asset_proxy_owner.d.ts.map
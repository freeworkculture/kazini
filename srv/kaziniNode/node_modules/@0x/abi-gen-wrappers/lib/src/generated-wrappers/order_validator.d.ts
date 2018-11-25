import { BaseContract } from '@0x/base-contract';
import { BlockParamLiteral, CallData, ContractAbi, ContractArtifact, Provider, TxData } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
export declare class OrderValidatorContract extends BaseContract {
    getOrderAndTraderInfo: {
        callAsync(order: {
            makerAddress: string;
            takerAddress: string;
            feeRecipientAddress: string;
            senderAddress: string;
            makerAssetAmount: BigNumber;
            takerAssetAmount: BigNumber;
            makerFee: BigNumber;
            takerFee: BigNumber;
            expirationTimeSeconds: BigNumber;
            salt: BigNumber;
            makerAssetData: string;
            takerAssetData: string;
        }, takerAddress: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<[{
            orderStatus: number;
            orderHash: string;
            orderTakerAssetFilledAmount: BigNumber;
        }, {
            makerBalance: BigNumber;
            makerAllowance: BigNumber;
            takerBalance: BigNumber;
            takerAllowance: BigNumber;
            makerZrxBalance: BigNumber;
            makerZrxAllowance: BigNumber;
            takerZrxBalance: BigNumber;
            takerZrxAllowance: BigNumber;
        }]>;
    };
    getBalanceAndAllowance: {
        callAsync(target: string, assetData: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<[BigNumber, BigNumber]>;
    };
    getOrdersAndTradersInfo: {
        callAsync(orders: {
            makerAddress: string;
            takerAddress: string;
            feeRecipientAddress: string;
            senderAddress: string;
            makerAssetAmount: BigNumber;
            takerAssetAmount: BigNumber;
            makerFee: BigNumber;
            takerFee: BigNumber;
            expirationTimeSeconds: BigNumber;
            salt: BigNumber;
            makerAssetData: string;
            takerAssetData: string;
        }[], takerAddresses: string[], callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<[{
            orderStatus: number;
            orderHash: string;
            orderTakerAssetFilledAmount: BigNumber;
        }[], {
            makerBalance: BigNumber;
            makerAllowance: BigNumber;
            takerBalance: BigNumber;
            takerAllowance: BigNumber;
            makerZrxBalance: BigNumber;
            makerZrxAllowance: BigNumber;
            takerZrxBalance: BigNumber;
            takerZrxAllowance: BigNumber;
        }[]]>;
    };
    getTradersInfo: {
        callAsync(orders: {
            makerAddress: string;
            takerAddress: string;
            feeRecipientAddress: string;
            senderAddress: string;
            makerAssetAmount: BigNumber;
            takerAssetAmount: BigNumber;
            makerFee: BigNumber;
            takerFee: BigNumber;
            expirationTimeSeconds: BigNumber;
            salt: BigNumber;
            makerAssetData: string;
            takerAssetData: string;
        }[], takerAddresses: string[], callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<{
            makerBalance: BigNumber;
            makerAllowance: BigNumber;
            takerBalance: BigNumber;
            takerAllowance: BigNumber;
            makerZrxBalance: BigNumber;
            makerZrxAllowance: BigNumber;
            takerZrxBalance: BigNumber;
            takerZrxAllowance: BigNumber;
        }[]>;
    };
    getERC721TokenOwner: {
        callAsync(token: string, tokenId: BigNumber, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<string>;
    };
    getBalancesAndAllowances: {
        callAsync(target: string, assetData: string[], callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<[BigNumber[], BigNumber[]]>;
    };
    getTraderInfo: {
        callAsync(order: {
            makerAddress: string;
            takerAddress: string;
            feeRecipientAddress: string;
            senderAddress: string;
            makerAssetAmount: BigNumber;
            takerAssetAmount: BigNumber;
            makerFee: BigNumber;
            takerFee: BigNumber;
            expirationTimeSeconds: BigNumber;
            salt: BigNumber;
            makerAssetData: string;
            takerAssetData: string;
        }, takerAddress: string, callData?: Partial<CallData>, defaultBlock?: number | BlockParamLiteral | undefined): Promise<{
            makerBalance: BigNumber;
            makerAllowance: BigNumber;
            takerBalance: BigNumber;
            takerAllowance: BigNumber;
            makerZrxBalance: BigNumber;
            makerZrxAllowance: BigNumber;
            takerZrxBalance: BigNumber;
            takerZrxAllowance: BigNumber;
        }>;
    };
    static deployFrom0xArtifactAsync(artifact: ContractArtifact, provider: Provider, txDefaults: Partial<TxData>, _exchange: string, _zrxAssetData: string): Promise<OrderValidatorContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, provider: Provider, txDefaults: Partial<TxData>, _exchange: string, _zrxAssetData: string): Promise<OrderValidatorContract>;
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>);
}
//# sourceMappingURL=order_validator.d.ts.map
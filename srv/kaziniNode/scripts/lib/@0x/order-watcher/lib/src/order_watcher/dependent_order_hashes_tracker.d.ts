import { SignedOrder } from '@0x/types';
export interface OrderHashesByMakerAddress {
    [makerAddress: string]: Set<string>;
}
export interface OrderHashesByERC20ByMakerAddress {
    [makerAddress: string]: {
        [erc20TokenAddress: string]: Set<string>;
    };
}
export interface OrderHashesByERC721AddressByTokenIdByMakerAddress {
    [makerAddress: string]: {
        [erc721TokenAddress: string]: {
            [erc721TokenId: string]: Set<string>;
        };
    };
}
/**
 */
export declare class DependentOrderHashesTracker {
    private readonly _zrxTokenAddress;
    private readonly _orderHashesByMakerAddress;
    private readonly _orderHashesByERC20ByMakerAddress;
    private readonly _orderHashesByERC721AddressByTokenIdByMakerAddress;
    constructor(zrxTokenAddress: string);
    getDependentOrderHashesByERC721ByMaker(makerAddress: string, tokenAddress: string): string[];
    getDependentOrderHashesByMaker(makerAddress: string): string[];
    getDependentOrderHashesByAssetDataByMaker(makerAddress: string, assetData: string): string[];
    addToDependentOrderHashes(signedOrder: SignedOrder): void;
    removeFromDependentOrderHashes(signedOrder: SignedOrder): void;
    private _getDependentOrderHashesByERC20AssetData;
    private _getDependentOrderHashesByERC721AssetData;
    private _addToERC20DependentOrderHashes;
    private _addToERC721DependentOrderHashes;
    private _addToMakerDependentOrderHashes;
    private _removeFromERC20DependentOrderhashes;
    private _removeFromERC721DependentOrderhashes;
    private _removeFromMakerDependentOrderhashes;
}
//# sourceMappingURL=dependent_order_hashes_tracker.d.ts.map
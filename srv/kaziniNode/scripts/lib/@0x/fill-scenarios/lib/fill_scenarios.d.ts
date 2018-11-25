import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { Provider } from 'ethereum-types';
export declare class FillScenarios {
    private readonly _web3Wrapper;
    private readonly _userAddresses;
    private readonly _coinbase;
    private readonly _zrxTokenAddress;
    private readonly _exchangeAddress;
    private readonly _erc20ProxyAddress;
    private readonly _erc721ProxyAddress;
    constructor(provider: Provider, userAddresses: string[], zrxTokenAddress: string, exchangeAddress: string, erc20ProxyAddress: string, erc721ProxyAddress: string);
    createFillableSignedOrderAsync(makerAssetData: string, takerAssetData: string, makerAddress: string, takerAddress: string, fillableAmount: BigNumber, expirationTimeSeconds?: BigNumber): Promise<SignedOrder>;
    createFillableSignedOrderWithFeesAsync(makerAssetData: string, takerAssetData: string, makerFee: BigNumber, takerFee: BigNumber, makerAddress: string, takerAddress: string, fillableAmount: BigNumber, feeRecipientAddress: string, expirationTimeSeconds?: BigNumber): Promise<SignedOrder>;
    createAsymmetricFillableSignedOrderAsync(makerAssetData: string, takerAssetData: string, makerAddress: string, takerAddress: string, makerFillableAmount: BigNumber, takerFillableAmount: BigNumber, expirationTimeSeconds?: BigNumber): Promise<SignedOrder>;
    createPartiallyFilledSignedOrderAsync(makerAssetData: string, takerAssetData: string, takerAddress: string, fillableAmount: BigNumber, partialFillAmount: BigNumber): Promise<SignedOrder>;
    private _createAsymmetricFillableSignedOrderWithFeesAsync;
    private _increaseERC721BalanceAndAllowanceAsync;
    private _increaseERC721AllowanceAsync;
    private _increaseERC721BalanceAsync;
    private _increaseERC20BalanceAndAllowanceAsync;
    private _increaseERC20BalanceAsync;
    private _increaseERC20AllowanceAsync;
}
//# sourceMappingURL=fill_scenarios.d.ts.map
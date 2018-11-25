import { AbstractBalanceAndProxyAllowanceFetcher } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import { BlockParamLiteral } from 'ethereum-types';
import { ERC20TokenWrapper } from '../contract_wrappers/erc20_token_wrapper';
import { ERC721TokenWrapper } from '../contract_wrappers/erc721_token_wrapper';
export declare class AssetBalanceAndProxyAllowanceFetcher implements AbstractBalanceAndProxyAllowanceFetcher {
    private readonly _erc20Token;
    private readonly _erc721Token;
    private readonly _stateLayer;
    constructor(erc20Token: ERC20TokenWrapper, erc721Token: ERC721TokenWrapper, stateLayer: BlockParamLiteral);
    getBalanceAsync(assetData: string, userAddress: string): Promise<BigNumber>;
    getProxyAllowanceAsync(assetData: string, userAddress: string): Promise<BigNumber>;
}
//# sourceMappingURL=asset_balance_and_proxy_allowance_fetcher.d.ts.map
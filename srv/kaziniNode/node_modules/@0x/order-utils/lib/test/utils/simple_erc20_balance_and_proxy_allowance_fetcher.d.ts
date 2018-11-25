import { ERC20TokenContract } from '@0x/abi-gen-wrappers';
import { BigNumber } from '@0x/utils';
import { AbstractBalanceAndProxyAllowanceFetcher } from '../../src/abstract/abstract_balance_and_proxy_allowance_fetcher';
export declare class SimpleERC20BalanceAndProxyAllowanceFetcher implements AbstractBalanceAndProxyAllowanceFetcher {
    private readonly _erc20TokenContract;
    private readonly _erc20ProxyAddress;
    constructor(erc20TokenWrapper: ERC20TokenContract, erc20ProxyAddress: string);
    getBalanceAsync(_assetData: string, userAddress: string): Promise<BigNumber>;
    getProxyAllowanceAsync(_assetData: string, userAddress: string): Promise<BigNumber>;
}
//# sourceMappingURL=simple_erc20_balance_and_proxy_allowance_fetcher.d.ts.map
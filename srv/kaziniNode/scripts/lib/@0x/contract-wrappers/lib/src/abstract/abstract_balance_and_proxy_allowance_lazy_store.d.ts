import { BigNumber } from '@0x/utils';
export declare abstract class AbstractBalanceAndProxyAllowanceLazyStore {
    abstract getBalanceAsync(tokenAddress: string, userAddress: string): Promise<BigNumber>;
    abstract getProxyAllowanceAsync(tokenAddress: string, userAddress: string): Promise<BigNumber>;
    abstract setBalance(tokenAddress: string, userAddress: string, balance: BigNumber): void;
    abstract deleteBalance(tokenAddress: string, userAddress: string): void;
    abstract setProxyAllowance(tokenAddress: string, userAddress: string, proxyAllowance: BigNumber): void;
    abstract deleteProxyAllowance(tokenAddress: string, userAddress: string): void;
    abstract deleteAll(): void;
}
//# sourceMappingURL=abstract_balance_and_proxy_allowance_lazy_store.d.ts.map
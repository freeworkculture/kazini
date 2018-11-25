import { BigNumber } from '@0x/utils';
import { AbstractBalanceAndProxyAllowanceLazyStore } from '../abstract/abstract_balance_and_proxy_allowance_lazy_store';
import { TradeSide, TransferType } from '../types';
export declare class ExchangeTransferSimulator {
    private readonly _store;
    private static _throwValidationError;
    constructor(store: AbstractBalanceAndProxyAllowanceLazyStore);
    /**
     * Simulates transferFrom call performed by a proxy
     * @param  tokenAddress      Address of the token to be transferred
     * @param  from              Owner of the transferred tokens
     * @param  to                Recipient of the transferred tokens
     * @param  amountInBaseUnits The amount of tokens being transferred
     * @param  tradeSide         Is Maker/Taker transferring
     * @param  transferType      Is it a fee payment or a value transfer
     */
    transferFromAsync(tokenAddress: string, from: string, to: string, amountInBaseUnits: BigNumber, tradeSide: TradeSide, transferType: TransferType): Promise<void>;
    private _decreaseProxyAllowanceAsync;
    private _increaseBalanceAsync;
    private _decreaseBalanceAsync;
}
//# sourceMappingURL=exchange_transfer_simulator.d.ts.map
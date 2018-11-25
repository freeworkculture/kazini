import { AbstractOrderFilledCancelledFetcher } from '@0x/order-utils';
import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { BlockParamLiteral } from 'ethereum-types';
import { ExchangeWrapper } from '../contract_wrappers/exchange_wrapper';
export declare class OrderFilledCancelledFetcher implements AbstractOrderFilledCancelledFetcher {
    private readonly _exchange;
    private readonly _stateLayer;
    constructor(exchange: ExchangeWrapper, stateLayer: BlockParamLiteral);
    getFilledTakerAmountAsync(orderHash: string): Promise<BigNumber>;
    isOrderCancelledAsync(signedOrder: SignedOrder): Promise<boolean>;
    getZRXAssetData(): string;
}
//# sourceMappingURL=order_filled_cancelled_fetcher.d.ts.map
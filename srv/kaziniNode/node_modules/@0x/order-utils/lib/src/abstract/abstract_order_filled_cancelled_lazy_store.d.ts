import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
export declare abstract class AbstractOrderFilledCancelledLazyStore {
    abstract getFilledTakerAmountAsync(orderHash: string): Promise<BigNumber>;
    abstract getIsCancelledAsync(signedOrder: SignedOrder): Promise<boolean>;
    abstract setFilledTakerAmount(orderHash: string, balance: BigNumber): void;
    abstract deleteFilledTakerAmount(orderHash: string): void;
    abstract setIsCancelled(orderHash: string, isCancelled: boolean): void;
    abstract deleteIsCancelled(orderHash: string): void;
    abstract deleteAll(): void;
    abstract getZRXAssetData(): string;
}
//# sourceMappingURL=abstract_order_filled_cancelled_lazy_store.d.ts.map
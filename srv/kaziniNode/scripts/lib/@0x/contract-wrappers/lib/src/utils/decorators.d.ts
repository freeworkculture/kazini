import { AsyncMethod, SyncMethod } from '../types';
export declare const decorators: {
    asyncZeroExErrorHandler: (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<AsyncMethod>) => TypedPropertyDescriptor<AsyncMethod>;
    syncZeroExErrorHandler: (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<SyncMethod>) => TypedPropertyDescriptor<SyncMethod>;
};
//# sourceMappingURL=decorators.d.ts.map
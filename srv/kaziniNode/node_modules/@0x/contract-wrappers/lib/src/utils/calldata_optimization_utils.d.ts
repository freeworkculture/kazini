import { SignedOrder } from '@0x/types';
export declare const calldataOptimizationUtils: {
    /**
     * Takes an array of orders and outputs an array of equivalent orders where all takerAssetData are '0x' and
     * all makerAssetData are '0x' except for that of the first order, which retains its original value
     * @param   orders         An array of SignedOrder objects
     * @returns optimized orders
     */
    optimizeForwarderOrders(orders: SignedOrder[]): SignedOrder[];
    /**
     * Takes an array of orders and outputs an array of equivalent orders where all takerAssetData are '0x' and
     * all makerAssetData are '0x'
     * @param   orders         An array of SignedOrder objects
     * @returns optimized orders
     */
    optimizeForwarderFeeOrders(orders: SignedOrder[]): SignedOrder[];
};
//# sourceMappingURL=calldata_optimization_utils.d.ts.map
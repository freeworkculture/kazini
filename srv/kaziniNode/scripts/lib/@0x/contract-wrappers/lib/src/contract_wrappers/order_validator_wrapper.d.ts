import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BalanceAndAllowance, OrderAndTraderInfo, TraderInfo } from '../types';
import { ContractWrapper } from './contract_wrapper';
/**
 * This class includes the functionality related to interacting with the OrderValidator contract.
 */
export declare class OrderValidatorWrapper extends ContractWrapper {
    abi: ContractAbi;
    address: string;
    private _orderValidatorContractIfExists?;
    /**
     * Instantiate OrderValidatorWrapper
     * @param web3Wrapper Web3Wrapper instance to use.
     * @param networkId Desired networkId.
     * @param address The address of the OrderValidator contract. If undefined,
     * will default to the known address corresponding to the networkId.
     */
    constructor(web3Wrapper: Web3Wrapper, networkId: number, address?: string);
    /**
     * Get an object conforming to OrderAndTraderInfo containing on-chain information of the provided order and address
     * @param   order           An object conforming to SignedOrder
     * @param   takerAddress    An ethereum address
     * @return  OrderAndTraderInfo
     */
    getOrderAndTraderInfoAsync(order: SignedOrder, takerAddress: string): Promise<OrderAndTraderInfo>;
    /**
     * Get an array of objects conforming to OrderAndTraderInfo containing on-chain information of the provided orders and addresses
     * @param   orders          An array of objects conforming to SignedOrder
     * @param   takerAddresses  An array of ethereum addresses
     * @return  array of OrderAndTraderInfo
     */
    getOrdersAndTradersInfoAsync(orders: SignedOrder[], takerAddresses: string[]): Promise<OrderAndTraderInfo[]>;
    /**
     * Get an object conforming to TraderInfo containing on-chain balance and allowances for maker and taker of order
     * @param   order           An object conforming to SignedOrder
     * @param   takerAddress    An ethereum address
     * @return  TraderInfo
     */
    getTraderInfoAsync(order: SignedOrder, takerAddress: string): Promise<TraderInfo>;
    /**
     * Get an array of objects conforming to TraderInfo containing on-chain balance and allowances for maker and taker of order
     * @param   orders          An array of objects conforming to SignedOrder
     * @param   takerAddresses  An array of ethereum addresses
     * @return  array of TraderInfo
     */
    getTradersInfoAsync(orders: SignedOrder[], takerAddresses: string[]): Promise<TraderInfo[]>;
    /**
     * Get an object conforming to BalanceAndAllowance containing on-chain balance and allowance for some address and assetData
     * @param   address     An ethereum address
     * @param   assetData   An encoded string that can be decoded by a specified proxy contract
     * @return  BalanceAndAllowance
     */
    getBalanceAndAllowanceAsync(address: string, assetData: string): Promise<BalanceAndAllowance>;
    /**
     * Get an array of objects conforming to BalanceAndAllowance containing on-chain balance and allowance for some address and array of assetDatas
     * @param   address     An ethereum address
     * @param   assetDatas  An array of encoded strings that can be decoded by a specified proxy contract
     * @return  BalanceAndAllowance
     */
    getBalancesAndAllowancesAsync(address: string, assetDatas: string[]): Promise<BalanceAndAllowance[]>;
    /**
     * Get owner address of tokenId by calling `token.ownerOf(tokenId)`, but returns a null owner instead of reverting on an unowned token.
     * @param   tokenAddress    An ethereum address
     * @param   tokenId         An ERC721 tokenId
     * @return  Owner of tokenId or null address if unowned
     */
    getERC721TokenOwnerAsync(tokenAddress: string, tokenId: BigNumber): Promise<string | undefined>;
    private _getOrderValidatorContractAsync;
}
//# sourceMappingURL=order_validator_wrapper.d.ts.map
import { AssetProxyId } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { ContractWrapper } from './contract_wrapper';
/**
 * This class includes the functionality related to interacting with the ERC721Proxy contract.
 */
export declare class ERC721ProxyWrapper extends ContractWrapper {
    abi: ContractAbi;
    address: string;
    private _erc721ProxyContractIfExists?;
    /**
     * Instantiate ERC721ProxyWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param networkId Desired networkId
     * @param address The address of the ERC721Proxy contract. If undefined,
     * will default to the known address corresponding to the networkId.
     */
    constructor(web3Wrapper: Web3Wrapper, networkId: number, address?: string);
    /**
     * Get the 4 bytes ID of this asset proxy
     * @return  Proxy id
     */
    getProxyIdAsync(): Promise<AssetProxyId>;
    /**
     * Check if the Exchange contract address is authorized by the ERC721Proxy contract.
     * @param   exchangeContractAddress     The hex encoded address of the Exchange contract to call.
     * @return  Whether the exchangeContractAddress is authorized.
     */
    isAuthorizedAsync(exchangeContractAddress: string): Promise<boolean>;
    /**
     * Get the list of all Exchange contract addresses authorized by the ERC721Proxy contract.
     * @return  The list of authorized addresses.
     */
    getAuthorizedAddressesAsync(): Promise<string[]>;
    private _getERC721ProxyContract;
}
//# sourceMappingURL=erc721_proxy_wrapper.d.ts.map
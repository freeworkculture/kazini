export interface ContractAddresses {
    erc20Proxy: string;
    erc721Proxy: string;
    zrxToken: string;
    etherToken: string;
    exchange: string;
    assetProxyOwner: string;
    forwarder: string;
    orderValidator: string;
}
export declare enum NetworkId {
    Mainnet = 1,
    Ropsten = 3,
    Kovan = 42
}
/**
 * Used to get addresses of contracts that have been deployed to either the
 * Ethereum mainnet or a supported testnet. Throws if there are no known
 * contracts deployed on the corresponding network.
 * @param networkId The desired networkId.
 * @returns The set of addresses for contracts which have been deployed on the
 * given networkId.
 */
export declare function getContractAddressesForNetworkOrThrow(networkId: NetworkId): ContractAddresses;
//# sourceMappingURL=index.d.ts.map
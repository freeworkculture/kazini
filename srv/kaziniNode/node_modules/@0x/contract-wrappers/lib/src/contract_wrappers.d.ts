import { Provider } from 'ethereum-types';
import { ERC20ProxyWrapper } from './contract_wrappers/erc20_proxy_wrapper';
import { ERC20TokenWrapper } from './contract_wrappers/erc20_token_wrapper';
import { ERC721ProxyWrapper } from './contract_wrappers/erc721_proxy_wrapper';
import { ERC721TokenWrapper } from './contract_wrappers/erc721_token_wrapper';
import { EtherTokenWrapper } from './contract_wrappers/ether_token_wrapper';
import { ExchangeWrapper } from './contract_wrappers/exchange_wrapper';
import { ForwarderWrapper } from './contract_wrappers/forwarder_wrapper';
import { OrderValidatorWrapper } from './contract_wrappers/order_validator_wrapper';
import { ContractWrappersConfig } from './types';
/**
 * The ContractWrappers class contains smart contract wrappers helpful when building on 0x protocol.
 */
export declare class ContractWrappers {
    /**
     * An instance of the ExchangeWrapper class containing methods for interacting with the 0x Exchange smart contract.
     */
    exchange: ExchangeWrapper;
    /**
     * An instance of the ERC20TokenWrapper class containing methods for interacting with any ERC20 token smart contract.
     */
    erc20Token: ERC20TokenWrapper;
    /**
     * An instance of the ERC721TokenWrapper class containing methods for interacting with any ERC721 token smart contract.
     */
    erc721Token: ERC721TokenWrapper;
    /**
     * An instance of the EtherTokenWrapper class containing methods for interacting with the
     * wrapped ETH ERC20 token smart contract.
     */
    etherToken: EtherTokenWrapper;
    /**
     * An instance of the ERC20ProxyWrapper class containing methods for interacting with the
     * erc20Proxy smart contract.
     */
    erc20Proxy: ERC20ProxyWrapper;
    /**
     * An instance of the ERC721ProxyWrapper class containing methods for interacting with the
     * erc721Proxy smart contract.
     */
    erc721Proxy: ERC721ProxyWrapper;
    /**
     * An instance of the ForwarderWrapper class containing methods for interacting with any Forwarder smart contract.
     */
    forwarder: ForwarderWrapper;
    /**
     * An instance of the OrderValidatorWrapper class containing methods for interacting with any OrderValidator smart contract.
     */
    orderValidator: OrderValidatorWrapper;
    private readonly _web3Wrapper;
    /**
     * Instantiates a new ContractWrappers instance.
     * @param   provider    The Provider instance you would like the contract-wrappers library to use for interacting with
     *                      the Ethereum network.
     * @param   config      The configuration object. Look up the type for the description.
     * @return  An instance of the ContractWrappers class.
     */
    constructor(provider: Provider, config: ContractWrappersConfig);
    /**
     * Unsubscribes from all subscriptions for all contracts.
     */
    unsubscribeAll(): void;
    /**
     * Get the provider instance currently used by contract-wrappers
     * @return  Web3 provider instance
     */
    getProvider(): Provider;
}
//# sourceMappingURL=contract_wrappers.d.ts.map
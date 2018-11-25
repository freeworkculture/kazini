"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var contract_artifacts_1 = require("@0x/contract-artifacts");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var _ = require("lodash");
var erc20_proxy_wrapper_1 = require("./contract_wrappers/erc20_proxy_wrapper");
var erc20_token_wrapper_1 = require("./contract_wrappers/erc20_token_wrapper");
var erc721_proxy_wrapper_1 = require("./contract_wrappers/erc721_proxy_wrapper");
var erc721_token_wrapper_1 = require("./contract_wrappers/erc721_token_wrapper");
var ether_token_wrapper_1 = require("./contract_wrappers/ether_token_wrapper");
var exchange_wrapper_1 = require("./contract_wrappers/exchange_wrapper");
var forwarder_wrapper_1 = require("./contract_wrappers/forwarder_wrapper");
var order_validator_wrapper_1 = require("./contract_wrappers/order_validator_wrapper");
var contract_wrappers_config_schema_1 = require("./schemas/contract_wrappers_config_schema");
var assert_1 = require("./utils/assert");
var constants_1 = require("./utils/constants");
var contract_addresses_1 = require("./utils/contract_addresses");
/**
 * The ContractWrappers class contains smart contract wrappers helpful when building on 0x protocol.
 */
var ContractWrappers = /** @class */ (function () {
    /**
     * Instantiates a new ContractWrappers instance.
     * @param   provider    The Provider instance you would like the contract-wrappers library to use for interacting with
     *                      the Ethereum network.
     * @param   config      The configuration object. Look up the type for the description.
     * @return  An instance of the ContractWrappers class.
     */
    function ContractWrappers(provider, config) {
        var _this = this;
        assert_1.assert.isWeb3Provider('provider', provider);
        assert_1.assert.doesConformToSchema('config', config, contract_wrappers_config_schema_1.ContractWrappersConfigSchema);
        var txDefaults = {
            gasPrice: config.gasPrice,
        };
        this._web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider, txDefaults);
        var artifactsArray = [
            contract_artifacts_1.ERC20Proxy,
            contract_artifacts_1.ERC20Token,
            contract_artifacts_1.ERC721Proxy,
            contract_artifacts_1.ERC721Token,
            contract_artifacts_1.Exchange,
            contract_artifacts_1.Forwarder,
            contract_artifacts_1.OrderValidator,
            contract_artifacts_1.WETH9,
        ];
        _.forEach(artifactsArray, function (artifact) {
            _this._web3Wrapper.abiDecoder.addABI(artifact.compilerOutput.abi);
        });
        var blockPollingIntervalMs = _.isUndefined(config.blockPollingIntervalMs)
            ? constants_1.constants.DEFAULT_BLOCK_POLLING_INTERVAL
            : config.blockPollingIntervalMs;
        var contractAddresses = _.isUndefined(config.contractAddresses)
            ? contract_addresses_1._getDefaultContractAddresses(config.networkId)
            : config.contractAddresses;
        this.erc20Proxy = new erc20_proxy_wrapper_1.ERC20ProxyWrapper(this._web3Wrapper, config.networkId, contractAddresses.erc20Proxy);
        this.erc721Proxy = new erc721_proxy_wrapper_1.ERC721ProxyWrapper(this._web3Wrapper, config.networkId, contractAddresses.erc721Proxy);
        this.erc20Token = new erc20_token_wrapper_1.ERC20TokenWrapper(this._web3Wrapper, config.networkId, this.erc20Proxy, blockPollingIntervalMs);
        this.erc721Token = new erc721_token_wrapper_1.ERC721TokenWrapper(this._web3Wrapper, config.networkId, this.erc721Proxy, blockPollingIntervalMs);
        this.etherToken = new ether_token_wrapper_1.EtherTokenWrapper(this._web3Wrapper, config.networkId, this.erc20Token, blockPollingIntervalMs);
        this.exchange = new exchange_wrapper_1.ExchangeWrapper(this._web3Wrapper, config.networkId, this.erc20Token, this.erc721Token, contractAddresses.exchange, contractAddresses.zrxToken, blockPollingIntervalMs);
        this.forwarder = new forwarder_wrapper_1.ForwarderWrapper(this._web3Wrapper, config.networkId, contractAddresses.forwarder, contractAddresses.zrxToken, contractAddresses.etherToken);
        this.orderValidator = new order_validator_wrapper_1.OrderValidatorWrapper(this._web3Wrapper, config.networkId, contractAddresses.orderValidator);
    }
    /**
     * Unsubscribes from all subscriptions for all contracts.
     */
    ContractWrappers.prototype.unsubscribeAll = function () {
        this.exchange.unsubscribeAll();
        this.erc20Token.unsubscribeAll();
        this.erc721Token.unsubscribeAll();
        this.etherToken.unsubscribeAll();
    };
    /**
     * Get the provider instance currently used by contract-wrappers
     * @return  Web3 provider instance
     */
    ContractWrappers.prototype.getProvider = function () {
        return this._web3Wrapper.getProvider();
    };
    return ContractWrappers;
}());
exports.ContractWrappers = ContractWrappers;
//# sourceMappingURL=contract_wrappers.js.map
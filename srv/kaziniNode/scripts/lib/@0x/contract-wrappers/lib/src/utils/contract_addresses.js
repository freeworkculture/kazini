"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var contract_addresses_1 = require("@0x/contract-addresses");
/**
 * Returns the default contract addresses for the given networkId or throws with
 * a context-specific error message if the networkId is not recognized.
 */
function _getDefaultContractAddresses(networkId) {
    if (!(networkId in contract_addresses_1.NetworkId)) {
        throw new Error("No default contract addresses found for the given network id (" + networkId + "). If you want to use ContractWrappers on this network, you must manually pass in the contract address(es) to the constructor.");
    }
    return contract_addresses_1.getContractAddressesForNetworkOrThrow(networkId);
}
exports._getDefaultContractAddresses = _getDefaultContractAddresses;
//# sourceMappingURL=contract_addresses.js.map
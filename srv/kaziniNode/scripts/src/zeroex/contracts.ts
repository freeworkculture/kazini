import { ContractWrappersConfig } from '../../lib/0x.js';
import { DummyERC721TokenContract } from '../../lib/@0x/abi-gen-wrappers';
import { ContractAddresses, getContractAddressesForNetworkOrThrow } from '../../lib/@0x/contract-addresses';
import { DummyERC721Token } from '../../lib/@0x/contract-artifacts';

import { ROPSTEN_CONFIGS, NETWORK_CONFIGS } from './configs';
import { providerEngine } from './provider_engine';

// The deployed addresses from the Ganache snapshot
const ROPSTEN_ERC721_TOKENS = ['0x131855dda0aaff096f6854854c55a4debf61077a'];
const ROPSTEN_CONTRACT_ADDRESSES: ContractAddresses = {
    erc20Proxy: '0xb1408f4c245a23c31b98d2c626777d4c0d766caa',
    erc721Proxy: '0xe654aac058bfbf9f83fcaee7793311dd82f6ddb4',
    zrxToken: '0xff67881f8d12f372d91baae9752eb3631ff0ed00',
    etherToken: '0xc778417e063141139fce010982780140aa0cd5ab',
    exchange: '0x4530c0483a1633c7a1c97d2c53721caff2caaaaf',
    assetProxyOwner: '0xf5fa5b5fed2727a0e44ac67f6772e97977aa358b',
    forwarder: '0x2240dab907db71e64d3e0dba4800c83b5c502d4e',
    orderValidator: '0x90431a90516ab49af23a0530e04e8c7836e7122f',
};

export const dummyERC721TokenContracts: DummyERC721TokenContract[] = [];

if (NETWORK_CONFIGS.networkId === ROPSTEN_CONFIGS.networkId) {
    for (const tokenAddress of ROPSTEN_ERC721_TOKENS) {
        dummyERC721TokenContracts.push(
            new DummyERC721TokenContract((DummyERC721Token as any).compilerOutput.abi, tokenAddress, providerEngine),
        );
    }
}

/**
 * Returns the deployed contract addresses for the network. Including the Ganache Snapshot
 * networkId: 50
 * @param networkId  the id of the network (1 == Mainnet, 3 == Ropsten, 42 == Kovan, 50 == Ganache)
 */
export function getContractAddressesForNetwork(networkId: number): ContractAddresses {
    if (networkId === ROPSTEN_CONFIGS.networkId) {
        return ROPSTEN_CONTRACT_ADDRESSES;
    } else {
        const contractAddresses = getContractAddressesForNetworkOrThrow(networkId);
        return contractAddresses;
    }
}

/**
 * Returns a constructed ContractWrappersConfig object for the given network.
 * @param networkId the id of the network
 */
export function getContractWrappersConfig(networkId: number): ContractWrappersConfig {
    const contractAddresses = getContractAddressesForNetwork(networkId);
    const config = { networkId, contractAddresses };
    return config;
}

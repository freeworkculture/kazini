import * as lightwallet from '../../lib/@types/eth-lightwallet';
import { RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { MnemonicWalletSubprovider } from '../../lib/@0x/subproviders';
import { EthLightwalletSubprovider } from '../../lib/@0x/subproviders';
import { BASE_DERIVATION_PATH, MNEMONIC, NETWORK_CONFIGS } from './configs';

export const mnemonicWallet = new MnemonicWalletSubprovider({
    mnemonic: MNEMONIC,
    baseDerivationPath: BASE_DERIVATION_PATH,
});

export const lightWallet = async function lightWalletProvider(KEYSTORE: lightwallet.keystore, PWDERIVEDKEY: Uint8Array) {
    return new EthLightwalletSubprovider(
        KEYSTORE,
        PWDERIVEDKEY
        );
}

export const pe = new Web3ProviderEngine();
pe.addProvider(mnemonicWallet);
pe.addProvider(new RPCSubprovider(NETWORK_CONFIGS.rpcUrl));
pe.start();

export const providerEngine = pe;
export const lightWalletProvider = lightWallet;


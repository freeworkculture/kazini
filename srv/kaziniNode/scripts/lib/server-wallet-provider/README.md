# server-wallet-provider
Ethereum wallet provider that user pustom private key server for signing

## Example usage
```javascript
import ProviderEngine from 'web3-provider-engine';
import ServerWalletProvider from 'server-wallet-provider';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc.js';

const engine = new ProviderEngine();
engine.addProvider(new ServerWalletProvider('http://example.com', 'YOUR_JWT'));
engine.addProvider(new RpcSubprovider({rpcUrl: 'RPC_URL'}));
engine.start();

const web3 = new Web3(engine);

web3.eth.getAccounts // would return a single account
web3.eth.sendTransaction // would use private key server for signing
```
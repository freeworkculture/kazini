
const Web3 = require('web3')
const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')

var engine = new ProviderEngine()
var web3 = new Web3(engine)

// static results
engine.addProvider(new FixtureSubprovider({
  web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
  net_listening: true,
  eth_hashrate: '0x00',
  eth_mining: false,
  eth_syncing: true,
}))

// cache layer
engine.addProvider(new CacheSubprovider())

// filters
engine.addProvider(new FilterSubprovider())

// pending nonce
engine.addProvider(new NonceSubprovider())

// vm
engine.addProvider(new VmSubprovider())

// id mgmt
engine.addProvider(new HookedWalletSubprovider({

  //   approveTransaction: function(cb){ ... },

  /*
   * Fetches user ethereum account
   */
  getAccounts: async (cb) => {
    const address = await (await fetch(`${baseUrl}/api/address`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${jwt}`,
      },
    })).text();
    cb(null, [address]);
  },
  /*
   * Signs transaction
   * If chainId is provided - uses EIP155 pro prevent replay attacks
   * If not - falls back to normal signature scheme
   */
  signTransaction: async (txParams, cb) => {
    const tx = new EthereumTx(txParams);

    let txFields = tx.raw.slice(0, 6);
    if (txParams.chainId) {
      // EIP 155
      txFields = txFields.concat([new Buffer([txParams.chainId]),
      new Buffer([]),
      new Buffer([])]);
    }

    const serializedUnsignedTx = ethUtil.rlp.encode(txFields).toString('hex');

    const signed = await fetch(`${baseUrl}/api/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${jwt}`,
      },
      body: JSON.stringify({ message: serializedUnsignedTx }),
    });
    const body = await signed.json();

    let v = parseInt(body.v, 16);
    if (txParams.chainId) {
      // EIP 155
      v += (txParams.chainId * 2) + 8;
    }

    // Fill in signature fields
    tx.v = new Buffer([v]);
    tx.r = new Buffer(body.r, 'hex');
    tx.s = new Buffer(body.s, 'hex');

    // Return signed serialized tx
    cb(null, `0x${tx.serialize().toString('hex')}`);
  },
}))

// data source
engine.addProvider(new RpcSubprovider({
  rpcUrl: 'https://testrpc.metamask.io/',
}))

// log new blocks
engine.on('block', function (block) {
  console.log('================================')
  console.log('BLOCK CHANGED:', '#' + block.number.toString('hex'), '0x' + block.hash.toString('hex'))
  console.log('================================')
})

// network connectivity error
engine.on('error', function (err) {
  // report connectivity errors
  console.error(err.stack)
})

// start polling for blocks
engine.start()
// export default ServerWalletProvider;
import ethUtil from 'ethereumjs-util';
import EthereumTx from 'ethereumjs-tx';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';

/*
 * Ethereum wallet provider that user pustom private key server for signing
 * No keys are stored client side
 * @constructor
 * @param {string} baseUrl - Base URL of the private key server
 * @param {string} jwt - JSON Web Token used to authenticate user
 */
function ServerWalletProvider(baseUrl, jwt) {
	return new HookedWalletSubprovider({
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
	});
}

export default ServerWalletProvider;
const fetch = require("node-fetch");
/*
 * Ethereum wallet provider that user pustom private key server for signing
 * No keys are stored client side
 * @constructor
 * @param {string} baseUrl - Base URL of the private key server
 * @param {string} jwt - JSON Web Token used to authenticate user
 */

 // async function getAccounts(Url, jwt) {

/*
 * Fetches user ethereum account
 */
function getAccounts(transaction) {
	let Url = {
        baseUrl: "https://www.corezoid.com/api/1/json/public",
        clientId: "470034",
        clientKey: "2a2a64cfb28ad2422725de8c4aa5afc47768b643"
    };
    let jwt = '01';
	return fetch('https://www.corezoid.com/api/1/json/public/474549/2976e76bb0349d1e551b90bd32d171bfea163be5',
		{
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(transaction)
		})
		.then((response) => response.json())
		.then((responseData) => {
			// console.warn('response in wallet-service' , responseData);
			return responseData;
		})
		// .catch(error => console.warn('error in wall-serv' , error));
}
module.exports = {
	address: getAccounts
};

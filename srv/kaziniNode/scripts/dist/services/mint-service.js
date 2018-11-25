'use strict';

/* 

Consumes POST from Corezoid with

mpsr_confirmation_1 : {
    MPSR_CERTIFICATE_CREATED = "true",
    MPSR_CERTIFICATE_REF = "xxxxx"
}
mpsr_confirmation_2 : {
    MPSR_CERTIFICATE_CREATED = "true",
    MPSR_CERTIFICATE_REF = "xxxxx"
}

mints ERC721 token for mpsr_confirmation_2 grantor.
creates ZeroEX order message_packet (mpsr_confirmation_1 grantor = maker, buyer = taker, mpsr_confirmation_2 = sender).
if Kazini is not buyer, kazini POST to corezoid MPSR_TRANSFER_ASSET(to buyer), require result = true;
kazini mints ERC20 token for kazini fees 


*/

// Include the modules (objects)
const ethers = require('ethers');
const ServerWalletProvider = require('./wallet-service');
// ServerWalletProvider = require('./serverprovider.js');
// ServerWalletProvider = require('./wallet-service.js');

// Instantiate the components (class)

// The Contract interface
// let abi = [
//     "function flipIntention() public returns  (bool)",
//     "function setbdi(tuple(uint state, bytes32 service, uint payout, string uri) _service) public"
// ];

// The Contract interface
let abi = [
    "event ValueChanged(address indexed author, string oldValue, string newValue)",
    "constructor(string value)",
    "function getValue() view returns (string value)",
    "function setValue(string value)"
];

/// !!! HERE DEFINE A HOOKED WALLET SUBPROVIDER
// Connect to the network provider
// var provider = ethers.providers.getDefaultProvider('homestead');
// Connect a wallet to mainnet
// You can use any standard network name
//  - "homestead"
//  - "rinkeby"
//  - "ropsten"
//  - "kovan"
let provider = ethers.getDefaultProvider('ropsten');

// The address from the above deployment example
let contractAddress = "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E";

// We connect to the Contract using a Provider, so we will only
// have read-only access to the Contract
let contractRo = new ethers.Contract(contractAddress, abi, provider);

// // A Signer from a private key
// let privateKey = '0xEE1D6ECFAB90C7DB9D40FB1E52021193C199376FBF48F45BA6077848F4711607';
// let wallet = new ethers.Wallet(privateKey, provider);

// // We connect to the Contract using a Wallet, so we will additionally
// // have read-write access to the Contract
// let contractRw = new ethers.Contract(contractAddress, abi, wallet)

// // Get the current value
async function getRecord(value) {
    try {
        const result = await contractRo.getValue();
        console.log("async/await based");
        console.log(result);
        return result;
    }
    catch (error) {
        // Handle error
        console.log(error);
        return error;
    }
}

async function initRecord(req) {
    // A Signer from a private key
    // let privateKey = '0xEE1D6ECFAB90C7DB9D40FB1E52021193C199376FBF48F45BA6077848F4711607';
    // let hookedwallet = ServerWalletProvider.ServerWalletProvider('req.baseUrl', 'req.jwt'); 

    let privateKey;

    let MPSR_MESSAGE_PACKET = req.transaction;

    // console.log('initial notice message pkt', MPSR_MESSAGE_PACKET);
    
    privateKey = await ServerWalletProvider.address(MPSR_MESSAGE_PACKET).then(function (response) {
        console.log('1 in mint service' , response);
        let Key = response.result;  
        // console.log(Key);
        privateKey = response.description;
        return privateKey;
    });

    // console.log('privateKey');
    // console.log(privateKey);

    try {

                
        let wallet = new ethers.Wallet(privateKey, provider);
        console.log(privateKey);

                // We connect to the Contract using a Wallet, so we will additionally
        // have read-write access to the Contract
        let contractRw = new ethers.Contract(contractAddress, abi, wallet)        
        // Set a new Value, which returns the transaction

                let tx = await contractRw.setValue("I like mbuzi.");

                // See: https://ropsten.etherscan.io/tx/0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364
                console.log(tx.hash);
                // "0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364"
        
                // The operation is NOT complete yet; we must wait until it is mined
                await tx.wait();
        
                // Call the Contract's getValue() method again
                let newValue = await contractRo.getValue();
        
                console.log(newValue);
                // "I like turtles."
                return (tx, newValue);

    }
    catch (error) {
        // Handle error
        console.log(error);
        return error;
    }
}

async function setRecord(value) {
    try {
        // Set a new Value, which returns the transaction
        let tx = await contractRw.setValue("I like turtles.");

        // See: https://ropsten.etherscan.io/tx/0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364
        console.log(tx.hash);
        // "0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364"

        // The operation is NOT complete yet; we must wait until it is mined
        await tx.wait();

        // Call the Contract's getValue() method again
        let newValue = await contractRo.getValue();

        console.log(newValue);
        // "I like turtles."
        return (tx, newValue);
    }
    catch (error) {
        // Handle error
        console.log(error);
        return error;
    }
}

// // Connect to "Doers token" Contract (ERC-721 compliant)
// // The address from the above deployment example
// /// !!!! RETRIEVE THIS ADDRESS FROM THE BX24
// // A Signer from a private key
// let privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
// let wallet = new ethers.Wallet(privateKey, provider);

// let parties = [ 'MSRP_GRANTOR_1', 'MSRP_GRANTOR_2' ];



// let wallet = new ethers.Wallet(privateKey, provider);

///// HERE FETCH A WALLET FROM BX24
// We connect to the Contract using our wallet, so we will 
// have read-write access to the Contract
// var wallet = new ethers.Wallet(privateKey, provider);
// var contract = new ethers.Contract(contractAddress, abi, wallet);

// Listen for Transfer events (triggered after the transaction)
// contract.onFlipIntention = function (on, from, origin, intention) {
//     var text = ethers.utils.formatEther(amount);
//     console.log("Flip Intention");
//     console.log("  On:   ", on);
//     console.log("  From:   ", from);
//     console.log("  Origin:     ", origin);
//     console.log("  Intention: ", intention);
// }

// let Intention = {
//     state: "0",
//     service: req.MPSR_REF_1,
//     payout: req.MPSR_AMOUNT_2,
//     uri: 'description: ${req.MPSR_DESCRIPTION_2}, collateral: ${req.MPSR_COLLATERAL_2}'
// }

// // Get the balance of the wallet before the transfer
// contract.balanceOf(wallet.address).then(function (balance) {
//     var text = ethers.utils.formatEther(balance);
//     console.log("Balance Before:", text);
//     // Balance Before: 3.141592653589793238
// })

// contract.setbdi(Intention).then(function (tx) {
//     // Show the pending transaction
//     console.log(tx);
//     // {
//     //     hash: 0x820cc57bc7...0dbe181ba1,
//     //     gasPrice: BigNumber("0x2540be400"),
//     //     gasLimit: BigNumber("0x16e360"),
//     //     value: BigNumber("0x0"),
//     //     data: "0xa9059cbb" + 
//     //           "000000000000000000000000851b9167" +
//     //           "b7cbf772d38efaf89705b35022880a07" +
//     //           "00000000000000000000000000000000" +
//     //           "00000000000000000de0b6b3a7640000",
//     //     to: "0x334eec1482109Bd802D9e72A447848de3bCc1063",
//     //     v: 37,
//     //     r: "0x3fce72962a...a19b611de2",
//     //     s: "0x16f9b70010...0b67a5d396",
//     //     chainId: 1
//     //     from: "0x59DEa134510ebce4a0c7146595dc8A61Eb9D0D79"
//     // }
//     // Wait until the transaction is mined...
//     return tx.wait();

// }).then(function (tx) {
//     console.log('Mined Transaction in block: ', tx.blockNumber);
//     // flip the Doers Intention after the minting
//     contractRo.flipIntention()(wallet.address).then(function (tx) {
//         // Show the pending transaction
//         console.log(tx);
//         // {
//         //     hash: 0x820cc57bc7...0dbe181ba1,
//         //     gasPrice: BigNumber("0x2540be400"),
//         //     gasLimit: BigNumber("0x16e360"),
//         //     value: BigNumber("0x0"),
//         //     data: "0xa9059cbb" + 
//         //           "000000000000000000000000851b9167" +
//         //           "b7cbf772d38efaf89705b35022880a07" +
//         //           "00000000000000000000000000000000" +
//         //           "00000000000000000de0b6b3a7640000",
//         //     to: "0x334eec1482109Bd802D9e72A447848de3bCc1063",
//         //     v: 37,
//         //     r: "0x3fce72962a...a19b611de2",
//         //     s: "0x16f9b70010...0b67a5d396",
//         //     chainId: 1
//         //     from: "0x59DEa134510ebce4a0c7146595dc8A61Eb9D0D79"
//         // }
//         // Wait until the transaction is mined...
//         return tx.wait();
//     })
// }).then(function (tx) {
//     console.log('Mined Transaction in block: ', tx.blockNumber);
//     // Get the balance of the wallet after the transfer
//     contract.balanceOf(wallet.address).then(function (balance) {
//         var text = ethers.utils.formatUnits(balance, 18);
//         console.log("Balance After:", text);
//         // Balance After: 2.141592653589793238
//     })
// });

/// HERE MAKE A ZEROEX ORDER

/// SIGN A ZEROEX ORDER

/// SUBMIT IT TO 

// creates ZeroEX order message_packet 
// (mpsr_confirmation_1 grantor = maker, buyer = taker, mpsr_confirmation_2 = sender).

// export default MintERC721;
// export { ethers };
// export * from './mint-service.js';
module.exports = {
    searchRecords: getRecord,
    initialNotice: initRecord,
    updateRecords: setRecord
}


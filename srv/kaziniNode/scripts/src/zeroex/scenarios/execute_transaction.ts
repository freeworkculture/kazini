import { assetDataUtils, BigNumber, ContractWrappers, generatePseudoRandomSalt, Order, orderHashUtils, signatureUtils, SignedOrder } from '0x.js';
import { MPSRMessage } from '../../../lib/types/newtypes';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { NETWORK_CONFIGS, TX_DEFAULTS } from '../configs';
import { DECIMALS, NULL_ADDRESS } from '../constants';
import { getContractAddressesForNetwork, getContractWrappersConfig } from '../contracts';
import { PrintUtils } from '../print_utils';
import { lightWalletProvider, providerEngine } from '../provider_engine';

/**
 * In this scenario a third party, called the sender, submits the operation on behalf of the taker.
 * This allows a sender to pay the gas on for the taker. It can be combined with a custom sender
 * contract with additional business logic (e.g checking a whitelist). Or the sender
 * can choose how and when the transaction should be submitted, if at all.
 * The maker creates and signs the order. The signed order and fillOrder parameters for the
 * execute transaction function call are signed by the taker.
 */

/*
SOME HANDY PATTERNS

   ///BX24.callMethod!!!
   BX24.callMethod('String: method', {Object: params}, function(res) {
       if(res.data())
       {
           var user = res.data()[0];
           if (!!user)
               alert('The name of the user #' + user.ID + ' is ' + user.NAME);
       }
   });

   ////BX24.callBatch !!!
   BX24.callBatch(batch, $.proxy(function (res) {
       if(!res.error)
           console.log(JSON.stringify(result));
       else
           console.error(error);
    }, this), true);

    ////WEB3 callbacks
   web3.eth.getBlock(48, function(error, result){
       if(!error)
           console.log(JSON.stringify(result));
       else
           console.error(error);
})
*/

// EDIT TO PROVIDE ORDER PARAMS AND ACCOUNT PARAMS
export async function scenarioAsync(): Promise<void> {

    PrintUtils.printScenario('Execute Transaction fillOrder');
    console.log('Execute Transaction fillOrder');

    // Initialize the ContractWrappers, this provides helper functions around calling
    // 0x contracts as well as ERC20/ERC721 token contracts on the blockchain
    const contractWrappers = new ContractWrappers(providerEngine, getContractWrappersConfig(NETWORK_CONFIGS.networkId));

    // Initialize the Web3Wrapper, this provides helper functions around fetching
    // account information, balances, general contract logs
    const web3Wrapper = new Web3Wrapper(providerEngine);

    // TAKER IS KAZINI
    // const [taker] = "0x5947795096F0a6468eF3a6d725203a32F55e87B3";
    // const feeRecipientAddress = taker;

    const contractAddresses = getContractAddressesForNetwork(NETWORK_CONFIGS.networkId);
    const zrxTokenAddress = contractAddresses.zrxToken;
    const etherTokenAddress = contractAddresses.etherToken;

    /// Get the current user,
    /// list the current invoice details by Invoice ID from <div>
    /// check if invoice status is <Pending Approval>!
    /// check if user is Contractor
    /// fetch keyStore and Password and get account
    /// assign account to maker

    var batch = [];

    batch = [{
        get_user: ['user.current', {}],
        list_invoice: ["crm.invoice.list",
            {
                "ORDER": { "DATE_INSERT": "ASC" },
                "FILTER": { "ID": "/* Insert DIV fetch here*/" }, // <Insert DIV fetch here>
                "SELECT": [
                    "STATUS_ID",
                    "UF_CONTRACTOR",
                    "UF_EMPLOYER",
                    "DATE_PAY_BEFORE",
                    "PRICE",
                    "UF_RELAYER_MESSAGE_ORDER",
                    "UF_RELAYER_MESSAGE_MAKEORDER",
                    "UF_RELAYER_MESSAGE_ORDERHASH",
                    "UF_RELAYER_MESSAGE_FILLDATA",
                    "UF_RELAYER_MESSAGE_FILLTxSIGNATUREHEX"
                ]
            }],
        get_keystore: ["crm.requisite.bankdetail.list",
            {
                order: { "DATE_CREATE": "ASC" },
                filter: { "CREATED_BY_ID": '$result[get_user][ID]' },
                select: ["XML_ID", "ORIGINATOR_ID"]
            }],
    }];

    BX24.callBatch(batch, $.proxy(function (res) {
        if (!res.error) {

            console.log(JSON.stringify(res));
            switch (res.list_invoice.data().STATUS_ID) {
                case "MAKE_ORDER":

                    /// ONLY CONTRACTOR CAN START THE INVOICE PAYMENT PROCESS
                    if (res.get_user.data().ID === res.list_invoice.data().UF_CONTRACTOR) {
                        // MAKER IS CONTRACTOR &&, INVOICE IS NOT YET PROCESSED FOR PAYMENT

                        // FETCH ACCOUNTS FROM SERVER, USE SERVER-PROVIDER
                        /*
                        1. fetch keystore from entity-user
                        2. pass in keyStore pw for user
                        */
                        providerEngine.addProvider(lightWalletProvider(
                            res.get_keystore.data().XML_ID,
                            res.get_keystore.data().ORIGINATOR_ID)
                        );

                        // Create the RELAYER_ORDER_MESSAGE_PACKET
                        const orderWithoutExchangeAddress = {
                            senderAddress: NULL_ADDRESS,
                            makerAddress: NULL_ADDRESS,
                            takerAddress: NULL_ADDRESS,
                            // the amount of fees the maker pays in ZRX
                            makerFee: new BigNumber(0),
                            // the amount of fees the taker pays in ZRX
                            takerFee: new BigNumber(0),
                            // the amount the maker is selling of maker asset
                            makerAssetAmount: res.list_invoice.data().PRICE,
                            // the amount the maker wants of taker asset /// WILL FETCH THIS FROM RELAYER SERVER
                            takerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS),
                            // 0x v2 uses hex encoded asset data strings to encode all the information needed to identify an asset
                            makerAssetData: assetDataUtils.encodeERC20AssetData(JSON.stringify(res.list_invoice.data().INVOICE_PROPERTIES) + JSON.stringify(res.list_invoice.data().PRODUCT_ROWS)),
                            takerAssetData: assetDataUtils.encodeERC20AssetData(etherTokenAddress),
                            salt: generatePseudoRandomSalt(),
                            feeRecipientAddress: NULL_ADDRESS,
                            expirationTimeSeconds: res.list_invoice.data().DATE_PAY_BEFORE,
                        };

                        const exchangeAddress = contractAddresses.exchange;
                        const order: Order = {
                            ...orderWithoutExchangeAddress,
                            exchangeAddress,
                        };
                        await relayerFees(order);
                        console.log('Printing the order' + JSON.stringify(order));
                        // await mpsrCertificate(order);
                        const signedOrder = await makeOrder(order);

                        /// UPDATE THE INVOICE CUSTOM FIELDS TO WITH NEW SIGNED TRANSACTION DATA
                        BX24.callMethod('crm.invoice.update',
                            {
                                "ID": res.list_invoice.data().ID,
                                FIELDS: {
                                    "UF_RELAYER_MESSAGE_ORDER": order,
                                    "UF_RELAYER_MESSAGE_ORDERHASH": signedOrder.orderHashHex,
                                    "UF_RELAYER_MESSAGE_MAKEORDER": signedOrder.signedOrder,
                                    "STATUS_ID": "MAKE_ORDER"
                                },
                            },
                            function (result) {
                                if (result.error())
                                    console.error(result.error());
                                else {
                                    console.info("Invoice ID=" + result.data() + "has been updated.");
                                }
                            }
                        );

                        /// INSTALL HERE AN EVENT HANDLER TO NOTIFY KAZINI OF INITIATED ORDER




                    } else {
                        break;
                    }

                case "FILL_ORDER":

                    /// ONLY KAZINI CAN APPROVE THE INVOICE PAYMENT PROCESS
                    if (res.get_user.data().ID === "KAZINI") {
                        // TAKER IS KAZINI &&, INVOICE IS IN PROCESS FOR PAYMENT 

                        // FETCH ACCOUNTS FROM SERVER, USE SERVER-PROVIDER
                        // CHANGE THIS TO USE A HOOKED WALLET FROM KAZINI SIGNING
                        providerEngine.addProvider(lightWalletProvider(
                            res.get_keystore.data().XML_ID,
                            res.get_keystore.data().ORIGINATOR_ID)
                        );

                        const [taker] = await web3Wrapper.getAvailableAddressesAsync(); // would return a single account

                        // Create the MPSR_ORDER_MESSAGE_PACKET
                        const mpsrNotice: MPSRMessage = {
                            particularsOfGrantors: {
                                GRANTORS_NAME: res.list_invoice.data().INVOICE_PROPERTIES,
                                GRANTORS_NATIONALITY: res.list_invoice.data().INVOICE_PROPERTIES,
                                GRANTORS_TAX_ID: res.list_invoice.data().INVOICE_PROPERTIES.,
                                GRANTORS_ID_NUMBER: res.list_invoice.data().,
                                GRANTORS_POSTAL_ADDRESS: res.list_invoice.data().INVOICE_PROPERTIES,
                                GRANTORS_POSTAL_CODE: res.list_invoice.data().,
                                GRANTORS_EMAIL: res.list_invoice.data().INVOICE_PROPERTIES.EMAIL,
                                GRANTORS_TELEPHONE: res.list_invoice.data().INVOICE_PROPERTIES.PHONE
                            },
                            particularsOfCreditors: {
                                CREDITORS_NAME: res.list_invoice.data().INVOICE_PROPERTIES,
                                CREDITORS_NATIONALITY: res.list_invoice.data().INVOICE_PROPERTIES.,
                                CREDITORS_TAX_ID: res.list_invoice.data().INVOICE_PROPERTIES.,
                                CREDITORS_ID_NUMBER: res.list_invoice.data().,
                                CREDITORS_POSTAL_ADDRESS: res.list_invoice.data().INVOICE_PROPERTIES.,
                                CREDITORS_POSTAL_CODE: res.list_invoice.data().,
                                CREDITORS_EMAIL: res.list_invoice.data().INVOICE_PROPERTIES.EMAIL,
                                CREDITORS_TELEPHONE: res.list_invoice.data().INVOICE_PROPERTIES.PHONE,
                                categoryOfSecuredCredit: res.list_invoice.data().,
                                typeOfNonSecuredCreditor: res.list_invoice.data().
                              },
                            detailsOfCollateral: {
                                collateralType: {
                                    universal: res.list_invoice.data().,
                                    tangible: res.list_invoice.data().,
                                    fungible: res.list_invoice.data().,
                                    temporal: false,
                                    generic: res.list_invoice.data().
                                },
                                description: res.list_invoice.data().DESCRIPTION
                            },
                            particularsOfSecuredLoan: {
                                maximumAmountSecured: res.list_invoice.data().,
                                effectivePeriodInMonths: res.list_invoice.data().,
                                consensual: res.list_invoice.data().,
                                relatesToPriorSecurity: res.list_invoice.data().
                              }
                        }

                        await mpsrCertificate(mpsrNotice);
                        console.log('Printing the order' + JSON.stringify(mpsrNotice));
                        const filledOrder = await fillOrder(
                            res.list_invoice.data().UF_RELAYER_MESSAGE_ORDER,
                            res.list_invoice.data().UF_RELAYER_MESSAGE_PACKET);

                        /// UPDATE THE INVOICE CUSTOM FIELDS TO WITH NEW SIGNED TRANSACTION DATA
                        BX24.callMethod('crm.invoice.update',
                            {
                                "ID": res.list_invoice.data().ID,
                                FIELDS: {
                                    "UF_RELAYER_MESSAGE_FILLDATA": filledOrder.fillData,
                                    "UF_RELAYER_MESSAGE_FILLTxSIGNATUREHEX": filledOrder.takerSignatureHex,
                                    "STATUS_ID": "FILL_ORDER"
                                },
                            },
                            function (result) {
                                if (result.error())
                                    console.error(result.error());
                                else {
                                    console.info("Invoice ID=" + result.data() + "has been updated.");
                                }
                            }
                        );
                        /// TO-DO!!INSTALL HERE AN EVENT HANDLER TO NOTIFY KAZINI OF FILLED ORDER

                    } else {
                        break;
                    }




                case "SUBMIT_ORDER":

                    /// ONLY EMPLOYER CAN SUBMIT THE INVOICE FOR PAYMENT PROCESS
                    if (res.get_user.data().ID === res.list_invoice.data().UF_EMPLOYER) {
                        // SENDER IS EMPLOYER &&, INVOICE IS IN LAST PROCESS FOR PAYMENT 

                        // FETCH ACCOUNTS FROM SERVER, USE SERVER-PROVIDER
                        // CHANGE THIS TO USE A HOOKED WALLET FROM KAZINI SIGNING
                        providerEngine.addProvider(lightWalletProvider(
                            res.get_keystore.data().XML_ID,
                            res.get_keystore.data().ORIGINATOR_ID)
                        );

                        const [sender] = await web3Wrapper.getAvailableAddressesAsync(); // would return a single account

                        // Create the MPSR_ORDER_MESSAGE_PACKET
                        const mpsrNotice: MPSRMessage = {
                            particularsOfGrantors: {
                                GRANTORS_NAME: res.list_invoice.data().INVOICE_PROPERTIES,
                                GRANTORS_NATIONALITY: res.list_invoice.data().INVOICE_PROPERTIES,
                                GRANTORS_TAX_ID: res.list_invoice.data().INVOICE_PROPERTIES.,
                                GRANTORS_ID_NUMBER: res.list_invoice.data().,
                                GRANTORS_POSTAL_ADDRESS: res.list_invoice.data().INVOICE_PROPERTIES,
                                GRANTORS_POSTAL_CODE: res.list_invoice.data().,
                                GRANTORS_EMAIL: res.list_invoice.data().INVOICE_PROPERTIES.EMAIL,
                                GRANTORS_TELEPHONE: res.list_invoice.data().INVOICE_PROPERTIES.PHONE
                            },
                            particularsOfCreditors: {
                                CREDITORS_NAME: res.list_invoice.data().INVOICE_PROPERTIES,
                                CREDITORS_NATIONALITY: res.list_invoice.data().INVOICE_PROPERTIES.,
                                CREDITORS_TAX_ID: res.list_invoice.data().INVOICE_PROPERTIES.,
                                CREDITORS_ID_NUMBER: res.list_invoice.data().,
                                CREDITORS_POSTAL_ADDRESS: res.list_invoice.data().INVOICE_PROPERTIES.,
                                CREDITORS_POSTAL_CODE: res.list_invoice.data().,
                                CREDITORS_EMAIL: res.list_invoice.data().INVOICE_PROPERTIES.EMAIL,
                                CREDITORS_TELEPHONE: res.list_invoice.data().INVOICE_PROPERTIES.PHONE,
                                categoryOfSecuredCredit: res.list_invoice.data().,
                                typeOfNonSecuredCreditor: res.list_invoice.data().
                                              },
                            detailsOfCollateral: {
                                collateralType: {
                                    universal: res.list_invoice.data().,
                                    tangible: res.list_invoice.data().,
                                    fungible: res.list_invoice.data().,
                                    temporal: false,
                                    generic: res.list_invoice.data().
                                                },
                                description: res.list_invoice.data().DESCRIPTION
                            },
                            particularsOfSecuredLoan: {
                                maximumAmountSecured: res.list_invoice.data().,
                                effectivePeriodInMonths: res.list_invoice.data().,
                                consensual: res.list_invoice.data().,
                                relatesToPriorSecurity: res.list_invoice.data().
                                              }
                        };

                        await mpsrCertificate(mpsrNotice);
                        console.log('Printing the order' + JSON.stringify(mpsrNotice));
                        const submitOrder = await sendOrder(
                            res.list_invoice.data().UF_RELAYER_MESSAGE_ORDER,
                            res.list_invoice.data().UF_RELAYER_MESSAGE_ORDERHASH,
                            res.list_invoice.data().UF_RELAYER_MESSAGE_FILLDATA,
                            res.list_invoice.data().UF_RELAYER_MESSAGE_FILLTxSIGNATUREHEX
                        );

                        /// UPDATE THE INVOICE CUSTOM FIELDS TO WITH NEW SIGNED TRANSACTION DATA
                        BX24.callMethod('crm.invoice.update',
                            {
                                "ID": res.list_invoice.data().ID,
                                FIELDS: {
                                    "UF_RELAYER_MESSAGE_SUBMITORDER": submitOrder,
                                    "STATUS_ID": "SUBMIT_ORDER"
                                },
                            },
                            function (result) {
                                if (result.error())
                                    console.error(result.error());
                                else {
                                    console.info("Invoice ID=" + result.data() + "has been updated.");
                                }
                            }
                        );
                        /// TO-DO!!INSTALL HERE AN EVENT HANDLER TO NOTIFY KAZINI OF FILLED ORDER

                    } else {
                        break;
                    }
                default:
                    console.log("NO MATCH");
            }
        } else
            console.error(res.error);
    }, this), true);

    //
    /*
     * Fetch relayer fees
     */
    var relayerUrl = "https://api.openrelay.xyz";

    var relayerFees = async (cb) => {
        const feeResponse = await (await fetch(`${relayerUrl}/v0/fees`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `JWT ${jwt}`,
            },
            body: JSON.stringify(cb),
        })).json();
        cb(null,
            [feeResponse],
            // Convert the makerFee and takerFee into BigNumbers
            cb.makerFee = new BigNumber(feeResponse.makerFee),
            cb.takerFee = new BigNumber(feeResponse.takerFee),
            // The fee API tells us what taker to specify
            cb.takerAddress = feeResponse.takerToSpecify,
            // The fee API tells us what feeRecipient to specify
            cb.feeRecipientAddress = feeResponse.feeRecipient
        );
    },

    var mpsrUrl = "https://api.openrelay.xyz";

    var mpsrCertificate = async (cb) => {
        const mpsrResponse = await (await fetch(`${mpsrUrl}/v0/fees`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `JWT ${jwt}`,
            },
            body: JSON.stringify(cb),
        })).json();
        cb(null,
            [mpsrResponse],
            // Convert the makerFee and takerFee into BigNumbers
            cb.makerAssetData = assetDataUtils.encodeERC20AssetData(cb.makerAssetData + JSON.stringify(mpsrResponse.initialNotice.data().MPRS_CERTIFICATE_REFERENCE))
        );
    },

    // // Get the current value
    export async function makeOrder(order: Order) {
        try {
            console.log("In makeOrder async/await based");
            
            const [maker] = await web3Wrapper.getAvailableAddressesAsync(); // would return a single account

            order.makerAddress = maker;

            const printUtils = new PrintUtils(
                web3Wrapper,
                contractWrappers,
                { maker: order.makerAddress, taker: order.takerAddress },
                { WETH: etherTokenAddress, ZRX: zrxTokenAddress },
            );
            printUtils.printAccounts();

            // Approve the ERC20 Proxy to move ZRX for maker
            const makerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
                zrxTokenAddress,
                maker,
            );
            await printUtils.awaitTransactionMinedSpinnerAsync('Maker ZRX Approval', makerZRXApprovalTxHash);

            PrintUtils.printData('Setup', [
                ['Maker ZRX Approval', makerZRXApprovalTxHash],
            ]);

            printUtils.printOrder(order);

            // Print out the Balances and Allowances
            await printUtils.fetchAndPrintContractAllowancesAsync();
            await printUtils.fetchAndPrintContractBalancesAsync();

            // Generate the order hash and sign it
            const orderHashHex = orderHashUtils.getOrderHashHex(order);
            const signature = await signatureUtils.ecSignHashAsync(providerEngine, orderHashHex, maker);

            const signedOrder: SignedOrder = {
                ...order,
                signature,
            };
            return { orderHashHex: orderHashHex, signedOrder: signedOrder };
        }
        catch (error) {
            // Handle error
            console.log(error);
            return error;
        }
    }

    // // Get the current value
    export async function fillOrder(order: Order, signedOrder: SignedOrder) {
        try {
            // const result = await contractRo.getValue();
            console.log("In Fill order async/await based");
            // console.log(result);

            const [taker] = await web3Wrapper.getAvailableAddressesAsync(); // would return a single account

            const printUtils = new PrintUtils(
                web3Wrapper,
                contractWrappers,
                { maker: order.makerAddress, taker: order.takerAddress },
                { WETH: etherTokenAddress, ZRX: zrxTokenAddress },
            );
            printUtils.printAccounts();

            // Approve the ERC20 Proxy to move ZRX for taker
            const takerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
                zrxTokenAddress,
                taker,
            );
            await printUtils.awaitTransactionMinedSpinnerAsync('Taker ZRX Approval', takerZRXApprovalTxHash);

            // Approve the ERC20 Proxy to move WETH for taker
            const takerWETHApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
                etherTokenAddress,
                taker,
            );
            await printUtils.awaitTransactionMinedSpinnerAsync('Taker WETH Approval', takerWETHApprovalTxHash);

            // Convert ETH into WETH for taker by depositing ETH into the WETH contract
            const takerWETHDepositTxHash = await contractWrappers.etherToken.depositAsync(
                etherTokenAddress,
                order.takerAssetAmount,
                taker,
            );
            await printUtils.awaitTransactionMinedSpinnerAsync('Taker WETH Deposit', takerWETHDepositTxHash);

            PrintUtils.printData('Setup', [
                ['Taker ZRX Approval', takerZRXApprovalTxHash],
                ['Taker WETH Approval', takerWETHApprovalTxHash],
                ['Taker WETH Deposit', takerWETHDepositTxHash],
            ]);

            printUtils.printOrder(signedOrder);

            // Print out the Balances and Allowances
            await printUtils.fetchAndPrintContractAllowancesAsync();
            await printUtils.fetchAndPrintContractBalancesAsync();

            // The transaction encoder provides helpers in encoding 0x Exchange transactions to allow
            // a third party to submit the transaction. This operates in the context of the signer (taker)
            // rather then the context of the submitter (sender)
            const transactionEncoder = await contractWrappers.exchange.transactionEncoderAsync();
            // This is an ABI encoded function call that the taker wishes to perform
            // in this scenario it is a fillOrder
            const fillData = transactionEncoder.fillOrderTx(signedOrder, order.takerAssetAmount);
            // Generate a random salt to mitigate replay attacks
            const takerTransactionSalt = generatePseudoRandomSalt();
            // The taker signs the operation data (fillOrder) with the salt
            const executeTransactionHex = transactionEncoder.getTransactionHex(fillData, takerTransactionSalt, taker);
            const takerSignatureHex = await signatureUtils.ecSignHashAsync(providerEngine, executeTransactionHex, taker);

            return {fillData: fillData, takerSignatureHex: takerSignatureHex};

        }
        catch (error) {
            // Handle error
            console.log(error);
            return error;
        }
    }

    // // Get the current value
    export async function sendOrder(order: Order, orderHashHex, fillData, takerSignatureHex) {
        try {
            // const result = await contractRo.getValue();
            console.log("In sign order async/await based");
            // console.log(result);

            const takerTransactionSalt = generatePseudoRandomSalt();

            // // The transaction encoder provides helpers in encoding 0x Exchange transactions to allow
            // // a third party to submit the transaction. This operates in the context of the signer (taker)
            // // rather then the context of the submitter (sender)
            // const transactionEncoder = await contractWrappers.exchange.transactionEncoderAsync();

            // const fillData = transactionEncoder.fillOrderTx(signedOrder, takerAssetAmount);
            const [sender] = await web3Wrapper.getAvailableAddressesAsync(); // would return a single account


            const printUtils = new PrintUtils(
                web3Wrapper,
                contractWrappers,
                { maker: order.makerAddress, taker: order.takerAddress, sender: order.senderAddress },
                { WETH: etherTokenAddress, ZRX: zrxTokenAddress },
            );
            printUtils.printAccounts();

            printUtils.printOrder(takerSignatureHex);

            // Print out the Balances and Allowances
            await printUtils.fetchAndPrintContractAllowancesAsync();
            await printUtils.fetchAndPrintContractBalancesAsync();

            // The sender submits this operation via executeTransaction passing in the signature from the taker
            const txHash = await contractWrappers.exchange.executeTransactionAsync(
                takerTransactionSalt,
                order.takerAddress,
                fillData,
                takerSignatureHex,
                sender,
                {
                    gasLimit: TX_DEFAULTS.gas,
                },
            );
            const txReceipt = await printUtils.awaitTransactionMinedSpinnerAsync('executeTransaction', txHash);
            printUtils.printTransaction('Execute Transaction fillOrder', txReceipt, [['orderHash', orderHashHex]]);

            // Print the Balances
            await printUtils.fetchAndPrintContractBalancesAsync();

            return txReceipt;

        }
        catch (error) {
            // Handle error
            console.log(error);
            return error;
        }
    }

    // Stop the Provider Engine
    providerEngine.stop(); 
}

void (async () => {
    try {
        if (!module.parent) {
            // await scenarioAsync();
            // await makeOrder();
            // await fillOrder();
            // await submitOrder();
        }
    } catch (e) {
        console.log(e);
        providerEngine.stop();
        process.exit(1);
    }
})();

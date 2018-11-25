import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { OrderTransactionOpts } from '../types';
import { ContractWrapper } from './contract_wrapper';
/**
 * This class includes the functionality related to interacting with the Forwarder contract.
 */
export declare class ForwarderWrapper extends ContractWrapper {
    abi: ContractAbi;
    address: string;
    zrxTokenAddress: string;
    etherTokenAddress: string;
    private _forwarderContractIfExists?;
    /**
     * Instantiate ForwarderWrapper
     * @param web3Wrapper Web3Wrapper instance to use.
     * @param networkId Desired networkId.
     * @param address The address of the Exchange contract. If undefined, will
     * default to the known address corresponding to the networkId.
     * @param zrxTokenAddress The address of the ZRXToken contract. If
     * undefined, will default to the known address corresponding to the
     * networkId.
     * @param etherTokenAddress The address of a WETH (Ether token) contract. If
     * undefined, will default to the known address corresponding to the
     * networkId.
     */
    constructor(web3Wrapper: Web3Wrapper, networkId: number, address?: string, zrxTokenAddress?: string, etherTokenAddress?: string);
    /**
     * Purchases as much of orders' makerAssets as possible by selling up to 95% of transaction's ETH value.
     * Any ZRX required to pay fees for primary orders will automatically be purchased by this contract.
     * 5% of ETH value is reserved for paying fees to order feeRecipients (in ZRX) and forwarding contract feeRecipient (in ETH).
     * Any ETH not spent will be refunded to sender.
     * @param   signedOrders            An array of objects that conform to the SignedOrder interface. All orders must specify the same makerAsset.
     *                                  All orders must specify WETH as the takerAsset
     * @param   takerAddress            The user Ethereum address who would like to fill this order. Must be available via the supplied
     *                                  Provider provided at instantiation.
     * @param   ethAmount               The amount of eth to send with the transaction (in wei).
     * @param   signedFeeOrders         An array of objects that conform to the SignedOrder interface. All orders must specify ZRX as makerAsset and WETH as takerAsset.
     *                                  Used to purchase ZRX for primary order fees.
     * @param   feePercentage           The percentage of WETH sold that will payed as fee to forwarding contract feeRecipient.
     *                                  Defaults to 0.
     * @param   feeRecipientAddress     The address that will receive ETH when signedFeeOrders are filled.
     * @param   orderTransactionOpts    Transaction parameters.
     * @return  Transaction hash.
     */
    marketSellOrdersWithEthAsync(signedOrders: SignedOrder[], takerAddress: string, ethAmount: BigNumber, signedFeeOrders?: SignedOrder[], feePercentage?: number, feeRecipientAddress?: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    /**
     * Attempt to purchase makerAssetFillAmount of makerAsset by selling ethAmount provided with transaction.
     * Any ZRX required to pay fees for primary orders will automatically be purchased by the contract.
     * Any ETH not spent will be refunded to sender.
     * @param   signedOrders            An array of objects that conform to the SignedOrder interface. All orders must specify the same makerAsset.
     *                                  All orders must specify WETH as the takerAsset
     * @param   makerAssetFillAmount    The amount of the order (in taker asset baseUnits) that you wish to fill.
     * @param   takerAddress            The user Ethereum address who would like to fill this order. Must be available via the supplied
     *                                  Provider provided at instantiation.
     * @param   ethAmount               The amount of eth to send with the transaction (in wei).
     * @param   signedFeeOrders         An array of objects that conform to the SignedOrder interface. All orders must specify ZRX as makerAsset and WETH as takerAsset.
     *                                  Used to purchase ZRX for primary order fees.
     * @param   feePercentage           The percentage of WETH sold that will payed as fee to forwarding contract feeRecipient.
     *                                  Defaults to 0.
     * @param   feeRecipientAddress     The address that will receive ETH when signedFeeOrders are filled.
     * @param   orderTransactionOpts    Transaction parameters.
     * @return  Transaction hash.
     */
    marketBuyOrdersWithEthAsync(signedOrders: SignedOrder[], makerAssetFillAmount: BigNumber, takerAddress: string, ethAmount: BigNumber, signedFeeOrders?: SignedOrder[], feePercentage?: number, feeRecipientAddress?: string, orderTransactionOpts?: OrderTransactionOpts): Promise<string>;
    private _getForwarderContractAsync;
}
//# sourceMappingURL=forwarder_wrapper.d.ts.map
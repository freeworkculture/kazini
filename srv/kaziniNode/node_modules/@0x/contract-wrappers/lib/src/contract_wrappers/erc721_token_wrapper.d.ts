import { ERC721TokenEventArgs, ERC721TokenEvents } from '@0x/abi-gen-wrappers';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BlockRange, EventCallback, IndexedFilterValues, MethodOpts, TransactionOpts } from '../types';
import { ContractWrapper } from './contract_wrapper';
import { ERC721ProxyWrapper } from './erc721_proxy_wrapper';
/**
 * This class includes all the functionality related to interacting with ERC721 token contracts.
 * All ERC721 method calls are supported, along with some convenience methods for getting/setting allowances
 * to the 0x ERC721 Proxy smart contract.
 */
export declare class ERC721TokenWrapper extends ContractWrapper {
    abi: ContractAbi;
    private readonly _tokenContractsByAddress;
    private readonly _erc721ProxyWrapper;
    /**
     * Instantiate ERC721TokenWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param networkId Desired networkId
     * @param erc721ProxyWrapper The ERC721ProxyWrapper instance to use
     * @param blockPollingIntervalMs The block polling interval to use for active subscriptions
     */
    constructor(web3Wrapper: Web3Wrapper, networkId: number, erc721ProxyWrapper: ERC721ProxyWrapper, blockPollingIntervalMs?: number);
    /**
     * Count all NFTs assigned to an owner
     * NFTs assigned to the zero address are considered invalid, and this function throws for queries about the zero address.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address whose balance you would like to check.
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  The number of NFTs owned by `ownerAddress`, possibly zero
     */
    getTokenCountAsync(tokenAddress: string, ownerAddress: string, methodOpts?: MethodOpts): Promise<BigNumber>;
    /**
     * Find the owner of an NFT
     * NFTs assigned to zero address are considered invalid, and queries about them do throw.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   tokenId         The identifier for an NFT
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  The address of the owner of the NFT
     */
    getOwnerOfAsync(tokenAddress: string, tokenId: BigNumber, methodOpts?: MethodOpts): Promise<string>;
    /**
     * Query if an address is an authorized operator for all NFT's of `ownerAddress`
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address of the token owner.
     * @param   operatorAddress The hex encoded user Ethereum address of the operator you'd like to check if approved.
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  True if `operatorAddress` is an approved operator for `ownerAddress`, false otherwise
     */
    isApprovedForAllAsync(tokenAddress: string, ownerAddress: string, operatorAddress: string, methodOpts?: MethodOpts): Promise<boolean>;
    /**
     * Query if 0x proxy is an authorized operator for all NFT's of `ownerAddress`
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address of the token owner.
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  True if `operatorAddress` is an approved operator for `ownerAddress`, false otherwise
     */
    isProxyApprovedForAllAsync(tokenAddress: string, ownerAddress: string, methodOpts?: MethodOpts): Promise<boolean>;
    /**
     * Get the approved address for a single NFT. Returns undefined if no approval was set
     * Throws if `_tokenId` is not a valid NFT
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   tokenId         The identifier for an NFT
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  The approved address for this NFT, or the undefined if there is none
     */
    getApprovedIfExistsAsync(tokenAddress: string, tokenId: BigNumber, methodOpts?: MethodOpts): Promise<string | undefined>;
    /**
     * Checks if 0x proxy is approved for a single NFT
     * Throws if `_tokenId` is not a valid NFT
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   tokenId         The identifier for an NFT
     * @param   methodOpts      Optional arguments this method accepts.
     * @return  True if 0x proxy is approved
     */
    isProxyApprovedAsync(tokenAddress: string, tokenId: BigNumber, methodOpts?: MethodOpts): Promise<boolean>;
    /**
     * Enable or disable approval for a third party ("operator") to manage all of `ownerAddress`'s assets.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the ApprovalForAll event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address of the token owner.
     * @param   operatorAddress The hex encoded user Ethereum address of the operator you'd like to set approval for.
     * @param   isApproved      The boolean variable to set the approval to.
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    setApprovalForAllAsync(tokenAddress: string, ownerAddress: string, operatorAddress: string, isApproved: boolean, txOpts?: TransactionOpts): Promise<string>;
    /**
     * Enable or disable approval for a third party ("operator") to manage all of `ownerAddress`'s assets.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the ApprovalForAll event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   ownerAddress    The hex encoded user Ethereum address of the token owner.
     * @param   operatorAddress The hex encoded user Ethereum address of the operator you'd like to set approval for.
     * @param   isApproved      The boolean variable to set the approval to.
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    setProxyApprovalForAllAsync(tokenAddress: string, ownerAddress: string, isApproved: boolean, txOpts?: TransactionOpts): Promise<string>;
    /**
     * Set or reaffirm the approved address for an NFT
     * The zero address indicates there is no approved address. Throws unless `msg.sender` is the current NFT owner,
     * or an authorized operator of the current owner.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the Approval event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   approvedAddress The hex encoded user Ethereum address you'd like to set approval for.
     * @param   tokenId         The identifier for an NFT
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    setApprovalAsync(tokenAddress: string, approvedAddress: string, tokenId: BigNumber, txOpts?: TransactionOpts): Promise<string>;
    /**
     * Set or reaffirm 0x proxy as an approved address for an NFT
     * Throws unless `msg.sender` is the current NFT owner, or an authorized operator of the current owner.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the Approval event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   tokenId         The identifier for an NFT
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    setProxyApprovalAsync(tokenAddress: string, tokenId: BigNumber, txOpts?: TransactionOpts): Promise<string>;
    /**
     * Enable or disable approval for a third party ("operator") to manage all of `ownerAddress`'s assets.
     * Throws if `_tokenId` is not a valid NFT
     * Emits the ApprovalForAll event.
     * @param   tokenAddress    The hex encoded contract Ethereum address where the ERC721 token is deployed.
     * @param   receiverAddress The hex encoded Ethereum address of the user to send the NFT to.
     * @param   senderAddress The hex encoded Ethereum address of the user to send the NFT to.
     * @param   tokenId         The identifier for an NFT
     * @param   txOpts          Transaction parameters.
     * @return  Transaction hash.
     */
    transferFromAsync(tokenAddress: string, receiverAddress: string, senderAddress: string, tokenId: BigNumber, txOpts?: TransactionOpts): Promise<string>;
    /**
     * Subscribe to an event type emitted by the Token contract.
     * @param   tokenAddress        The hex encoded address where the ERC721 token is deployed.
     * @param   eventName           The token contract event you would like to subscribe to.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param   callback            Callback that gets called when a log is added/removed
     * @param   isVerbose           Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends ERC721TokenEventArgs>(tokenAddress: string, eventName: ERC721TokenEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean): string;
    /**
     * Cancel a subscription
     * @param   subscriptionToken Subscription token returned by `subscribe()`
     */
    unsubscribe(subscriptionToken: string): void;
    /**
     * Cancels all existing subscriptions
     */
    unsubscribeAll(): void;
    /**
     * Gets historical logs without creating a subscription
     * @param   tokenAddress        An address of the token that emitted the logs.
     * @param   eventName           The token contract event you would like to subscribe to.
     * @param   blockRange          Block range to get logs from.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return  Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends ERC721TokenEventArgs>(tokenAddress: string, eventName: ERC721TokenEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    private _getTokenContractAsync;
}
//# sourceMappingURL=erc721_token_wrapper.d.ts.map
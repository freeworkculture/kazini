import { ContractAbi, DecodedLogArgs, LogEntry, LogWithDecodedArgs, RawLog } from 'ethereum-types';
/**
 * ERC20 and ERC721 have some events with different args but colliding signature.
 * For exmaple:
 * Transfer(_from address, _to address, _value uint256)
 * Transfer(_from address, _to address, _tokenId uint256)
 * Both have the signature:
 * Transfer(address,address,uint256)
 *
 * In order to correctly decode those events we need to know the token type by address in advance.
 * You can pass it by calling `this.addERC20Token(address)` or `this.addERC721Token(address)`
 */
export declare class CollisionResistanceAbiDecoder {
    private readonly _erc20AbiDecoder;
    private readonly _erc721AbiDecoder;
    private readonly _restAbiDecoder;
    private readonly _knownERC20Tokens;
    private readonly _knownERC721Tokens;
    constructor(erc20Abi: ContractAbi, erc721Abi: ContractAbi, abis: ContractAbi[]);
    tryToDecodeLogOrNoop<ArgsType extends DecodedLogArgs>(log: LogEntry): LogWithDecodedArgs<ArgsType> | RawLog;
    addERC20Token(address: string): void;
    addERC721Token(address: string): void;
}
//# sourceMappingURL=collision_resistant_abi_decoder.d.ts.map
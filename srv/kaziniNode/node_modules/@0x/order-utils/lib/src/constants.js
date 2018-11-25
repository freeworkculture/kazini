"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
exports.constants = {
    NULL_ADDRESS: '0x0000000000000000000000000000000000000000',
    NULL_BYTES: '0x',
    // tslint:disable-next-line:custom-no-magic-numbers
    UNLIMITED_ALLOWANCE_IN_BASE_UNITS: new utils_1.BigNumber(2).pow(256).minus(1),
    TESTRPC_NETWORK_ID: 50,
    ADDRESS_LENGTH: 20,
    ERC20_ASSET_DATA_BYTE_LENGTH: 36,
    ERC721_ASSET_DATA_MINIMUM_BYTE_LENGTH: 53,
    SELECTOR_LENGTH: 4,
    BASE_16: 16,
    INFINITE_TIMESTAMP_SEC: new utils_1.BigNumber(2524604400),
    ZERO_AMOUNT: new utils_1.BigNumber(0),
    EIP712_DOMAIN_NAME: '0x Protocol',
    EIP712_DOMAIN_VERSION: '2',
    EIP712_DOMAIN_SCHEMA: {
        name: 'EIP712Domain',
        parameters: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'verifyingContract', type: 'address' },
        ],
    },
    EIP712_ORDER_SCHEMA: {
        name: 'Order',
        parameters: [
            { name: 'makerAddress', type: 'address' },
            { name: 'takerAddress', type: 'address' },
            { name: 'feeRecipientAddress', type: 'address' },
            { name: 'senderAddress', type: 'address' },
            { name: 'makerAssetAmount', type: 'uint256' },
            { name: 'takerAssetAmount', type: 'uint256' },
            { name: 'makerFee', type: 'uint256' },
            { name: 'takerFee', type: 'uint256' },
            { name: 'expirationTimeSeconds', type: 'uint256' },
            { name: 'salt', type: 'uint256' },
            { name: 'makerAssetData', type: 'bytes' },
            { name: 'takerAssetData', type: 'bytes' },
        ],
    },
    EIP712_ZEROEX_TRANSACTION_SCHEMA: {
        name: 'ZeroExTransaction',
        parameters: [
            { name: 'salt', type: 'uint256' },
            { name: 'signerAddress', type: 'address' },
            { name: 'data', type: 'bytes' },
        ],
    },
};
//# sourceMappingURL=constants.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
exports.constants = {
    NULL_ADDRESS: '0x0000000000000000000000000000000000000000',
    NULL_BYTES: '0x',
    TESTRPC_NETWORK_ID: 50,
    INVALID_JUMP_PATTERN: 'invalid JUMP at',
    REVERT: 'revert',
    OUT_OF_GAS_PATTERN: 'out of gas',
    INVALID_TAKER_FORMAT: 'instance.taker is not of a type(s) string',
    // tslint:disable-next-line:custom-no-magic-numbers
    UNLIMITED_ALLOWANCE_IN_BASE_UNITS: new utils_1.BigNumber(2).pow(256).minus(1),
    DEFAULT_BLOCK_POLLING_INTERVAL: 1000,
    ZERO_AMOUNT: new utils_1.BigNumber(0),
    ONE_AMOUNT: new utils_1.BigNumber(1),
    ETHER_TOKEN_DECIMALS: 18,
    USER_DENIED_SIGNATURE_PATTERN: 'User denied transaction signature',
};
//# sourceMappingURL=constants.js.map
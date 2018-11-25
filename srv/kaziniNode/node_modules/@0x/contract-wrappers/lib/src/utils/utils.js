"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var _ = require("lodash");
var constants_1 = require("./constants");
exports.utils = {
    getCurrentUnixTimestampSec: function () {
        var milisecondsInSecond = 1000;
        return new utils_1.BigNumber(Date.now() / milisecondsInSecond).round();
    },
    getCurrentUnixTimestampMs: function () {
        return new utils_1.BigNumber(Date.now());
    },
    numberPercentageToEtherTokenAmountPercentage: function (percentage) {
        return web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(constants_1.constants.ONE_AMOUNT, constants_1.constants.ETHER_TOKEN_DECIMALS).mul(percentage);
    },
    removeUndefinedProperties: function (obj) {
        return _.pickBy(obj);
    },
};
//# sourceMappingURL=utils.js.map
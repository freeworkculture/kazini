"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
exports.utils = {
    getCurrentUnixTimestampSec: function () {
        var milisecondsInASecond = 1000;
        return new utils_1.BigNumber(Date.now() / milisecondsInASecond).round();
    },
    getCurrentUnixTimestampMs: function () {
        return new utils_1.BigNumber(Date.now());
    },
};
//# sourceMappingURL=utils.js.map
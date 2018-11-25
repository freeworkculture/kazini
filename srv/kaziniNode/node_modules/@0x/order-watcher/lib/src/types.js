"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderWatcherError;
(function (OrderWatcherError) {
    OrderWatcherError["SubscriptionAlreadyPresent"] = "SUBSCRIPTION_ALREADY_PRESENT";
    OrderWatcherError["SubscriptionNotFound"] = "SUBSCRIPTION_NOT_FOUND";
})(OrderWatcherError = exports.OrderWatcherError || (exports.OrderWatcherError = {}));
var InternalOrderWatcherError;
(function (InternalOrderWatcherError) {
    InternalOrderWatcherError["NoAbiDecoder"] = "NO_ABI_DECODER";
    InternalOrderWatcherError["ZrxNotInTokenRegistry"] = "ZRX_NOT_IN_TOKEN_REGISTRY";
    InternalOrderWatcherError["WethNotInTokenRegistry"] = "WETH_NOT_IN_TOKEN_REGISTRY";
})(InternalOrderWatcherError = exports.InternalOrderWatcherError || (exports.InternalOrderWatcherError = {}));
//# sourceMappingURL=types.js.map
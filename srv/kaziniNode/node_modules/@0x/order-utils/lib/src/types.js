"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderError;
(function (OrderError) {
    OrderError["InvalidSignature"] = "INVALID_SIGNATURE";
    OrderError["InvalidMetamaskSigner"] = "MetaMask provider must be wrapped in a MetamaskSubprovider (from the '@0x/subproviders' package) in order to work with this method.";
})(OrderError = exports.OrderError || (exports.OrderError = {}));
var TradeSide;
(function (TradeSide) {
    TradeSide["Maker"] = "maker";
    TradeSide["Taker"] = "taker";
})(TradeSide = exports.TradeSide || (exports.TradeSide = {}));
var TransferType;
(function (TransferType) {
    TransferType["Trade"] = "trade";
    TransferType["Fee"] = "fee";
})(TransferType = exports.TransferType || (exports.TransferType = {}));
//# sourceMappingURL=types.js.map
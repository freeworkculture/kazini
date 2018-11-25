"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExchangeWrapperError;
(function (ExchangeWrapperError) {
    ExchangeWrapperError["AssetDataMismatch"] = "ASSET_DATA_MISMATCH";
})(ExchangeWrapperError = exports.ExchangeWrapperError || (exports.ExchangeWrapperError = {}));
var ForwarderWrapperError;
(function (ForwarderWrapperError) {
    ForwarderWrapperError["CompleteFillFailed"] = "COMPLETE_FILL_FAILED";
})(ForwarderWrapperError = exports.ForwarderWrapperError || (exports.ForwarderWrapperError = {}));
var ContractWrappersError;
(function (ContractWrappersError) {
    ContractWrappersError["ContractNotDeployedOnNetwork"] = "CONTRACT_NOT_DEPLOYED_ON_NETWORK";
    ContractWrappersError["InsufficientAllowanceForTransfer"] = "INSUFFICIENT_ALLOWANCE_FOR_TRANSFER";
    ContractWrappersError["InsufficientBalanceForTransfer"] = "INSUFFICIENT_BALANCE_FOR_TRANSFER";
    ContractWrappersError["InsufficientEthBalanceForDeposit"] = "INSUFFICIENT_ETH_BALANCE_FOR_DEPOSIT";
    ContractWrappersError["InsufficientWEthBalanceForWithdrawal"] = "INSUFFICIENT_WETH_BALANCE_FOR_WITHDRAWAL";
    ContractWrappersError["InvalidJump"] = "INVALID_JUMP";
    ContractWrappersError["OutOfGas"] = "OUT_OF_GAS";
    ContractWrappersError["SubscriptionNotFound"] = "SUBSCRIPTION_NOT_FOUND";
    ContractWrappersError["SubscriptionAlreadyPresent"] = "SUBSCRIPTION_ALREADY_PRESENT";
    ContractWrappersError["ERC721OwnerNotFound"] = "ERC_721_OWNER_NOT_FOUND";
    ContractWrappersError["ERC721NoApproval"] = "ERC_721_NO_APPROVAL";
    ContractWrappersError["SignatureRequestDenied"] = "SIGNATURE_REQUEST_DENIED";
})(ContractWrappersError = exports.ContractWrappersError || (exports.ContractWrappersError = {}));
var InternalContractWrappersError;
(function (InternalContractWrappersError) {
    InternalContractWrappersError["NoAbiDecoder"] = "NO_ABI_DECODER";
})(InternalContractWrappersError = exports.InternalContractWrappersError || (exports.InternalContractWrappersError = {}));
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
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["INVALID"] = 0] = "INVALID";
    OrderStatus[OrderStatus["INVALID_MAKER_ASSET_AMOUNT"] = 1] = "INVALID_MAKER_ASSET_AMOUNT";
    OrderStatus[OrderStatus["INVALID_TAKER_ASSET_AMOUNT"] = 2] = "INVALID_TAKER_ASSET_AMOUNT";
    OrderStatus[OrderStatus["FILLABLE"] = 3] = "FILLABLE";
    OrderStatus[OrderStatus["EXPIRED"] = 4] = "EXPIRED";
    OrderStatus[OrderStatus["FULLY_FILLED"] = 5] = "FULLY_FILLED";
    OrderStatus[OrderStatus["CANCELLED"] = 6] = "CANCELLED";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
//# sourceMappingURL=types.js.map
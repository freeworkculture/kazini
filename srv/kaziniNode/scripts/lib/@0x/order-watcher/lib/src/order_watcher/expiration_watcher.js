"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var bintrees_1 = require("bintrees");
var _ = require("lodash");
var types_1 = require("../types");
var utils_2 = require("../utils/utils");
var DEFAULT_EXPIRATION_MARGIN_MS = 0;
var DEFAULT_ORDER_EXPIRATION_CHECKING_INTERVAL_MS = 50;
/**
 * This class includes the functionality to detect expired orders.
 * It stores them in a min heap by expiration time and checks for expired ones every `orderExpirationCheckingIntervalMs`
 */
var ExpirationWatcher = /** @class */ (function () {
    function ExpirationWatcher(expirationMarginIfExistsMs, orderExpirationCheckingIntervalIfExistsMs) {
        var _this = this;
        this._expiration = {};
        this._orderExpirationCheckingIntervalMs =
            orderExpirationCheckingIntervalIfExistsMs || DEFAULT_ORDER_EXPIRATION_CHECKING_INTERVAL_MS;
        this._expirationMarginMs = expirationMarginIfExistsMs || DEFAULT_EXPIRATION_MARGIN_MS;
        this._orderExpirationCheckingIntervalMs =
            expirationMarginIfExistsMs || DEFAULT_ORDER_EXPIRATION_CHECKING_INTERVAL_MS;
        var comparator = function (lhsOrderHash, rhsOrderHash) {
            var lhsExpiration = _this._expiration[lhsOrderHash].toNumber();
            var rhsExpiration = _this._expiration[rhsOrderHash].toNumber();
            if (lhsExpiration !== rhsExpiration) {
                return lhsExpiration - rhsExpiration;
            }
            else {
                // HACK: If two orders have identical expirations, the order in which they are emitted by the
                // ExpirationWatcher does not matter, so we emit them in alphabetical order by orderHash.
                return lhsOrderHash.localeCompare(rhsOrderHash);
            }
        };
        this._orderHashByExpirationRBTree = new bintrees_1.RBTree(comparator);
    }
    ExpirationWatcher.prototype.subscribe = function (callback) {
        if (!_.isUndefined(this._orderExpirationCheckingIntervalIdIfExists)) {
            throw new Error(types_1.OrderWatcherError.SubscriptionAlreadyPresent);
        }
        this._orderExpirationCheckingIntervalIdIfExists = utils_1.intervalUtils.setInterval(this._pruneExpiredOrders.bind(this, callback), this._orderExpirationCheckingIntervalMs, _.noop.bind(_));
    };
    ExpirationWatcher.prototype.unsubscribe = function () {
        if (_.isUndefined(this._orderExpirationCheckingIntervalIdIfExists)) {
            throw new Error(types_1.OrderWatcherError.SubscriptionNotFound);
        }
        utils_1.intervalUtils.clearInterval(this._orderExpirationCheckingIntervalIdIfExists);
        delete this._orderExpirationCheckingIntervalIdIfExists;
    };
    ExpirationWatcher.prototype.addOrder = function (orderHash, expirationUnixTimestampMs) {
        this._expiration[orderHash] = expirationUnixTimestampMs;
        this._orderHashByExpirationRBTree.insert(orderHash);
    };
    ExpirationWatcher.prototype.removeOrder = function (orderHash) {
        if (_.isUndefined(this._expiration[orderHash])) {
            return; // noop since order already removed
        }
        this._orderHashByExpirationRBTree.remove(orderHash);
        delete this._expiration[orderHash];
    };
    ExpirationWatcher.prototype._pruneExpiredOrders = function (callback) {
        var currentUnixTimestampMs = utils_2.utils.getCurrentUnixTimestampMs();
        while (true) {
            var hasNoTrackedOrders = this._orderHashByExpirationRBTree.size === 0;
            if (hasNoTrackedOrders) {
                break;
            }
            var nextOrderHashToExpire = this._orderHashByExpirationRBTree.min();
            var hasNoExpiredOrders = this._expiration[nextOrderHashToExpire].greaterThan(currentUnixTimestampMs.plus(this._expirationMarginMs));
            var isSubscriptionActive = _.isUndefined(this._orderExpirationCheckingIntervalIdIfExists);
            if (hasNoExpiredOrders || isSubscriptionActive) {
                break;
            }
            var orderHash = this._orderHashByExpirationRBTree.min();
            this._orderHashByExpirationRBTree.remove(orderHash);
            delete this._expiration[orderHash];
            callback(orderHash);
        }
    };
    return ExpirationWatcher;
}());
exports.ExpirationWatcher = ExpirationWatcher;
//# sourceMappingURL=expiration_watcher.js.map
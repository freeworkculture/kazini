"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderWatcherPartialConfigSchema = {
    id: '/OrderWatcherPartialConfigSchema',
    properties: {
        stateLayer: { $ref: '/blockParamSchema' },
        orderExpirationCheckingIntervalMs: { type: 'number' },
        eventPollingIntervalMs: { type: 'number' },
        expirationMarginMs: { type: 'number' },
        cleanupJobIntervalMs: { type: 'number' },
        isVerbose: { type: 'boolean' },
    },
    type: 'object',
    required: [],
};
//# sourceMappingURL=order_watcher_partial_config_schema.js.map
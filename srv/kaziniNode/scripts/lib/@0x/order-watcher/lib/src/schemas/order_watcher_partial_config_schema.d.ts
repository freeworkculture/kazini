export declare const orderWatcherPartialConfigSchema: {
    id: string;
    properties: {
        stateLayer: {
            $ref: string;
        };
        orderExpirationCheckingIntervalMs: {
            type: string;
        };
        eventPollingIntervalMs: {
            type: string;
        };
        expirationMarginMs: {
            type: string;
        };
        cleanupJobIntervalMs: {
            type: string;
        };
        isVerbose: {
            type: string;
        };
    };
    type: string;
    required: never[];
};
//# sourceMappingURL=order_watcher_partial_config_schema.d.ts.map
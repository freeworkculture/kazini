export declare const ContractWrappersConfigSchema: {
    id: string;
    properties: {
        networkId: {
            type: string;
        };
        gasPrice: {
            $ref: string;
        };
        contractAddresses: {
            type: string;
            properties: {
                erc20Proxy: {
                    $ref: string;
                };
                erc721Proxy: {
                    $ref: string;
                };
                zrxToken: {
                    $ref: string;
                };
                etherToken: {
                    $ref: string;
                };
                exchange: {
                    $ref: string;
                };
                assetProxyOwner: {
                    $ref: string;
                };
                forwarder: {
                    $ref: string;
                };
                orderValidator: {
                    $ref: string;
                };
            };
        };
        blockPollingIntervalMs: {
            type: string;
        };
    };
    type: string;
    required: string[];
};
//# sourceMappingURL=contract_wrappers_config_schema.d.ts.map
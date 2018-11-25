"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderTxOptsSchema = {
    id: '/OrderTxOpts',
    allOf: [{ $ref: '/TxOpts' }],
    properties: {
        shouldValidate: { type: 'boolean' },
    },
    type: 'object',
};
//# sourceMappingURL=order_tx_opts_schema.js.map
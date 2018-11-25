"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txOptsSchema = {
    id: '/TxOpts',
    properties: {
        gasPrice: { $ref: '/numberSchema' },
        gasLimit: { type: 'number' },
    },
    type: 'object',
};
//# sourceMappingURL=tx_opts_schema.js.map
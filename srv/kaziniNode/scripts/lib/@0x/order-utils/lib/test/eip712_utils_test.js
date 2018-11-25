"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var chai = require("chai");
require("mocha");
var constants_1 = require("../src/constants");
var eip712_utils_1 = require("../src/eip712_utils");
var chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
var expect = chai.expect;
describe('EIP712 Utils', function () {
    describe('createTypedData', function () {
        it('adds in the EIP712DomainSeparator', function () {
            var primaryType = 'Test';
            var typedData = eip712_utils_1.eip712Utils.createTypedData(primaryType, { Test: [{ name: 'testValue', type: 'uint256' }] }, { testValue: '1' }, constants_1.constants.NULL_ADDRESS);
            expect(typedData.domain).to.not.be.undefined();
            expect(typedData.types.EIP712Domain).to.not.be.undefined();
            var domainObject = typedData.domain;
            expect(domainObject.name).to.eq(constants_1.constants.EIP712_DOMAIN_NAME);
            expect(typedData.primaryType).to.eq(primaryType);
        });
    });
    describe('createTypedData', function () {
        it('adds in the EIP712DomainSeparator', function () {
            var typedData = eip712_utils_1.eip712Utils.createZeroExTransactionTypedData({
                salt: new utils_1.BigNumber('0'),
                data: constants_1.constants.NULL_BYTES,
                signerAddress: constants_1.constants.NULL_ADDRESS,
            }, constants_1.constants.NULL_ADDRESS);
            expect(typedData.primaryType).to.eq(constants_1.constants.EIP712_ZEROEX_TRANSACTION_SCHEMA.name);
            expect(typedData.types.EIP712Domain).to.not.be.undefined();
        });
    });
});
//# sourceMappingURL=eip712_utils_test.js.map
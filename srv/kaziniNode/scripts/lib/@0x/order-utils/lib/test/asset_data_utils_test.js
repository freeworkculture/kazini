"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var utils_1 = require("@0x/utils");
var asset_data_utils_1 = require("../src/asset_data_utils");
var chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
var expect = chai.expect;
var KNOWN_ENCODINGS = [
    {
        address: '0x1dc4c1cefef38a777b15aa20260a54e584b16c48',
        assetData: '0xf47261b00000000000000000000000001dc4c1cefef38a777b15aa20260a54e584b16c48',
    },
    {
        address: '0x1dc4c1cefef38a777b15aa20260a54e584b16c48',
        tokenId: new utils_1.BigNumber(1),
        assetData: '0x025717920000000000000000000000001dc4c1cefef38a777b15aa20260a54e584b16c480000000000000000000000000000000000000000000000000000000000000001',
    },
];
var ERC20_ASSET_PROXY_ID = '0xf47261b0';
var ERC721_ASSET_PROXY_ID = '0x02571792';
describe('assetDataUtils', function () {
    it('should encode ERC20', function () {
        var assetData = asset_data_utils_1.assetDataUtils.encodeERC20AssetData(KNOWN_ENCODINGS[0].address);
        expect(assetData).to.equal(KNOWN_ENCODINGS[0].assetData);
    });
    it('should decode ERC20', function () {
        var assetData = asset_data_utils_1.assetDataUtils.decodeERC20AssetData(KNOWN_ENCODINGS[0].assetData);
        expect(assetData.tokenAddress).to.equal(KNOWN_ENCODINGS[0].address);
        expect(assetData.assetProxyId).to.equal(ERC20_ASSET_PROXY_ID);
    });
    it('should encode ERC721', function () {
        var assetData = asset_data_utils_1.assetDataUtils.encodeERC721AssetData(KNOWN_ENCODINGS[1].address, KNOWN_ENCODINGS[1]
            .tokenId);
        expect(assetData).to.equal(KNOWN_ENCODINGS[1].assetData);
    });
    it('should decode ERC721', function () {
        var assetData = asset_data_utils_1.assetDataUtils.decodeERC721AssetData(KNOWN_ENCODINGS[1].assetData);
        expect(assetData.tokenAddress).to.equal(KNOWN_ENCODINGS[1].address);
        expect(assetData.assetProxyId).to.equal(ERC721_ASSET_PROXY_ID);
        expect(assetData.tokenId).to.be.bignumber.equal(KNOWN_ENCODINGS[1].tokenId);
    });
});
//# sourceMappingURL=asset_data_utils_test.js.map
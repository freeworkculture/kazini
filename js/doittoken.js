const DoitTokenAbi = require('../build/DoitToken.sol').DoitTokenAbi;
const DoitTokenByteCode = require('../build/DoitToken.sol').DoitTokenByteCode;
const generateClass = require('eth-contract-class').default;

module.exports = generateClass(DoitTokenAbi, DoitTokenByteCode);

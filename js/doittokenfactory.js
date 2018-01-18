const DoitTokenFactoryAbi = require('../build/Doit.sol').DoitTokenFactoryAbi;
const DoitTokenFactoryByteCode = require('../build/Doit.sol').DoitTokenFactoryByteCode;
const generateClass = require('eth-contract-class').default;

module.exports = generateClass(DoitTokenFactoryAbi, DoitTokenFactoryByteCode);

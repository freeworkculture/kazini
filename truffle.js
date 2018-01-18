var TestRPC = require("ethereumjs-testrpc");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    dev: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: 3
    },
    // add a new network definition that will self host TestRPC
    localtest: {
      provider: TestRPC.provider(),
      network_id:"*"
    }
  },
  // add a section for mocha defaults
  mocha: {
    reporter: "spec",
    reporterOptions: {
      mochaFile: 'TEST-truffle.xml'
    }
  }
};

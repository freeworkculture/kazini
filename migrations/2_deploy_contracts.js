
// var BaseController = artifacts.require("BaseController");
// var TokenController = artifacts.require("TokenController");
// var DataController = artifacts.require("DataController");
// var OraclizeI = artifacts.require("OraclizeI");
// var OraclizeAddrResolverI = artifacts.require("OraclizeAddrResolverI");
// var usingOraclize = artifacts.require("usingOraclize");
var Able = artifacts.require("Able");
var Database = artifacts.require("Database");
// var DoitTokenFactory = artifacts.require("DoitTokenFactory");
// var DoitToken = artifacts.require("DoitToken");
// // var Exchange = artifacts.require("Exchange");
// var Kazini = artifacts.require("Factor");
// var Reserve = artifacts.require("Reserve");
// var Creators = artifacts.require("Creators");
// var Doers = artifacts.require("Doers");
// var DoPromise = artifacts.require("DoPromise");

module.exports = function(deployer, network, accounts) {
    // deployer.deploy(DoitTokenFactory)
    // .then(function() {
    //   return deployer.deploy(DoitToken, DoitTokenFactory.address, 0x0, 0, "DOIT", "DIY", 18, "ECC9:10", 0, true);
    // })

    // deployer.deploy(BaseController);
    // deployer.deploy(TokenController);
    // deployer.deploy(usingOraclize);
    // deployer.link(BaseController, DataController, Able);
    // deployer.deploy(DataController);
    // deployer.link(DataController, Able);
    // Deploy Able, then deploy Database, passing in Able's newly deployed address
    deployer.deploy(Able).then(function() {
    return deployer.deploy(Database, Able.address);
    });
    // Deploy multiple contracts, some with arguments and some without.
    // This is quicker than writing three `deployer.deploy()` statements as the deployer
    // can perform the deployment as a single batched request.
    // deployer.deploy([
    //     Able,
    //     [Database, Able.address]
    // ]);
    // deployer.deploy(Able)
    // deployer.link(Able, Database);
    // deployer.deploy(Database);
    // deployer.deploy(InputFactor);
    
    // deployer.deploy(InputStake);

    // deployer.deploy(Creators)

    // deployer.link(Creators, [Doers, DoPromise]);

    // deployer.deploy(Doers)
    // .then(function() {
    //   return deployer.deploy(DoPromise, Doers.address);
    // });
};

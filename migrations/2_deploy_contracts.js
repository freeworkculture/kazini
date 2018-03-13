
// var BaseController = artifacts.require("BaseController");
// var TokenController = artifacts.require("TokenController");
// var DataController = artifacts.require("DataController");
// var OraclizeI = artifacts.require("OraclizeI");
// var OraclizeAddrResolverI = artifacts.require("OraclizeAddrResolverI");
// var usingOraclize = artifacts.require("usingOraclize");
var Able = artifacts.require("Able");
var Database = artifacts.require("Database");
var Userbase = artifacts.require("Userbase");
var Creators = artifacts.require("Creators");
var Doers = artifacts.require("Doers");
var DoitTokenFactory = artifacts.require("DoitTokenFactory");
var DoitToken = artifacts.require("DoitToken");
var Reserve = artifacts.require("Reserve");
// var Kazini = artifacts.require("Kazini");

module.exports = function(deployer, network, [owner,controller,doer,creator,curator,msgOrigin,msgSender]) {
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
    deployer.deploy(Able, {from: owner
    }).then(function() {
    return deployer.deploy(Database, Able.address, {from: owner});
    }).then(function() {
    return deployer.deploy(Userbase, Able.address, {from: owner});

    }).then(function() {
    return deployer.deploy(Creators, Able.address, Userbase.address, {from: owner});

    }).then(function() {
    return deployer.link(Creators, Doers);

    }).then(function() {
    return deployer.deploy(Doers, Creators.address, {from: owner});

    }).then(function() {
    return deployer.deploy(DoitTokenFactory, Able.address, {from: owner});
    }).then(function() {
    return deployer.deploy(DoitToken, DoitTokenFactory.address, 0x0, 0, "TEST", "TST", 18, "DEFAULT", 0, true, {from: owner});
    // // }).then(function() {
    // // return deployer.link(DoitToken, Reserve);
    }).then(function() {
    return deployer.deploy(Reserve, {from: owner});
    // // }).then(function() {
    // return deployer.deploy(Kazini, Able.address, 0x0, 0x0, 0x0, {from: owner});
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

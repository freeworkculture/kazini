
var DoitTokenFactory = artifacts.require("DoitTokenFactory");
var DoitToken = artifacts.require("DoitToken");
var Controlled = artifacts.require("Controlled");
var Able = artifacts.require("Able");
var Exchange = artifacts.require("Exchange");
var InputFactor = artifacts.require("InputFactor");
var InputStake = artifacts.require("InputStake");
var Creators = artifacts.require("Creators");
var Doers = artifacts.require("Doers");
var DoPromise = artifacts.require("DoPromise");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(DoitTokenFactory)
    .then(function() {
      return deployer.deploy(DoitToken, DoitTokenFactory.address, 0x0, 0, "DOIT", "DIY", 18, "ECC9:10", 0, true);
    })

    deployer.deploy(Controlled);

    deployer.deploy(Able)

    deployer.deploy(Exchange);
    
    deployer.deploy(InputFactor);
    
    deployer.deploy(InputStake);

    deployer.deploy(Creators)

    deployer.link(Creators, [Doers, DoPromise]);

    deployer.deploy(Doers)
    .then(function() {
      return deployer.deploy(DoPromise, Doers.address);
    });
};

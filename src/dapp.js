var Web3 = require("web3");
var contract = require("truffle-contract");
var Doers = contract(require("../build/contracts/Doers.json"));
var DoPromise = contract(require("../build/contracts/DoPromise.json"));
require("bootstrap");

var account;

window.Dapp = {
  start: function() {
    this.setDoerCount();
    this.setFulfillmentCount();
  },

  setAlert: function(message, type) {
    type = type || "info";
    var element = document.getElementById("alerts");
    element.innerHTML = "<div class='alert alert-" + type + "'>" + message + "</div>";
  },

  throwError: function(message, err) {
    err = err || message;
    this.setAlert("<strong>Error!</strong> " + message, "danger");
    throw err;
  },

  setDoerCount: function() {
    Doers.deployed().then(function(instance) {
      return instance.getDoerCount.call();
    }).then(function(value) {
      var element = document.getElementById("doer-count");
      element.innerHTML = value.valueOf();
    }).catch(function(err) {
      console.log(err);
    });
  },

  setFulfillmentCount: function() {
    Promise.deployed().then(function(instance) {
      return instance.getFulfillmentCount.call();
    }).then(function(value) {
      var element = document.getElementById("fulfillment-count");
      element.innerHTML = value.valueOf();
    }).catch(function(err) {
      console.log(err);
    });
  },

  addDoer: function() {
    var self = this;
    var address = document.getElementById("doer-address").value;
    Doers.deployed().then(function(instance) {
      self.setAlert("Adding doer...");
      return instance.addDoer(address, {from: account});
    }).then(function() {
      self.setDoerCount();
      self.setAlert("Doer was added!", "success");
    }).catch(function(err) {
      console.log(err);
    });
  },

  fulfill: function() {
    var self = this;
    var proof = document.getElementById("fulfillment-proof").value;
    Promise.deployed().then(function(instance) {
      self.setAlert("Submitting fulfillment proof...");
      return instance.fulfill(proof, {from: account});
    }).then(function() {
      self.setFulfillmentCount();
      self.setAlert("Fulfillment proof was submitted!", "success");
    }).catch(function(err) {
      console.log(err);
    });
  }
};

window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  Doers.setProvider(web3.currentProvider);
  Promise.setProvider(web3.currentProvider);

  web3.eth.getAccounts(function(err, accounts) {
    if (err) {
      Dapp.throwError("Your browser can't see the decentralized web!", err);
    }
    if (accounts.length == 0) {
      Dapp.throwError("Connect an account!");
    }
    account = accounts[0];
    Dapp.start();
  });
});

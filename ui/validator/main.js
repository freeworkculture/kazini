import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

if(typeof web3 !== 'undefined'){
  web3 = new Web3(web3.currentProvider);
}else{
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
};



contractABI = [{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"hash","type":"bytes32"}],"name":"constVerify","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"hash","type":"bytes32"}],"name":"verify","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}];
//contractAddress = "0x024e57d249CCB2422869a3b8D54580bFdAd2F6fB";

//Validator = web3.eth.contract(contractABI).at(contractAddress);

Template.Smsg.onCreated(function () {

  this.signedmsg = new ReactiveVar();
  this.address = new ReactiveVar();
});


Template.Smsg.helpers({
  signedmsg() {
    return Template.instance().signedmsg.get();
    },
  address(){
    return Template.instance().address.get();
    }
});

Template.Smsg.events({
    "click #signMsg"(event, Template){
        //console.log("y");
        web3.eth.sign(web3.eth.accounts[0], web3.sha3(msgToSign.value), function(err, res){
            //console.log(err,res);
            Template.signedmsg.set(res);
        })
    },

    "click #checkAddress"(event, Template){

	if (network.checked){
		contractAddress = "0x985cE5070EB1C077CeEfF3691899196c2a2F17c0";	 //livenet
		Validator = web3.eth.contract(contractABI).at(contractAddress);
	}else{
		contractAddress = "0xee9c02c520dd3c0c229f7ac76c593cb49c43ab90";  //testnet
		Validator = web3.eth.contract(contractABI).at(contractAddress);
	};

        r = "0x" + signedMsg.value.slice(2, 66);
        s = "0x" + signedMsg.value.slice(66, 130);
        v = new Buffer(signedMsg.value.slice(130, 132), "hex");
        v = v[0].valueOf();
        console.log("r: ", r, "s: ", s, "v: ", v);
        h = web3.sha3(originalMsg.value);
        
	console.log(network.checked);
	console.log(transaction.checked);

	if (transaction.checked){

		Validator.verify(r, s, v, h, function(err,res){
            		console.log(err, res);
 		        Template.address.set("The transaction id is: " + res);
	        });
	}else{
		Validator.constVerify(r, s, v, h, function(err,res){
			console.log(err, res);
			Template.address.set("The signer address: " + res);
		});

	}
    }
});

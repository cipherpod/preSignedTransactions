/**
 * Copyright 2019 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

const Web3 = require('web3');
const web3 = new Web3(Web3.providers.HttpProvider("http://localhost:8545"));
const fs = require('fs');

web3.eth.defaultAccount = '0xB365B4236Ae69ef4b7b1EB622ecC2bD88083Cfb0';

const contractBin = Buffer.from(fs.readFileSync("./out/ERC865Token.bin"));
const contractAbi = JSON.parse(fs.readFileSync("./out/ERC865Token.abi"));

module.exports = {
    deployTokenSmartcontract: function (_tokenOwner, _symbol, _name, _decimals, _initialSupply, _callback) {

        let Token = new web3.eth.Contract(contractAbi, null, { data: '0x' + contractBin, });

        Token.deploy({
            arguments: [_tokenOwner, _symbol, _name, _decimals, _initialSupply],
        }).send({
            from: web3.eth.defaultAccount,
            gas: 5000000,
        }).then((instance) => { _callback(instance.options.address);});
    },
    performPreSignedTransaction: function (_token, _from, _to, _value, _nonce, _signature, _callback) {
        console.log(_token, _from, _to, _value, _nonce, _signature)
        let Token = new web3.eth.Contract(contractAbi, _token);
        Token.methods.transferPreSigned(_signature, _from, _to, _value, _nonce).send({
            from: web3.eth.defaultAccount,
            gas: 5000000,
        }).on('confirmation', (confirmationNumber, receipt) => {
            //_callback(confirmationNumber);
        })
        .on('error', () => {
            //_callback(0);
        });
    },
    getAccountNonce: function (_token, _from, _callback) {
        let Token = new web3.eth.Contract(contractAbi, _token);
        return Token.methods.getAccountNonce(_from).call({from: web3.eth.defaultAccount})
        .then((result) => {
            _callback(result.toString());
        });
    },
    getAccountBalance: function (_token, _from, _callback) {
        let Token = new web3.eth.Contract(contractAbi, _token);
        return Token.methods.balanceOf(_from).call({from: web3.eth.defaultAccount})
        .then((result) => {
            _callback(result.toString());
        });
    },

};

const express = require('express'); //Line 1
const path = require("path");
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3


// Ethereum, Web3.js 
const Web3 = require('web3');
const ethAmount = '0.1';
const senderAddress = '0x15C2c14B416b2f5531CbCcdE364c048cf3F0f1dE';
const privKey = '358547c8efd5381ad50841d73d5449d64a0c9f795070f8c54c34cbdf4c94969d';

var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// This displays message that the server running and listening to specified port
app.listen(port,() => console.log(`Listening on port ${port}`)); //Line 6

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// TODO Serve public
app.use("/faucet", express.static(path.join(__dirname, "frontend", "build")));
app.use("/faucet", express.static("public"));

app.post('/faucet/api/send_ether', jsonParser, function (req, res) {
    let web3 = new Web3(Web3.givenProvider || "https://eth.bag.org.tr/rpc");
    const toAddress = req.body.address;

    const tx = {
        from: senderAddress,
        to: toAddress,
        value: web3.utils.toHex(parseInt(web3.utils.toWei(ethAmount, 'ether'))),
        gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
        gasLimit: web3.utils.toHex(21000),
    };

    web3.eth.transactionPollingTimeout = 30;

    if(toAddress){
        const signPromise = web3.eth.accounts.signTransaction(tx, privKey);
        signPromise.then((signedTx) => {
            const sentTx = web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Trying to send transaction...');
            sentTx.on("receipt", receipt => {
                console.log('Transaction sent successfully \n' + senderAddress + ' to ' + toAddress + '\nAmount: ' + ethAmount + ' ETH');

                web3.eth.getBalance(toAddress)
                    .then((balanceInWei) => {
                        const balance = Web3.utils.fromWei(balanceInWei, 'ether');
                        res.send({ balance: balance });
                    });
            });
            sentTx.on("error", err => {
                console.log(err)
            });
        }).catch((err) => {
            console.log(err)
        });
    }
});
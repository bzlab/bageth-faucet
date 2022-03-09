const express = require('express'); //Line 1
const path = require("path");
const Web3 = require('web3');
const morgan = require('morgan')
const jsonParser = require('body-parser').json()
require('dotenv').config({path: __dirname + '/frontend/.env'})

// Express
const app = express();
app.use(morgan('combined'))
const port = process.env.PORT || 5000;

// Ethereum, Web3.js 
const ethAmount = process.env.ETH_AMOUNT;
const senderAddress = process.env.SENDER;
const privKey = process.env.PRIVATE_KEY;

// const web3 = new Web3(Web3.givenProvider || "https://rpc.eth.bag.org.tr" || "http://localhost:3000");
const web3 = new Web3(Web3.givenProvider || process.env.RPC_URL);
web3.eth.transactionPollingTimeout = 30;

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// TODO buna gerek olmayabilir test et
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Serve public
app.use("/", express.static(path.join(__dirname, "frontend", "build")));
app.use("/", express.static("public"));

app.post('/api/send_ether', jsonParser, function (req, res) {
    const toAddress = req.body.address;

    const tx = {
        from: senderAddress,
        to: toAddress,
        value: web3.utils.toHex(parseInt(web3.utils.toWei(ethAmount, 'ether'))),
        gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
        gasLimit: web3.utils.toHex(21000),
    };

    if (toAddress) {
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
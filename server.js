const express = require('express'); //Line 1
const Web3 = require('web3');
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
var bodyParser = require('body-parser')


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// This displays message that the server running and listening to specified port
app.listen(port,() => console.log(`Listening on port ${port}`)); //Line 6

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11



app.post('/helloworld', jsonParser, function (req, res) {
  res.send({ post_request: 'helloworld' });
  console.log(req.body.name)
});
import React, { Component } from 'react';
import Web3 from 'web3';
import contractABI from './contract-abi' // cirkin ama ne yapalim

class App extends Component {

state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };




render() {
  let web3 = new Web3(Web3.givenProvider || "https://eth.bag.org.tr/rpc");
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  }
  const contractAddress = ethereum.selectedAddress;
  const contract = new web3.eth.Contract(contractABI.contractABI, contractAddress);

  const click = async () => {
    const body = JSON.stringify({
      name: "gkyclpn",
      email: "gokayculpan@hotmail.com",
      password: "**********",
    })

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    const settings = {
      method: 'POST',
      headers,
      body
    };

    try {
      const fetchResponse = await fetch(`http://localhost:5000/helloworld`, settings);
      const data = await fetchResponse.json();
      console.log(data)
      return data; // your response data
    } catch (e) {
      console.log(e)
      return e; // handle your error here
    }

  }

  return (
        <div>
          <p>{this.state.data}</p>
          <button className="" onClick={() => ethereum.request({ method: 'eth_requestAccounts' })}>Connect MetaMask</button>
          {ethereum.selectedAddress ? (<span>{ethereum.selectedAddress}</span>) : null}
            <button onClick={click}>Send Data To Backend</button>
        </div>
    );
  }
}

export default App;
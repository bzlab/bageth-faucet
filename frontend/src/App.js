import React, { Component, useState } from 'react';
import Web3 from 'web3';
import bzlablogo from './img/bzlablogo.png';
import { ethers } from 'ethers';

// Import App config
import config from './config'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: null,
            balance: null
        };
    }

    componentDidMount() {
        this.click();
    }

    click = async () => {

        if (typeof window.ethereum !== 'undefined') {
            console.log("Connecting to Metamask Account...")
            await window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(res => { this.accountChangedHandler(res[0]) });
        } else {
            console.log("Install MetaMask Wallet");
        }
    }

    accountChangedHandler = async (newAccount) => {
        this.setState({ address: newAccount });
        this.checkBalance(newAccount.toString());
    }

    checkBalance = async (address) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
            .then(balance => this.setState({ balance: ethers.utils.formatEther(balance) }))
    }

    sendEther = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = Web3.utils.toChecksumAddress(accounts[0]);
        const body = JSON.stringify({
            address: account,
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

        // TODO make request to name
        const response = await fetch('/api/send_ether', settings);
        console.log(response)
        const result = await response.json();
        if (response.status !== 200) {
            throw Error(body.message)
        }
        this.checkBalance(account.toString());
        return result;
    }

    render() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', this.accountChangedHandler)
        }
        return (
            <div className="flex flex-col h-screen gap-y-8 items-center">
                <div className="bg-gray-600 w-full h-1/6 flex justify-center shadow-md"><img className="p-8" src={bzlablogo} /></div>
                <div className=" w-5/6 p-16 h-4/6 rounded-lg shadow-md bg-gray-200 flex flex-col text-lg">
                    {ethereum.selectedAddress ? <div className="flex justify-center text-center bg-gray-600 rounded-xl py-4 text-gray-100 shadow-md"><h2 className=""><b>BAGETH Havuzuna</b> Hoş Geldiniz! <br /> Aşağıdaki buton sayesinde hesabınıza <b>0.1 <i>ETH</i></b> gönderebilirsiniz. </h2></div> : (<div className="h-screen flex flex-col items-center justify-center gap-y-4"><span>Hoş Geldiniz! Aşağıdaki butonu kullanarak MetaMask Cüzdanınızı bağlayabilirsiniz.</span><button className="bg-orange-400 text-white font-semibold p-2 px-4 rounded-lg shadow-md hover:bg-orange-500" onClick={this.click}>MetaMask'a Bağlan</button></div>)}
                    <div className="flex flex-col h-full items-center justify-center gap-y-3">
                        <hr />
                        {ethereum.selectedAddress ? (<span><b>Cüzdan Adresi:</b> {this.state.address}</span>) : null}
                        <hr />
                        {ethereum.selectedAddress ? (<span><b>Bakiye:</b> {this.state.balance} <i>ETH</i></span>) : null}
                        <hr />
                        {ethereum.selectedAddress ? (<button className="bg-green-400 text-white font-semibold p-2 px-4 rounded-lg shadow-md hover:bg-green-500" onClick={this.sendEther}>ETH Aktar!</button>) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
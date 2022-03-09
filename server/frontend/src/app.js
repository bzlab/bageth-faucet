import React, { Component, useState } from 'react';
import Web3 from 'web3';
import bzlablogo from './img/bzlablogo.png';
import { ethers } from 'ethers';
import ReactLoading from 'react-loading';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: null,
            balance: null,
            modal_success: false,
            modal_pending: false,
            modal_failed: false,
            data: null,
            deeplink: null
        };
    }

    componentDidMount() {
        this.click();
    }

    isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }


    click = async () => {

        if (this.isMobileDevice()) {
            const dappUrl = process.env.REACT_APP_DAPP_URL; // TODO enter your dapp URL. For example: https://uniswap.exchange. (don't enter the "https://")
            const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
            this.setState({deeplink: metamaskAppDeepLink});

        }else if (typeof window.ethereum !== 'undefined') {
            console.log("Connecting to Metamask Account...")
            // TODO refactor to function
            // Source https://davidkathoh.medium.com/programatically-switch-network-on-metamask-e9a44525cab
            const chainId = await window.ethereum.request({ method: `eth_chainId` });
            const bagethChainId = process.env.REACT_APP_CHAIN_ID

            if (chainId === bagethChainId) {
                console.log("BAGETH network");
            } else {
                console.log("Different network")
            }

            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: process.env.REACT_APP_CHAIN_ID }],
                });
                console.log("You have succefully switched to BAGETH network")
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                console.log(switchError)

                if (switchError.code === 4902) {
                    console.log("This network is not available in your metamask, please add it")
                    // TODO Kullaniciya hatayi bildir
                }
                console.log("Failed to switch to the network")
            }


            this.setState({deeplink: null});

        } else {
            console.log("Install MetaMask Wallet");
            this.setState({deeplink: null});
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(res => { this.accountChangedHandler(res[0]) });
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
        this.setState({ modal_pending: true });
        const response = await fetch('/api/send_ether', settings)
            .then(res => { this.setState({ modal_pending: false, data: res }) })
        const res = this.state.data;
        const balance = await res.json();
        this.setState({ balance: balance.balance });
        if (res.status !== 200) {
            throw Error(body.message)
            this.setState({ modal_failed: true });

            setTimeout(function () {
                this.setState({ modal_failed: false });
            }.bind(this), 3000);
        }
        if (res.status == 200) {
            this.setState({ modal_success: true });

            setTimeout(function () {
                this.setState({ modal_success: false });
            }.bind(this), 3000);
        }
    }

    render() {
        if (!this.isMobileDevice()) {
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.on('accountsChanged', this.accountChangedHandler)
            }
        }
        return (
            <div className="flex flex-col h-screen gap-y-8 items-center">
                <div className="bg-gray-600 w-full h-1/6 flex justify-center shadow-md object-contain"><img className="p-10" src={bzlablogo} /></div>
                {this.state.modal_pending ?
                    <div className="flex items-center justify-center gap-x-4 bg-blue-400 w-3/4 md:w-1/3 text-xs md:text-base p-3 md:p-4 text-white font-semibold shadow-md rounded-md"><ReactLoading className="text-white text-center my-auto md:mt-1" type='spin' height='16px' width='16px' /><span>Ethereum aktarma işlemi başladı...</span></div> : null}
                {this.state.modal_failed ? <div className="flex items-center justify-center bg-red-400 w-3/4 md:w-1/3 text-xs md:text-base p-3 md:p-4 text-white font-semibold shadow-md rounded-md"> Ethereum aktarımı sırasında sorun oluştu.</div> : null}
                {this.state.modal_success ? <div className="flex items-center justify-center bg-green-400 w-3/4 md:w-1/3 text-xs md:text-base p-3 md:p-4 text-white font-semibold shadow-md rounded-md"> Ethereum başarıyla hesabınıza aktarıldı. </div> : null}
                <div className=" w-5/6 p-16 h-4/6 rounded-lg shadow-md bg-gray-200 flex flex-col text-lg">
                    {this.state.address ? <div className="flex justify-center text-center bg-gray-600 rounded-xl py-4 px-4 md:px-1 text-gray-100 shadow-md text-sm md:text-lg"><h2 className=""><b>BAGETH Havuzuna</b> Hoş Geldiniz! <br /> Aşağıdaki buton sayesinde hesabınıza <b>0.1 <i>ETH</i></b> gönderebilirsiniz. </h2></div> : (<div className="h-full flex flex-col justify-between items-center gap-y-4"><span className="flex font-semibold justify-center text-center bg-gray-600 rounded-xl py-4 px-8 text-gray-100 shadow-md text-sm md:text-lg">Hoş Geldiniz! Aşağıdaki butonu kullanarak MetaMask Cüzdanınızı bağlayabilirsiniz.</span><a href={this.isMobileDevice() ? this.state.deeplink : null}><button className="bg-orange-400 text-white font-semibold p-2 px-4 rounded-lg shadow-md hover:bg-orange-500" onClick={this.click}>MetaMask'a Bağlan</button></a></div>)}
                    <div className="flex flex-col h-full items-center justify-center gap-y-3 text-[13px] md:text-lg">
                        <hr />
                        {this.state.address ? (<span className="flex flex-col text-center"><b>Cüzdan Adresi:</b><span>{this.state.address}</span></span>) : null}
                        <hr />
                        {this.state.address ? (<span><b>Bakiye:</b> <span>{this.state.balance} <i>ETH</i></span></span>) : null}
                        <hr />
                        {this.state.address ? (<button className="bg-green-400 text-white font-semibold p-2 px-4 rounded-lg shadow-md hover:bg-green-500" onClick={this.sendEther}>ETH Aktar!</button>) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
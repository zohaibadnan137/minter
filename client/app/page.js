"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Page = () => {
  // Wallet state variables
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(
    "0x00f0000000000000000000000000000000000000"
  );
  const [walletBalance, setWalletBalance] = useState(0);

  // Counter to select the number of tokens to transfer
  const [counter, setcounter] = useState(0);

  // Wallet connection handler
  const connectWalletHandler = () => {
    if (window.ethereum) {
      // Initialize the provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request account access
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        // Set the wallet address
        setWalletAddress(res[0]);

        // Get the wallet balance
        provider.getBalance(res[0]).then((balance) => {
          setWalletBalance(ethers.utils.formatEther(balance));

          setIsWalletConnected(true);
        });
      });
    } else {
      alert("Please install the MetaMask extension!");
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          // Account disconnected
          setIsWalletConnected(false);
          setWalletAddress("0x00f0000000000000000000000000000000000000");
          setWalletBalance(0);
        } else if (accounts[0] !== walletAddress) {
          setWalletAddress(accounts[0]);

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          provider.getBalance(accounts[0]).then((balance) => {
            setWalletBalance(ethers.utils.formatEther(balance));
          });

          setIsWalletConnected(true);
        }
      });
    }
  }, [walletAddress]);

  return (
    <div className="container">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Your Wallet</p>
        </header>
        <div className="card-content">
          <div className="content">
            <p>Wallet Address: {walletAddress}</p>
            <p>Wallet Balance: {walletBalance}</p>
            <br />
            <div className="has-text-centered">
              {!isWalletConnected ? (
                <button
                  className="button is-light"
                  onClick={connectWalletHandler}
                >
                  Connect to MetaMask
                </button>
              ) : (
                <button className="button is-success">Connected</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <br />

      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Transfer Tokens</p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="field">
              <label className="label has-text-weight-normal">
                Number of Tokens
              </label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Enter the number of tokens to transfer"
                  value={counter}
                  onChange={(e) => setcounter(e.target.value)}
                />
              </div>
            </div>
            <br />
            <div className="has-text-centered">
              <button
                className="button is-success"
                disabled={isWalletConnected ? false : true}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

"use client";

// Import dependencies
import { useState, useEffect } from "react";
import { ethers } from "ethers";
require("dotenv").config();
import { ClipLoader } from "react-spinners";

const Page = () => {
  // Wallet state variables
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(
    "0x00f0000000000000000000000000000000000000"
  );
  const [walletBalance, setWalletBalance] = useState(0);

  // Counter to select the number of tokens to transfer
  const [counter, setCounter] = useState(1);

  // Transaction loading state
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Connected wallet's tokens
  const [walletTokens, setWalletTokens] = useState(["Loading..."]);

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

  const mintTokensHandler = async () => {
    // Ensure that the counter has a value
    if (counter === "") {
      alert("Please enter the number of tokens to mint!");
      return;
    }

    // Ensure that the wallet's balance is sufficient
    const requiredBalance = ethers.utils.formatEther(
      ethers.utils.parseEther("0.1")
    );
    if (walletBalance < requiredBalance) {
      alert("Insufficient balance!");
      return;
    }

    // Start the transaction and set the pending status
    setIsTransactionLoading(true);

    // Make a POST request to the api/ endpoint
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: walletAddress, numberOfTokens: counter }),
      });
      if (res.status === 200) {
        alert("Tokens minted successfully!");
      } else {
        alert("Error minting tokens!");
      }
    } catch (err) {
      alert("Connection error!");
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const getWalletTokens = async () => {
    // Make a GET request to the api/ endpoint
    try {
      const res = await fetch(`api?owner=${walletAddress}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setWalletTokens(data.data);
    } catch {
      alert("Error fetching tokens!");
    }
  };

  // Handlers to open and close the modal
  const openModalHandler = () => {
    getWalletTokens();
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

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
                <button className="button is-dark" onClick={openModalHandler}>
                  Your Tokens
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <br />

      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Mint Tokens</p>
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
                  min={1}
                  placeholder="Enter the number of tokens to mint"
                  value={counter}
                  onChange={(e) => {
                    if (e.target.value === "0") setCounter(1);
                    else if (e.target.value < 0)
                      setCounter(Math.abs(e.target.value));
                    else setCounter(e.target.value);
                  }}
                />
              </div>
            </div>
            <br />
            <div className="has-text-centered">
              <button
                className="button is-dark"
                onClick={mintTokensHandler}
                disabled={!isWalletConnected || isTransactionLoading}
              >
                {isTransactionLoading ? (
                  <div className="spinner-container">
                    <ClipLoader color="#ffffff" size={20} />
                    <span className="spinner-text">Minting...</span>
                  </div>
                ) : (
                  "Mint"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModalHandler}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Your Tokens</p>
              <button
                className="delete"
                aria-label="close"
                onClick={closeModalHandler}
              ></button>
            </header>
            <section className="modal-card-body">
              <ul>
                {walletTokens.map((token) => (
                  <li key={token}>{token}</li>
                ))}
              </ul>
            </section>
            <footer className="modal-card-foot"></footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

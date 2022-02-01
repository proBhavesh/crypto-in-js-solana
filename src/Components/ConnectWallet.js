import React, { useEffect, useState } from "react";
import "./Styles.css";
// import twitterLogo from "./assets/twitter-logo.svg";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const ConnectWallet = ({ setWalletAddress, walletAddress }) => {
  // let walletAddress=null;
  // State
  // const [walletAddress, setWalletAddress] = useState(null);
  // const [walletAddress, setWalletAddress] = useState(false);
  // const [provider, setProvider] = useState();
  const [loading, setLoading] = useState();

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          //if found connect to it
          connectWalletPhantom();
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWalletPhantom = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey);
      // setWalletAddress(true);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWalletPhantom}
    >
      Connect to Wallet
    </button>
  );

  const airDropUI = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={airDropHelper}
    >
      AirDrop 1 SOL
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const airDropHelper = async () => {
    try {
      setLoading(true);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(walletAddress.toString()),
        LAMPORTS_PER_SOL
      );
      console.log(
        `1 SOL airdropped to your wallet ${walletAddress.toString()} successfully`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="App">
        <div className="container">
          <div className="header-container">
            <p className="header">Coin Creater</p>
            <p className="sub-text">Create your own coin with javascript</p>
            {/* Add the condition to show this only if we don't have a wallet address */}
            {!walletAddress && renderNotConnectedContainer()}
          </div>
          <div className="header-container">
            <p className="header">{walletAddress && airDropUI()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectWallet;

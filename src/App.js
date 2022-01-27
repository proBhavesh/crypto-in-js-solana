import React, { useState } from "react";

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState();
  const [loading, setLoading] = useState();

  //provider function
  const getProvider = async () => {
    console.log("provider function called");
    if ("solana" in window) {
      console.log("solana is in window");
      const provider = window.solana;
      console.log("Phantom is installed", provider.isPhantom);
      if (provider.isPhantom) {
        return provider;
      }
    } else {
      console.log("opening in window");
      window.open("https://www.phantom.app/", "_blank");
    }
  };

  //wallet connection helper
  const walletConnectionHelper = async () => {
    console.log("helper function called");
    if (walletConnected) {
      //Disconnect wallet
      console.log("disconnect wallet from helper funciton");
      setProvider();
      setWalletConnected(false);
    } else {
      //connect wallet
      console.log("connect wallet from helper funciton");
      const userWallet = await getProvider();
      console.log("user wallet:", userWallet);
      userWallet.on("connect", async () => {
        setProvider(userWallet);
        setWalletConnected(true);
        console.log("wallet connected");
      });
      console.log("after userWallet.On");
    }
    console.log("helper function finished");
  };
  return (
    <>
      {walletConnected ? (
        <p>
          <strong>Public Key:</strong> {provider.publicKey.toString()}
        </p>
      ) : (
        <p></p>
      )}
      <h2>Create your first cryptocurency in javascript</h2>
      <button onClick={walletConnectionHelper} disabled={loading}>
        {!walletConnected ? "Connect Wallet" : "Disconnect Wallet"}
      </button>
    </>
  );
};

export default App;

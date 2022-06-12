import React, { useState, useEffect } from "react";
import { auth } from "./DB/firebase.js";
import ConnectWallet from "./Components/ConnectWallet.js";
import CreateToken from "./Components/CreateToken.js";
import MintMore from "./Components/MintMore.js";
import Navbar from "./Components/Navbar.js";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [mintingWalletSecretKey, setMintingWalletSecretKey] = useState(null);
  const [createdTokenPublicKey, setCreatedTokenPublicKey] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState([null, false]);

  

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <ConnectWallet
        setWalletAddress={setWalletAddress}
        walletAddress={walletAddress}
      />
      <CreateToken
        walletAddress={walletAddress}
        mintingWalletSecretKey={mintingWalletSecretKey}
        setMintingWalletSecretKey={setMintingWalletSecretKey}
        createdTokenPublicKey={createdTokenPublicKey}
        setCreatedTokenPublicKey={setCreatedTokenPublicKey}
      />
      {/*  <MintMore
        walletAddress={walletAddress}
        mintingWalletSecretKey={mintingWalletSecretKey}
        createdTokenPublicKey={createdTokenPublicKey}
      />*/}
    </div>
  );
};

export default App;

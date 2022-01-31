import React, { useState } from "react";
import ConnectWallet from "./Components/ConnectWallet.js";
import CreateToken from "./Components/CreateToken.js";
import MintMore from "./Components/MintMore.js";
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [mintingWalletSecretKey, setMintingWalletSecretKey] = useState(null);
  const [createdTokenPublicKey, setCreatedTokenPublicKey] = useState(null);

  return (
    <div>
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
      <MintMore
        walletAddress={walletAddress}
        mintingWalletSecretKey={mintingWalletSecretKey}
        createdTokenPublicKey={createdTokenPublicKey}
      />
    </div>
  );
};

export default App;

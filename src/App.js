import React, { useState } from "react";
import ConnectWallet from "./Components/ConnectWallet.js";
import CreateToken from "./Components/CreateToken.js";
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <div>
      <ConnectWallet
        setWalletAddress={setWalletAddress}
        walletAddress={walletAddress}
      />
      <CreateToken walletAddress={walletAddress} />
    </div>
  );
};

export default App;

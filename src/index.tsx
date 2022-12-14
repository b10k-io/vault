import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@ibm/plex/css/ibm-plex.css';
import { BrowserRouter } from "react-router-dom";

import { Hardhat, DAppProvider, Config } from '@usedapp/core'

import * as chains from "./model/chain"

Hardhat.blockExplorerUrl = chains.HardhatExtended.blockExplorerUrl
Hardhat.rpcUrl = chains.HardhatExtended.rpcUrl
Hardhat.getExplorerAddressLink = chains.HardhatExtended.getExplorerAddressLink
Hardhat.getExplorerTransactionLink = chains.HardhatExtended.getExplorerTransactionLink

const config: Config = {
  networks: [
    Hardhat, 
  ],
  readOnlyChainId: Hardhat.chainId,
  readOnlyUrls: {
    [Hardhat.chainId]: Hardhat.rpcUrl || "",
  },
  
}



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

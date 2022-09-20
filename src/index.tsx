import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@ibm/plex/css/ibm-plex.css';
import { BrowserRouter } from "react-router-dom";

import { Hardhat, Mainnet, DAppProvider, Config } from '@usedapp/core'
import { getDefaultProvider } from "ethers"

const config: Config = {
  readOnlyChainId: Hardhat.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider('mainnet')
    // [Hardhat.chainId]: getDefaultProvider(),
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

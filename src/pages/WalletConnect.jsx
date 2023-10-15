import React from "react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal, Web3Button } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { Footer } from "../components/Footer";
const chains = [arbitrum, mainnet, polygon];
const projectId = "5e13fa2664931e9ffbca253148dde5b9";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const ConnectBtn = () => {
  return (
    <Web3Button />
  )
}

export const WalletConnect = () => {
  return (
    <div className="mt-20 ">
    <div className="flex items-center justify-center border-2 h-screen">

    <WagmiConfig config={wagmiConfig}>
        <ConnectBtn />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />

      
    </div>
    <Footer />
    </div>
  );
};

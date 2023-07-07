import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal as Web3Modal0 } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig, Connector } from 'wagmi'
import { arbitrum, mainnet, polygon, bscTestnet, bsc } from 'wagmi/chains'

import { publicProvider } from "@wagmi/core/providers/public";

// import { UAuthWagmiConnector } from "@uauth/wagmi";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";


export default function ({ children }: { children: React.ReactNode }) {

    const projectId = (process.env.REACT_APP_WAGMI_APP_ID) as any

    const { chains, provider } = configureChains(
        [bscTestnet, polygon, bsc],//arbitrum, mainnet, polygon,
        [publicProvider()]
    );

    // const uauthClient = new UAuth({
    //     clientID: "CLIENT_ID",
    //     redirectUri: "REDIRECT_URI",
    //     // Scope must include openid and wallet
    //     scope: "openid wallet",
    // });

    const wagmiClient = createClient({
        autoConnect: true,
        connectors: [
            ...w3mConnectors({ projectId, version: 2, chains }),
        ],
        provider,
    })

    const ethereumClient = new EthereumClient(wagmiClient, chains)

    return (
        <>
            <WagmiConfig client={wagmiClient} >
                {children}
            </WagmiConfig>
            <Web3Modal0
                projectId={projectId}
                ethereumClient={ethereumClient}
            />
        </>
    )
}
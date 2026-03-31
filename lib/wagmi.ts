import { http, createConfig } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors'

// Define Tempo Moderate chain properly (must include all required fields)
const tempoModerato = {
  id: 42431,
  name: 'Tempo Moderate',
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.moderato.tempo.xyz'] },
    public: { http: ['https://rpc.moderato.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Explorer', url: 'https://explore.tempo.xyz' },
  },
  contracts: {},
} as const

// Define Tempo Mainnet chain
const tempo = {
  id: 111,
  name: 'Tempo',
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.tempo.xyz'] },
    public: { http: ['https://rpc.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Explorer', url: 'https://explore.tempo.xyz' },
  },
  contracts: {},
} as const

/**
 * Wagmi Configuration for AgentPad
 * 
 * Features:
 * - Tempo Moderate (Testnet) - Default for development
 * - Tempo (Mainnet) - For production
 * - Zero gas fees on all Tempo chains
 * - WalletConnect, MetaMask, Coinbase Wallet support
 */

export const config = createConfig({
  chains: [tempoModerato, tempo, base, mainnet],
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({ 
      projectId: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID : '85be66e6169307dc900bc2337d69d10a',
    }),
    metaMask(),
    coinbaseWallet({
      appName: 'AgentPad',
      appLogoUrl: 'https://agentpad.vercel.app/logo.png',
    }),
  ],
  transports: {
    [tempoModerato.id]: http('https://rpc.moderato.tempo.xyz'),
    [tempo.id]: http('https://rpc.tempo.xyz'),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true, // Enable server-side rendering support
  multiInjectedProviderDiscovery: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export default config

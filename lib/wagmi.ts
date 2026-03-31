import { http, createConfig } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'

// Tempo chain configuration (manual, since wagmi/tempo not available in v2.12)
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
}

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
}

// WalletConnectors (passkey support requires @wagmi/tempo or viem integration)
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors'

/**
 * Wagmi Configuration for AgentPad
 * 
 * Note: Passkey/WebAuthn authentication requires @wagmi/tempo package which is
 * compatible with wagmi v3+. For v2.12, we use standard wallet connectors.
 * 
 * Chains:
 * - Tempo Moderate (Testnet) - Active
 * - Tempo (Mainnet) - Active  
 * - Base - Future
 * - Mainnet - Future
 */

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development'
const keyManagerUrl = process.env.NEXT_PUBLIC_KEY_MANAGER_URL

export const config = createConfig({
  chains: [tempoModerato, tempo, base, mainnet],
  connectors: [
    // Standard wallet connectors (passkey auth not available in wagmi v2.12)
    injected({ target: 'metaMask' }),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '85be66e6169307dc900bc2337d69d10a'
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

  // Disable injected wallet detection to prefer WalletConnect
  multiInjectedProviderDiscovery: true,
})

// Type declaration for wagmi module augmentation
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export function getKeyManagerType(): 'remote' | 'local' {
  if (keyManagerUrl && !isDevelopment) {
    return 'remote'
  }
  return 'local'
}

export default config

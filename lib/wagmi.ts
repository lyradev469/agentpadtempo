import { http, createConfig } from 'wagmi'
import { mainnet, base, tempo, tempoModerato } from 'wagmi/chains'
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors'
import { KeyManager, webAuthn } from 'wagmi/tempo'

/**
 * Wagmi Configuration for AgentPad with Tempo Passkey Support
 * 
 * Features:
 * 1. Passkey Authentication (WebAuthn) - Primary for Tempo
 *    - Dev Mode: LocalStorage (no backend needed)
 *    - Production: Remote Key Manager (cross-device sync)
 * 2. Standard Wallets - Fallback options (MetaMask, WalletConnect, Coinbase)
 * 
 * Chains:
 * - Tempo Moderate (Testnet, Chain ID: 42431)
 * - Tempo (Mainnet, Chain ID: 111)
 * - Base (Future)
 * - Mainnet (Future)
 */

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development'
const keyManagerUrl = process.env.NEXT_PUBLIC_KEY_MANAGER_URL
const keyManagerApiKey = process.env.NEXT_PUBLIC_KEY_MANAGER_API_KEY

// Configure WebAuthn connector based on environment
const webAuthnConnector = webAuthn({
  keyManager: keyManagerUrl && !isDevelopment
    ? KeyManager.http({
        baseUrl: keyManagerUrl,
        fetchOptions: {
          headers: {
            'X-API-Key': keyManagerApiKey || 'default-dev-key',
          },
        },
      })
    : KeyManager.localStorage(), // Dev fallback - keys stored in browser
})

export const config = createConfig({
  chains: [tempoModerato, tempo, base, mainnet],
  connectors: [
    // Primary: Passkey Authentication (WebAuthn) for Tempo
    webAuthnConnector,

    // Secondary: Standard Wallet Connectors
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

  // Enable multi-injected provider discovery for wallet fallbacks
  multiInjectedProviderDiscovery: true,
})

// Type declaration for wagmi module augmentation
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

/**
 * Helper: Get active key manager type
 * Useful for logging/debugging
 */
export function getKeyManagerType(): 'remote' | 'local' {
  if (keyManagerUrl && !isDevelopment) {
    return 'remote'
  }
  return 'local'
}

export default config

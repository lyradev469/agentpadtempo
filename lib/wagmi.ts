import { http, createConfig } from 'wagmi'
import { mainnet, base, tempo, tempoModerato } from 'wagmi/chains'
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors'

// Tempo-specific imports (available in wagmi >=2.12.8 with viem >=2.21.0)
import { KeyManager, webAuthn } from 'wagmi/tempo'

/**
 * Wagmi Configuration for AgentPad
 * 
 * Supports:
 * 1. Passkey Authentication (WebAuthn) - Primary for Tempo
 *    - Dev Mode: LocalStorage (no backend needed)
 *    - Production: Remote Key Manager (cross-device sync)
 * 2. Standard Wallets - Fallback options
 * 
 * Chains:
 * - Tempo Moderate (Testnet) - Default for development
 * - Tempo (Mainnet) - For production
 * - Base - For future multi-chain support
 * - Mainnet - For future multi-chain support
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
            'X-API-Key': keyManagerApiKey!,
          },
        },
      })
    : KeyManager.localStorage(), // Dev fallback
})

export const config = createConfig({
  chains: [tempoModerato, tempo, base, mainnet],
  connectors: [
    // Primary: Passkey Authentication (WebAuthn) for Tempo
    webAuthnConnector,

    // Secondary: Standard Wallet Connectors
    injected({ target: 'metaMask' }),
    walletConnect({ 
      projectId: keyManagerApiKey || '85be66e6169307dc900bc2337d69d10a'
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

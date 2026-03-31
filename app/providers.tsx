'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createConfig, http } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors'

// Define Tempo chains
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

let config: ReturnType<typeof createConfig> | null = null
let queryClient: QueryClient | null = null

function getConfig() {
  if (!config) {
    config = createConfig({
      chains: [tempoModerato, tempo, base, mainnet],
      connectors: [
        injected({ target: 'metaMask' }),
        walletConnect({ 
          projectId: '85be66e6169307dc900bc2337d69d10a',
        }),
        metaMask(),
        coinbaseWallet({
          appName: 'AgentPad',
        }),
      ],
      transports: {
        [tempoModerato.id]: http('https://rpc.moderato.tempo.xyz'),
        [tempo.id]: http('https://rpc.tempo.xyz'),
        [base.id]: http(),
        [mainnet.id]: http(),
      },
      ssr: true,
    })
  }
  return config
}

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    })
  }
  return queryClient
}

export function Providers({ children }: { children: React.ReactNode }) {
  const wagmiConfig = useMemo(() => getConfig(), [])
  const client = useMemo(() => getQueryClient(), [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

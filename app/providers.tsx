'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'
import { mainnet, base } from 'wagmi/chains'
import { injected, walletConnect, metaMask, coinbaseWallet } from 'wagmi/connectors'

// Minimal Tempo Moderate chain (compatible with Wagmi types)
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
} as const

export function Providers({ children }: { children: React.ReactNode }) {
  const wagmiConfig = useMemo(() => {
    return createConfig({
      chains: [tempoModerato as any, mainnet, base],
      connectors: [
        injected(),
        walletConnect({ 
          projectId: '85be66e6169307dc900bc2337d69d10a',
        }),
        metaMask(),
        coinbaseWallet({ appName: 'AgentPad' }),
      ],
      transports: {
        [tempoModerato.id]: http('https://rpc.moderato.tempo.xyz'),
        [mainnet.id]: http(),
        [base.id]: http(),
      },
      ssr: true,
    })
  }, [])

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }), [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

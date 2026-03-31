'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'
import { injected, walletConnect } from 'wagmi/connectors'

// Tempo Moderate chain
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
  const config = useMemo(() => {
    return createConfig({
      chains: [tempoModerato as any],
      connectors: [
        injected(),
        walletConnect({ projectId: '85be66e6169307dc900bc2337d69d10a' }),
      ],
      transports: {
        [tempoModerato.id]: http('https://rpc.moderato.tempo.xyz'),
      },
    })
  }, [])

  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    // @ts-ignore - Type incompatibility workaround
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

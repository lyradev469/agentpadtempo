/**
 * Tempo-Specific Wagmi Exports
 * 
 * Official Tempo SDK hooks and actions for AgentPad.
 * Import from this file to get type-safe Tempo integrations.
 * 
 * @see https://wagmi.sh/tempo
 * @see https://docs.tempo.xyz/sdk/typescript
 */

// Tempo Hooks (use these for Tempo-specific features)
export { 
  Hooks as TempoHooks,
  useSendTransactionSync as useSendTempoTransactionSync,
  usePrepareSendTransactionSync as usePrepareTempoSendTransactionSync,
} from 'wagmi/tempo'

// Tempo Actions (for non-React contexts)
export { 
  actions as tempoActions,
  prepareSendTransactionSync as prepareTempoSendTransactionSync,
} from 'wagmi/tempo/actions'

// Tempo Chains (already exported from wagmi/chains, but re-export for clarity)
export { 
  tempo, 
  tempoModerato,
  tempoMainnet,
} from 'wagmi/chains'

// WebAuthn connector (for passkey auth)
export { 
  webAuthn, 
  KeyManager,
} from 'wagmi/tempo'

// Re-export standard wagmi hooks for convenience
export { 
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  usePrepareSendTransaction,
  useWaitForTransaction,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi'

// Viem utilities (for contract interactions)
export { 
  createClient,
  http,
  publicActions,
  walletActions,
} from 'viem'

// Tempo-specific client actions
export { 
  tempoActions as tempoClientActions,
} from 'viem/tempo'

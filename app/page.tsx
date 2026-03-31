'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

export default function Home() {
  const { address, isConnected } = useAccount()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('ready')
  }, [])

  return (
    <div className="min-h-screen bg-white text-black font-sans p-12">
      <header className="mb-12">
        <h1 className="text-6xl font-bold mb-4">agentpad</h1>
        <p className="text-lg text-gray-600">Tempo Integration Test</p>
      </header>

      {status === 'loading' ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="p-6 border-2 border-black">
            <h2 className="text-xl font-semibold mb-3">Connection Status</h2>
            <p className="text-gray-600">
              {isConnected ? (
                <span className="text-green-600 font-mono">✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
              ) : (
                <span className="text-red-600">❌ Not connected</span>
              )}
            </p>
          </div>

          {/* Connect Button */}
          <div className="p-6 border-2 border-black">
            <h2 className="text-xl font-semibold mb-3">Connect Wallet</h2>
            {!isConnected ? (
              <div className="space-y-3">
                <button
                  onClick={() => connect.connect({ connector: connect.connectors.find(c => c.id === 'injected') || connect.connectors[0] })}
                  className="px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800"
                >
                  MetaMask
                </button>
                <button
                  onClick={() => connect.connect({ connector: connect.connectors.find(c => c.id === 'walletConnect') || connect.connectors[1] })}
                  className="px-6 py-3 bg-gray-100 text-black font-semibold hover:bg-gray-200 border-2 border-black"
                >
                  WalletConnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => disconnect.disconnect()}
                className="px-6 py-3 bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                Disconnect
              </button>
            )}
          </div>

          {/* Chain Info */}
          <div className="p-6 border-2 border-black">
            <h2 className="text-xl font-semibold mb-3">Chain Info</h2>
            <p className="text-gray-600">Chain ID: 42431 (Tempo Moderate)</p>
            <p className="text-gray-600">RPC: https://rpc.moderato.tempo.xyz</p>
          </div>

          {/* Debug Info */}
          <div className="p-6 border-2 border-gray-300 bg-gray-50">
            <h2 className="text-xl font-semibold mb-3">Debug</h2>
            <pre className="text-xs text-gray-700 font-mono">
              {JSON.stringify({
                isConnected,
                address: address || null,
                connectors: connect.connectors?.map(c => c.id) || [],
                status,
                timestamp: new Date().toISOString()
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <footer className="mt-24 pt-8 border-t border-gray-300 text-gray-500 text-sm">
        <p>AgentPad • Tempo Integration • {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

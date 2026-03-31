'use client'

import { useState } from 'react'
import { useConnect, useConnectors, useConnection, useDisconnect } from 'wagmi'

/**
 * PasskeyAuth Component
 * 
 * Provides passwordless authentication via WebAuthn passkeys for Tempo accounts.
 * Users can create (sign up) or use existing (sign in) passkey credentials bound to this domain.
 * 
 * Features:
 * - Biometric authentication (Touch ID, Face ID, Windows Hello)
 * - Domain-bound credentials (secure against phishing)
 * - Loading states and error handling
 * - Seamless integration with Tempo zero-gas transactions
 * 
 * Note: Currently uses localStorage for key persistence (dev mode).
 * For production, deploy remote key manager backend and set NEXT_PUBLIC_KEY_MANAGER_URL.
 */

export function PasskeyAuth() {
  const [isCreating, setIsCreating] = useState(false)
  const account = useConnection()
  const connect = useConnect()
  const connectors = useConnectors()
  const disconnect = useDisconnect()

  // Find the webAuthn connector (should be the first one in our config)
  const webAuthnConnector = connectors[0]

  // Handle loading state during connection
  if (connect.isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking for passkey... Please approve in your browser</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (connect.error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-700 font-medium">Authentication Failed</p>
        <p className="text-red-600 text-sm mt-1">{connect.error.message}</p>
        <button
          onClick={() => connect.reset?.()}
          className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  // Authenticated state: show account info and sign out
  if (account.address) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">Connected with Passkey</p>
              <p className="text-green-600 text-sm font-mono mt-1">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs text-green-700">Active</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => disconnect.disconnect()}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          Sign Out
        </button>

        <p className="text-xs text-gray-500 text-center">
          Passkey stored securely on this device. Syncs via iCloud/Google Password Manager
        </p>
      </div>
    )
  }

  // Unauthenticated state: show sign up / sign in buttons
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sign in with Passkey</h3>
        <p className="text-sm text-gray-500 mt-1">
          Passwordless authentication using biometrics. Zero gas fees on Tempo.
        </p>
      </div>

      <div className="space-y-3">
        {/* Sign Up - Create New Account */}
        <button
          onClick={async () => {
            if (!webAuthnConnector) return
            setIsCreating(true)
            try {
              await connect.connectAsync({
                connector: webAuthnConnector,
                capabilities: { type: 'sign-up' as const },
              })
            } catch (error) {
              console.error('Sign up failed:', error)
            } finally {
              setIsCreating(false)
            }
          }}
          disabled={isCreating || !webAuthnConnector}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating Account...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Sign Up with Passkey
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Sign In - Use Existing Account */}
        <button
          onClick={async () => {
            if (!webAuthnConnector) return
            try {
              await connect.connectAsync({
                connector: webAuthnConnector,
              })
            } catch (error) {
              console.error('Sign in failed:', error)
            }
          }}
          disabled={!webAuthnConnector}
          className="w-full py-3 px-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
          </svg>
          Sign In with Existing Passkey
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium">How it works</p>
            <p className="mt-1 text-blue-700">
              Your passkey is stored securely in your device's hardware enclave and synced across 
              devices via iCloud or Google Password Manager. All Tempo transactions have zero gas fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

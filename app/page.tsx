'use client'

import { useEffect, useState } from 'react'
import { WalletConnect } from '@/components/WalletConnect'
// PasskeyAuth disabled for stable deployment
// import { PasskeyAuth } from '@/components/PasskeyAuth'
import { LaunchList } from '@/components/LaunchList'
import { CreateLaunch } from '@/components/CreateLaunch'
import { RegisterAgent } from '@/components/RegisterAgent'
import { FeeSponsorshipPanel } from '@/components/FeeSponsorshipPanel'
import { DEXSwapModal } from '@/components/DEXSwapModal'
import { MPPPayment } from '@/components/MPPPayment'
import { LaunchStats } from '@/components/LaunchStats'
import HealthMonitor from '@/components/HealthMonitor'
import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Shield, DollarSign, ArrowUpRight, TrendingUp, Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'
export const revalidate = 0

if (typeof window !== 'undefined') {
  const clashLink = document.createElement('link')
  clashLink.href = 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap'
  clashLink.rel = 'stylesheet'
  document.head.appendChild(clashLink)
}

export default function Home() {
  const { isConnected, address } = useAccount()
  const [isAgent, setIsAgent] = useState<boolean | null>(null)
  const [showSponsorship, setShowSponsorship] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [swapData, setSwapData] = useState<any>(null)

  const handleCloseSponsorship = () => setShowSponsorship(false)
  const handleSuccessSponsorship = () => setShowSponsorship(false)
  const handleCloseSwap = () => setShowSwap(false)
  const handleSuccessSwap = () => setShowSwap(false)

  useEffect(() => {
    if (isConnected && address) {
      const stored = localStorage.getItem(`agent-${address}`)
      setIsAgent(stored === 'true')
    } else {
      setIsAgent(null)
    }
  }, [isConnected, address])

  const handleProjectRegistered = (projectId: number) => {
    setIsAgent(true)
    if (address) {
      localStorage.setItem(`agent-${address}`, 'true')
    }
  }

  const handleFeeSponsorshipEnabled = () => {
    setShowSponsorship(false)
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header - Brutalist Minimal */}
      <header className="border-b border-black py-8 px-6 md:px-12">
        <div className="container-simple">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="badge-mono mb-6">Tempo Mainnet Live</Badge>
          </motion.div>

          <motion.h1
            className="text-macro mb-6 tracking-macro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            agent<span className="text-gray-400">pad</span>
          </motion.h1>

          <motion.p
            className="text-micro max-w-[600px] mb-8 tracking-micro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Launch your token in minutes. Zero gas fees for contributors, multi-stablecoin funding.
          </motion.p>

          {!isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Connect wallet to launch
              </p>
            </motion.div>
          )}
        </div>
      </header>

      <div className="container-simple px-6 md:px-12 py-12">
        <div className="mb-8">
          <WalletConnect />
        </div>
        
        {/* Passkey Auth disabled for stable deployment
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <WalletConnect />
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" />
              Passkey Authentication
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Sign in securely with biometrics. No passwords, no gas fees.
            </p>
            <PasskeyAuth />
          </div>
        </div>
        */}

        {/* LIVE STATS BAR */}
        <LaunchStats />

        {/* Fee Sponsorship */}
        <AnimatePresence>
          {isConnected && showSponsorship && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="card-brutalist-dark">
                <CardContent className="p-0">
                  <FeeSponsorshipPanel onSponsorshipEnabled={handleFeeSponsorshipEnabled} />
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Project Registration */}
        <AnimatePresence>
          {isConnected && !isAgent && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="card-brutalist">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-semibold mb-2">Register Project</h3>
                  <p className="text-gray-600 mb-6">Create your identity on Tempo to launch tokens.</p>
                  <RegisterAgent onSuccess={handleProjectRegistered} />
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Control Center */}
        {isAgent === true && isConnected && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-micro mb-8 tracking-micro">Control Center</h2>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Button
                  onClick={() => setShowSponsorship(!showSponsorship)}
                  className="w-full h-40 flex flex-col items-start justify-start p-6 bg-white border-2 border-black hover:bg-gray-50 transition-all duration-200 rounded-none"
                >
                  <div className="flex items-center justify-between w-full mb-4">
                    <Zap className="h-8 w-8" />
                    <ArrowUpRight className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-lg font-semibold">Fee Sponsorship</div>
                  <div className="text-sm text-gray-600">Zero-gas for users</div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Button
                  onClick={() => setShowSwap(true)}
                  className="w-full h-40 flex flex-col items-start justify-start p-6 bg-white border-2 border-black hover:bg-gray-50 transition-all duration-200 rounded-none"
                >
                  <div className="flex items-center justify-between w-full mb-4">
                    <DollarSign className="h-8 w-8" />
                    <ArrowUpRight className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-lg font-semibold">Token Swap</div>
                  <div className="text-sm text-gray-600">Convert stablecoins</div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Button
                  onClick={() => alert('MPP payments coming soon!')}
                  className="w-full h-40 flex flex-col items-start justify-start p-6 bg-white border-2 border-black hover:bg-gray-50 transition-all duration-200 rounded-none"
                >
                  <div className="flex items-center justify-between w-full mb-4">
                    <Shield className="h-8 w-8" />
                    <ArrowUpRight className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-lg font-semibold">MPP Payments</div>
                  <div className="text-sm text-gray-600">Multi-token payouts</div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Main Content - Grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-brutalist"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Launch</h2>
              <div className="w-1 h-6 bg-black" />
            </div>
            <CreateLaunch />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-brutalist"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Active Launches</h2>
              <div className="w-1 h-6 bg-black" />
            </div>
            <LaunchList />
          </motion.section>
        </div>

        {/* DEX Swap Modal */}
        <AnimatePresence>
          {showSwap && swapData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
            >
              <DEXSwapModal
                fromToken={swapData.from}
                toToken={swapData.to}
                amount={swapData.amount}
                onClose={handleCloseSwap}
                onSuccess={handleSuccessSwap}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Health Monitor */}
        <HealthMonitor />

        {/* Footer */}
        <motion.footer
          className="mt-24 py-12 border-t border-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-sm">agentpad / tempo / open source</span>
          </div>
          <div className="flex justify-center gap-6 text-xs text-gray-600">
            <a href="https://docs.tempo.xyz" className="hover:text-black">Docs</a>
            <span>/</span>
            <a href="https://explore.tempo.xyz" className="hover:text-black">Explorer</a>
            <span>/</span>
            <a href="https://wallet.tempo.xyz" className="hover:text-black">Wallet</a>
            <span>/</span>
            <a href="/landing" className="hover:text-black">Landing</a>
            <span>/</span>
            <a href="https://github.com/lyradev469" className="hover:text-black">GitHub</a>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

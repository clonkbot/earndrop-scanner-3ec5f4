import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { formatEther, isAddress } from 'viem'

// Mock airdrop data - in production this would come from an API/indexer
const MOCK_AIRDROPS = [
  {
    id: 1,
    name: 'BASE HORIZON',
    protocol: 'Horizon Protocol',
    token: 'HZN',
    status: 'eligible',
    amount: '2,450',
    value: '$847.20',
    deadline: '2024-03-15',
    category: 'DeFi',
    logo: '◈',
  },
  {
    id: 2,
    name: 'NEON SWAP',
    protocol: 'NeonSwap DEX',
    token: 'NEON',
    status: 'eligible',
    amount: '15,000',
    value: '$1,234.50',
    deadline: '2024-04-01',
    category: 'DEX',
    logo: '◎',
  },
  {
    id: 3,
    name: 'CYBER VAULT',
    protocol: 'CyberVault Finance',
    token: 'CVT',
    status: 'pending',
    amount: '500',
    value: '$420.00',
    deadline: '2024-05-20',
    category: 'Yield',
    logo: '⬡',
  },
  {
    id: 4,
    name: 'GRID NETWORK',
    protocol: 'GridNet L2',
    token: 'GRID',
    status: 'claimed',
    amount: '8,200',
    value: '$1,640.00',
    deadline: '2024-01-10',
    category: 'Infrastructure',
    logo: '▣',
  },
  {
    id: 5,
    name: 'PHANTOM LENS',
    protocol: 'Phantom Social',
    token: 'PHTM',
    status: 'eligible',
    amount: '3,750',
    value: '$562.50',
    deadline: '2024-06-30',
    category: 'Social',
    logo: '◉',
  },
  {
    id: 6,
    name: 'SYNTH CORE',
    protocol: 'SynthCore AI',
    token: 'SYNTH',
    status: 'not_eligible',
    amount: '0',
    value: '$0.00',
    deadline: '2024-02-28',
    category: 'AI',
    logo: '⬢',
  },
]

const OPPORTUNITIES = [
  {
    id: 1,
    name: 'AERO BOOST',
    protocol: 'Aerodrome',
    action: 'Provide liquidity',
    probability: 'High',
    requirements: ['Swap on Base', 'Add LP', 'Lock for 4 weeks'],
    estimatedValue: '$500-2,000',
  },
  {
    id: 2,
    name: 'FRAME PASS',
    protocol: 'Farcaster Frames',
    action: 'Deploy a Frame',
    probability: 'Medium',
    requirements: ['Farcaster account', 'Deploy frame', 'Get 100+ interactions'],
    estimatedValue: '$200-800',
  },
  {
    id: 3,
    name: 'OMNI BRIDGE',
    protocol: 'Omni Network',
    action: 'Cross-chain bridge',
    probability: 'High',
    requirements: ['Bridge ETH to Base', 'Use 3+ dApps', 'Hold for 30 days'],
    estimatedValue: '$300-1,500',
  },
]

function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`glitch-text ${className}`} data-text={text}>
      {text}
    </span>
  )
}

function ScanlineOverlay() {
  return <div className="scanlines" />
}

function CRTEffect() {
  return (
    <>
      <div className="crt-flicker" />
      <div className="crt-glow" />
    </>
  )
}

function TerminalHeader() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="terminal-header">
      <div className="flex items-center gap-2">
        <span className="text-cyan-400">▶</span>
        <span className="text-cyan-300 font-mono text-xs sm:text-sm">SYS://AIRDROP_SCANNER_v2.4</span>
      </div>
      <div className="font-mono text-xs text-amber-400 hidden sm:block">
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </div>
    </div>
  )
}

function StatusIndicator({ status }: { status: string }) {
  const statusConfig = {
    eligible: { color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/50', label: 'ELIGIBLE' },
    pending: { color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/50', label: 'PENDING' },
    claimed: { color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50', label: 'CLAIMED' },
    not_eligible: { color: 'text-red-400', bg: 'bg-red-400/20', border: 'border-red-400/50', label: 'LOCKED' },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_eligible

  return (
    <span className={`px-2 py-0.5 text-xs font-mono ${config.color} ${config.bg} border ${config.border} rounded`}>
      {config.label}
    </span>
  )
}

function AirdropCard({ airdrop }: { airdrop: typeof MOCK_AIRDROPS[0] }) {
  return (
    <div className={`airdrop-card ${airdrop.status === 'eligible' ? 'eligible' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="airdrop-logo">{airdrop.logo}</div>
          <div>
            <h3 className="font-mono text-cyan-300 font-bold text-xs sm:text-sm">{airdrop.name}</h3>
            <p className="text-xs text-gray-500 font-mono">{airdrop.protocol}</p>
          </div>
        </div>
        <StatusIndicator status={airdrop.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
        <div className="data-field">
          <span className="text-gray-500 text-xs">TOKEN</span>
          <span className="text-magenta-400 font-mono text-sm sm:text-base">${airdrop.token}</span>
        </div>
        <div className="data-field">
          <span className="text-gray-500 text-xs">AMOUNT</span>
          <span className="text-cyan-300 font-mono text-sm sm:text-base">{airdrop.amount}</span>
        </div>
        <div className="data-field">
          <span className="text-gray-500 text-xs">VALUE</span>
          <span className="text-emerald-400 font-mono text-sm sm:text-base">{airdrop.value}</span>
        </div>
        <div className="data-field">
          <span className="text-gray-500 text-xs">DEADLINE</span>
          <span className="text-amber-400 font-mono text-sm sm:text-base">{airdrop.deadline}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-cyan-900/30">
        <span className="category-tag">{airdrop.category}</span>
        {airdrop.status === 'eligible' && (
          <button className="claim-btn">
            CLAIM ▶
          </button>
        )}
        {airdrop.status === 'claimed' && (
          <span className="text-xs text-cyan-400/50 font-mono">✓ ACQUIRED</span>
        )}
      </div>
    </div>
  )
}

function OpportunityCard({ opp }: { opp: typeof OPPORTUNITIES[0] }) {
  const probabilityColor = {
    High: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/50',
    Medium: 'text-amber-400 bg-amber-400/20 border-amber-400/50',
    Low: 'text-red-400 bg-red-400/20 border-red-400/50',
  }

  return (
    <div className="opportunity-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-mono text-magenta-400 font-bold text-sm">{opp.name}</h3>
          <p className="text-xs text-gray-500 font-mono">{opp.protocol}</p>
        </div>
        <span className={`px-2 py-0.5 text-xs font-mono border rounded ${probabilityColor[opp.probability as keyof typeof probabilityColor]}`}>
          {opp.probability.toUpperCase()}
        </span>
      </div>

      <div className="mb-3">
        <span className="text-gray-500 text-xs">ACTION REQUIRED</span>
        <p className="text-cyan-300 font-mono text-sm">{opp.action}</p>
      </div>

      <div className="mb-3">
        <span className="text-gray-500 text-xs block mb-1">REQUIREMENTS</span>
        <ul className="space-y-1">
          {opp.requirements.map((req, i) => (
            <li key={i} className="text-xs text-gray-400 font-mono flex items-center gap-2">
              <span className="text-cyan-400">›</span> {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-magenta-900/30">
        <div>
          <span className="text-gray-500 text-xs">EST. VALUE</span>
          <p className="text-emerald-400 font-mono text-sm">{opp.estimatedValue}</p>
        </div>
        <button className="action-btn">
          START ▶
        </button>
      </div>
    </div>
  )
}

function StatsPanel({ address }: { address: `0x${string}` }) {
  const { data: balance } = useBalance({ address })

  const eligibleCount = MOCK_AIRDROPS.filter(a => a.status === 'eligible').length
  const totalValue = MOCK_AIRDROPS
    .filter(a => a.status === 'eligible')
    .reduce((sum, a) => sum + parseFloat(a.value.replace('$', '').replace(',', '')), 0)

  return (
    <div className="stats-panel">
      <div className="stat-item">
        <span className="stat-label">WALLET BALANCE</span>
        <span className="stat-value text-cyan-400">
          {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ETH` : '---'}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">ELIGIBLE DROPS</span>
        <span className="stat-value text-emerald-400">{eligibleCount}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">TOTAL VALUE</span>
        <span className="stat-value text-magenta-400">${totalValue.toFixed(2)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">OPPORTUNITIES</span>
        <span className="stat-value text-amber-400">{OPPORTUNITIES.length}</span>
      </div>
    </div>
  )
}

function AddressChecker() {
  const [inputAddress, setInputAddress] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = () => {
    if (!inputAddress) {
      setError('ENTER ADDRESS')
      return
    }
    if (!isAddress(inputAddress)) {
      setError('INVALID ADDRESS FORMAT')
      return
    }
    setError('')
    setIsChecking(true)
    setTimeout(() => setIsChecking(false), 2000)
  }

  return (
    <div className="address-checker">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500 font-mono">CHECK ANOTHER ADDRESS</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="0x..."
            className="address-input flex-1"
          />
          <button
            onClick={handleCheck}
            className="scan-btn"
            disabled={isChecking}
          >
            {isChecking ? 'SCANNING...' : 'SCAN ▶'}
          </button>
        </div>
        {error && <span className="text-xs text-red-400 font-mono">{error}</span>}
      </div>
    </div>
  )
}

function Dashboard() {
  const { address } = useAccount()
  const [activeTab, setActiveTab] = useState<'airdrops' | 'opportunities'>('airdrops')
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(true)

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false)
            return 100
          }
          return prev + 5
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isScanning])

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-mono">CONNECTED TERMINAL</span>
          <span className="text-cyan-400 font-mono text-sm sm:text-base tracking-wider">{truncatedAddress}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-mono">ONLINE</span>
          </div>
        </div>
      </div>

      {isScanning ? (
        <div className="scan-progress">
          <div className="flex justify-between items-center mb-2">
            <span className="text-cyan-400 font-mono text-sm">SCANNING BLOCKCHAIN...</span>
            <span className="text-amber-400 font-mono text-sm">{scanProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${scanProgress}%` }} />
          </div>
          <div className="mt-3 font-mono text-xs text-gray-500">
            <span className="text-cyan-400">▶</span> Analyzing wallet history...
          </div>
        </div>
      ) : (
        <>
          <StatsPanel address={address!} />
          <AddressChecker />

          <div className="tab-nav">
            <button
              onClick={() => setActiveTab('airdrops')}
              className={`tab-btn ${activeTab === 'airdrops' ? 'active' : ''}`}
            >
              <span className="hidden sm:inline">ELIGIBLE</span> AIRDROPS
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`tab-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
            >
              OPPORTUNITIES
            </button>
          </div>

          {activeTab === 'airdrops' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {MOCK_AIRDROPS.map(airdrop => (
                <AirdropCard key={airdrop.id} airdrop={airdrop} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {OPPORTUNITIES.map(opp => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="logo-container">
          <div className="logo-glow" />
          <div className="logo">
            <span className="logo-text">◈</span>
          </div>
        </div>

        <h1 className="landing-title">
          <GlitchText text="EARNDROP" />
        </h1>
        <p className="landing-subtitle">
          AIRDROP SCANNER & ELIGIBILITY CHECKER
        </p>

        <div className="feature-grid">
          <div className="feature-item">
            <span className="feature-icon">◎</span>
            <span className="feature-text">SCAN WALLET</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">◈</span>
            <span className="feature-text">CHECK ELIGIBILITY</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">▣</span>
            <span className="feature-text">CLAIM TOKENS</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⬡</span>
            <span className="feature-text">FIND OPPORTUNITIES</span>
          </div>
        </div>

        <div className="connect-prompt">
          <div className="prompt-text">
            <span className="text-cyan-400">▶</span> CONNECT WALLET TO INITIALIZE SCAN
          </div>
          <div className="connect-wrapper">
            <ConnectButton />
          </div>
        </div>

        <div className="terminal-output">
          <div className="terminal-line">
            <span className="text-gray-500">[SYS]</span> <span className="text-cyan-400">Initializing airdrop scanner...</span>
          </div>
          <div className="terminal-line">
            <span className="text-gray-500">[NET]</span> <span className="text-emerald-400">Connected to Base Network</span>
          </div>
          <div className="terminal-line">
            <span className="text-gray-500">[DB]</span> <span className="text-amber-400">Loaded 847 active airdrops</span>
          </div>
          <div className="terminal-line typing">
            <span className="text-gray-500">[WAIT]</span> <span className="text-magenta-400">Awaiting wallet connection...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <span>Requested by <a href="https://x.com/Nishant293" target="_blank" rel="noopener noreferrer">@Nishant293</a> · Built by <a href="https://x.com/clonkbot" target="_blank" rel="noopener noreferrer">@clonkbot</a></span>
    </footer>
  )
}

export default function App() {
  const { isConnected } = useAccount()

  return (
    <div className="app">
      <ScanlineOverlay />
      <CRTEffect />

      <header className="header">
        <TerminalHeader />
        <div className="header-main">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-cyan-400 text-xl sm:text-2xl">◈</span>
            <span className="font-mono text-cyan-300 font-bold tracking-widest text-sm sm:text-lg">EARNDROP</span>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="main">
        {isConnected ? <Dashboard /> : <LandingPage />}
      </main>

      <Footer />
    </div>
  )
}

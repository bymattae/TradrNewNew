'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { colors, components, layout } from '@/app/lib/styles/designSystem';
import { connectAccount, updateStrategyMetrics } from '@/app/lib/actions/strategy';
import { toast } from 'sonner';

interface Server {
  name: string;
  region: string;
}

export default function ConnectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    server: '',
    platform: 'mt5' as 'mt4' | 'mt5'
  });

  // Get strategyId from URL
  const [strategyId, setStrategyId] = useState('');
  
  useEffect(() => {
    // Extract strategyId from URL path
    const path = window.location.pathname;
    const match = path.match(/\/strategy\/([A-Z0-9]{6})\/connect/);
    if (match) {
      setStrategyId(match[1]);
    }
  }, []);

  const [stats, setStats] = useState({
    gain: '0%',
    winRate: '0%',
    riskRatio: '1:1',
  });

  const [showStats, setShowStats] = useState(false);
  const [showOnProfile, setShowOnProfile] = useState(true);
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/metastats/servers');
        const data = await response.json();
        
        if (data.success) {
          setServers(data.servers);
        } else {
          toast.error('Failed to load servers');
        }
      } catch (error) {
        console.error('Error fetching servers:', error);
        toast.error('Failed to load servers');
      }
    };

    fetchServers();
  }, []);

  const handleSync = async () => {
    if (!formData.username || !formData.password || !formData.server || !formData.platform) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!strategyId) {
      toast.error('Strategy ID not found');
      return;
    }

    setLoading(true);
    try {
      // 1. Connect account to MetaApi
      const connectResult = await connectAccount({
        strategyId,
        login: formData.username,
        password: formData.password,
        server: formData.server,
        platform: formData.platform
      });

      if (!connectResult.success || !connectResult.account_id) {
        throw new Error(connectResult.error || 'Failed to connect account');
      }

      // 2. Fetch and update metrics
      const metricsResult = await updateStrategyMetrics(strategyId, connectResult.account_id);
      
      if (!metricsResult.success || !metricsResult.metrics) {
        throw new Error(metricsResult.error || 'Failed to fetch metrics');
      }

      // 3. Update UI with metrics
      setStats({
        gain: `${metricsResult.metrics.gain}%`,
        winRate: `${metricsResult.metrics.winRate}%`,
        riskRatio: `1:${Math.round(metricsResult.metrics.averageRiskReward)}`
      });
      
      setShowStats(true);
      toast.success('Account connected successfully');

    } catch (error: any) {
      console.error('Error connecting account:', error);
      toast.error(error.message || 'Failed to connect account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={layout.container}>
      {/* Header */}
      <div className={components.nav.header}>
        <button 
          onClick={() => router.back()}
          className={components.button.icon}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Connect your stats</h1>
          <p className="text-sm text-gray-400 mt-1">2/3 steps</p>
        </div>
        <div className="w-5"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8 space-y-8 overflow-y-auto scrollbar-hide max-w-2xl mx-auto w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, platform: 'mt4' }))}
              className={`flex items-center justify-center px-4 py-3.5 rounded-xl border ${
                formData.platform === 'mt4'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-900/50 border-zinc-800/50 text-gray-400'
              }`}
            >
              MT4
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, platform: 'mt5' }))}
              className={`flex items-center justify-center px-4 py-3.5 rounded-xl border ${
                formData.platform === 'mt5'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-900/50 border-zinc-800/50 text-gray-400'
              }`}
            >
              MT5
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">MT Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Enter username"
            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Investor Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter password"
            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Server</label>
          <select
            value={formData.server}
            onChange={(e) => setFormData(prev => ({ ...prev, server: e.target.value }))}
            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl appearance-none"
          >
            <option value="" className="bg-zinc-900">Select server</option>
            {servers.map((server) => (
              <option key={server.region} value={server.region} className="bg-zinc-900">
                {server.name}
              </option>
            ))}
          </select>
        </div>

        {showStats && (
          <>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 text-center backdrop-blur-xl">
                <div className="text-emerald-500 text-lg font-medium">{stats.gain}</div>
                <div className="text-sm text-gray-400 mt-1">Gain</div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 text-center backdrop-blur-xl">
                <div className="text-white text-lg font-medium">{stats.winRate}</div>
                <div className="text-sm text-gray-400 mt-1">Win Rate</div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 text-center backdrop-blur-xl">
                <div className="text-white text-lg font-medium">{stats.riskRatio}</div>
                <div className="text-sm text-gray-400 mt-1">Risk Ratio</div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3.5 backdrop-blur-xl">
              <span className="text-sm">Show strategy on profile</span>
              <button
                onClick={() => setShowOnProfile(prev => !prev)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  showOnProfile ? 'bg-indigo-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform duration-200 ease-in-out ${
                  showOnProfile ? 'translate-x-7' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </>
        )}

        <div className="bg-zinc-900/30 rounded-xl p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔒</span>
            <span className="text-base text-white">Your data is secure</span>
          </div>
          <p className="text-sm text-gray-400">
            We&apos;ll sync your account and preview it live. Your credentials are encrypted and never stored.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={components.nav.footer}>
        {!showStats ? (
          <button
            onClick={handleSync}
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <span>Sync now</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => router.push('/strategy/preview')}
            className="w-full py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            <span>Next step</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 
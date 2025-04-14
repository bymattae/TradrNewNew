'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';

export default function ConnectionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    login: '',
    password: '',
    server: '',
  });
  const [servers, setServers] = useState<{ name: string; value: string; }[]>([]);
  const [step, setStep] = useState<'credentials' | 'server'>('credentials');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCredentials(prev => ({ ...prev, server: e.target.value }));
  };

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/metastats/servers');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch servers');
      }
      
      setServers(data.servers);
      setStep('server');
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch available servers. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleValidateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/metastats/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: credentials.login,
          password: credentials.password,
          type: 'investor',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Fetch available servers after successful validation
      await fetchServers();
    } catch (error: any) {
      console.error('Validation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to validate credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Final validation with server selection
      const response = await fetch('/api/metastats/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: credentials.login,
          password: credentials.password,
          server: credentials.server,
          type: 'investor',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Connection failed');
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
      toast({
        title: 'Success',
        description: 'Successfully connected to MetaTrader account!',
      });
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to connect. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Connect your MetaTrader account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your MetaTrader credentials to connect your account
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleValidateCredentials} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-lg bg-white/5 p-6">
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-300">
                  Login
                </label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={credentials.login}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-0 bg-white/10 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your login ID"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-0 bg-white/10 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Validating...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-lg bg-white/5 p-6">
              <div>
                <label htmlFor="server" className="block text-sm font-medium text-gray-300">
                  Server
                </label>
                <select
                  id="server"
                  name="server"
                  required
                  value={credentials.server}
                  onChange={handleServerChange}
                  className="mt-1 block w-full rounded-lg border-0 bg-white/10 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a server</option>
                  {servers.map((server) => (
                    <option key={server.value} value={server.value}>
                      {server.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="flex w-full justify-center rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !credentials.server}
                className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connecting...' : 'Connect Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 
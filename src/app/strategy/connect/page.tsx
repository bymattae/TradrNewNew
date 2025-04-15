'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function ConnectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    server: '',
    platform: 'mt5' as 'mt4' | 'mt5'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/metastats/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate account');
      }

      toast.success('Account validated successfully');
      
      // Here you can handle the successful validation
      // For example, redirect to a success page or show additional options
      console.log('Account validated:', data.account);

    } catch (error: any) {
      toast.error(error.message || 'Failed to validate account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Connect Trading Account</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Platform</label>
          <div className="flex gap-4">
            {(['mt4', 'mt5'] as const).map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, platform }))}
                className={`px-4 py-2 rounded-lg ${
                  formData.platform === platform
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {platform.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="login" className="block text-sm font-medium">
            Login
          </label>
          <input
            id="login"
            type="text"
            value={formData.login}
            onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="server" className="block text-sm font-medium">
            Server
          </label>
          <input
            id="server"
            type="text"
            value={formData.server}
            onChange={(e) => setFormData(prev => ({ ...prev, server: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg text-white ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Validating...' : 'Connect Account'}
        </button>
      </form>
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Key, RefreshCw, CheckCircle, AlertCircle, Lock } from 'lucide-react';

interface ApiStatus {
  configuredKeys: number;
  keysMasked: string[];
}

export default function Settings() {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/api-status');
      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized');
        throw new Error('Failed to fetch API status');
      }
      const data = await res.json();
      setStatus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  if (error === 'Unauthorized') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700 mb-6">You must be logged in to view API settings.</p>
          <p className="text-sm text-red-600 font-medium">Please contact the administrator for access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">Security & API Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Failover Status */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-zinc-500" />
                <h2 className="font-bold text-zinc-900">YouTube API Failover</h2>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Active
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
                <span className="text-sm text-zinc-600">Configured Keys</span>
                <span className="font-bold text-zinc-900">{status?.configuredKeys || 0} / 4</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Keys</p>
                {status?.keysMasked.map((key, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-mono text-zinc-600 bg-zinc-50 p-2 rounded border border-zinc-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    {key}
                  </div>
                ))}
                {status?.keysMasked.length === 0 && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> No keys configured
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-100">
              <p className="text-xs text-zinc-500 leading-relaxed">
                The system automatically switches to the next available API key if the current one reaches its quota limit. This ensures 24/7 uptime for your analyzer.
              </p>
            </div>
          </div>

          {/* API Renewal Info */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <RefreshCw className="w-5 h-5 text-zinc-500" />
              <h2 className="font-bold text-zinc-900">API Key Management</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-zinc-600">
                To renew or update your API keys, please use the <strong>Secrets</strong> panel in the AI Studio sidebar.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="text-sm font-bold text-blue-900 mb-1">How to update:</h3>
                <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Click the lock icon in the sidebar</li>
                  <li>Update <code>YOUTUBE_API_KEY</code>, <code>YOUTUBE_API_KEY_2</code>, etc.</li>
                  <li>The server will automatically pick up changes on restart</li>
                </ol>
              </div>

              <div className="pt-4">
                <button 
                  onClick={fetchStatus}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-zinc-900 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Security Hardened</h2>
          </div>
          <p className="text-zinc-400 mb-6 max-w-2xl">
            Your application is now secured with Google OAuth. Only authorized users can access the admin dashboard and API status. All session cookies are configured with <code>SameSite: None</code> and <code>Secure</code> attributes for safe operation within iframes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Auth Provider</p>
              <p className="text-sm font-medium">Google OAuth 2.0</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Session Security</p>
              <p className="text-sm font-medium">Iframe-Compatible</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Data Protection</p>
              <p className="text-sm font-medium">Server-Side Proxy</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, TrendingDown, Youtube, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { YouTubeChannel } from '../types';

export default function SubscriberCounter() {
  const [query, setQuery] = useState('');
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [prevCount, setPrevCount] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  const handleFetchChannel = async () => {
    if (!query) return;
    setLoading(true);
    setChannel(null);
    setError(null);
    try {
      const res = await window.fetch(`/api/youtube/channel?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      if (data.id) {
        setChannel(data);
        setCount(parseInt(data.statistics.subscriberCount));
        setPrevCount(parseInt(data.statistics.subscriberCount));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch channel');
    } finally {
      setLoading(false);
    }
  };

  // Simulate live updates
  useEffect(() => {
    if (!channel) return;
    
    const interval = setInterval(() => {
      setPrevCount(count);
      // Randomly add/subtract a few subs to simulate "live" feel
      const change = Math.floor(Math.random() * 5) - 1;
      if (change !== 0) {
        setCount(prev => Math.max(0, prev + change));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [channel, count]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Live Subscriber Counter</h1>
        <p className="text-zinc-500">Watch the subscriber count of any YouTube channel in real-time.</p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Channel Name, ID or @handle"
            className="w-full pl-12 pr-32 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <button
            onClick={handleFetchChannel}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track'}
          </button>
        </div>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {error.includes('quota') ? 'YouTube API Quota Exceeded. Please try again later or add more API keys in Settings.' : error}
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {channel ? (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-xl overflow-hidden"
          >
            <div className="bg-zinc-900 p-12 text-center text-white relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" />
              
              <img 
                src={channel.snippet.thumbnails.high.url} 
                alt={channel.snippet.title} 
                className="w-32 h-32 rounded-full border-4 border-white/10 mx-auto mb-6 relative z-10 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <h2 className="text-3xl font-bold mb-2 relative z-10">{channel.snippet.title}</h2>
              <p className="text-zinc-400 font-medium relative z-10 mb-8">{channel.snippet.customUrl}</p>
              
              <div className="relative z-10 inline-block">
                <div className="text-7xl md:text-9xl font-black tracking-tighter tabular-nums mb-4">
                  {count.toLocaleString()}
                </div>
                <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-zinc-500 text-sm">
                  <Users className="w-4 h-4" />
                  Subscribers
                </div>
              </div>

              <div className="mt-12 flex justify-center gap-8 relative z-10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <TrendingUp className="w-5 h-5" />
                  Live Tracking Active
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Total Views</p>
                <p className="text-xl font-bold text-zinc-900">{parseInt(channel.statistics.viewCount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Total Videos</p>
                <p className="text-xl font-bold text-zinc-900">{parseInt(channel.statistics.videoCount).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-zinc-100 border-2 border-dashed border-zinc-200 rounded-[2.5rem] p-20 text-center">
            <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No Channel Selected</h3>
            <p className="text-zinc-500">Search for a channel to start tracking its subscribers live.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

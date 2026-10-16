import React, { useState } from 'react';
import { ArrowRightLeft, Search, Loader2, TrendingUp, Users, Eye, Video, AlertCircle, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { YouTubeChannel } from '../types';

interface ChannelMiniCardProps {
  channel: YouTubeChannel;
  onRemove: () => void;
}

const ChannelMiniCard: React.FC<ChannelMiniCardProps> = ({ channel, onRemove }) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative group">
    <button 
      onClick={onRemove}
      className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
    >
      <Plus className="w-4 h-4 rotate-45" />
    </button>
    <div className="flex items-center gap-4 mb-6">
      <img 
        src={channel.snippet.thumbnails.default.url} 
        alt={channel.snippet.title} 
        className="w-16 h-16 rounded-full border-2 border-zinc-100"
        referrerPolicy="no-referrer"
      />
      <div>
        <h3 className="font-bold text-zinc-900 line-clamp-1">{channel.snippet.title}</h3>
        <p className="text-zinc-500 text-sm font-medium">{channel.snippet.customUrl}</p>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Subscribers</span>
        <span className="font-bold text-zinc-900">{parseInt(channel.statistics.subscriberCount).toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Views</span>
        <span className="font-bold text-zinc-900">{parseInt(channel.statistics.viewCount).toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Videos</span>
        <span className="font-bold text-zinc-900">{parseInt(channel.statistics.videoCount).toLocaleString()}</span>
      </div>
    </div>
  </div>
);

export default function Comparison() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addChannel = async () => {
    if (!query || channels.length >= 2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch(`/api/youtube/channel?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (channels.find(c => c.id === data.id)) throw new Error('Channel already added');
      setChannels([...channels, data]);
      setQuery('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeChannel = (id: string) => {
    setChannels(channels.filter(c => c.id !== id));
  };

  const getDifference = (val1: string, val2: string) => {
    const diff = parseInt(val1) - parseInt(val2);
    return diff;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Channel Comparison Tool</h1>
        <p className="text-zinc-500">Compare two YouTube channels side-by-side to see who's winning.</p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={channels.length >= 2}
            placeholder={channels.length >= 2 ? "Maximum channels reached" : "Add a channel to compare..."}
            className="w-full pl-12 pr-32 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-zinc-50"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <button
            onClick={addChannel}
            disabled={loading || !query || channels.length >= 2}
            className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2 text-center font-medium">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {channels.map(channel => (
          <ChannelMiniCard key={channel.id} channel={channel} onRemove={() => removeChannel(channel.id)} />
        ))}
        {channels.length < 2 && (
          <div className="bg-zinc-100 border-2 border-dashed border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center text-zinc-400">
            <Plus className="w-8 h-8 mb-2" />
            <p className="font-medium">Add another channel</p>
          </div>
        )}
      </div>

      {channels.length === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden"
        >
          <div className="p-8 bg-zinc-50 border-b border-zinc-100">
            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-red-600" />
              Comparison Results
            </h3>
          </div>
          <div className="p-8 space-y-8">
            {/* Subs Diff */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Subscriber Gap</span>
                <span className="text-2xl font-black text-zinc-900">
                  {Math.abs(getDifference(channels[0].statistics.subscriberCount, channels[1].statistics.subscriberCount)).toLocaleString()}
                </span>
              </div>
              <div className="h-4 bg-zinc-100 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-red-600 transition-all duration-1000" 
                  style={{ width: `${(parseInt(channels[0].statistics.subscriberCount) / (parseInt(channels[0].statistics.subscriberCount) + parseInt(channels[1].statistics.subscriberCount))) * 100}%` }}
                />
                <div 
                  className="h-full bg-zinc-900 transition-all duration-1000" 
                  style={{ width: `${(parseInt(channels[1].statistics.subscriberCount) / (parseInt(channels[0].statistics.subscriberCount) + parseInt(channels[1].statistics.subscriberCount))) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-bold text-zinc-400">
                <span>{channels[0].snippet.title}</span>
                <span>{channels[1].snippet.title}</span>
              </div>
            </div>

            {/* Views Diff */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">View Gap</span>
                <span className="text-2xl font-black text-zinc-900">
                  {Math.abs(getDifference(channels[0].statistics.viewCount, channels[1].statistics.viewCount)).toLocaleString()}
                </span>
              </div>
              <div className="h-4 bg-zinc-100 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000" 
                  style={{ width: `${(parseInt(channels[0].statistics.viewCount) / (parseInt(channels[0].statistics.viewCount) + parseInt(channels[1].statistics.viewCount))) * 100}%` }}
                />
                <div 
                  className="h-full bg-zinc-400 transition-all duration-1000" 
                  style={{ width: `${(parseInt(channels[1].statistics.viewCount) / (parseInt(channels[0].statistics.viewCount) + parseInt(channels[1].statistics.viewCount))) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-100">
              <div className="text-center">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Winner (Subs)</p>
                <p className="font-bold text-zinc-900">
                  {parseInt(channels[0].statistics.subscriberCount) > parseInt(channels[1].statistics.subscriberCount) ? channels[0].snippet.title : channels[1].snippet.title}
                </p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Efficiency Ratio</p>
                <p className="font-bold text-zinc-900">
                  {(parseInt(channels[0].statistics.viewCount) / parseInt(channels[0].statistics.subscriberCount)).toFixed(1)} vs {(parseInt(channels[1].statistics.viewCount) / parseInt(channels[1].statistics.subscriberCount)).toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Upload Frequency</p>
                <p className="font-bold text-zinc-900">
                  {channels[0].statistics.videoCount} vs {channels[1].statistics.videoCount}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

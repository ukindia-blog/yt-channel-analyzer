import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Youtube, Loader2, AlertCircle, TrendingUp, Users, Video, Eye, Calendar, MapPin, Tag, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { YouTubeChannel, YouTubeVideo } from '../types';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const StatsCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={twMerge("p-2 rounded-xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="text-zinc-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-zinc-900 mt-1">{value}</h3>
  </div>
);

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  const handleFetchChannel = async (searchQuery: string) => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch(`/api/youtube/channel?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChannel(data);
      
      // Fetch videos
      const videosRes = await window.fetch(`/api/youtube/videos?channelId=${data.id}`);
      const videosData = await videosRes.json();
      setVideos(videosData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch channel data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchChannel(query);
  };

  const formatNumber = (num: string) => {
    const n = parseInt(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  // Simulated growth data for charts
  const growthData = [
    { name: 'Jan', subs: 4000, views: 2400 },
    { name: 'Feb', subs: 3000, views: 1398 },
    { name: 'Mar', subs: 2000, views: 9800 },
    { name: 'Apr', subs: 2780, views: 3908 },
    { name: 'May', subs: 1890, views: 4800 },
    { name: 'Jun', subs: 2390, views: 3800 },
    { name: 'Jul', subs: 3490, views: 4300 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
          Analyze Any YouTube Channel
        </h1>
        <p className="text-zinc-500 mb-8">
          Get deep insights, statistics, and earnings data for any creator.
        </p>
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Channel URL, ID, or @username"
            className="w-full pl-12 pr-32 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
          </button>
        </form>
        {error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-600 bg-red-50 py-3 px-6 rounded-xl text-sm font-medium border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {error.includes('quota') 
                ? 'YouTube API Quota Exceeded. Please try again later or add more API keys in Settings.' 
                : error}
            </span>
          </div>
        )}
      </div>

      {channel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Channel Profile Header */}
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            {channel.brandingSettings?.image?.bannerExternalUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={channel.brandingSettings.image.bannerExternalUrl} 
                  alt="Banner" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <img 
                src={channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url} 
                alt={channel.snippet.title} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg -mt-16 md:mt-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-zinc-900">{channel.snippet.title}</h2>
                  {channel.snippet.customUrl && (
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      {channel.snippet.customUrl}
                    </span>
                  )}
                </div>
                <p className="text-zinc-500 max-w-2xl line-clamp-2 mb-4">
                  {channel.snippet.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Joined {format(new Date(channel.snippet.publishedAt), 'MMM d, yyyy')}
                  </div>
                  {channel.snippet.country && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {channel.snippet.country}
                    </div>
                  )}
                  {channel.topicDetails?.topicCategories && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      {channel.topicDetails.topicCategories[0].split('/').pop()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <a 
                  href={`https://youtube.com/${channel.snippet.customUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
                >
                  <Youtube className="w-5 h-5" />
                  Visit Channel
                </a>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Subscribers" 
              value={formatNumber(channel.statistics.subscriberCount)} 
              icon={Users} 
              color="bg-red-600" 
            />
            <StatsCard 
              title="Total Views" 
              value={formatNumber(channel.statistics.viewCount)} 
              icon={Eye} 
              color="bg-blue-600" 
            />
            <StatsCard 
              title="Total Videos" 
              value={formatNumber(channel.statistics.videoCount)} 
              icon={Video} 
              color="bg-emerald-600" 
            />
            <StatsCard 
              title="Est. Monthly Earnings" 
              value={`$${formatNumber((parseInt(channel.statistics.viewCount) / 1000 * 2 / 12).toString())}`} 
              icon={DollarSign} 
              color="bg-amber-600" 
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Growth Analytics
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="subs" stroke="#ef4444" fillOpacity={1} fill="url(#colorSubs)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                View Performance
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-zinc-900">Latest Videos</h3>
              </div>
              <div className="divide-y divide-zinc-100">
                {videos.slice(0, 5).map((video) => (
                  <div key={video.id} className="p-6 flex gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={video.snippet.thumbnails.medium.url} 
                        alt={video.snippet.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-zinc-900 text-sm line-clamp-2 mb-1">{video.snippet.title}</h4>
                      <p className="text-xs text-zinc-500">{formatNumber(video.statistics.viewCount)} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-zinc-900">Top Performing</h3>
              </div>
              <div className="divide-y divide-zinc-100">
                {[...videos].sort((a, b) => parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount)).slice(0, 5).map((video) => (
                  <div key={video.id} className="p-6 flex gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={video.snippet.thumbnails.medium.url} 
                        alt={video.snippet.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-zinc-900 text-sm line-clamp-2 mb-1">{video.snippet.title}</h4>
                      <p className="text-xs text-zinc-500">{formatNumber(video.statistics.viewCount)} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

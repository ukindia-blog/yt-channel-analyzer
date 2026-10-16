import React, { useState } from 'react';
import { BrainCircuit, Hash, Download, TrendingUp, Loader2, Search, Tag, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { twMerge } from 'tailwind-merge';

interface ToolCardProps {
  title: string;
  description: string;
  icon: any;
  onClick: () => void;
  active: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon: Icon, onClick, active }) => (
  <button 
    onClick={onClick}
    className={twMerge(
      "p-6 rounded-2xl border text-left transition-all group",
      active 
        ? "bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.02]" 
        : "bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300 hover:shadow-md"
    )}
  >
    <div className={twMerge(
      "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
      active ? "bg-white/10" : "bg-zinc-100 group-hover:bg-zinc-200"
    )}>
      <Icon className={twMerge("w-6 h-6", active ? "text-white" : "text-zinc-600")} />
    </div>
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <p className={twMerge("text-sm leading-relaxed", active ? "text-zinc-400" : "text-zinc-500")}>
      {description}
    </p>
  </button>
);

export default function Tools() {
  const [activeTool, setActiveTool] = useState('ai');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const tools = [
    { id: 'ai', title: 'AI Growth Prediction', description: 'Get AI-powered insights and predictions for your channel growth.', icon: BrainCircuit },
    { id: 'tags', title: 'Video Tag Extractor', description: 'Extract optimized tags from any YouTube video URL.', icon: Tag },
    { id: 'thumb', title: 'Thumbnail Downloader', description: 'Download high-quality thumbnails from any video.', icon: Download },
    { id: 'trending', title: 'Trending Finder', description: 'Find what is trending in your niche right now.', icon: TrendingUp },
  ];

  const handleExecuteTool = async () => {
    if (!input) return;
    setLoading(true);
    setResult(null);
    try {
      if (activeTool === 'ai') {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("GEMINI_API_KEY is not configured. Please add it to the Secrets panel (lock icon).");
        }
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Analyze this YouTube channel/topic: "${input}". Provide 3 specific growth strategies and a 6-month growth prediction. Format as JSON with "strategies" (array) and "prediction" (string).`
        });
        const text = response.text;
        try {
          const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
          setResult(json);
        } catch {
          setResult({ prediction: text });
        }
      } else if (activeTool === 'tags') {
        // Mock tag extraction
        setResult({ tags: ['youtube', 'growth', 'analytics', 'tutorial', 'creator', 'tips', 'strategy'] });
      } else if (activeTool === 'thumb') {
        let videoId = input;
        if (input.includes('v=')) videoId = input.split('v=')[1].split('&')[0];
        else if (input.includes('be/')) videoId = input.split('be/')[1].split('?')[0];
        setResult({ thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` });
      } else {
        setResult({ trending: ['Short-form content', 'AI tools for creators', 'Niche community building', 'Live streaming engagement'] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Advanced Creator Tools</h1>
        <p className="text-zinc-500">Supercharge your content strategy with our advanced AI-powered tools.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {tools.map(tool => (
          <ToolCard 
            key={tool.id} 
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            active={activeTool === tool.id} 
            onClick={() => { setActiveTool(tool.id); setResult(null); setInput(''); }} 
          />
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">
                {tools.find(t => t.id === activeTool)?.title}
              </h2>
            </div>

            <div className="flex gap-3 mb-8">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeTool === 'ai' ? "Enter channel name or niche..." : "Enter Video URL..."}
                className="flex-grow px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
              <button
                onClick={handleExecuteTool}
                disabled={loading || !input}
                className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100"
                >
                  {activeTool === 'ai' && (
                    <div className="space-y-6">
                      {result.strategies && (
                        <div>
                          <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            Growth Strategies
                          </h4>
                          <ul className="space-y-2">
                            {result.strategies.map((s: string, i: number) => (
                              <li key={i} className="text-zinc-600 text-sm flex gap-3">
                                <span className="text-zinc-400 font-bold">{i + 1}.</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
                          <BrainCircuit className="w-4 h-4 text-blue-600" />
                          AI Prediction
                        </h4>
                        <p className="text-zinc-600 text-sm leading-relaxed">{result.prediction}</p>
                      </div>
                    </div>
                  )}

                  {activeTool === 'tags' && (
                    <div>
                      <h4 className="font-bold text-zinc-900 mb-4">Extracted Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:border-red-200 hover:text-red-600 cursor-pointer transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTool === 'thumb' && (
                    <div className="text-center">
                      <img src={result.thumb} alt="Thumbnail" className="w-full rounded-2xl shadow-lg mb-6" />
                      <a 
                        href={result.thumb} 
                        download 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        Download HD Thumbnail
                      </a>
                    </div>
                  )}

                  {activeTool === 'trending' && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-zinc-900">Trending Topics</h4>
                      {result.trending.map((topic: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200">
                          <span className="font-bold text-zinc-700">{topic}</span>
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

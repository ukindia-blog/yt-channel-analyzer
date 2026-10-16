import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Info, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function EarningsCalculator() {
  const [views, setViews] = useState<number>(100000);
  const [cpm, setCpm] = useState<number>(2.5);

  const dailyViews = views / 30;
  const yearlyViews = views * 12;

  const calculateEarnings = (v: number) => (v / 1000) * cpm;

  const stats = [
    { label: 'Daily Earnings', value: calculateEarnings(dailyViews), period: 'per day' },
    { label: 'Monthly Earnings', value: calculateEarnings(views), period: 'per month' },
    { label: 'Yearly Earnings', value: calculateEarnings(yearlyViews), period: 'per year' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">YouTube Earnings Calculator</h1>
        <p className="text-zinc-500">Estimate how much a YouTube channel makes based on views and CPM.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-4 flex justify-between">
                Monthly Views
                <span className="text-red-600">{views.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={views}
                onChange={(e) => setViews(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-2 font-medium">
                <span>1K</span>
                <span>5M</span>
                <span>10M</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-4 flex justify-between">
                Estimated CPM ($)
                <span className="text-red-600">${cpm.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.25"
                max="20"
                step="0.25"
                value={cpm}
                onChange={(e) => setCpm(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-2 font-medium">
                <span>$0.25</span>
                <span>$10</span>
                <span>$20</span>
              </div>
            </div>
          </div>

          <div className="mt-10 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex gap-3">
            <Info className="w-5 h-5 text-zinc-400 flex-shrink-0" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              CPM (Cost Per Mille) is the amount an advertiser pays for 1,000 views. This varies greatly by niche, audience location, and season. Typical CPMs range from $0.50 to $10.00.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm"
            >
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-zinc-900">${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-zinc-400 text-xs font-medium">{stat.period}</span>
              </div>
            </motion.div>
          ))}
          
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Growth Potential</span>
            </div>
            <p className="text-sm text-red-900 font-medium">
              Increasing your CPM by just $1.00 could add <span className="font-bold">${(views / 1000 * 12).toLocaleString()}</span> to your yearly revenue.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <h3 className="text-xl font-bold text-zinc-900 mb-6">How is this calculated?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">The Formula</h4>
                <p className="text-sm text-zinc-500">Earnings = (Total Views / 1,000) × CPM. We divide by 1,000 because CPM is a rate per thousand views.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Net vs Gross</h4>
                <p className="text-sm text-zinc-500">YouTube takes a 45% cut of ad revenue. Our calculator estimates the gross amount before YouTube's cut unless specified.</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Disclaimer:</strong> These are estimates only. Actual earnings depend on many factors including ad-blocker usage, viewer demographics, and video length.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

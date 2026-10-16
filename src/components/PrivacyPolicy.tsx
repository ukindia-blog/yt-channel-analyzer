import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm p-8 md:p-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-zinc-900 p-3 rounded-2xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Privacy Policy</h1>
        </div>

        <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-600" />
              Information We Collect
            </h2>
            <p>
              YT Analyzer is designed to be a privacy-first tool. We collect minimal information required to provide our services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Account Information:</strong> If you choose to sign in via Google OAuth, we receive your name, email address, and profile picture. This is used solely to personalize your experience and manage your settings.</li>
              <li><strong>YouTube Data:</strong> We access public YouTube data (channel stats, video info) via the YouTube Data API. We do not store this data permanently; it is fetched in real-time for your analysis.</li>
              <li><strong>Usage Data:</strong> We may collect anonymous usage statistics to improve the application's performance and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              How We Use Your Information
            </h2>
            <p>
              Your information is used strictly for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing the YouTube channel analysis and comparison features.</li>
              <li>Personalizing your dashboard if you are logged in.</li>
              <li>Ensuring the security and integrity of our API failover system.</li>
            </ul>
            <p className="mt-4 font-medium text-zinc-900">
              We never sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your data. All communications between your browser and our servers are encrypted via SSL/TLS. Session cookies are secured with <code>SameSite: None</code> and <code>Secure</code> attributes to prevent unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Third-Party Services</h2>
            <p>
              This application uses the YouTube Data API. By using this tool, you are also bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-bold">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-bold">Google Privacy Policy</a>.
            </p>
          </section>

          <section className="pt-8 border-t border-zinc-100">
            <p className="text-sm text-zinc-400">
              Last Updated: March 19, 2026. This policy is subject to change.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

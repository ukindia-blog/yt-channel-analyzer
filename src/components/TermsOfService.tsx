import React from 'react';
import { FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm p-8 md:p-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-zinc-900 p-3 rounded-2xl">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Terms of Service</h1>
        </div>

        <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using YT Analyzer, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Description of Service
            </h2>
            <p>
              YT Analyzer provides tools for analyzing YouTube channel statistics, comparing creators, and estimating earnings. This tool is provided for educational and informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Usage Restrictions
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may not use this tool for any illegal or unauthorized purpose.</li>
              <li>You may not attempt to circumvent the YouTube API quota limits or our failover system.</li>
              <li>You may not use automated scripts to scrape data from this application.</li>
              <li>You must respect the intellectual property rights of content creators.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">YouTube API Compliance</h2>
            <p>
              This application uses YouTube API Services. By using YT Analyzer, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-bold">YouTube Terms of Service</a>. We are not responsible for any changes to YouTube's policies or API availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Disclaimer of Warranties</h2>
            <p>
              YT Analyzer is provided "as is" without any warranties, express or implied. We do not guarantee the accuracy of earnings estimates or growth predictions, as these are based on algorithms and public data which may change.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Limitation of Liability</h2>
            <p>
              In no event shall YT Analyzer or its creators be liable for any damages arising out of the use or inability to use the service.
            </p>
          </section>

          <section className="pt-8 border-t border-zinc-100">
            <p className="text-sm text-zinc-400">
              Last Updated: March 19, 2026.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

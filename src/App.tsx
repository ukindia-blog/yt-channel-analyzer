import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Video, 
  DollarSign, 
  Layers, 
  BrainCircuit,
  Menu,
  X,
  Youtube,
  Info,
  ArrowRightLeft,
  Download,
  Hash,
  Calculator,
  Shield,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Components
import Dashboard from './components/Dashboard';
import Comparison from './components/Comparison';
import EarningsCalculator from './components/EarningsCalculator';
import SubscriberCounter from './components/SubscriberCounter';
import Tools from './components/Tools';
import Settings from './components/Settings';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Analyzer', path: '/', icon: BarChart3 },
    { name: 'Comparison', path: '/compare', icon: ArrowRightLeft },
    { name: 'Earnings', path: '/earnings', icon: DollarSign },
    { name: 'Live Subs', path: '/live-subs', icon: Users },
    { name: 'AI Tools', path: '/tools', icon: BrainCircuit },
  ];

  if (user) {
    navItems.push({ name: 'Settings', path: '/settings', icon: Shield });
  }

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                YT <span className="text-red-600">Analyzer</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-zinc-200 mx-2" />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full border border-zinc-200">
                  {user.photos?.[0]?.value ? (
                    <img src={user.photos[0].value} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                  )}
                  <span className="text-xs font-bold text-zinc-700">{user.displayName}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === item.path
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-zinc-200 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            YT <span className="text-red-600">Analyzer</span>
          </span>
        </div>
        <p className="text-zinc-500 text-sm font-medium">
          Made by <span className="text-zinc-900">Khunni JK</span> – Educational Purpose Only
        </p>
        <div className="flex gap-6 text-sm text-zinc-400">
          <Link to="/privacy" className="hover:text-zinc-600">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-zinc-600">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();

    // Listen for OAuth success message from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchUser();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/user');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<Comparison />} />
            <Route path="/earnings" element={<EarningsCalculator />} />
            <Route path="/live-subs" element={<SubscriberCounter />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

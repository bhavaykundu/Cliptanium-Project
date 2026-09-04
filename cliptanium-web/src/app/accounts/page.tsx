'use client';

import { useState, useEffect } from 'react';
import { getLinkedAccounts, linkAccount } from '@/lib/api/accounts';

export default function AccountsPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  // Backend API states
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [platform, setPlatform] = useState('TikTok');
  const [username, setUsername] = useState('');
  const [analyticsDriveUrl, setAnalyticsDriveUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch accounts from backend on load
  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        const data = await getLinkedAccounts();
        setAccounts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  // Button click handlers
  const handleAddNew = () => {
    setModalType('add');
    setUsername('');
    setAnalyticsDriveUrl('');
    setShowModal(true);
  };

  const handleEdit = () => {
    setModalType('edit');
    setShowModal(true);
  };

  // Form submit handler calling backend API
  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await linkAccount({
        platform,
        username,
        analyticsDriveUrl,
      });
      alert("Verification submitted successfully to backend!");
      setShowModal(false);
      
      // Refresh accounts list after submission
      const updatedData = await getLinkedAccounts();
      setAccounts(updatedData);
    } catch (err: any) {
      alert(err.message || "Failed to submit account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white relative">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8 animate-fadeIn">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/25">
            Identity Verification
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-2">
            My Accounts
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Manage your connected social accounts. Backend handles the verification lifecycle.
          </p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-white text-black text-[11px] px-6 py-3 rounded-xl font-black tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] uppercase"
        >
          + Link New Account
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-zinc-500 text-sm py-12 font-mono">Loading accounts from backend...</div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs mb-6">
          API Error: {error} (Check backend connection)
        </div>
      )}

      {!loading && !error && accounts.length === 0 && (
        <div className="text-zinc-500 text-sm py-12 border border-dashed border-zinc-800 rounded-3xl text-center">
          No accounts found. Click "+ Link New Account" to add one.
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div 
            key={acc.id || acc.username} 
            className="group relative bg-zinc-900/50 backdrop-blur-md rounded-3xl p-6 border border-zinc-800/80 transition-all duration-500 hover:-translate-y-2 hover:border-zinc-600 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between h-[240px] animate-fadeIn"
          >
            {/* Top Row: Pic & Status */}
            <div className="flex justify-between items-start">
              <img 
                src={acc.pic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"} 
                alt={acc.username} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-700 group-hover:border-rose-500/50 transition-colors duration-300" 
              />
              
              <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold border backdrop-blur-md shadow-lg ${
                acc.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {acc.status || 'Pending'}
              </span>
            </div>

            {/* Middle Row: Username & Platform */}
            <div className="mt-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{acc.platform}</span>
              <h3 className="text-xl font-black text-white mt-1">{acc.username}</h3>
              <p className="text-xs text-zinc-400 mt-1.5">Tier-1 Audience: {acc.tier1 || 'Pending Audit'}</p>
            </div>

            {/* Bottom Row: Edit Button */}
            <div className="mt-auto pt-4 border-t border-zinc-800/50 flex justify-end">
              <button 
                onClick={handleEdit}
                className="text-xs font-bold text-zinc-400 bg-zinc-800/50 px-4 py-2 rounded-lg hover:text-white hover:bg-zinc-700 transition-all duration-300 active:scale-95"
              >
                Edit Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ANIMATED ACCOUNT MODAL POPUP */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          {/* Modal Container */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative transform transition-all animate-zoomIn">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-5 right-5 text-zinc-500 hover:text-white transition active:scale-95 text-lg"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-black text-white mb-2">
              {modalType === 'add' ? 'Link New Account' : 'Edit Account'}
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Submit your social profile through the API for backend verification.
            </p>

            <form onSubmit={handleSubmitAccount} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Platform</label>
                <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram Reels</option>
                  <option value="YouTube">YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Username / Handle</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@yourhandle" 
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition" 
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Analytics Recording (Drive Link)</label>
                <input 
                  type="url" 
                  value={analyticsDriveUrl}
                  onChange={(e) => setAnalyticsDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/..." 
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition" 
                />
                <p className="text-[10px] text-rose-400 mt-2 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  Backend will process audit for 40% Tier-1 audience requirement.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full mt-4 bg-white hover:bg-zinc-200 text-black text-xs px-6 py-3.5 rounded-xl font-black tracking-wider transition-all duration-300 active:scale-95 uppercase disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : (modalType === 'add' ? 'Submit Verification' : 'Save Changes')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tailwind Animations Setup */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-zoomIn { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}} />
    </div>
  );
}
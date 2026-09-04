'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [hasAccount, setHasAccount] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!hasAccount) {
      setShowPopup(true);
    }
  }, [hasAccount]);

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white relative">
      
      {/* Dashboard Header */}
      <div className="mb-8 animate-fadeIn">
        <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/25">
          Creator Protocol
        </span>
        <h1 className="text-3xl font-black tracking-tight text-white mt-2">
          Cliptanium Dashboard
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Welcome back! Here is the live platform overview and your performance metrics.
        </p>
      </div>

      {/* Metric Cards Grid (Restored All 4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Campaigns</p>
          <h3 className="text-3xl font-black text-white mt-2">12</h3>
          <p className="text-xs text-rose-400 mt-1">↑ 2 new this week</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Clip Submissions</p>
          <h3 className="text-3xl font-black text-white mt-2">1,428</h3>
          <p className="text-xs text-zinc-400 mt-1">Pending Discord reviews: 34</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Views Generated</p>
          <h3 className="text-3xl font-black text-white mt-2">845.2K</h3>
          <p className="text-xs text-emerald-400 mt-1">↑ 18% from last month</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Earnings / Payout</p>
          <h3 className="text-3xl font-black text-emerald-400 mt-2">$1,690.40</h3>
          <p className="text-xs text-zinc-400 mt-1">Calculated via live RPM</p>
        </div>
      </div>

      {/* Main Grid: Activity Stream & Discord Integration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Platform Activity Stream */}
        <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl">
          <h2 className="text-lg font-black text-white mb-4">Platform Activity Stream</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/50">
              <span className="text-xs text-zinc-300">New reel submitted for <strong className="text-white">Cliptanium Apparel Launch</strong></span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/50">
              <span className="text-xs text-zinc-300">Clip approved by Staff in Discord (#clip-review)</span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">Approved</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/50">
              <span className="text-xs text-zinc-300">New campaign <strong className="text-white">Gaming Stream Highlights</strong> went live</span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-full font-bold">Active</span>
            </div>
          </div>
        </div>

        {/* Discord & Backend Notice */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-white mb-2">Discord & Backend</h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Website is running in isolated mode. All reviews are handled securely in Discord, while stats & metrics sync via Developer 3 backend.
            </p>
          </div>
          <div className="p-3.5 bg-zinc-950/80 rounded-2xl border border-zinc-800/60 font-mono text-[11px]">
            <span className="text-zinc-500 block">GIUTH STATUS: MOCK</span>
            <span className="text-emerald-400 font-bold">Ready for Developer 3 API hookup.</span>
          </div>
        </div>

      </div>

      {/* MANDATORY ACCOUNT ADD POPUP */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-950 border border-rose-500/40 rounded-3xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(225,29,72,0.2)] relative transform transition-all animate-zoomIn">
            
            <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-5 border border-rose-500/30">
              <span className="text-xl">🔒</span>
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2">Add Account First!</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Welcome to Cliptanium! Before accessing the dashboard or campaigns, you must link your social media account with verified <strong className="text-rose-400">Tier-1 audience (Min 40%)</strong>.
            </p>

            <form className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Platform</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition">
                  <option>TikTok</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Username / Handle</label>
                <input type="text" placeholder="@yourhandle" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition" />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Analytics Drive Recording Link</label>
                <input type="url" placeholder="https://drive.google.com/..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition" />
              </div>

              <button 
                type="button" 
                onClick={() => {
                  alert("Account submitted successfully! Pending verification.");
                  setHasAccount(true); 
                  setShowPopup(false);
                }}
                className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white text-xs px-6 py-3.5 rounded-xl font-black tracking-wider transition-all duration-300 active:scale-95 uppercase shadow-lg shadow-rose-950"
              >
                Submit & Unlock Dashboard →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tailwind Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-zoomIn { animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}} />
    </div>
  );
}
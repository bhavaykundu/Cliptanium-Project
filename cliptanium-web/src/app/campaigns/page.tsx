'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <-- 1. Router import kiya
import { getCampaigns, joinCampaign } from '@/lib/api/campaigns';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter(); // <-- 2. Router initialize kiya

  // Fetch campaigns from backend on load
  useEffect(() => {
    async function fetchCampaignsData() {
      try {
        setLoading(true);
        const data = await getCampaigns();
        setCampaigns(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    }
    fetchCampaignsData();
  }, []);

  // Handle Joining Campaign
  const handleJoinCampaign = async (campaignId: string) => {
    try {
      // Backend api call
      await joinCampaign(campaignId);
      
      // 3. Jaise hi join success ho, seedha user ko nayi manzil par bhej do!
      router.push(`/campaigns/${campaignId}/submit`);
      
    } catch (err: any) {
      alert(err.message || "Failed to join campaign");
    }
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      {/* Page Header with Fade-in Animation */}
      <div className="mb-8 animate-fadeIn">
        <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/25">
          Live Marketplace
        </span>
        <h1 className="text-3xl font-black tracking-tight text-white mt-2">
          Active Campaigns
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Browse live clipping campaigns, check pool capacities, and join via backend.
        </p>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-zinc-500 text-sm py-12 font-mono">Loading campaigns from backend...</div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs mb-6">
          API Error: {error} (Ensure backend is running)
        </div>
      )}

      {!loading && !error && campaigns.length === 0 && (
        <div className="text-zinc-500 text-sm py-12 border border-dashed border-zinc-800 rounded-3xl text-center">
          No active campaigns available right now.
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {campaigns.map((camp) => {
          const target = camp.targetViews || 1;
          const current = camp.currentViews || 0;
          const progressPercent = Math.min(Math.round((current / target) * 100), 100);

          return (
            <div 
              key={camp.id || camp._id} 
              className="group relative rounded-3xl flex flex-col justify-between overflow-hidden min-h-[440px] border border-zinc-800/80 hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(225,29,72,0.25)] cursor-pointer"
            >
              
              {/* Background Image with Smooth Zoom Animation on Hover */}
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${camp.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"})` }}
              ></div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/20 group-hover:via-zinc-950/75 transition-all duration-500"></div>

              {/* CARD CONTENT */}
              <div className="relative z-10 p-7 flex flex-col h-full justify-between">
                
                {/* Top Section: Status & Payout */}
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3.5 py-1.5 rounded-full font-bold border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-black/50 transition-transform duration-300 group-hover:scale-105">
                    {camp.status || 'Live'}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-zinc-300 border border-zinc-700/50 px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold shadow-lg transition-transform duration-300 group-hover:scale-105">
                    {camp.payout || '$10 / 1K Views'}
                  </span>
                </div>

                {/* Bottom Section: Title, Progress Bar, Button */}
                <div className="mt-auto pt-4">
                  <h3 className="text-2xl font-black text-white mb-2 leading-tight drop-shadow-lg group-hover:text-rose-400 transition-colors duration-300">
                    {camp.title}
                  </h3>
                  <p className="text-zinc-300 text-xs mb-5 leading-relaxed line-clamp-2 drop-shadow-md">
                    {camp.description}
                  </p>

                  {/* Glassmorphism Progress Bar Container */}
                  <div className="bg-black/50 backdrop-blur-md border border-zinc-700/50 rounded-2xl p-4 mb-5 shadow-xl transition-all duration-300 group-hover:border-zinc-500">
                    <div className="flex justify-between items-center text-[11px] mb-2">
                      <span className="text-zinc-300 font-semibold">Budget / View Pool</span>
                      <span className="font-mono font-bold text-rose-400">{progressPercent}% Filled</span>
                    </div>

                    <div className="w-full bg-zinc-900/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
                      <div 
                        className="bg-gradient-to-r from-rose-600 to-red-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(225,29,72,0.9)]"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mt-2">
                      <span>{(current / 1000000).toFixed(2)}M Views</span>
                      <span>Goal: {(target / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono text-zinc-300 bg-black/50 px-3 py-2 rounded-xl border border-zinc-700/50 backdrop-blur-md">
                      {camp.platform || 'TikTok, Reels'}
                    </span>
                    <button 
                      onClick={() => handleJoinCampaign(camp.id || camp._id)}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] px-6 py-3 rounded-xl font-black tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-rose-950 hover:shadow-[0_0_25px_rgba(225,29,72,0.7)] text-center uppercase"
                    >
                      Join Campaign →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
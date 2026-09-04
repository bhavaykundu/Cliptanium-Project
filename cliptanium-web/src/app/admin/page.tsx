'use client';

import { useState, useEffect } from 'react';
import { getAdminQueue, reviewSubmission } from '@/lib/api/admin';

export default function AdminPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending review queue on load
  useEffect(() => {
    async function fetchQueue() {
      try {
        setLoading(true);
        const data = await getAdminQueue();
        setQueue(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load admin queue');
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, []);

  // Handle Approve or Reject action
  const handleReview = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      await reviewSubmission(id, action, reason);
      alert(`Submission successfully ${action}d!`);
      
      // Refresh queue
      const updated = await getAdminQueue();
      setQueue(updated);
    } catch (err: any) {
      alert(err.message || `Failed to ${action} submission`);
    }
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white relative">
      
      {/* Header with Fade-in Animation */}
      <div className="mb-8 animate-fadeIn">
        <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/25">
          Staff Control Terminal
        </span>
        <h1 className="text-3xl font-black tracking-tight text-white mt-2">
          Moderation Review Queue
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Review clipper submissions, verify guidelines, and trigger real-time backend updates.
        </p>
      </div>

      {loading && (
        <div className="text-zinc-500 font-mono py-12 animate-pulse">Loading moderation queue from backend...</div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs mb-6 font-mono animate-fadeIn">
          API Error: {error} (Ensure backend admin routes are active)
        </div>
      )}

      {!loading && !error && queue.length === 0 && (
        <div className="text-zinc-500 text-sm py-12 border border-dashed border-zinc-800 rounded-3xl text-center animate-fadeIn">
          No pending submissions in the queue. All caught up!
        </div>
      )}

      {/* Review Items List with Hover Effects & Animations */}
      <div className="space-y-4 animate-fadeIn">
        {queue.map((item) => (
          <div 
            key={item.id || item._id} 
            className="group bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-500 hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
                  {item.platform}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">ID: {(item.id || item._id).slice(0, 8)}</span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-rose-400 transition-colors duration-300">
                {item.campaignTitle || 'Cliptanium Campaign'}
              </h3>
              <a 
                href={item.clipUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-mono text-rose-400 hover:text-rose-300 hover:underline mt-1 block truncate max-w-md"
              >
                {item.clipUrl}
              </a>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={() => handleReview(item.id || item._id, 'approve')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-emerald-950"
              >
                Approve ✓
              </button>
              <button 
                onClick={() => {
                  const reason = prompt("Enter rejection reason for clipper:") || "Watermark or quality violation";
                  if (reason) handleReview(item.id || item._id, 'reject', reason);
                }}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-red-950"
              >
                Reject ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tailwind Animations Setup */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
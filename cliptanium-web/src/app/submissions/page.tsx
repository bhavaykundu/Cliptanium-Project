'use client';

import { useState, useEffect } from 'react';
import { getSubmissions, createSubmission } from '@/lib/api/submissions';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states for creating new submission
  const [showModal, setShowModal] = useState(false);
  const [campaignId, setCampaignId] = useState('');
  const [clipUrl, setClipUrl] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [submitting, setSubmitting] = useState(false);

  // Helper function to safely extract array from backend response
  const extractArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.submissions)) return res.submissions;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  };

  // Fetch submissions from backend on load
  useEffect(() => {
    async function loadSubmissions() {
      try {
        setLoading(true);
        const rawData = await getSubmissions();
        const data = extractArray(rawData);
        setSubmissions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    }
    loadSubmissions();
  }, []);

  // Submit new reel to backend API
  const handleCreateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createSubmission({
        campaignId,
        clipUrl,
        platform,
      });
      alert("Clip submitted successfully! Sent to Discord review queue.");
      setShowModal(false);
      setClipUrl('');
      setCampaignId('');
      
      // Refresh submissions list safely
      const rawData = await getSubmissions();
      const updated = extractArray(rawData);
      setSubmissions(updated);
    } catch (err: any) {
      alert(err.message || "Failed to submit clip");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white relative">
      
      {/* Header & Submit Button */}
      <div className="flex justify-between items-end mb-8 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
            My Submissions
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Track the review status, views, and backend-authoritative earnings of your submitted clips.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] px-6 py-3 rounded-xl font-black tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-rose-950 uppercase"
        >
          + Submit New Reel
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-zinc-500 text-sm py-12 font-mono">Loading submissions from backend...</div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs mb-6 font-mono">
          API Error: {error} (Ensure backend is running)
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && submissions.length === 0 && (
        <div className="text-zinc-500 text-sm py-12 border border-dashed border-zinc-800 rounded-3xl text-center">
          No submissions found. Click "+ Submit New Reel" to upload your first clip.
        </div>
      )}

      {/* Submissions Table */}
      {!loading && !error && submissions.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider bg-zinc-900/80">
                  <th className="p-4">ID & Campaign</th>
                  <th className="p-4">Platform / URL</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm">
                {submissions.map((sub, index) => {
                  const status = (sub.status || 'Pending').toLowerCase();
                  const subId = sub.id || sub._id || `SUB-${index}`;
                  const campaignName = sub.campaignTitle || sub.campaign || 'Cliptanium Campaign';
                  const clipUrl = sub.clipUrl || sub.url || '#';
                  const subDate = sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : (sub.date || 'Today');
                  const views = sub.views || '0';
                  const earnings = sub.earnings || '$0.00';
                  const reason = sub.rejectionReason || sub.reason || 'Watermark / Quality violation';

                  return (
                    <tr key={subId} className="hover:bg-zinc-900/40 transition">
                      <td className="p-4">
                        <span className="font-bold text-white block">{campaignName}</span>
                        <span className="text-xs text-zinc-500 font-mono">{subId}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-zinc-300 font-medium block">{sub.platform}</span>
                        <a 
                          href={clipUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-rose-400 hover:underline truncate max-w-[200px] block font-mono"
                        >
                          {clipUrl}
                        </a>
                      </td>
                      <td className="p-4 text-zinc-400 text-xs font-mono">{subDate}</td>
                      <td className="p-4">
                        <div>
                          {status === 'approved' && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                              Approved
                            </span>
                          )}
                          {status === 'pending' && (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                              Pending
                            </span>
                          )}
                          {status === 'claimed' && (
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                              Claimed 🛡️
                            </span>
                          )}
                          {status === 'rejected' && (
                            <div>
                              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                                Rejected
                              </span>
                              <p className="text-xs text-rose-300/80 mt-1 max-w-xs">
                                Reason: {reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-zinc-200 font-mono">{views}</td>
                      <td className="p-4 font-bold text-emerald-400 font-mono">{earnings}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL POPUP */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative transform transition-all animate-zoomIn">
            
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-5 right-5 text-zinc-500 hover:text-white transition active:scale-95 text-lg"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-black text-white mb-2">Submit New Reel</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Official website submission terminal. Syncs directly with backend & Discord review queue.
            </p>

            <form onSubmit={handleCreateSubmission} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Campaign ID</label>
                <input 
                  type="text" 
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  placeholder="Enter backend campaign ID" 
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition font-mono" 
                />
              </div>

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
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Clip URL</label>
                <input 
                  type="url" 
                  value={clipUrl}
                  onChange={(e) => setClipUrl(e.target.value)}
                  placeholder="https://tiktok.com/@user/video/..." 
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition font-mono" 
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full mt-4 bg-white hover:bg-zinc-200 text-black text-xs px-6 py-3.5 rounded-xl font-black tracking-wider transition-all duration-300 active:scale-95 uppercase disabled:opacity-50"
              >
                {submitting ? 'Submitting to Backend...' : 'Submit to Review Queue'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-zoomIn { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}} />
    </div>
  );
}
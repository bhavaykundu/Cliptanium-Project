'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createSubmission } from '@/lib/api/submissions'; // <-- Clean API wrapper import kiya

export default function CampaignCommandDeck() {
  const params = useParams();
  const campaignId = params.id as string;

  const [platform, setPlatform] = useState('tiktok');
  const [url, setUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNameHidden, setIsNameHidden] = useState(false);

  const campaignData = {
    title: "Cliptanium Apparel Launch",
    payout: "$15 / 1K Views",
    platform: "TikTok, Instagram Reels",
    requirements: `01. Download high-resolution source clips from official drive: https://drive.google.com/drive/folders/example-clips-123\n02. Minimum edit length must be 15 seconds. No vertical framing black bars.\n03. Maintain a positive promotional narrative toward the Cliptanium brand.\n04. Tag official audio track on all published TikTok & IG posts.`
  };

  const extractDriveLink = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : 'https://drive.google.com';
  };

  const dynamicDriveLink = extractDriveLink(campaignData.requirements);

  const parseErrorMessage = (err: any) => {
    if (!err) return 'An unknown error occurred';
    if (typeof err === 'string') return err;
    const detail = err.data?.detail || err.message;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((d: any) => {
        const fieldPath = d.loc ? d.loc.join(' → ') : 'Field';
        return `${fieldPath}: ${d.msg}`;
      }).join(' | ');
    }
    if (typeof detail === 'object') {
      return JSON.stringify(detail);
    }
    return 'Failed to process request';
  };

  // CLEAN SUBMISSION HANDLER (Dev 3 Contract Compliant)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createSubmission({
        campaignId: campaignId,
        clipUrl: url,
        platform: platform,
      });

      setSubmitted(true);
    } catch (err: any) {
      const errorMsg = parseErrorMessage(err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const leaderboard = [
    { rank: 1, name: "CyberNinja", views: "1.4M", earnings: "$210.00", isMe: false },
    { rank: 2, name: "VortexClips", views: "920K", earnings: "$138.00", isMe: false },
    { rank: 3, name: "Cliptanium_King", views: "650K", earnings: "$97.50", isMe: true },
    { rank: 4, name: "NeonEditor", views: "410K", earnings: "$61.50", isMe: false },
  ];

  const maskName = (name: string) => {
    if (name.length <= 2) return name;
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      
      <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-6">
        <div>
          <Link href="/campaigns" className="text-xs text-zinc-500 hover:text-white transition font-mono mb-2 inline-block">
            ← RETURN TO OPERATIONS
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {campaignData.title}
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase">
              Active Protocol
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-3 font-mono text-xs">
          <span className="text-zinc-500">PAYOUT YIELD:</span>
          <span className="text-emerald-400 font-bold">{campaignData.payout}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                📋 Mission Briefing & Guidelines
              </h2>
              <a 
                href={dynamicDriveLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-xl hover:bg-rose-500/20 transition flex items-center gap-1.5"
              >
                📂 Open Asset Drive
              </a>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
              {campaignData.requirements}
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-4">
              🚀 Execution Terminal (Submit Reel)
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs mb-4 font-mono">
                Error: {error}
              </div>
            )}

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                <div className="text-2xl mb-1">⚡</div>
                <h3 className="text-sm font-bold text-emerald-400 font-mono">Submission Transmitted</h3>
                <p className="text-zinc-400 text-xs mt-1 mb-4">Logged into audit queue as <span className="text-amber-400 font-mono">Pending</span>.</p>
                <Link href="/submissions" className="inline-block bg-rose-600 hover:bg-rose-500 text-white text-xs px-4 py-2 rounded-xl font-bold font-mono transition shadow-lg shadow-rose-950">
                  Access Submission Tracker →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Target Network</label>
                  <select 
                    value={platform} onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram_reels">Instagram Reels</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Published Reel URL</label>
                  <input 
                    type="url" required placeholder="https://tiktok.com/@username/video/..." value={url} onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition placeholder:text-zinc-600"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider font-mono transition shadow-lg shadow-rose-900/40 mt-2 disabled:opacity-50"
                >
                  {loading ? "Transmitting to Backend..." : "Transmit Proof for Review 🔒"}
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-2xl h-full flex flex-col">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                🏆 Live Telemetry Leaderboard
              </h2>

              <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Stealth</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isNameHidden} onChange={() => setIsNameHidden(!isNameHidden)} />
                  <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden flex-1">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] uppercase tracking-wider bg-zinc-900/40">
                    <th className="p-3.5">Rank</th>
                    <th className="p-3.5">Operator</th>
                    <th className="p-3.5">Views</th>
                    <th className="p-3.5 text-right">Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/80">
                  {leaderboard.map((item) => (
                    <tr key={item.rank} className={`transition ${item.isMe ? 'bg-rose-500/5' : 'hover:bg-zinc-900/20'}`}>
                      <td className="p-3.5 font-bold text-zinc-500">#{item.rank}</td>
                      <td className="p-3.5 font-bold">
                        {item.isMe ? (
                          <span className="text-rose-400 flex items-center gap-1.5">
                            {isNameHidden ? maskName(item.name) : item.name}
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">YOU</span>
                          </span>
                        ) : (
                          <span className="text-zinc-300">{item.name}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-zinc-400">{item.views}</td>
                      <td className="p-3.5 font-black text-emerald-400 text-right">{item.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Cliptanium Apparel Launch",
      payout: "$15 / 1K Views",
      platform: "TikTok, Instagram Reels",
      status: "Active",
      participants: 142,
      submissions: 680,
      requirements: "Step 1: Download high-quality clips from drive: https://drive.google.com/...\nStep 2: Video length must be at least 15 seconds. No black bars.\nStep 3: Tag the official audio.",
    },
    {
      id: 2,
      title: "Gaming Stream Highlights",
      payout: "$10 / 1K Views",
      platform: "YouTube Shorts, TikTok",
      status: "Active",
      participants: 98,
      submissions: 412,
      requirements: "Clip funny moments from the gameplay streams. Drive Link: https://drive.google.com/...",
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [payout, setPayout] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [requirements, setRequirements] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const toggleStatus = (id: number) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) return { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' };
      return c;
    }));
  };

  const resetForm = () => {
    setTitle(''); setPayout(''); setPlatform('TikTok'); setRequirements(''); setEditId(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp = {
      id: Date.now(), title, payout: `$${payout} / 1K Views`, platform, requirements,
      status: "Active", participants: 0, submissions: 0,
    };
    setCampaigns([newCamp, ...campaigns]);
    setIsCreateOpen(false);
    resetForm();
  };

  const openEditModal = (camp: any) => {
    setEditId(camp.id);
    setTitle(camp.title);
    setPayout(camp.payout.replace(' / 1K Views', '').replace('$', ''));
    setPlatform(camp.platform);
    setRequirements(camp.requirements || '');
    setIsEditOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaigns(campaigns.map(c => {
      if (c.id === editId) return { ...c, title, payout: `$${payout} / 1K Views`, platform, requirements };
      return c;
    }));
    setIsEditOpen(false);
    resetForm();
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
            Manage Campaigns (Admin)
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Create, edit, and control campaign statuses.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-rose-900/40"
        >
          + Create New Campaign
        </button>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider bg-zinc-900/85">
                <th className="p-4">Campaign Title</th>
                <th className="p-4">Platforms</th>
                <th className="p-4">Payout Rate</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-zinc-900/40 transition">
                  <td className="p-4 font-bold text-white">{camp.title}</td>
                  <td className="p-4 text-zinc-300">{camp.platform}</td>
                  <td className="p-4 text-emerald-400 font-semibold">{camp.payout}</td>
                  <td className="p-4">
                    {camp.status === 'Active' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold">Paused</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => toggleStatus(camp.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition">
                      {camp.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                    <button onClick={() => openEditModal(camp)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <h2 className="text-xl font-bold mb-6 text-white">Create New Campaign</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Campaign Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Payout Rate (USD/1K Views)</label>
                  <input type="text" required value={payout} onChange={(e) => setPayout(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Target Platforms</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500">
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="TikTok, Instagram Reels">TikTok, Instagram Reels</option>
                  <option value="All Platforms">All Platforms</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Content Brief / Requirements</label>
                <textarea required value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={5} placeholder="Paste rules, drive links, and requirements here..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white">Create Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <h2 className="text-xl font-bold mb-6 text-white">Edit Campaign Details</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Campaign Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Payout Rate (USD/1K Views)</label>
                  <input type="text" required value={payout} onChange={(e) => setPayout(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Target Platforms</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500">
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="TikTok, Instagram Reels">TikTok, Instagram Reels</option>
                  <option value="All Platforms">All Platforms</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Content Brief / Requirements</label>
                <textarea required value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={5} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-xl text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
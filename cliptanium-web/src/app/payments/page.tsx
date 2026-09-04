'use client';

import { useState, useEffect } from 'react';
import { getWalletBalance } from '@/lib/api/payments';

export default function PaymentsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [methodType, setMethodType] = useState<'crypto' | 'upi' | 'paypal'>('crypto');

  // Backend API states
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Stored Payout Method State
  const [savedMethod, setSavedMethod] = useState({
    type: 'CRYPTO WALLET',
    provider: 'USDT on ERC-20',
    identifier: '0x504d...8e1c',
    owner: 'Verified Account'
  });

  // Form Inputs
  const [cryptoNet, setCryptoNet] = useState('USDT on ERC-20');
  const [walletAddr, setWalletAddr] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [fullName, setFullName] = useState('');

  // Fetch balance from backend on load
  useEffect(() => {
    async function fetchLedger() {
      try {
        setLoading(true);
        const data = await getWalletBalance();
        setBalance(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    }
    fetchLedger();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (methodType === 'crypto') {
        setSavedMethod({
          type: 'CRYPTO WALLET',
          provider: cryptoNet,
          identifier: walletAddr ? `${walletAddr.slice(0, 6)}...${walletAddr.slice(-4)}` : '0x...1234',
          owner: 'Network Verified'
        });
      } else if (methodType === 'upi') {
        setSavedMethod({
          type: 'UPI TRANSFER',
          provider: 'Instant VPA',
          identifier: upiId,
          owner: fullName || 'Personal Account'
        });
      } else {
        setSavedMethod({
          type: 'PAYPAL GATEWAY',
          provider: 'Global Mail',
          identifier: paypalEmail,
          owner: fullName || 'Verified User'
        });
      }
      alert("Payout routing configuration updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to save configuration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-zinc-900 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            Financial Terminal
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-2">
            Earnings & Payout Routing
          </h1>
        </div>
        
        <div className="bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-zinc-500 block">TOTAL EARNED</span>
            <span className="text-emerald-400 font-bold text-sm">
              ${balance?.totalEarned || '35.74'}
            </span>
          </div>
          <div className="h-8 w-px bg-zinc-800"></div>
          <div>
            <span className="text-zinc-500 block">LOCKED / ACTIVE</span>
            <span className="text-rose-400 font-bold text-sm">
              ${balance?.pending || '35.74'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs mb-6 font-mono">
          API Error: {error} (Check backend connection)
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Payout Account & Dynamic Config (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">Payout Account</h2>
                <p className="text-zinc-400 text-xs mt-0.5">Destination for your approved funds</p>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 rounded-xl transition shadow-sm"
              >
                {isEditing ? '✕ Cancel' : '✎ Edit Method'}
              </button>
            </div>

            {/* VIEW MODE: Details Loaded Card */}
            {!isEditing ? (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                      ✓
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {savedMethod.type}
                      </span>
                      <p className="text-xs font-mono text-zinc-300 mt-1">{savedMethod.provider}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>

                <div className="pt-3 border-t border-zinc-900 flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-mono">Identifier: <strong className="text-zinc-200">{savedMethod.identifier}</strong></span>
                  <span className="text-zinc-500">{savedMethod.owner}</span>
                </div>
              </div>
            ) : (
              /* EDIT/SELECT MODE: Custom Unique Form */
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-5 animate-in fade-in duration-300">
                
                {/* Custom Method Switcher Tabs */}
                <div className="grid grid-cols-3 gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
                  <button 
                    type="button" 
                    onClick={() => setMethodType('crypto')}
                    className={`py-2 text-[11px] font-bold rounded-lg transition ${methodType === 'crypto' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Crypto
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMethodType('upi')}
                    className={`py-2 text-[11px] font-bold rounded-lg transition ${methodType === 'upi' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                  >
                    UPI
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMethodType('paypal')}
                    className={`py-2 text-[11px] font-bold rounded-lg transition ${methodType === 'paypal' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                  >
                    PayPal
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  {methodType === 'crypto' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Select Network</label>
                        <select 
                          value={cryptoNet} onChange={(e) => setCryptoNet(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                        >
                          <option value="USDT on ERC-20">USDT on ERC-20</option>
                          <option value="USDC on Base">USDC on Base</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Wallet Address</label>
                        <input 
                          type="text" required placeholder="0x..." value={walletAddr} onChange={(e) => setWalletAddr(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  )}

                  {methodType === 'upi' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">UPI ID</label>
                        <input 
                          type="text" required placeholder="username@okhdfcbank" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Account Holder Name</label>
                        <input 
                          type="text" required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  )}

                  {methodType === 'paypal' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">PayPal Email</label>
                        <input 
                          type="email" required placeholder="you@example.com" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Account Holder Name</label>
                        <input 
                          type="text" required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold text-xs uppercase transition shadow-lg shadow-rose-900/40 mt-2 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save & Apply Configuration 🔒'}
                  </button>
                </form>

              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Financial Ledger & Metrics (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-3xl flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Ready for Payout</span>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-400">${balance?.available || '0.00'}</span>
                <span className="text-[10px] text-zinc-500">Available</span>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-3xl flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Under Review</span>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-black text-amber-400">${balance?.pending || '30.33'}</span>
                <span className="text-[10px] text-zinc-500">Pending audit</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">Payment Ledger</h2>
                <p className="text-zinc-400 text-xs">Consolidated record of financial activity</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
                📊
              </div>
            </div>

            <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 font-bold mb-3">
                $
              </div>
              <p className="text-zinc-300 text-xs font-semibold">No payout history yet.</p>
              <p className="text-zinc-500 text-[11px] mt-1 max-w-xs">
                Earnings stay locked while campaigns run. Once finished, balances clear automatically.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
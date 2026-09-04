'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  
  // ADMIN TOGGLE: Isko true karoge toh Admin Panel dikhega, false karoge toh hide ho jayega!
  const [isAdmin, setIsAdmin] = useState(true); 

  const clipperNav = [
    { name: 'Dashboard', href: '/' },
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'My Submissions', href: '/submissions' },
    { name: 'My Accounts', href: '/accounts' },
    { name: 'Payment Methods', href: '/payments' },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between p-4 select-none h-screen">
      
      {/* Top Branding & Navigation */}
      <div>
        {/* Custom Graphic Logo with Hover Animation */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-zinc-900/80">
          <img 
            src="/ClipTanium.jpeg" 
            alt="Cliptanium Logo" 
            className="w-9 h-9 rounded-xl object-cover border border-rose-500/30 shadow-lg shadow-rose-950/50 transition-transform duration-300 hover:scale-105" 
          />
          <div>
            <h1 className="font-black text-sm tracking-tight text-white">CLIPTANIUM</h1>
            <p className="text-[10px] font-mono text-zinc-500 tracking-wider">CREATOR PROTOCOL</p>
          </div>
        </div>

        {/* Clipper Menu Section */}
        <div className="mb-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 px-3 mb-2 font-bold">
            Clipper Menu
          </p>
          <nav className="space-y-1">
            {clipperNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(225,29,72,0.15)]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 hover:translate-x-1'
                  } active:scale-95`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,1)]' : 'bg-zinc-700 group-hover:bg-zinc-400'}`}></span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Panel Section - Sirf tab dikhega jab isAdmin true hoga */}
        {isAdmin && (
          <div className="animate-fadeIn">
            <p className="text-[10px] font-mono uppercase tracking-widest text-rose-500/70 px-3 mb-2 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
              Admin Panel
            </p>
            <nav className="space-y-1">
              {/* Review Queue Link Added */}
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 group ${
                  pathname === '/admin'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(225,29,72,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 hover:translate-x-1'
                } active:scale-95`}
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${pathname === '/admin' ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,1)]' : 'bg-zinc-700 group-hover:bg-zinc-400'}`}></span>
                Review Queue
              </Link>

              <Link
                href="/admin/campaigns"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 group ${
                  pathname === '/admin/campaigns'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(225,29,72,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 hover:translate-x-1'
                } active:scale-95`}
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${pathname === '/admin/campaigns' ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,1)]' : 'bg-zinc-700 group-hover:bg-zinc-400'}`}></span>
                Manage Campaigns
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Footer Mode Indicator with Developer Toggle */}
      <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500 text-[10px]">v0.3 Hybrid Mode</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
        </div>
        
        {/* DEV TOGGLE BUTTON - Role change karne ke liye */}
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className={`w-full flex items-center justify-between text-[10px] font-mono px-2.5 py-2 rounded-lg border transition-all duration-300 active:scale-95 ${
            isAdmin 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
        >
          <span>MOCK ROLE:</span>
          <span className="font-bold tracking-wider">{isAdmin ? 'ADMIN' : 'CLIPPER'}</span>
        </button>
      </div>

    </aside>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import { 
  CalendarDays, 
  Activity, 
  Newspaper, 
  ChevronRight, 
  Swords, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Flame,
  Clock,
  ArrowRight,
  ShieldHalf,
  Trophy
} from "lucide-react";

// --- FAKE DATA ---

const FIXTURES = [
  { id: 1, home: "ARS", homeColor: "bg-rose-600", away: "LIV", awayColor: "bg-red-500", time: "Sat 12:30", match: "High Stakes Clash" },
  { id: 2, home: "MCI", homeColor: "bg-sky-400", away: "CHE", awayColor: "bg-blue-700", time: "Sat 15:00", match: "Title Decider" },
  { id: 3, home: "MUN", homeColor: "bg-red-600", away: "TOT", awayColor: "bg-slate-200", time: "Sat 17:30", match: "European Spots" },
  { id: 4, home: "NEW", homeColor: "bg-slate-900 border border-white/20", away: "AVL", awayColor: "bg-rose-900", time: "Sun 14:00", match: "Top 4 Battle" },
  { id: 5, home: "EVE", homeColor: "bg-blue-600", away: "WHU", awayColor: "bg-rose-900", time: "Sun 16:30", match: "Relegation Scrap" },
];

const NEWS = [
  { 
    id: 1, 
    title: "Saka Doubtful for Weekend Clash", 
    desc: "Mikel Arteta confirms Bukayo Saka will face a late fitness test after picking up a knock in training. Fantasy managers on high alert.", 
    category: "Injury Update",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    time: "2 hours ago"
  },
  { 
    id: 2, 
    title: "Haaland Breaks Another Record", 
    desc: "The Norwegian striker has now scored more goals in his first 10 games than any player in history. Price rise expected.", 
    category: "Player Spotlight",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    time: "5 hours ago"
  },
  { 
    id: 3, 
    title: "Manager Sacked: What it Means for Form", 
    desc: "A tactical analysis of how the recent managerial change might affect key fantasy assets and expected points.", 
    category: "Tactical Analysis",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    time: "Yesterday"
  },
  { 
    id: 4, 
    title: "Double Gameweek Announced!", 
    desc: "Planners take note: Matchweek 14 will feature double fixtures for both City and Arsenal following the cup rearrangements.", 
    category: "League Announcement",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    time: "Yesterday"
  }
];

const PLAYER_STATUS = [
  { id: 1, name: "De Bruyne", club: "MCI", status: "Returning", details: "Expected back by GW13. Proceed with caution.", icon: <Activity className="w-4 h-4 text-cyan-400" />, border: "border-cyan-500/30" },
  { id: 2, name: "Watkins", club: "AVL", status: "Hot Form", details: "Scored 4 in his last 3. Essential pick.", icon: <Flame className="w-4 h-4 text-orange-500" />, border: "border-orange-500/30" },
  { id: 3, name: "Saliba", club: "ARS", status: "Suspended", details: "Out for 1 match due to red card. Sell.", icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, border: "border-rose-500/30" },
  { id: 4, name: "Maddison", club: "TOT", status: "Price Drop", details: "Down £0.2m this week. High ownership risk.", icon: <TrendingDown className="w-4 h-4 text-slate-400" />, border: "border-white/10" },
  { id: 5, name: "Isak", club: "NEW", status: "Price Rise", details: "Up £0.1m after consecutive hauls.", icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, border: "border-emerald-500/30" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 pb-20">
      
    

      {/* Hero Header */}
      <div className="border-b border-white/5 bg-slate-900/40 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-1/4 h-64 w-64 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-12 relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold tracking-wide uppercase mb-3">
             <Trophy className="w-4 h-4" /> Season 2026/27
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Manager Dashboard
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Welcome back. Prepare for Matchweek 12 with the latest insights, breaking news, and player status updates affecting your squad.
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: News Feed (Spans 8 columns on large screens) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                 <Newspaper className="w-6 h-6 text-cyan-400" /> Latest Intel
               </h2>
               <button className="text-sm font-medium text-slate-400 hover:text-white transition flex items-center gap-1">
                 View All <ArrowRight className="w-4 h-4" />
               </button>
            </div>

            <div className="grid gap-4">
              {NEWS.map((item) => (
                <div key={item.id} className="group relative rounded-2xl border border-white/5 bg-white/5 p-6 transition hover:border-white/10 hover:bg-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wide font-bold rounded-full border ${item.bg} ${item.color}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Promo Card inside feed */}
            <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8 text-center relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-white mb-3">Ready to optimize your lineup?</h3>
                 <p className="text-slate-300 mb-6 max-w-md mx-auto">
                   Our predictive AI factors in all breaking news to suggest the best starting 11 for this gameweek.
                 </p>
                 <Link href="/buildTeam" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-400 hover:scale-105">
                   Engine <ChevronRight className="w-4 h-4" />
                 </Link>
               </div>
            </div>
          </div>

          {/* Column 2: Sidebars (Fixtures & Player Status) (Spans 4 cols on large) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Upcoming Fixtures Widget */}
            <div className="rounded-3xl border border-white/5 bg-white/5 overflow-hidden">
              <div className="p-5 border-b border-white/5 bg-slate-900/50">
                 <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   <CalendarDays className="w-5 h-5 text-emerald-400" /> Matchweek 12
                 </h2>
                 <p className="text-xs text-slate-400 mt-1">Starting in 2 Days</p>
              </div>
              <div className="p-0 divide-y divide-white/5">
                {FIXTURES.map((match) => (
                  <div key={match.id} className="p-4 hover:bg-white/5 transition cursor-pointer group">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center mb-2 font-semibold">
                      {match.time} • {match.match}
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className={`h-8 w-8 rounded-full ${match.homeColor} shadow-md flex items-center justify-center`}>
                           {/* Simulating a logo badge */}
                           <ShieldHalf className="w-4 h-4 text-white/50" />
                        </div>
                        <span className="text-sm font-bold text-slate-200">{match.home}</span>
                      </div>
                      
                      <div className="flex flex-col items-center w-1/3">
                        <div className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded border border-white/5">VS</div>
                      </div>

                      <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className={`h-8 w-8 rounded-full ${match.awayColor} shadow-md flex items-center justify-center`}>
                           <ShieldHalf className="w-4 h-4 text-white/50" />
                        </div>
                        <span className="text-sm font-bold text-slate-200">{match.away}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/5 bg-slate-900/50 text-center">
                 <button className="text-sm text-emerald-400 hover:text-emerald-300 transition font-medium">
                   View Full Schedule
                 </button>
              </div>
            </div>

            {/* Player Status / Tracker Widget */}
            <div className="rounded-3xl border border-white/5 bg-white/5 overflow-hidden">
               <div className="p-5 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
                 <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   <Activity className="w-5 h-5 text-cyan-400" /> Player Status
                 </h2>
                 <span className="flex h-2 w-2">
                   <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-rose-400 opacity-75"></span>
                   <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
                 </span>
               </div>
               <div className="p-4 space-y-3">
                 {PLAYER_STATUS.map((player) => (
                   <div key={player.id} className={`p-3 rounded-xl border bg-slate-950/50 ${player.border} transition hover:bg-white/5`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{player.name}</span>
                          <span className="text-[10px] text-slate-400 bg-white/10 px-1.5 py-0.5 rounded font-mono">
                            {player.club}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 px-2 py-1 rounded-md">
                          {player.icon}
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                            {player.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">
                        {player.details}
                      </p>
                   </div>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

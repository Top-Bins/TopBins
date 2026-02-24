"use client";

import React, { useState } from "react";
import Link from "next/link";

interface League {
    id: string;
    name: string;
    rank: number;
    totalTeams: number;
    points: number;
}

interface Standing {
    rank: number;
    teamName: string;
    points: number;
    lastWeek: number;
}

const MOCK_LEAGUES: League[] = [
    { id: "1", name: "The Champions Circle", rank: 12, totalTeams: 120, points: 1450 },
    { id: "2", name: "Workplace Warriors", rank: 3, totalTeams: 15, points: 1380 },
    { id: "3", name: "Global Elite League", rank: 4502, totalTeams: 50000, points: 1200 },
];

const MOCK_STANDINGS: Record<string, Standing[]> = {
    "1": [
        { rank: 1, teamName: "Thunder Strikers", points: 1520, lastWeek: 1 },
        { rank: 2, teamName: "Goal Diggers FC", points: 1495, lastWeek: 3 },
        { rank: 3, teamName: "Red Devils United", points: 1480, lastWeek: 2 },
        { rank: 4, teamName: "Top Bins Kings", points: 1450, lastWeek: 5 },
        { rank: 5, teamName: "Your Team", points: 1420, lastWeek: 4 },
        { rank: 6, teamName: "Offside Trap", points: 1390, lastWeek: 6 },
        { rank: 7, teamName: "Counter Attackers", points: 1375, lastWeek: 8 },
        { rank: 8, teamName: "Pitch Perfect", points: 1360, lastWeek: 7 },
    ],
    "2": [
        { rank: 1, teamName: "Office All-Stars", points: 1550, lastWeek: 1 },
        { rank: 2, teamName: "Watercooler Wanderers", points: 1510, lastWeek: 2 },
        { rank: 3, teamName: "Your Team", points: 1380, lastWeek: 4 },
        { rank: 4, teamName: "Deadline Dreamers", points: 1320, lastWeek: 3 },
        { rank: 5, teamName: "Spreadsheet Stallions", points: 1290, lastWeek: 5 },
    ],
    "3": [
        { rank: 4500, teamName: "Global Giant 1", points: 1205, lastWeek: 4502 },
        { rank: 4501, teamName: "World Class XI", points: 1202, lastWeek: 4490 },
        { rank: 4502, teamName: "Your Team", points: 1200, lastWeek: 4505 },
        { rank: 4503, teamName: "International Icons", points: 1198, lastWeek: 4500 },
        { rank: 4504, teamName: "Planet Football", points: 1195, lastWeek: 4510 },
    ]
};

export default function DashboardPage() {
    const [activeLeagueId, setActiveLeagueId] = useState("1");
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-white/5 bg-slate-900/50 hidden lg:flex flex-col">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition" />
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">TopBins</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavLink href="/" icon="🏠">Home</NavLink>
                    <NavLink href="/dashboard" icon="📊" active>Dashboard</NavLink>
                    <NavLink href="/buildTeam" icon="⚽">Draft Squad</NavLink>
                    <NavLink href="#" icon="👤">Profile</NavLink>
                    <NavLink href="#" icon="⚙️">Settings</NavLink>
                </nav>

                <div className="p-6 border-t border-white/5 space-y-4">
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent p-4 border border-emerald-500/20">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Current Event</p>
                        <p className="text-sm font-semibold text-white">Gameweek 24 Live</p>
                        <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>

                    <div className="px-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Recent Results</p>
                        <div className="space-y-3">
                            <ResultRow teams="GW23" score="78 pts" trend="up" />
                            <ResultRow teams="GW22" score="45 pts" trend="down" />
                            <ResultRow teams="GW21" score="62 pts" trend="stable" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Header */}
                <header className="sticky top-0 z-10 flex items-center justify-between bg-slate-950/80 px-8 py-6 backdrop-blur-md border-b border-white/5">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">DASHBOARD</h1>
                        <p className="text-slate-400 text-sm">Welcome back, Gaffer.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-2.5 rounded-xl bg-white text-slate-950 text-sm font-bold shadow-xl hover:bg-slate-200 transition active:scale-95"
                        >
                            CREATE LEAGUE
                        </button>
                        <button className="px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition active:scale-95">
                            JOIN LEAGUE
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Stats Overview */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Total Points" value="1,450" sub="Top 5%" icon="✨" />
                        <StatCard label="Global Rank" value="#4,502" sub="↑ 245 spots" icon="🌍" />
                        <StatCard label="Active Leagues" value="3" sub="2 private / 1 public" icon="🏆" />
                    </section>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* My Leagues (Left Column) */}
                        <div className="xl:col-span-4 space-y-6">
                            <div className="flex items-center justify-between uppercase tracking-widest text-xs font-black text-slate-500">
                                <h2>MY LEAGUES</h2>
                            </div>
                            <div className="space-y-4">
                                {MOCK_LEAGUES.map((league) => (
                                    <button
                                        key={league.id}
                                        onClick={() => setActiveLeagueId(league.id)}
                                        className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${activeLeagueId === league.id
                                            ? "bg-slate-900 border-emerald-500/30 ring-1 ring-emerald-500/20"
                                            : "bg-slate-900/40 border-white/5 hover:border-white/10"
                                            }`}
                                    >
                                        <div className="relative z-10 flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition">{league.name}</h3>
                                                <p className="text-slate-500 text-sm">{league.totalTeams} Teams</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-emerald-400 font-black italic">#{league.rank}</p>
                                                <p className="text-slate-500 text-xs">{league.points} pts</p>
                                            </div>
                                        </div>
                                        {activeLeagueId === league.id && (
                                            <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Standings (Right Column) */}
                        <div className="xl:col-span-8 space-y-6">
                            <div className="flex items-center justify-between uppercase tracking-widest text-xs font-black text-slate-500">
                                <h2>LEAGUE STANDINGS</h2>
                                <span className="text-emerald-400">GW24</span>
                            </div>

                            <div className="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="px-6 py-4">Rank</th>
                                            <th className="px-6 py-4">Team</th>
                                            <th className="px-6 py-4 text-right">Points</th>
                                            <th className="px-6 py-4 text-center">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {(MOCK_STANDINGS[activeLeagueId] || []).map((standing) => (
                                            <tr key={standing.teamName} className={`hover:bg-white/[0.02] transition cursor-default ${standing.teamName === "Your Team" ? "bg-emerald-500/5" : ""}`}>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg font-mono font-bold text-sm ${standing.rank === 1 ? "bg-amber-400 text-slate-950" :
                                                        standing.rank === 2 ? "bg-slate-300 text-slate-950" :
                                                            standing.rank === 3 ? "bg-amber-700 text-white" : "text-slate-400"
                                                        }`}>
                                                        {standing.rank}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`font-bold ${standing.teamName === "Your Team" ? "text-emerald-400" : "text-white"}`}>
                                                        {standing.teamName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right font-mono font-black text-white">
                                                    {standing.points}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    {standing.lastWeek > standing.rank ? (
                                                        <span className="text-emerald-400 text-xs">▲</span>
                                                    ) : standing.lastWeek < standing.rank ? (
                                                        <span className="text-rose-500 text-xs">▼</span>
                                                    ) : (
                                                        <span className="text-slate-600 text-[10px]">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mock Modal for Create League */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-white mb-2 italic">CREATE NEW LEAGUE</h2>
                        <p className="text-slate-400 text-sm mb-6">Compete with friends and rivals in your own private arena.</p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">League Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Master Tacticians"
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-200 transition">CREATE</button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 rounded-xl bg-white/5 text-slate-400 font-bold text-sm hover:bg-white/10 transition"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function NavLink({ href, icon, children, active = false }: { href: string; icon: string; children: React.ReactNode; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition group ${active
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-slate-500 hover:bg-white/5 hover:text-white"
                }`}
        >
            <span className={`text-xl transition ${active ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`}>{icon}</span>
            <span className="font-bold text-sm tracking-wide">{children}</span>
            {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
        </Link>
    );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: string }) {
    return (
        <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-6xl opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out">{icon}</div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline gap-3">
                <h3 className="text-3xl font-black text-white italic">{value}</h3>
                <span className="text-emerald-400 text-xs font-bold">{sub}</span>
            </div>
        </div>
    );
}

function ResultRow({ teams, score, trend }: { teams: string; score: string; trend: 'up' | 'down' | 'stable' }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">{teams}</span>
            <div className="flex items-center gap-2">
                <span className="text-white font-mono">{score}</span>
                <span className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-500' : 'text-slate-600'}>
                    {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
                </span>
            </div>
        </div>
    );
}

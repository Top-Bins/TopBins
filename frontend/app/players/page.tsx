"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Trophy, TrendingUp, Shield, Activity, X } from 'lucide-react';

type Player = {
    id: string;
    name: string;
    club: string;
    position: "GK" | "DEF" | "MID" | "FWD";
    price: number;
    points: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    form: number;
    image: string;
};

const MOCK_PLAYERS: Player[] = [
    { id: "1", name: "Alisson", club: "Liverpool", position: "GK", price: 5.5, points: 42, goals: 0, assists: 1, cleanSheets: 5, form: 7.2, image: "https://minio.sportsteq.com/public/players/alisson.png" },
    { id: "2", name: "Ederson", club: "Man City", position: "GK", price: 5.5, points: 38, goals: 0, assists: 0, cleanSheets: 4, form: 6.8, image: "" },
    { id: "3", name: "Raya", club: "Arsenal", position: "GK", price: 5.0, points: 45, goals: 0, assists: 0, cleanSheets: 6, form: 8.1, image: "" },
    { id: "5", name: "Van Dijk", club: "Liverpool", position: "DEF", price: 6.0, points: 50, goals: 2, assists: 1, cleanSheets: 5, form: 7.5, image: "" },
    { id: "6", name: "Saliba", club: "Arsenal", position: "DEF", price: 5.5, points: 48, goals: 1, assists: 0, cleanSheets: 6, form: 7.1, image: "" },
    { id: "11", name: "De Bruyne", club: "Man City", position: "MID", price: 10.5, points: 65, goals: 3, assists: 8, cleanSheets: 2, form: 9.0, image: "" },
    { id: "12", name: "Odegaard", club: "Arsenal", position: "MID", price: 8.5, points: 55, goals: 5, assists: 4, cleanSheets: 3, form: 8.2, image: "" },
    { id: "13", name: "Rice", club: "Arsenal", position: "MID", price: 7.0, points: 45, goals: 2, assists: 2, cleanSheets: 4, form: 7.0, image: "" },
    { id: "17", name: "Haaland", club: "Man City", position: "FWD", price: 14.0, points: 88, goals: 14, assists: 2, cleanSheets: 0, form: 9.5, image: "" },
    { id: "18", name: "Salah", club: "Liverpool", position: "FWD", price: 13.0, points: 82, goals: 10, assists: 6, cleanSheets: 1, form: 9.2, image: "" },
    { id: "19", name: "Saka", club: "Arsenal", position: "FWD", price: 8.5, points: 70, goals: 7, assists: 5, cleanSheets: 2, form: 8.5, image: "" },
    { id: "20", name: "Son", club: "Spurs", position: "FWD", price: 9.0, points: 68, goals: 8, assists: 4, cleanSheets: 1, form: 8.0, image: "" },
    { id: "21", name: "Watkins", club: "Aston Villa", position: "FWD", price: 8.0, points: 65, goals: 7, assists: 4, cleanSheets: 0, form: 7.8, image: "" },
];

export default function PlayersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPos, setSelectedPos] = useState<"ALL" | "GK" | "DEF" | "MID" | "FWD">("ALL");
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const filteredPlayers = MOCK_PLAYERS.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.club.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPos = selectedPos === "ALL" || p.position === selectedPos;
        return matchesSearch && matchesPos;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 pt-24 md:p-12 md:pt-24 font-sans flex flex-col">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                        <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition">
                            Dashboard
                        </Link>
                        <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-xs font-bold">MGR</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-8">
                {/* Left Column: Player List */}
                <div className="flex-1 flex flex-col h-[calc(100vh-140px)]">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white">Player Database</h1>
                        <p className="text-slate-400">Scout players, analyze stats, and find the next star for your roster.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Search by name or club..."
                                className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 bg-slate-900/60 border border-white/10 p-1 rounded-2xl overflow-x-auto scrollbar-hide">
                            {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map(pos => (
                                <button
                                    key={pos}
                                    onClick={() => setSelectedPos(pos)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedPos === pos ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                                >
                                    {pos}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {filteredPlayers.map(player => (
                            <div 
                                key={player.id}
                                onClick={() => setSelectedPlayer(player)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${selectedPlayer?.id === player.id ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.1)]" : "bg-slate-900/40 border-white/5 hover:bg-slate-900/80 hover:border-white/10"}`}
                            >
                                <div className="h-12 w-12 rounded-full bg-slate-950 flex items-center justify-center font-bold text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                                    {player.position}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-lg">{player.name}</h3>
                                    <p className="text-sm text-slate-400">{player.club}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-white text-xl">{player.points}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Points</div>
                                </div>
                            </div>
                        ))}
                        {filteredPlayers.length === 0 && (
                            <div className="text-center py-20 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
                                <p className="text-slate-500">No players found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Player Profile */}
                <div className="w-full lg:w-[400px] xl:w-[450px]">
                    {selectedPlayer ? (
                        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden sticky top-[100px] shadow-2xl animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="relative h-48 bg-gradient-to-br from-emerald-900/40 to-slate-900 flex flex-col justify-end p-6 overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-[80px]" />
                                <button 
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-colors text-white/70 hover:text-white"
                                    onClick={() => setSelectedPlayer(null)}
                                >
                                    <X size={18} />
                                </button>
                                
                                <div className="relative z-10 flex items-end gap-6">
                                    <div className="h-24 w-24 rounded-2xl bg-slate-950 border-4 border-slate-900 flex items-center justify-center text-3xl font-black text-emerald-400 shadow-xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent" />
                                        {selectedPlayer.position}
                                    </div>
                                    <div className="pb-1">
                                        <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-1">{selectedPlayer.name}</h2>
                                        <p className="font-medium text-emerald-400 flex items-center gap-2">
                                            {selectedPlayer.club} • <span className="text-slate-400">£{selectedPlayer.price}m</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <StatCard icon={<Trophy className="text-amber-400" size={18} />} label="Total Points" value={selectedPlayer.points.toString()} />
                                    <StatCard icon={<TrendingUp className="text-emerald-400" size={18} />} label="Form" value={selectedPlayer.form.toString()} />
                                </div>

                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Season Stats</h3>
                                
                                <div className="space-y-4">
                                    <StatBar label="Goals Scored" value={selectedPlayer.goals} max={30} />
                                    <StatBar label="Assists" value={selectedPlayer.assists} max={20} />
                                    {["GK", "DEF"].includes(selectedPlayer.position) && (
                                        <StatBar label="Clean Sheets" value={selectedPlayer.cleanSheets} max={15} />
                                    )}
                                </div>

                                <button className="mt-8 w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2">
                                    <Shield size={18} /> Add to Roster
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] bg-slate-900/40 border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 sticky top-[100px]">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Activity className="text-slate-500 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Select a Player</h3>
                            <p className="text-slate-500 max-w-[250px]">Click on any player in the database to view their detailed profile and seasonal statistics.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-slate-950/50 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                {icon} {label}
            </div>
            <div className="text-3xl font-black text-white">{value}</div>
        </div>
    );
}

function StatBar({ label, value, max }: { label: string, value: number, max: number }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-300">{label}</span>
                <span className="font-bold text-white">{value}</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

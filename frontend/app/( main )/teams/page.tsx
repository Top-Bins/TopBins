"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Trophy, Shield, Activity, X, Crosshair } from 'lucide-react';

type Team = {
    id: string;
    name: string;
    shortName: string;
    primaryColor: string;
    secondaryColor: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    cleanSheets: number;
    form: ("W" | "D" | "L")[];
};

const MOCK_TEAMS: Team[] = [
    { id: "1", name: "Arsenal", shortName: "ARS", primaryColor: "from-red-600", secondaryColor: "to-red-800", played: 12, wins: 8, draws: 3, losses: 1, goalsFor: 26, goalsAgainst: 10, cleanSheets: 6, form: ["W", "D", "W", "W", "L"] },
    { id: "2", name: "Manchester City", shortName: "MCI", primaryColor: "from-sky-400", secondaryColor: "to-sky-600", played: 12, wins: 9, draws: 2, losses: 1, goalsFor: 32, goalsAgainst: 11, cleanSheets: 4, form: ["W", "W", "D", "W", "W"] },
    { id: "3", name: "Liverpool", shortName: "LIV", primaryColor: "from-rose-600", secondaryColor: "to-rose-900", played: 12, wins: 8, draws: 4, losses: 0, goalsFor: 28, goalsAgainst: 9, cleanSheets: 5, form: ["D", "W", "W", "W", "D"] },
    { id: "4", name: "Tottenham Hotspur", shortName: "TOT", primaryColor: "from-slate-100/80", secondaryColor: "to-slate-300/80", played: 12, wins: 8, draws: 2, losses: 2, goalsFor: 24, goalsAgainst: 14, cleanSheets: 4, form: ["W", "L", "W", "W", "D"] },
    { id: "5", name: "Aston Villa", shortName: "AVL", primaryColor: "from-fuchsia-900", secondaryColor: "to-sky-300/80", played: 12, wins: 8, draws: 1, losses: 3, goalsFor: 29, goalsAgainst: 17, cleanSheets: 2, form: ["W", "L", "W", "L", "W"] },
    { id: "6", name: "Newcastle United", shortName: "NEW", primaryColor: "from-slate-900", secondaryColor: "to-slate-700", played: 12, wins: 6, draws: 2, losses: 4, goalsFor: 27, goalsAgainst: 14, cleanSheets: 5, form: ["L", "D", "W", "W", "L"] },
    { id: "7", name: "Manchester United", shortName: "MUN", primaryColor: "from-red-600", secondaryColor: "to-red-950", played: 12, wins: 7, draws: 0, losses: 5, goalsFor: 13, goalsAgainst: 16, cleanSheets: 4, form: ["W", "W", "L", "W", "L"] },
    { id: "8", name: "Brighton", shortName: "BHA", primaryColor: "from-blue-500", secondaryColor: "to-blue-700", played: 12, wins: 5, draws: 4, losses: 3, goalsFor: 25, goalsAgainst: 21, cleanSheets: 1, form: ["D", "D", "D", "L", "W"] },
    { id: "9", name: "Chelsea", shortName: "CHE", primaryColor: "from-blue-700", secondaryColor: "to-blue-900", played: 12, wins: 4, draws: 4, losses: 4, goalsFor: 21, goalsAgainst: 16, cleanSheets: 3, form: ["D", "W", "L", "D", "W"] },
    { id: "10", name: "Brentford", shortName: "BRE", primaryColor: "from-red-600", secondaryColor: "to-red-800", played: 12, wins: 4, draws: 4, losses: 4, goalsFor: 19, goalsAgainst: 17, cleanSheets: 2, form: ["L", "W", "D", "W", "L"] },
];

export default function TeamsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const filteredTeams = MOCK_TEAMS.filter((t) => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 pt-24 md:p-12 md:pt-24 font-sans flex flex-col">
            

            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-8">
                {/* Left Column: Team List */}
                <div className="flex-1 flex flex-col h-[calc(100vh-140px)]">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white">Club Directory</h1>
                        <p className="text-slate-400">View team statistics, form, and overall league performance.</p>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input 
                            type="text"
                            placeholder="Search clubs by name or abbreviation..."
                            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {filteredTeams.map((team, index) => {
                            const points = (team.wins * 3) + team.draws;
                            const isSelected = selectedTeam?.id === team.id;
                            
                            return (
                                <div 
                                    key={team.id}
                                    onClick={() => setSelectedTeam(team)}
                                    className={`flex items-center gap-5 p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.1)]" : "bg-slate-900/40 border-white/5 hover:bg-slate-900/80 hover:border-white/10"}`}
                                >
                                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${team.primaryColor} ${team.secondaryColor} flex items-center justify-center font-black text-white text-lg shadow-lg border border-white/20 flex-shrink-0 relative overflow-hidden group`}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        <span className="relative z-10">{team.shortName}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg">{team.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {team.form.slice(-3).map((result, i) => (
                                                <span key={i} className={`flex h-4 w-4 items-center justify-center rounded-sm text-[9px] font-bold text-white shadow-sm ${
                                                    result === 'W' ? 'bg-emerald-500' : result === 'D' ? 'bg-slate-500' : 'bg-red-500'
                                                }`}>
                                                    {result}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-white text-2xl tracking-tighter">{points}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">PTS</div>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredTeams.length === 0 && (
                            <div className="text-center py-20 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
                                <p className="text-slate-500">No clubs found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Team Profile */}
                <div className="w-full lg:w-[400px] xl:w-[450px]">
                    {selectedTeam ? (
                        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden sticky top-[100px] shadow-2xl animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="relative h-48 bg-slate-950 flex flex-col justify-end p-6 overflow-hidden">
                                {/* Dynamic Background based on Team Colors */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${selectedTeam.primaryColor} ${selectedTeam.secondaryColor} opacity-20`} />
                                <div className={`absolute top-0 right-0 p-32 bg-gradient-to-br ${selectedTeam.primaryColor} ${selectedTeam.secondaryColor} rounded-full blur-[80px] opacity-40`} />
                                
                                <button 
                                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-colors text-white/70 hover:text-white"
                                    onClick={() => setSelectedTeam(null)}
                                >
                                    <X size={18} />
                                </button>
                                
                                <div className="relative z-10 flex items-end gap-5">
                                    <div className={`h-24 w-24 rounded-2xl bg-gradient-to-br ${selectedTeam.primaryColor} ${selectedTeam.secondaryColor} border-4 border-slate-900 flex items-center justify-center text-3xl font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10" />
                                        <span className="relative z-10 shadow-black drop-shadow-md">{selectedTeam.shortName}</span>
                                    </div>
                                    <div className="pb-1 text-shadow-sm">
                                        <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-1">{selectedTeam.name}</h2>
                                        <p className="font-semibold text-white/80 uppercase tracking-widest text-xs">
                                            Premier League
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <StatCard icon={<Trophy className="text-amber-400" size={18} />} label="Total Points" value={((selectedTeam.wins * 3) + selectedTeam.draws).toString()} />
                                    <StatCard icon={<Shield className="text-emerald-400" size={18} />} label="Clean Sheets" value={selectedTeam.cleanSheets.toString()} />
                                </div>

                                <div className="bg-slate-950/50 rounded-2xl border border-white/5 p-4 mb-8 flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Form</span>
                                    <div className="flex gap-1.5">
                                        {selectedTeam.form.map((result, i) => (
                                            <span key={i} className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md text-xs font-bold text-white shadow-sm ring-1 ring-white/10 ${
                                                result === 'W' ? 'bg-emerald-500' : result === 'D' ? 'bg-slate-500' : 'bg-red-500'
                                            }`}>
                                                {result}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Season Record & Stats</h3>
                                
                                <div className="space-y-4">
                                     <div className="grid grid-cols-3 gap-2 mb-2">
                                        <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 flex flex-col items-center">
                                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Wins</span>
                                            <span className="text-xl font-black text-white">{selectedTeam.wins}</span>
                                        </div>
                                        <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 flex flex-col items-center">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Draws</span>
                                            <span className="text-xl font-black text-white">{selectedTeam.draws}</span>
                                        </div>
                                        <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 flex flex-col items-center">
                                            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Losses</span>
                                            <span className="text-xl font-black text-white">{selectedTeam.losses}</span>
                                        </div>
                                    </div>

                                    <StatBar label="Goals Scored" value={selectedTeam.goalsFor} max={50} colorClass="from-cyan-500 to-blue-500" />
                                    <StatBar label="Goals Against" value={selectedTeam.goalsAgainst} max={50} colorClass="from-rose-500 to-red-500" reverse />
                                </div>

                                <button className="mt-8 w-full bg-white/5 border border-white/10 text-white font-bold py-3 px-4 rounded-xl hover:bg-white/10 transition-all flex justify-center items-center gap-2">
                                    <Crosshair size={18} className="text-emerald-400" /> View Roster Highlights
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] bg-slate-900/40 border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 sticky top-[100px]">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Activity className="text-slate-500 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Select a Club</h3>
                            <p className="text-slate-500 max-w-[250px]">Click on any club in the directory to view its detailed performance profile and statistics.</p>
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

function StatBar({ label, value, max, colorClass, reverse = false }: { label: string, value: number, max: number, colorClass: string, reverse?: boolean }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-300">{label}</span>
                <span className="font-bold text-white">{value}</span>
            </div>
            <div className={`h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 ${reverse ? 'flex justify-end' : ''}`}>
                <div 
                    className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

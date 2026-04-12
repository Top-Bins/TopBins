'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, ChevronLeft, ChevronRight, Users, AlertCircle } from 'lucide-react';
import { leagueService } from '@/services/league';

export default function LeagueViewPage() {
    const params = useParams();
    const router = useRouter();
    const [league, setLeague] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeague = async () => {
            try {
                const data = await leagueService.getLeagueDetails(params.id as string);
                setLeague(data);
            } catch (err: any) {
                setError(err.message || "Failed to load league.");
            }
        };
        if (params.id) {
            fetchLeague();
        }
    }, [params.id]);

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-12 flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-rose-500" />
                <p className="text-xl font-bold">{error}</p>
                <button 
                    onClick={() => router.push('/leagues')}
                    className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                    Back to Leagues
                </button>
            </div>
        );
    }

    if (!league) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Loading League</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 pt-24 md:p-12 md:pt-24 pb-20">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                        <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link href="/leagues" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition">
                            My Leagues
                        </Link>
                        <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-xs font-bold">JD</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <button 
                        onClick={() => router.push('/leagues')}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft size={16} /> Back to Leagues
                    </button>
                    
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl font-black text-emerald-400 shadow-xl shadow-emerald-900/20">
                            {league.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                                {league.name}
                            </h1>
                            <p className="text-slate-400 flex items-center gap-2 mt-1">
                                <Users size={14} className="text-cyan-400"/> {league.members.length} Members
                            </p>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
                    <div className="px-6 py-4 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
                        <h2 className="font-bold text-lg text-white flex items-center gap-2">
                            <Trophy className="text-amber-400" size={18} /> League Standings
                        </h2>
                        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-white/5">
                            Matchweek 12
                        </span>
                    </div>
                    
                    <div className="divide-y divide-white/5">
                        {league.members.sort((a, b) => b.points - a.points).map((member, index) => {
                            const isCurrentUser = member.id === 'u1'; // Dummy logic for formatting
                            
                            return (
                                <div 
                                    key={member.id}
                                    onClick={() => router.push(`/leagues/${league.id}/members/${member.id}`)}
                                    className={`group flex items-center p-6 hover:bg-white/5 transition-colors cursor-pointer ${isCurrentUser ? 'bg-emerald-500/5' : ''}`}
                                >
                                    <div className="w-12 text-center text-2xl font-black text-slate-500 group-hover:text-emerald-400 transition-colors">
                                        {index + 1}
                                    </div>
                                    
                                    <div className="flex-1 ml-4">
                                        <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            {member.team_name}
                                        </h3>
                                        <p className="text-sm text-slate-400">{member.name}</p>
                                    </div>
                                    
                                    <div className="text-right mr-6">
                                        <div className="text-2xl font-bold text-white">{member.points}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Points</div>
                                    </div>
                                    
                                    <ChevronRight className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Trophy, ChevronRight, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { leagueService } from '@/services/league';

export default function LeagueDashboardPage() {
    const [leagues, setLeagues] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const data = await leagueService.getMyLeagues();
                setLeagues(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load leagues');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeagues();
    }, []);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 pt-24 md:p-12 md:pt-24">
            {/* Navbar Mock (matching app/page.tsx) */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold">
                            JD
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white">Your Leagues</h1>
                        <p className="text-slate-400">Compete with friends and climb the global leaderboards.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/leagues/join')}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold text-slate-200"
                        >
                            <Users size={18} className="text-emerald-400" />
                            Join
                        </button>
                        <button
                            onClick={() => router.push('/leagues/create')}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:brightness-110 transition-all font-bold shadow-lg shadow-emerald-500/20"
                        >
                            <Plus size={18} />
                            Create
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-white/5 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {leagues.map((league) => (
                            <div
                                key={league.id}
                                onClick={() => router.push(`/leagues/${league.id}`)}
                                className="group relative bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 hover:bg-white/5 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl font-bold text-emerald-400 group-hover:scale-110 transition-transform shadow-inner shadow-white/5">
                                            {league.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1 text-white group-hover:text-emerald-400 transition-colors">
                                                {league.name}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} /> {league.members || 1} Members
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyToClipboard(league.invite_code);
                                                    }}
                                                    className="flex items-center gap-1.5 font-mono text-xs bg-slate-950 border border-white/5 px-2 py-0.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                                                >
                                                    {league.invite_code}
                                                    {copiedCode === league.invite_code ? <Check size={12} /> : <Copy size={12} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Current Rank</p>
                                            <div className="flex items-center gap-1.5 justify-end font-bold text-lg text-white">
                                                <Trophy size={16} className="text-amber-400" />
                                                #{league.rank || 1}
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && leagues.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/20 border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-slate-500 mb-6">You haven't joined any leagues yet.</p>
                        <button
                            onClick={() => router.push('/leagues/create')}
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-cyan-400 font-bold transition-colors"
                        >
                            Create your first league <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { Plus, Users, Trophy, ChevronRight } from 'lucide-react';

// Mock data for UI demonstration
const MOCK_LEAGUES = [
    { id: '1', name: 'Elite Champions', members: 12, rank: 3, invite_code: 'ELITE-99' },
    { id: '2', name: 'Weekend Warriors', members: 8, rank: 1, invite_code: 'WAR-2024' },
    { id: '3', name: 'Office Bragging Rights', members: 25, rank: 14, invite_code: 'WORK-XYZ' },
];

export default function LeagueDashboardPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Your Leagues</h1>
                        <p className="text-neutral-400">Compete with friends and climb the global leaderboards.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/leagues/join')}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-all font-semibold"
                        >
                            <Users size={20} className="text-purple-400" />
                            Join League
                        </button>
                        <button
                            onClick={() => router.push('/leagues/create')}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-neutral-950 hover:from-emerald-400 hover:to-cyan-400 transition-all font-bold shadow-lg shadow-emerald-500/10"
                        >
                            <Plus size={20} />
                            Create
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {MOCK_LEAGUES.map((league) => (
                        <div
                            key={league.id}
                            className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-neutral-800 flex items-center justify-center text-2xl font-bold text-emerald-400 group-hover:scale-110 transition-transform">
                                        {league.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-400 transition-colors">
                                            {league.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                                            <span className="flex items-center gap-1">
                                                <Users size={14} /> {league.members} Members
                                            </span>
                                            <span className="flex items-center gap-1 font-mono text-xs bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                                                {league.invite_code}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-1">Rank</p>
                                        <div className="flex items-center gap-1 justify-end font-bold text-lg">
                                            <Trophy size={16} className="text-amber-400" />
                                            #{league.rank}
                                        </div>
                                    </div>
                                    <ChevronRight className="text-neutral-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {MOCK_LEAGUES.length === 0 && (
                    <div className="text-center py-20 bg-neutral-900/50 border-2 border-dashed border-neutral-800 rounded-3xl">
                        <p className="text-neutral-500 mb-6">You haven't joined any leagues yet.</p>
                        <button
                            onClick={() => router.push('/leagues/create')}
                            className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                        >
                            Create your first league &rarr;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

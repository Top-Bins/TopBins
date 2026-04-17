'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { leagueService } from '@/services/league';
import { ChevronLeft, Loader2, PlayCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function DraftRoomPage() {
    const params = useParams();
    const router = useRouter();
    const [league, setLeague] = useState<any>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isDrafting, setIsDrafting] = useState(false);

    const loadDraftData = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            const [leagueData, playersData] = await Promise.all([
                leagueService.getLeagueDetails(params.id as string),
                leagueService.getAvailablePlayers(params.id as string)
            ]);
            
            setLeague(leagueData);
            setPlayers(playersData);
        } catch (err: any) {
            setError(err.message || "Failed to load draft room.");
        }
    };

    useEffect(() => {
        if (params.id) {
            loadDraftData();
        }
    }, [params.id]);

    const handlePickPlayer = async (playerId: number) => {
        try {
            setIsDrafting(true);
            await leagueService.makeDraftPick(params.id as string, playerId);
            await loadDraftData(); // Refresh state after pick
        } catch (err: any) {
            alert(err.message || 'Failed to draft player');
        } finally {
            setIsDrafting(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-12 flex flex-col items-center justify-center gap-4">
                <p className="text-xl font-bold text-rose-500">{error}</p>
                <button onClick={() => router.push(`/leagues/${params.id}`)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg">Back</button>
            </div>
        );
    }

    if (!league) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            </div>
        );
    }

    const settings = league.settings || {};
    const draftOrder = settings.draft_order || [];
    const currentIndex = settings.current_pick_index || 0;
    const currentTeamId = draftOrder[currentIndex];
    const currentTeam = league.members.find((m: any) => m.id === currentTeamId);
    const isMyTurn = currentTeam?.user_id === currentUser?.id;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 pb-20">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between w-full">
                    <Link href={`/leagues/${league.id}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft size={16} /> Back to League
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-bold text-emerald-400 tracking-widest uppercase">Draft Live</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Draft Board Sidebar */}
                <div className="col-span-1 border-r border-white/5 pr-8">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                        Draft Board
                    </h2>
                    <div className="space-y-4">
                        {draftOrder.map((teamId: string, idx: number) => {
                            const team = league.members.find((m: any) => m.id === teamId);
                            const isCurrent = idx === currentIndex;
                            const isPast = idx < currentIndex;

                            return (
                                <div key={idx} className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${isCurrent ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 scale-105' : isPast ? 'opacity-50 bg-white/5' : 'bg-white/5'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${isCurrent ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{team?.team_name || 'Unknown Team'}</p>
                                        <p className="text-xs text-slate-500">{team?.name}</p>
                                    </div>
                                    {isCurrent && (
                                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase rounded-full animate-pulse">
                                            Pick
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Available Players & Action */}
                <div className="col-span-2">
                    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-3xl p-8 mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-emerald-400 tracking-widest uppercase mb-1 flex items-center gap-2">
                                <PlayCircle size={16} /> On The Clock
                            </p>
                            <h2 className="text-4xl font-black text-white">{currentTeam?.team_name || 'Waiting...'}</h2>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 rounded-3xl p-8 border border-white/5">
                        <h3 className="text-xl font-bold mb-4">Available Players</h3>
                        <p className="text-slate-400 mb-8">Select a player to draft to your team.</p>
                        
                        <div className="space-y-3 h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                            {players.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">No players available</div>
                            ) : (
                                players.map((player) => (
                                    <div key={player.id} className="bg-white/5 rounded-xl border border-white/5 p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{player.name}</h4>
                                            <p className="text-sm text-slate-400">{player.position} &middot; {player.club_name || 'Free Agent'}</p>
                                        </div>
                                        <button
                                            disabled={!isMyTurn || isDrafting}
                                            onClick={() => handlePickPlayer(player.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all
                                                ${isMyTurn ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'}
                                            `}
                                        >
                                            <Plus size={16} /> Draft
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Clock, Trophy } from 'lucide-react';
import { leagueService } from '@/services/league';
import { createClient } from '@/lib/supabase/client';

export default function DraftPage() {
    const params = useParams();
    const router = useRouter();
    const [players, setPlayers] = useState<any[]>([]);
    const [draftState, setDraftState] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [myTeamId, setMyTeamId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // Fetch players
            const { data: playersData, error: playersError } = await supabase.from('players').select('*');
            if (playersError) {
                console.warn('Error fetching players from Supabase. Are the tables created? Error:', playersError);
            }
            setPlayers(playersData || []);

            // Initial draft state
            await fetchDraftState(user);
            setIsLoading(false);
        };
        if (params.id) {
            init();
        }
    }, [params.id]);

    const fetchDraftState = async (user: any = currentUser) => {
        try {
            const state = await leagueService.getDraftState(params.id as string);
            setDraftState(state);
            
            if (state.is_complete) {
                router.push(`/leagues/${params.id}`);
                return;
            }

            // Find current user's team id in this league to know if it's their turn
            if (user && state.draft_order) {
                const { data: teamData } = await supabase
                    .from('teams')
                    .select('id')
                    .eq('league_id', params.id)
                    .eq('user_id', user.id)
                    .single();
                if (teamData) {
                    setMyTeamId(teamData.id);
                }
            }
        } catch (err) {
            console.error("Failed to fetch draft state", err);
        }
    };

    // Polling every 3 seconds for updates
    useEffect(() => {
        const interval = setInterval(() => {
            if (params.id) fetchDraftState();
        }, 3000);
        return () => clearInterval(interval);
    }, [params.id, currentUser]);

    const handlePick = async (playerId: string) => {
        try {
            await leagueService.makeDraftPick(params.id as string, playerId);
            await fetchDraftState();
        } catch (err: any) {
            alert(err.message || "Failed to make pick");
        }
    };

    if (isLoading || !draftState) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Loading Draft...</p>
                </div>
            </div>
        );
    }

    const isMyTurn = draftState.current_turn_team_id === myTeamId;
    
    // Derived Data
    const draftedPlayerIds = new Set((draftState.picks || []).map((p: any) => p.player_id));
    const availablePlayers = players.filter(p => !draftedPlayerIds.has(p.id));
    
    const myPicks = (draftState.picks || [])
        .filter((p: any) => p.team_id === myTeamId)
        .map((p: any) => players.find(pl => pl.id === p.player_id) || { id: p.player_id, name: 'Unknown Player', position: 'UNK', club_name: 'Unknown' });

    const totalTeams = draftState.draft_order ? draftState.draft_order.length : 1;
    const currentRound = Math.floor((draftState.picks ? draftState.picks.length : 0) / Math.max(1, totalTeams)) + 1;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 pt-24 pb-20">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href={`/leagues/${params.id}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
                        <ChevronLeft size={16} /> Back to League
                    </Link>
                    <div className="flex gap-2 items-center">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Live Draft</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: My Team & Draft Status */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Status Card */}
                    <div className={`p-6 rounded-3xl border transition-colors ${isMyTurn ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/40 border-white/5'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            {isMyTurn ? (
                                <Clock className="text-emerald-400 animate-pulse" size={24} />
                            ) : (
                                <Clock className="text-slate-500" size={24} />
                            )}
                            <h2 className={`text-xl font-black ${isMyTurn ? 'text-emerald-400' : 'text-slate-300'}`}>
                                {isMyTurn ? "Your Turn!" : "Waiting for next pick..."}
                            </h2>
                        </div>
                        <p className="text-sm text-slate-400">
                            Round {currentRound}
                        </p>
                    </div>

                    {/* My Team */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col h-[600px]">
                        <div className="px-6 py-4 border-b border-white/5 bg-slate-900/60">
                            <h2 className="font-bold text-lg text-white flex items-center gap-2">
                                <Trophy className="text-amber-400" size={18} /> My Drafted Squad ({myPicks.length}/15)
                            </h2>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-2">
                            {myPicks.length === 0 ? (
                                <p className="text-center text-slate-500 text-sm mt-10">No players drafted yet.</p>
                            ) : (
                                myPicks.map((player: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-white/5 rounded-xl flex items-center justify-between border border-white/5">
                                        <div>
                                            <p className="font-bold text-white">{player.name}</p>
                                            <p className="text-xs text-slate-400">{player.club_name}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-slate-800 rounded text-xs font-bold text-slate-300">
                                            {player.position}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Player Pool */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col h-[calc(100vh-140px)]">
                        <div className="px-6 py-4 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
                            <h2 className="font-bold text-lg text-white">Available Players</h2>
                            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-white/5">
                                {availablePlayers.length} remaining
                            </span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {availablePlayers.length === 0 && (
                                <p className="text-center text-slate-500 text-sm mt-10">No players available or players failed to load.</p>
                            )}
                            {availablePlayers.map((player) => (
                                <div key={player.id} className="group p-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-between border border-white/5 transition-all">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg">{player.name}</h3>
                                        <div className="flex gap-3 text-sm text-slate-400 mt-1">
                                            <span>{player.club_name}</span>
                                            <span className="px-2 bg-slate-800 rounded text-xs font-bold text-slate-300 flex items-center">
                                                {player.position}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handlePick(player.id)}
                                        disabled={!isMyTurn}
                                        className={`px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${
                                            isMyTurn 
                                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20 hover:scale-105 active:scale-95' 
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                        }`}
                                    >
                                        {isMyTurn ? 'Draft' : 'Wait'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

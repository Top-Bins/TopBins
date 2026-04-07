"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, LogIn, ArrowRightLeft } from "lucide-react";
import { leagueService } from "@/services/league";

type Position = "GK" | "DEF" | "MID" | "FWD";

type Player = {
   id: string;
   name: string;
   club: string;
   position: Position;
   price: number;
   points: number;
   isStarter: boolean;
};

// Opponent's dummy roster
const DUMMY_ROSTER: Player[] = [
   { id: "1", name: "Alisson", club: "LIV", position: "GK", price: 5.5, points: 42, isStarter: true },
   { id: "2", name: "Saliba", club: "ARS", position: "DEF", price: 5.5, points: 38, isStarter: true },
   { id: "3", name: "Dias", club: "MCI", position: "DEF", price: 6.0, points: 35, isStarter: true },
   { id: "4", name: "Botman", club: "NEW", position: "DEF", price: 4.5, points: 28, isStarter: true },
   { id: "5", name: "Dunk", club: "BHA", position: "DEF", price: 5.0, points: 25, isStarter: true },
   { id: "6", name: "Saka", club: "ARS", position: "MID", price: 8.5, points: 48, isStarter: true },
   { id: "7", name: "De Bruyne", club: "MCI", position: "MID", price: 10.5, points: 55, isStarter: true },
   { id: "8", name: "Maddison", club: "TOT", position: "MID", price: 8.0, points: 40, isStarter: true },
   { id: "9", name: "Mbeumo", club: "BRE", position: "MID", price: 6.5, points: 34, isStarter: true },
   { id: "10", name: "Haaland", club: "MCI", position: "FWD", price: 14.0, points: 65, isStarter: true },
   { id: "11", name: "Watkins", club: "AVL", position: "FWD", price: 8.0, points: 45, isStarter: true },
   { id: "12", name: "Areola", club: "WHU", position: "GK", price: 4.0, points: 15, isStarter: false },
   { id: "13", name: "Gusto", club: "CHE", position: "DEF", price: 4.0, points: 18, isStarter: false },
   { id: "14", name: "Gordon", club: "NEW", position: "MID", price: 5.5, points: 22, isStarter: false },
   { id: "15", name: "Archer", club: "SHU", position: "FWD", price: 4.5, points: 12, isStarter: false },
];

// My dummy roster
const MY_DUMMY_ROSTER: Player[] = [
   { id: "m1", name: "Ederson", club: "MCI", position: "GK", price: 5.5, points: 40, isStarter: true },
   { id: "m2", name: "Gabriel", club: "ARS", position: "DEF", price: 5.0, points: 36, isStarter: true },
   { id: "m3", name: "Trippier", club: "NEW", position: "DEF", price: 6.5, points: 45, isStarter: true },
   { id: "m4", name: "Udogie", club: "TOT", position: "DEF", price: 4.5, points: 30, isStarter: true },
   { id: "m5", name: "Walker", club: "MCI", position: "DEF", price: 5.0, points: 28, isStarter: true },
   { id: "m6", name: "Salah", club: "LIV", position: "MID", price: 12.5, points: 60, isStarter: true },
   { id: "m7", name: "Son", club: "TOT", position: "MID", price: 9.0, points: 52, isStarter: true },
   { id: "m8", name: "Foden", club: "MCI", position: "MID", price: 7.5, points: 44, isStarter: true },
   { id: "m9", name: "Mitoma", club: "BHA", position: "MID", price: 6.5, points: 38, isStarter: true },
   { id: "m10", name: "Isak", club: "NEW", position: "FWD", price: 7.5, points: 41, isStarter: true },
   { id: "m11", name: "Alvarez", club: "MCI", position: "FWD", price: 7.0, points: 46, isStarter: true },
   { id: "m12", name: "Turner", club: "NFO", position: "GK", price: 4.0, points: 10, isStarter: false },
   { id: "m13", name: "Cash", club: "AVL", position: "DEF", price: 4.5, points: 20, isStarter: false },
   { id: "m14", name: "Diaby", club: "AVL", position: "MID", price: 6.5, points: 25, isStarter: false },
   { id: "m15", name: "Joao Pedro", club: "BHA", position: "FWD", price: 5.5, points: 18, isStarter: false },
];

export default function MemberTeamPage() {
    const params = useParams();
    const router = useRouter();
    const [memberName, setMemberName] = useState("Opponent");
    
    const [isTradeMode, setIsTradeMode] = useState(false);
    const [mySelected, setMySelected] = useState<Player[]>([]);
    const [theirSelected, setTheirSelected] = useState<Player[]>([]);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const league = await leagueService.getLeagueDetails(params.id as string);
                const member = league.members.find((m: any) => m.id === params.memberId);
                if (member) setMemberName(member.team_name);
            } catch (e) {
                console.error(e);
            }
        };
        fetchInfo();
    }, [params.id, params.memberId]);

    const handlePlayerClick = (player: Player, isMine: boolean) => {
        if (!isTradeMode) return;
        
        if (isMine) {
            if (mySelected.find(p => p.id === player.id)) {
                setMySelected(mySelected.filter(p => p.id !== player.id));
            } else {
                setMySelected([...mySelected, player]);
            }
        } else {
            if (theirSelected.find(p => p.id === player.id)) {
                setTheirSelected(theirSelected.filter(p => p.id !== player.id));
            } else {
                setTheirSelected([...theirSelected, player]);
            }
        }
    };

    const handleInstantiateTrade = () => {
       if (mySelected.length === 0 && theirSelected.length === 0) return;
       alert(`Trade Proposed!\nYou receive: ${theirSelected.map(p => p.name).join(", ")}\nYou send: ${mySelected.map(p => p.name).join(", ")}`);
       setMySelected([]);
       setTheirSelected([]);
       setIsTradeMode(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 pt-24 border-t">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                        <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-[1400px] px-6 py-8 w-full">
                <button 
                    onClick={() => router.push(`/leagues/${params.id}`)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft size={16} /> Back to League
                </button>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-white/10 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white mb-2">{memberName}'s Roster</h1>
                        <p className="text-slate-400 flex items-center gap-2 text-sm">You are viewing another manager's team.</p>
                    </div>
                    <button 
                        onClick={() => {
                            setIsTradeMode(!isTradeMode);
                            setMySelected([]);
                            setTheirSelected([]);
                        }}
                        className={`flex items-center gap-2 px-6 py-3 font-bold rounded-2xl transition hover:scale-105 ${isTradeMode ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'}`}
                    >
                        <ArrowRightLeft size={18} />
                        {isTradeMode ? 'Cancel Trade' : 'Propose Trade'}
                    </button>
                </div>

                {/* Trade Interaction Area */}
                {isTradeMode && (
                    <div className="mb-12 bg-slate-900/60 border border-emerald-500/30 rounded-3xl p-6 lg:p-8 backdrop-blur-md shadow-2xl shadow-emerald-900/10 mb-8 animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ArrowRightLeft className="text-emerald-400"/> Trade Proposal</h2>
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-8">
                            <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5">
                                <h3 className="text-amber-400 font-bold mb-4 uppercase tracking-widest text-sm flex justify-between items-center">
                                    Players You Send
                                    <span className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-xs">{mySelected.length}</span>
                                </h3>
                                <div className="space-y-3 min-h-[60px]">
                                    {mySelected.length === 0 && <p className="text-slate-500 text-sm italic">Select players from your pitch below.</p>}
                                    {mySelected.map(p => (
                                        <div key={p.id} className="flex justify-between items-center bg-slate-900 px-4 py-3 rounded-xl border border-white/5">
                                            <span className="font-bold text-white">{p.name} <span className="text-xs text-slate-400 font-normal ml-2">{p.position}</span></span>
                                            <button onClick={() => handlePlayerClick(p, true)} className="text-rose-400 text-sm hover:underline">Remove</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5">
                                <h3 className="text-emerald-400 font-bold mb-4 uppercase tracking-widest text-sm flex justify-between items-center">
                                    Players You Receive 
                                    <span className="bg-emerald-500/20 px-2 py-1 rounded text-xs">{theirSelected.length}</span>
                                </h3>
                                <div className="space-y-3 min-h-[60px]">
                                    {theirSelected.length === 0 && <p className="text-slate-500 text-sm italic">Select players from {memberName}'s pitch below.</p>}
                                    {theirSelected.map(p => (
                                        <div key={p.id} className="flex justify-between items-center bg-slate-900 px-4 py-3 rounded-xl border border-white/5">
                                            <span className="font-bold text-white">{p.name} <span className="text-xs text-slate-400 font-normal ml-2">{p.position}</span></span>
                                            <button onClick={() => handlePlayerClick(p, false)} className="text-rose-400 text-sm hover:underline">Remove</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center border-t border-white/5 pt-6">
                            <button
                                onClick={handleInstantiateTrade}
                                disabled={mySelected.length === 0 && theirSelected.length === 0}
                                className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black px-12 py-4 rounded-xl shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:grayscale transition-all disabled:cursor-not-allowed hover:scale-105"
                            >
                                Instantiate Trade
                            </button>
                        </div>
                    </div>
                )}

                {/* Pitches Container */}
                <div className={isTradeMode ? "grid lg:grid-cols-2 gap-12" : ""}>
                    {/* My Roster Layout (Only in Trade Mode) */}
                    {isTradeMode && (
                        <div className="animate-in fade-in slide-in-from-left-4">
                            <h2 className="text-2xl font-bold text-white mb-6">Your Team</h2>
                            <PitchLayout 
                                roster={MY_DUMMY_ROSTER} 
                                isTradeMode={isTradeMode} 
                                selected={mySelected}
                                onPlayerClick={(p) => handlePlayerClick(p, true)}
                            />
                        </div>
                    )}

                    {/* Opponent's Roster Layout */}
                    <div className={isTradeMode ? "animate-in fade-in slide-in-from-right-4" : ""}>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {isTradeMode ? "Their Team" : "Roster Viewer"}
                        </h2>
                        <PitchLayout 
                            roster={DUMMY_ROSTER} 
                            isTradeMode={isTradeMode} 
                            selected={theirSelected}
                            onPlayerClick={(p) => handlePlayerClick(p, false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Pitch Sub-component
function PitchLayout({ roster, isTradeMode, selected, onPlayerClick }: { roster: Player[], isTradeMode: boolean, selected?: Player[], onPlayerClick?: (p: Player) => void }) {
    const starters = roster.filter(p => p.isStarter);
    const bench = roster.filter(p => !p.isStarter);

    const startersByPos = {
        GK: starters.filter(p => p.position === "GK"),
        DEF: starters.filter(p => p.position === "DEF"),
        MID: starters.filter(p => p.position === "MID"),
        FWD: starters.filter(p => p.position === "FWD"),
    };

    return (
        <div>
            {/* Main Pitch Area */}
            <div className="relative bg-[#0a2315] rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-emerald-900/10 mb-8 py-8 lg:py-10">
                {/* Field markings */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-6 top-6 bottom-6 border border-white/10 rounded" />
                    <div className="absolute inset-x-6 top-1/2 h-0.5 bg-white/10" />
                    <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                </div>

                <div className="relative z-10 w-full h-full flex flex-col justify-between gap-10 lg:gap-16">
                    <div className="flex justify-center">
                        {startersByPos.GK.map(p => <PlayerNode key={p.id} player={p} isSelectable={isTradeMode} isSelected={selected?.some(s => s.id === p.id)} onClick={() => onPlayerClick?.(p)} />)}
                    </div>
                    <div className="flex justify-evenly px-2 lg:px-12">
                        {startersByPos.DEF.map(p => <PlayerNode key={p.id} player={p} isSelectable={isTradeMode} isSelected={selected?.some(s => s.id === p.id)} onClick={() => onPlayerClick?.(p)} />)}
                    </div>
                    <div className="flex justify-evenly px-2 lg:px-16">
                        {startersByPos.MID.map(p => <PlayerNode key={p.id} player={p} isSelectable={isTradeMode} isSelected={selected?.some(s => s.id === p.id)} onClick={() => onPlayerClick?.(p)} />)}
                    </div>
                    <div className="flex justify-evenly px-2 lg:px-24">
                        {startersByPos.FWD.map(p => <PlayerNode key={p.id} player={p} isSelectable={isTradeMode} isSelected={selected?.some(s => s.id === p.id)} onClick={() => onPlayerClick?.(p)} />)}
                    </div>
                </div>
            </div>

            {/* Bench Area */}
            <div className="bg-slate-900/60 rounded-3xl border border-white/5 p-6 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-4">Bench</h3>
                <div className="flex justify-between sm:justify-center sm:gap-12 lg:gap-8 px-2 flex-wrap">
                    {bench.map(p => <PlayerNode key={p.id} player={p} isSelectable={isTradeMode} isSelected={selected?.some(s => s.id === p.id)} onClick={() => onPlayerClick?.(p)} />)}
                </div>
            </div>
        </div>
    );
}

// Sub-component for individual players
function PlayerNode({ player, isSelectable, isSelected, onClick }: { player: Player, isSelectable?: boolean, isSelected?: boolean, onClick?: () => void }) {
    return (
        <div 
            onClick={onClick}
            className={`relative flex flex-col items-center gap-1 group transition-all duration-200 z-10 hover:z-20 ${isSelectable ? 'cursor-pointer hover:-translate-y-1' : ''}`}
        >
            <div className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors ${isSelected ? 'bg-amber-500 border-amber-300 shadow-amber-500/50 ring-4 ring-amber-500/30' : 'bg-emerald-950 border-emerald-500 shadow-black/40'}`}>
                <span className="z-10 text-[10px] sm:text-xs font-bold text-white tracking-widest">{player.position}</span>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${isSelected ? 'from-amber-400/20' : 'from-emerald-500/20'} to-transparent pointer-events-none`} />
            </div>
            <div className="flex flex-col items-center select-none">
                <div className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold border transition-colors truncate max-w-[70px] sm:max-w-[85px] backdrop-blur-sm ${isSelected ? 'bg-amber-500/90 border-amber-300 text-slate-950' : 'bg-slate-900/90 border-white/10 text-white'}`}>
                    {player.name}
                </div>
                <div className="mt-0.5 flex gap-1 items-center bg-slate-950/80 px-1 rounded">
                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">{player.club}</span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-emerald-400">{player.points}pts</span>
                </div>
            </div>
            
            {/* Selection indicator overlay icon */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-lg border border-white">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </div>
    );
}

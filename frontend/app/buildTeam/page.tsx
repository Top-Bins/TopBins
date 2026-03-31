"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; 

// --- Mock Data ---
type Player = {
    id: string;
    name: string;
    position: "GK" | "DEF" | "MID" | "FWD";
    club: string;
};

const MOCK_PLAYERS: Player[] = [
    { id: "1", name: "Alisson", position: "GK", club: "Liverpool" },
    { id: "2", name: "Ederson", position: "GK", club: "Man City" },
    { id: "3", name: "Raya", position: "GK", club: "Arsenal" },
    { id: "4", name: "Pickford", position: "GK", club: "Everton" },
    { id: "5", name: "Van Dijk", position: "DEF", club: "Liverpool" },
    { id: "6", name: "Saliba", position: "DEF", club: "Arsenal" },
    { id: "7", name: "Dias", position: "DEF", club: "Man City" },
    { id: "8", name: "Walker", position: "DEF", club: "Man City" },
    { id: "9", name: "Trippier", position: "DEF", club: "Newcastle" },
    { id: "10", name: "Dunk", position: "DEF", club: "Brighton" },
    { id: "11", name: "De Bruyne", position: "MID", club: "Man City" },
    { id: "12", name: "Odegaard", position: "MID", club: "Arsenal" },
    { id: "13", name: "Rice", position: "MID", club: "Arsenal" },
    { id: "14", name: "Fernandes", position: "MID", club: "Man Utd" },
    { id: "15", name: "Maddison", position: "MID", club: "Spurs" },
    { id: "16", name: "Paqueta", position: "MID", club: "West Ham" },
    { id: "17", name: "Haaland", position: "FWD", club: "Man City" },
    { id: "18", name: "Salah", position: "FWD", club: "Liverpool" },
    { id: "19", name: "Saka", position: "FWD", club: "Arsenal" },
    { id: "20", name: "Son", position: "FWD", club: "Spurs" },
    { id: "21", name: "Watkins", position: "FWD", club: "Aston Villa" },
    { id: "22", name: "Isak", position: "FWD", club: "Newcastle" },
];

// --- Types for Squad State ---
type Squad = {
    GK: Player | null;
    DEF1: Player | null;
    DEF2: Player | null;
    DEF3: Player | null;
    DEF4: Player | null;
    MID1: Player | null;
    MID2: Player | null;
    MID3: Player | null;
    FWD1: Player | null;
    FWD2: Player | null;
    FWD3: Player | null;
};

const INITIAL_SQUAD: Squad = {
    GK: null,
    DEF1: null, DEF2: null, DEF3: null, DEF4: null,
    MID1: null, MID2: null, MID3: null,
    FWD1: null, FWD2: null, FWD3: null,
};

const DRAFT_ORDER = ["You", "Pep AI", "Klopp AI", "Arteta AI"];

export default function BuildTeamPage() {
    const [squad, setSquad] = useState<Squad>(INITIAL_SQUAD);
    const [filterPos, setFilterPos] = useState<"ALL" | "GK" | "DEF" | "MID" | "FWD">("ALL");

    const [currentTurnIndex, setCurrentTurnIndex] = useState(0); // 0 corresponds to "You"
    const [globalDrafted, setGlobalDrafted] = useState<Record<string, string>>({}); 
    const [draftLogs, setDraftLogs] = useState<{msg: string; id: number}[]>([]);

    const addLog = (msg: string) => {
        setDraftLogs(prev => [{msg, id: Date.now()}, ...prev].slice(0, 5));
    };

    // Auto-advance AI turns
    useEffect(() => {
        if (currentTurnIndex === 0) return; // Your turn, wait for user action

        // Check if draft is essentially over (11 picks for you)
        const yourPicks = Object.values(globalDrafted).filter(v => v === "You").length;
        if (yourPicks >= 11) return;

        const timer = setTimeout(() => {
            const currentManager = DRAFT_ORDER[currentTurnIndex];
            
            // AI logic: pick a random available player
            const availablePlayers = MOCK_PLAYERS.filter(p => !globalDrafted[p.id]);
            if (availablePlayers.length > 0) {
                // simple random selection
                const pick = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
                setGlobalDrafted(prev => ({ ...prev, [pick.id]: currentManager }));
                addLog(`${currentManager} drafted ${pick.name} (${pick.position})`);
            }

            // Move to next turn
            setCurrentTurnIndex(prev => (prev + 1) % DRAFT_ORDER.length);
        }, 1500); // 1.5 seconds per AI pick

        return () => clearTimeout(timer);
    }, [currentTurnIndex, globalDrafted]);


    const handleAddPlayer = (player: Player) => {
        if (currentTurnIndex !== 0) {
            alert("Please wait for your turn!");
            return;
        }

        if (globalDrafted[player.id]) {
            alert("This player has already been drafted!");
            return;
        }

        let slotKey: keyof Squad | null = null;
        if (player.position === "GK" && !squad.GK) slotKey = "GK";
        else if (player.position === "DEF") {
            if (!squad.DEF1) slotKey = "DEF1";
            else if (!squad.DEF2) slotKey = "DEF2";
            else if (!squad.DEF3) slotKey = "DEF3";
            else if (!squad.DEF4) slotKey = "DEF4";
        } else if (player.position === "MID") {
            if (!squad.MID1) slotKey = "MID1";
            else if (!squad.MID2) slotKey = "MID2";
            else if (!squad.MID3) slotKey = "MID3";
        } else if (player.position === "FWD") {
            if (!squad.FWD1) slotKey = "FWD1";
            else if (!squad.FWD2) slotKey = "FWD2";
            else if (!squad.FWD3) slotKey = "FWD3";
        }

        if (slotKey) {
            setSquad((prev) => ({ ...prev, [slotKey!]: player }));
            setGlobalDrafted((prev) => ({ ...prev, [player.id]: "You" }));
            addLog(`You drafted ${player.name} (${player.position})`);
            
            // Advance turn to next player
            setCurrentTurnIndex(1);
        } else {
            alert(`No empty slots in your formation for ${player.position}!`);
        }
    };

    const filteredPlayers = MOCK_PLAYERS.filter(
        (p) => (filterPos === "ALL" || p.position === filterPos)
    );

    const picksMade = Object.values(globalDrafted).filter(v => v === "You").length;
    const picksRemaining = 11 - picksMade;

    return (
        <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-100 font-sans lg:flex-row">

            {/* Sidebar: Player Selection */}
            <div className="flex w-full flex-col border-r border-white/5 bg-slate-900 lg:w-96 shadow-2xl z-20">
                <div className="p-6 border-b border-white/5 bg-slate-900">
                    <Link href="/" className="mb-6 flex items-center gap-2 hover:opacity-80 transition">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20" />
                        <span className="text-xl font-bold tracking-tight text-white">TopBins Draft</span>
                    </Link>

                    <div className="mb-4 flex flex-col gap-2">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                           Draft Pool
                        </h2>
                    </div>

                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                        {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos) => (
                            <button
                                key={pos}
                                onClick={() => setFilterPos(pos)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filterPos === pos
                                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                                    }`}
                            >
                                {pos}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-slate-950/30">
                    {filteredPlayers.map((player) => {
                        const draftedBy = globalDrafted[player.id];
                        const isSelected = !!draftedBy;
                        const isYours = draftedBy === "You";
                        
                        // We dim the card if it's already selected
                        return (
                            <div
                                key={player.id}
                                className={`flex items-center justify-between rounded-xl border p-3 transition ${isSelected
                                    ? (isYours ? "bg-indigo-900/40 border-indigo-500/30 opacity-70 cursor-default" : "bg-white/5 border-white/5 opacity-40 cursor-not-allowed")
                                    : "bg-slate-800/80 border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/50 cursor-pointer shadow-sm hover:shadow-indigo-500/10"
                                    }`}
                                onClick={() => !isSelected && handleAddPlayer(player)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isSelected ? "bg-slate-800 text-slate-500" : "bg-indigo-950 text-indigo-400 border border-indigo-500/30"}`}>
                                        {player.position}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-semibold ${isSelected && !isYours ? "text-slate-500 line-through" : "text-white"}`}>{player.name}</div>
                                        <div className="text-xs text-slate-400">{player.club}</div>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold ${isYours ? "text-indigo-400" : isSelected ? "text-slate-500" : "text-emerald-400"}`}>
                                   {isSelected ? draftedBy : currentTurnIndex === 0 ? "DRAFT" : "AVAILABLE"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content: Pitch & Stats */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
                {/* Top Bar */}
                <div className="z-10 flex items-center justify-between bg-slate-900/60 p-6 backdrop-blur-xl border-b border-white/5 relative shadow-xl focus-within:ring-0">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3 text-white">
                           Your Draft Board
                        </h1>
                        <p className="text-sm mt-1 h-6 transition-all duration-300">
                             {picksRemaining === 0 ? (
                                <span className="text-slate-400">Draft Complete</span>
                             ) : currentTurnIndex === 0 ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-2">
                                     <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                     Your Turn to Pick!
                                </span>
                             ) : (
                                <span className="text-indigo-400 font-medium animate-pulse">
                                     Waiting for {DRAFT_ORDER[currentTurnIndex]}...
                                </span>
                             )}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Status / Log box */}
                        <div className="hidden xl:flex flex-col text-right mr-4 max-w-xs">
                           <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Draft Activity</div>
                           <div className="text-sm font-medium text-white truncate h-5">
                               {draftLogs[0] ? draftLogs[0].msg : "Waiting for first pick..."}
                           </div>
                        </div>

                        <div className="text-right flex items-center gap-4 bg-slate-950 border border-white/10 px-4 py-2 rounded-2xl shadow-inner">
                            <div className="text-sm text-slate-400 font-medium">Picks Remaining</div>
                            <div className={`text-2xl font-mono font-black ${picksRemaining === 0 ? "text-indigo-400" : "text-white"}`}>
                                {picksRemaining}
                            </div>
                        </div>
                        <button
                            className={`rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition ${picksRemaining === 0 ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-110 hover:scale-105" : "bg-slate-800 text-slate-400 cursor-not-allowed"}`}
                            onClick={() => picksRemaining === 0 && alert("Draft submitted successfully! Navigating to dashboard...")}
                        >
                            Complete
                        </button>
                    </div>
                </div>

                {/* Pitch Area */}
                <div className="flex-1 relative flex items-center justify-center bg-[#0d1424] p-6 overflow-hidden">
                    {/* Abstract Pitch markings for a drafting theme */}
                    <div className="absolute inset-0 border-x border-white/5 mx-6" /> 
                    <div className="absolute inset-x-6 top-6 bottom-6 border-y border-white/5" /> 
                    <div className="absolute inset-x-6 top-1/2 h-px bg-white/5" /> 
                    <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" /> 
                    
                    {/* Subtle Glows */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

                    {/* Formation Layout (4-3-3 simplified) */}
                    <div className="relative z-10 w-full max-w-3xl h-full flex flex-col justify-between py-10">
                        {/* GK */}
                        <div className="flex justify-center transition-all duration-300">
                            <PlayerNode slotKey="GK" player={squad.GK} />
                        </div>

                        {/* DEF */}
                        <div className="flex justify-around px-10 transition-all duration-300">
                            <PlayerNode slotKey="DEF" player={squad.DEF1} />
                            <PlayerNode slotKey="DEF" player={squad.DEF2} />
                            <PlayerNode slotKey="DEF" player={squad.DEF3} />
                            <PlayerNode slotKey="DEF" player={squad.DEF4} />
                        </div>

                        {/* MID */}
                        <div className="flex justify-around px-20 transition-all duration-300">
                            <PlayerNode slotKey="MID" player={squad.MID1} />
                            <PlayerNode slotKey="MID" player={squad.MID2} />
                            <PlayerNode slotKey="MID" player={squad.MID3} />
                        </div>

                        {/* FWD */}
                        <div className="flex justify-around px-20 transition-all duration-300">
                            <PlayerNode slotKey="FWD" player={squad.FWD1} />
                            <PlayerNode slotKey="FWD" player={squad.FWD2} />
                            <PlayerNode slotKey="FWD" player={squad.FWD3} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayerNode({ slotKey, player }: { slotKey: string; player: Player | null }) {
    if (!player) {
        return (
            <div className="flex flex-col items-center gap-2 group">
                <div className="h-14 w-14 rounded-full border-2 border-dashed border-white/20 bg-slate-900/50 flex items-center justify-center text-xs font-bold text-white/30 backdrop-blur-sm shadow-inner transition group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                    {slotKey}
                </div>
            </div>
        );
    }

    // In a live draft, removing players is not allowed so the node doesn't need onClick
    return (
        <div className="flex flex-col items-center gap-1 relative group" title="Drafted Player">
            <div className="relative h-14 w-14 rounded-full border-[3px] border-emerald-400 bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] transition transform hover:scale-105">
                <span className="z-10">{player.position}</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/30 to-transparent" />
            </div>
            <div className="flex flex-col items-center mt-1">
                <div className="bg-slate-900/95 px-2.5 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 backdrop-blur-md truncate max-w-[85px] shadow-lg">
                    {player.name}
                </div>
            </div>
        </div>
    );
}

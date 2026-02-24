"use client";

import React, { useState } from "react";
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

export default function BuildTeamPage() {
    const [squad, setSquad] = useState<Squad>(INITIAL_SQUAD);
    const [filterPos, setFilterPos] = useState<"ALL" | "GK" | "DEF" | "MID" | "FWD">("ALL");
    const [draftLog, setDraftLog] = useState<Player[]>([]);

    const usedPlayerIds = Object.values(squad)
        .filter((p): p is Player => p !== null)
        .map((p) => p.id);

    const handleAddPlayer = (player: Player) => {
        // Simple auto-fill logic: find first empty slot matching position
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
            setDraftLog((prev) => [...prev, player]);
        } else {
            alert(`No empty slots for ${player.position}!`);
        }
    };

    const handleRemovePlayer = (key: keyof Squad) => {
        const player = squad[key];
        if (player) {
            setSquad((prev) => ({ ...prev, [key]: null }));
            setDraftLog((prev) => prev.filter(p => p.id !== player.id));
        }
    };

    const handleAutoPick = () => {
        let currentSquad = { ...INITIAL_SQUAD };
        let currentLog: Player[] = [];

        const fillSlots = (pos: "GK" | "DEF" | "MID" | "FWD", slots: (keyof Squad)[]) => {
            const available = MOCK_PLAYERS.filter(p => p.position === pos && !currentLog.find(cp => cp.id === p.id)).sort(() => 0.5 - Math.random());
            let pIdx = 0;
            for (const slot of slots) {
                if (pIdx < available.length) {
                    const p = available[pIdx];
                    currentSquad[slot] = p;
                    currentLog.push(p);
                    pIdx++;
                }
            }
        };

        fillSlots("GK", ["GK"]);
        fillSlots("DEF", ["DEF1", "DEF2", "DEF3", "DEF4"]);
        fillSlots("MID", ["MID1", "MID2", "MID3"]);
        fillSlots("FWD", ["FWD1", "FWD2", "FWD3"]);

        setSquad(currentSquad);
        setDraftLog(currentLog);
    };

    const filteredPlayers = MOCK_PLAYERS.filter(
        (p) => (filterPos === "ALL" || p.position === filterPos)
    );

    const playersPickedCount = usedPlayerIds.length;

    return (
        <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-100 font-sans lg:flex-row">

            {/* Sidebar: Player Selection & Draft Log */}
            <div className="flex w-full flex-col border-r border-white/5 bg-slate-900 lg:w-96">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="mb-6 flex items-center gap-2 hover:opacity-80 transition">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-md shadow-emerald-500/10" />
                        <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                    </Link>

                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Player Pool</h2>
                        <button
                            onClick={handleAutoPick}
                            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                            Auto Pick
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos) => (
                            <button
                                key={pos}
                                onClick={() => setFilterPos(pos)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0 ${filterPos === pos
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                                    }`}
                            >
                                {pos}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {filteredPlayers.map((player) => {
                        const isSelected = usedPlayerIds.includes(player.id);
                        return (
                            <div
                                key={player.id}
                                className={`flex items-center justify-between rounded-xl border border-white/5 p-3 transition ${isSelected
                                    ? "bg-emerald-500/5 border-emerald-500/20 opacity-50 cursor-default"
                                    : "bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 cursor-pointer"
                                    }`}
                                onClick={() => !isSelected && handleAddPlayer(player)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-slate-500">
                                        {player.position}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{player.name}</div>
                                        <div className="text-xs text-slate-400">{player.club}</div>
                                    </div>
                                </div>
                                {!isSelected && (
                                    <div className="text-xs font-bold text-emerald-400 hover:opacity-100 transition">
                                        SELECT
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Draft History Section */}
                {draftLog.length > 0 && (
                    <div className="h-48 border-t border-white/5 p-4 bg-slate-950/50">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Draft History</h3>
                        <div className="space-y-2 overflow-y-auto max-h-32 custom-scrollbar">
                            {draftLog.slice().reverse().map((pick, idx) => (
                                <div key={pick.id} className="flex items-center gap-2 text-xs">
                                    <span className="text-slate-600 font-mono w-4">{draftLog.length - idx}.</span>
                                    <span className="text-emerald-400 font-bold">{pick.position}</span>
                                    <span className="text-white">{pick.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content: Pitch & Stats */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Top Bar */}
                <div className="z-10 flex items-center justify-between bg-slate-950/80 p-6 backdrop-blur-md border-b border-white/5">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Your Squad</h1>
                        <p className="text-sm text-slate-400">Draft your dream 11.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-xs text-slate-400">Draft Progress</div>
                            <div className={`text-2xl font-mono font-bold ${playersPickedCount === 11 ? "text-emerald-400" : "text-white"}`}>
                                {playersPickedCount} <span className="text-slate-500 text-lg">/ 11</span>
                            </div>
                        </div>
                        <button
                            className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg hover:bg-slate-200 transition"
                            onClick={() => alert("Draft complete!")}
                        >
                            Complete Draft
                        </button>
                    </div>
                </div>

                {/* Pitch Area */}
                <div className="flex-1 relative flex items-center justify-center bg-[#0a2315] p-6 overflow-hidden">
                    {/* Pitch markings */}
                    <div className="absolute inset-0 border-x-4 border-white/10 mx-6 opacity-30" />
                    <div className="absolute inset-x-6 top-6 bottom-6 border-y-4 border-white/10 opacity-30" />
                    <div className="absolute inset-x-6 top-1/2 h-0.5 bg-white/10 opacity-30" />
                    <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/10 opacity-30" />
                    <div className="absolute top-6 left-1/2 h-16 w-32 -translate-x-1/2 border-2 border-t-0 border-white/10 opacity-30" />
                    <div className="absolute bottom-6 left-1/2 h-16 w-32 -translate-x-1/2 border-2 border-b-0 border-white/10 opacity-30" />

                    {/* Formation Layout */}
                    <div className="relative z-10 w-full max-w-2xl h-full flex flex-col justify-between py-10">
                        {/* GK */}
                        <div className="flex justify-center">
                            <PlayerNode slotKey="GK" player={squad.GK} onRemove={() => handleRemovePlayer("GK")} />
                        </div>

                        {/* DEF */}
                        <div className="flex justify-around px-4">
                            <PlayerNode slotKey="DEF" player={squad.DEF1} onRemove={() => handleRemovePlayer("DEF1")} />
                            <PlayerNode slotKey="DEF" player={squad.DEF2} onRemove={() => handleRemovePlayer("DEF2")} />
                            <PlayerNode slotKey="DEF" player={squad.DEF3} onRemove={() => handleRemovePlayer("DEF3")} />
                            <PlayerNode slotKey="DEF" player={squad.DEF4} onRemove={() => handleRemovePlayer("DEF4")} />
                        </div>

                        {/* MID */}
                        <div className="flex justify-around px-12">
                            <PlayerNode slotKey="MID" player={squad.MID1} onRemove={() => handleRemovePlayer("MID1")} />
                            <PlayerNode slotKey="MID" player={squad.MID2} onRemove={() => handleRemovePlayer("MID2")} />
                            <PlayerNode slotKey="MID" player={squad.MID3} onRemove={() => handleRemovePlayer("MID3")} />
                        </div>

                        {/* FWD */}
                        <div className="flex justify-around px-12">
                            <PlayerNode slotKey="FWD" player={squad.FWD1} onRemove={() => handleRemovePlayer("FWD1")} />
                            <PlayerNode slotKey="FWD" player={squad.FWD2} onRemove={() => handleRemovePlayer("FWD2")} />
                            <PlayerNode slotKey="FWD" player={squad.FWD3} onRemove={() => handleRemovePlayer("FWD3")} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayerNode({ slotKey, player, onRemove }: { slotKey: string; player: Player | null; onRemove: () => void }) {
    if (!player) {
        return (
            <div className="flex flex-col items-center gap-1 group">
                <div className="h-14 w-14 rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center text-xs font-bold text-white/30 backdrop-blur-sm transition group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 group-hover:text-emerald-500">
                    {slotKey}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={onRemove} title="Remove player">
            <div className="relative h-14 w-14 rounded-full border-2 border-emerald-500 bg-emerald-950 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-emerald-900/50 transition transform group-hover:scale-110">
                <span className="z-10">{player.position}</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 to-transparent" />
            </div>
            <div className="flex flex-col items-center">
                <div className="bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10 backdrop-blur-sm truncate max-w-[80px]">
                    {player.name}
                </div>
            </div>
        </div>
    );
}

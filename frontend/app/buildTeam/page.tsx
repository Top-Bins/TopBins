"use client";

import React, { useState } from "react";
import Link from "next/link"; // For the logo home link

// --- Mock Data ---
type Player = {
    id: string;
    name: string;
    position: "GK" | "DEF" | "MID" | "FWD";
    price: number;
    club: string;
};

const MOCK_PLAYERS: Player[] = [
    { id: "1", name: "Alisson", position: "GK", price: 12, club: "Liverpool" },
    { id: "2", name: "Ederson", position: "GK", price: 11, club: "Man City" },
    { id: "3", name: "Raya", position: "GK", price: 8, club: "Arsenal" },
    { id: "4", name: "Pickford", position: "GK", price: 5, club: "Everton" },
    { id: "5", name: "Van Dijk", position: "DEF", price: 14, club: "Liverpool" },
    { id: "6", name: "Saliba", position: "DEF", price: 13, club: "Arsenal" },
    { id: "7", name: "Dias", position: "DEF", price: 12, club: "Man City" },
    { id: "8", name: "Walker", position: "DEF", price: 10, club: "Man City" },
    { id: "9", name: "Trippier", position: "DEF", price: 7, club: "Newcastle" },
    { id: "10", name: "Dunk", position: "DEF", price: 5, club: "Brighton" },
    { id: "11", name: "De Bruyne", position: "MID", price: 15, club: "Man City" },
    { id: "12", name: "Odegaard", position: "MID", price: 14, club: "Arsenal" },
    { id: "13", name: "Rice", position: "MID", price: 13, club: "Arsenal" },
    { id: "14", name: "Fernandes", position: "MID", price: 12, club: "Man Utd" },
    { id: "15", name: "Maddison", position: "MID", price: 9, club: "Spurs" },
    { id: "16", name: "Paqueta", position: "MID", price: 8, club: "West Ham" },
    { id: "17", name: "Haaland", position: "FWD", price: 16, club: "Man City" },
    { id: "18", name: "Salah", position: "FWD", price: 15, club: "Liverpool" },
    { id: "19", name: "Saka", position: "FWD", price: 14, club: "Arsenal" },
    { id: "20", name: "Son", position: "FWD", price: 12, club: "Spurs" },
    { id: "21", name: "Watkins", position: "FWD", price: 10, club: "Aston Villa" },
    { id: "22", name: "Isak", position: "FWD", price: 9, club: "Newcastle" },
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

const INITIAL_BUDGET = 100;

export default function BuildTeamPage() {
    const [squad, setSquad] = useState<Squad>(INITIAL_SQUAD);
    const [budget, setBudget] = useState(INITIAL_BUDGET);
    const [filterPos, setFilterPos] = useState<"ALL" | "GK" | "DEF" | "MID" | "FWD">("ALL");

    // Memoize usage of players to disable them in list if already picked
    const usedPlayerIds = Object.values(squad)
        .filter((p): p is Player => p !== null)
        .map((p) => p.id);

    const handleAddPlayer = (player: Player) => {
        if (budget < player.price) {
            alert("Not enough budget!");
            return;
        }

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
            setBudget((prev) => prev - player.price);
        } else {
            alert(`No empty slots for ${player.position}! Remove a player first.`);
        }
    };

    const handleRemovePlayer = (key: keyof Squad) => {
        const player = squad[key];
        if (player) {
            setSquad((prev) => ({ ...prev, [key]: null }));
            setBudget((prev) => prev + player.price);
        }
    };

    const handleAutoPick = () => {
        // Reset first
        let currentBudget = INITIAL_BUDGET;
        let currentSquad = { ...INITIAL_SQUAD };

        // Helper to fill slots
        const fillSlots = (pos: "GK" | "DEF" | "MID" | "FWD", slots: (keyof Squad)[]) => {
            const available = MOCK_PLAYERS.filter(p => p.position === pos).sort(() => 0.5 - Math.random());
            let pIdx = 0;
            for (const slot of slots) {
                // Try to find a player that fits budget (simple heuristic)
                while (pIdx < available.length) {
                    const p = available[pIdx];
                    // Reserve some budget for remaining slots (very rough est: 5M per remaining)
                    // This is basic; a real algo would be more complex
                    if (currentBudget - p.price >= 0) {
                        currentSquad[slot] = p;
                        currentBudget -= p.price;
                        pIdx++;
                        break;
                    }
                    pIdx++;
                }
            }
        };

        fillSlots("GK", ["GK"]);
        fillSlots("DEF", ["DEF1", "DEF2", "DEF3", "DEF4"]);
        fillSlots("MID", ["MID1", "MID2", "MID3"]);
        fillSlots("FWD", ["FWD1", "FWD2", "FWD3"]);

        setSquad(currentSquad);
        setBudget(currentBudget);
    };

    const filteredPlayers = MOCK_PLAYERS.filter(
        (p) => (filterPos === "ALL" || p.position === filterPos)
    );

    return (
        <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-100 font-sans lg:flex-row">

            {/* Sidebar: Player Selection */}
            <div className="flex w-full flex-col border-r border-white/5 bg-slate-900 lg:w-96">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="mb-6 flex items-center gap-2 hover:opacity-80 transition">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-md shadow-emerald-500/10" />
                        <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                    </Link>

                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Market</h2>
                        <button
                            onClick={handleAutoPick}
                            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                            Auto Pick
                        </button>
                    </div>

                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                        {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos) => (
                            <button
                                key={pos}
                                onClick={() => setFilterPos(pos)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filterPos === pos
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
                        const canAfford = budget >= player.price;
                        return (
                            <div
                                key={player.id}
                                className={`flex items-center justify-between rounded-xl border border-white/5 p-3 transition ${isSelected
                                    ? "bg-emerald-500/5 border-emerald-500/20 opacity-50 cursor-default"
                                    : canAfford
                                        ? "bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 cursor-pointer"
                                        : "bg-rose-500/5 border-rose-500/10 opacity-70 cursor-not-allowed"
                                    }`}
                                onClick={() => !isSelected && canAfford && handleAddPlayer(player)}
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
                                <div className="text-sm font-bold text-emerald-400">£{player.price}M</div>
                            </div>
                        );
                    })}
                </div>
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
                            <div className="text-xs text-slate-400">Remaining Budget</div>
                            <div className={`text-2xl font-mono font-bold ${budget < 10 ? "text-rose-400" : "text-emerald-400"}`}>
                                £{budget}M
                            </div>
                        </div>
                        <button
                            className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg hover:bg-slate-200 transition"
                            onClick={() => alert("Team saved!")}
                        >
                            Save Team
                        </button>
                    </div>
                </div>

                {/* Pitch Area */}
                <div className="flex-1 relative flex items-center justify-center bg-[#0a2315] p-6 overflow-hidden">
                    {/* Pitch markings */}
                    <div className="absolute inset-0 border-x-4 border-white/10 mx-6" /> {/* Touchlines */}
                    <div className="absolute inset-x-6 top-6 bottom-6 border-y-4 border-white/10" /> {/* Goal lines */}
                    <div className="absolute inset-x-6 top-1/2 h-0.5 bg-white/10" /> {/* Halfway line */}
                    <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/10" /> {/* Center circle */}
                    <div className="absolute top-6 left-1/2 h-16 w-32 -translate-x-1/2 border-2 border-t-0 border-white/10" /> {/* Top Goal box */}
                    <div className="absolute bottom-6 left-1/2 h-16 w-32 -translate-x-1/2 border-2 border-b-0 border-white/10" /> {/* Bottom Goal box */}


                    {/* Formation Layout (4-3-3 simplified) */}
                    <div className="relative z-10 w-full max-w-2xl h-full flex flex-col justify-between py-10">
                        {/* GK */}
                        <div className="flex justify-center">
                            <PlayerNode slotKey="GK" player={squad.GK} onRemove={() => handleRemovePlayer("GK")} />
                        </div>

                        {/* DEF */}
                        <div className="flex justify-around px-10">
                            <PlayerNode slotKey="DEF" player={squad.DEF1} onRemove={() => handleRemovePlayer("DEF1")} />
                            <PlayerNode slotKey="DEF" player={squad.DEF2} onRemove={() => handleRemovePlayer("DEF2")} />
                            <PlayerNode slotKey="DEF" player={squad.DEF3} onRemove={() => handleRemovePlayer("DEF3")} />
                            <PlayerNode slotKey="DEF" player={squad.DEF4} onRemove={() => handleRemovePlayer("DEF4")} />
                        </div>

                        {/* MID */}
                        <div className="flex justify-around px-20">
                            <PlayerNode slotKey="MID" player={squad.MID1} onRemove={() => handleRemovePlayer("MID1")} />
                            <PlayerNode slotKey="MID" player={squad.MID2} onRemove={() => handleRemovePlayer("MID2")} />
                            <PlayerNode slotKey="MID" player={squad.MID3} onRemove={() => handleRemovePlayer("MID3")} />
                        </div>

                        {/* FWD */}
                        <div className="flex justify-around px-20">
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
                {/* Simulated jersey pattern */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 to-transparent" />
            </div>
            <div className="flex flex-col items-center">
                <div className="bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10 backdrop-blur-sm truncate max-w-[80px]">
                    {player.name}
                </div>
                <div className="text-[10px] font-bold text-emerald-400 shadow-black drop-shadow-md">
                    £{player.price}M
                </div>
            </div>
        </div>
    );
}

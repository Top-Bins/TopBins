"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, RotateCw } from "lucide-react";

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

const INITIAL_ROSTER: Player[] = [
   // Starters (11) - 1 GK, 4 DEF, 4 MID, 2 FWD
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

   // Bench (4) - 1 GK, 1 DEF, 1 MID, 1 FWD
   { id: "12", name: "Areola", club: "WHU", position: "GK", price: 4.0, points: 15, isStarter: false },
   { id: "13", name: "Gusto", club: "CHE", position: "DEF", price: 4.0, points: 18, isStarter: false },
   { id: "14", name: "Gordon", club: "NEW", position: "MID", price: 5.5, points: 22, isStarter: false },
   { id: "15", name: "Archer", club: "SHU", position: "FWD", price: 4.5, points: 12, isStarter: false },
];

export default function RosterPage() {
   const [roster, setRoster] = useState<Player[]>(INITIAL_ROSTER);
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   // Grouping for pitch view
   const starters = roster.filter(p => p.isStarter);
   const bench = roster.filter(p => !p.isStarter);

   const startersByPos = {
      GK: starters.filter(p => p.position === "GK"),
      DEF: starters.filter(p => p.position === "DEF"),
      MID: starters.filter(p => p.position === "MID"),
      FWD: starters.filter(p => p.position === "FWD"),
   };

   const handlePlayerClick = (id: string) => {
      // Dismiss any previous error
      setErrorMsg(null);

      // Toggle selection off if clicking same player
      if (selectedId === id) {
         setSelectedId(null);
         return;
      }

      // Select first player
      if (!selectedId) {
         setSelectedId(id);
         return;
      }

      // Attempting a swap (we have a previously selected player)
      const p1 = roster.find(p => p.id === selectedId)!;
      const p2 = roster.find(p => p.id === id)!;

      // Both are starters -> visually ignoring for now (they just deselect)
      if (p1.isStarter && p2.isStarter) {
         setSelectedId(null);
         return;
      }

      // Both are bench -> ignore
      if (!p1.isStarter && !p2.isStarter) {
         setSelectedId(null);
         return;
      }

      // Determine who is the starter and who is the sub
      const starter = p1.isStarter ? p1 : p2;
      const sub = p1.isStarter ? p2 : p1;

      // RULE 1: GK can only swap with GK
      if (starter.position === "GK" && sub.position !== "GK") {
         setErrorMsg("A Goalkeeper can only be swapped with a Goalkeeper!");
         setSelectedId(null);
         return;
      }
      if (sub.position === "GK" && starter.position !== "GK") {
         setErrorMsg("A Goalkeeper can only be swapped with a Goalkeeper!");
         setSelectedId(null);
         return;
      }

      // Analyze formation change for outfielders (only if not GK)
      if (starter.position !== "GK" && sub.position !== "GK") {
         const currentCounts: Record<"DEF" | "MID" | "FWD", number> = {
            DEF: startersByPos.DEF.length,
            MID: startersByPos.MID.length,
            FWD: startersByPos.FWD.length,
         };

         // Simulated new formation
         currentCounts[starter.position as "DEF" | "MID" | "FWD"]--;
         currentCounts[sub.position as "DEF" | "MID" | "FWD"]++;

         // Formations rules
         if (currentCounts.DEF < 3) {
            setErrorMsg("Invalid Formation: You must play with at least 3 Defenders.");
            setSelectedId(null);
            return;
         }
         if (currentCounts.MID < 2) {
            setErrorMsg("Invalid Formation: You must play with at least 2 Midfielders.");
            setSelectedId(null);
            return;
         }
         if (currentCounts.FWD < 1) {
            setErrorMsg("Invalid Formation: You must play with at least 1 Forward.");
            setSelectedId(null);
            return;
         }
      }

      // Valid Swap: update roster state
      const newRoster = roster.map(p => {
         if (p.id === starter.id) return { ...p, isStarter: false };
         if (p.id === sub.id) return { ...p, isStarter: true };
         return p;
      });

      setRoster(newRoster);
      setSelectedId(null); // Clear selection
   };

   return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans lg:flex lg:flex-col pb-20">

      

         {/* Roster Header */}
         <div className="bg-slate-900/60 border-b border-white/5 py-8">
            <div className="mx-auto max-w-5xl px-6">
               <h1 className="text-3xl font-extrabold text-white mb-2">My Roster</h1>
               <p className="text-slate-400 flex items-center gap-2">
                  Matchweek 12 • <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold ring-1 ring-emerald-500/40">Deadline: Fri 18:30 GMT</span>
               </p>
               <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                  <RotateCw className="w-4 h-4" /> Click a starter and then a bench player to swap them. (Must adhere to realistic formation rules).
               </p>

               {/* Error Message Toast */}
               {errorMsg && (
                  <div className="mt-4 flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-lg animate-in fade-in slide-in-from-top-4">
                     <AlertCircle className="w-5 h-5 flex-shrink-0" />
                     <p className="font-medium text-sm">{errorMsg}</p>
                     <button onClick={() => setErrorMsg(null)} className="ml-auto text-rose-500 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-500/20 text-xs font-bold">Clear</button>
                  </div>
               )}
            </div>
         </div>

         {/* Main Pitch & Bench Area */}
         <main className="mx-auto max-w-5xl w-full flex-1 px-4 py-8">

            {/* Pitch Area */}
            <div className="relative bg-[#0a2315] rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-emerald-900/10 mb-8 py-10">

               {/* Pitch Markings */}
               <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-6 top-6 bottom-6 border border-white/10 rounded" />
                  <div className="absolute inset-x-6 top-1/2 h-0.5 bg-white/10" />
                  <div className="absolute top-6 left-1/2 h-40 w-48 -translate-x-1/2 border border-t-0 border-white/10" />
                  <div className="absolute top-6 left-1/2 h-16 w-24 -translate-x-1/2 border border-t-0 border-white/20" />
                  <div className="absolute bottom-6 left-1/2 h-40 w-48 -translate-x-1/2 border border-b-0 border-white/10" />
                  <div className="absolute bottom-6 left-1/2 h-16 w-24 -translate-x-1/2 border border-b-0 border-white/20" />
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                  <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" />
               </div>

               <div className="relative z-10 w-full h-full flex flex-col justify-between gap-12 sm:gap-16">
                  {/* GK Row */}
                  <div className="flex justify-center">
                     {startersByPos.GK.map(p => (
                        <PlayerNode key={p.id} player={p} isSelected={selectedId === p.id} onClick={() => handlePlayerClick(p.id)} />
                     ))}
                  </div>

                  {/* DEF Row */}
                  <div className="flex justify-evenly px-4 sm:px-12">
                     {startersByPos.DEF.map(p => (
                        <PlayerNode key={p.id} player={p} isSelected={selectedId === p.id} onClick={() => handlePlayerClick(p.id)} />
                     ))}
                  </div>

                  {/* MID Row */}
                  <div className="flex justify-evenly px-4 sm:px-16">
                     {startersByPos.MID.map(p => (
                        <PlayerNode key={p.id} player={p} isSelected={selectedId === p.id} onClick={() => handlePlayerClick(p.id)} />
                     ))}
                  </div>

                  {/* FWD Row */}
                  <div className="flex justify-evenly px-4 sm:px-24">
                     {startersByPos.FWD.map(p => (
                        <PlayerNode key={p.id} player={p} isSelected={selectedId === p.id} onClick={() => handlePlayerClick(p.id)} />
                     ))}
                  </div>
               </div>
            </div>

            {/* Bench Area */}
            <div className="bg-slate-900/60 rounded-3xl border border-white/5 p-6 backdrop-blur-md">
               <h2 className="text-xl font-bold text-white mb-6 px-2 flex items-center justify-between">
                  <span>Substitutes (Bench)</span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-white/5">4 Players</span>
               </h2>
               <div className="flex justify-between sm:justify-center sm:gap-12 px-2 pb-2">
                  {bench.map(p => (
                     <PlayerNode key={p.id} player={p} isSelected={selectedId === p.id} onClick={() => handlePlayerClick(p.id)} />
                  ))}
               </div>
            </div>

         </main>

      </div>
   );
}

// Sub-component for individual players
function PlayerNode({ player, isSelected, onClick }: { player: Player; isSelected: boolean; onClick: () => void }) {
   return (
      <div
         className={`relative flex flex-col items-center gap-1 group cursor-pointer transition-transform duration-200 ${isSelected ? "scale-110 z-20" : "hover:scale-110 z-10"}`}
         onClick={onClick}
      >
         {/* Player Icon/Jersey */}
         <div className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 bg-emerald-950 flex items-center justify-center shadow-lg shadow-black/40 transition-colors
          ${isSelected ? "border-cyan-400 ring-4 ring-cyan-500/50 bg-cyan-950 shadow-cyan-500/40" : "border-emerald-500"}
      `}>
            <span className="z-10 text-[10px] sm:text-xs font-bold text-white tracking-widest">{player.position}</span>
            {/* Simulated jersey gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 to-transparent pointer-events-none" />

            {/* Active selection dot */}
            {isSelected && (
               <div className="absolute -top-1 -right-1 h-3 w-3 bg-cyan-400 rounded-full animate-pulse border border-slate-900" />
            )}
         </div>

         {/* Info Badge */}
         <div className="flex flex-col items-center select-none">
            <div className={`bg-slate-900/90 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold border backdrop-blur-sm truncate max-w-[70px] sm:max-w-[85px] transition-colors
              ${isSelected ? "text-cyan-300 border-cyan-500/50" : "text-white border-white/10 group-hover:border-emerald-500/50"}
          `}>
               {player.name}
            </div>
            <div className="mt-0.5 flex gap-1 items-center bg-slate-950/80 px-1 rounded">
               <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">{player.club}</span>
               <span className="text-[8px] sm:text-[9px] font-bold text-emerald-400">{player.points}pts</span>
            </div>
         </div>
      </div>
   );
}

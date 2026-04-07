"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, LogIn } from "lucide-react";

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

const DUMMY_ROSTER: Player[] = [
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
   // Bench (4)
   { id: "12", name: "Areola", club: "WHU", position: "GK", price: 4.0, points: 15, isStarter: false },
   { id: "13", name: "Gusto", club: "CHE", position: "DEF", price: 4.0, points: 18, isStarter: false },
   { id: "14", name: "Gordon", club: "NEW", position: "MID", price: 5.5, points: 22, isStarter: false },
   { id: "15", name: "Archer", club: "SHU", position: "FWD", price: 4.5, points: 12, isStarter: false },
];

export default function MemberTeamPage() {
    const params = useParams();
    const router = useRouter();
    const [roster] = useState<Player[]>(DUMMY_ROSTER);

    const starters = roster.filter(p => p.isStarter);
    const bench = roster.filter(p => !p.isStarter);

    const startersByPos = {
       GK: starters.filter(p => p.position === "GK"),
       DEF: starters.filter(p => p.position === "DEF"),
       MID: starters.filter(p => p.position === "MID"),
       FWD: starters.filter(p => p.position === "FWD"),
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans lg:flex lg:flex-col pb-20 pt-20 border-t">
            {/* Top Navigation placeholder */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                        <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-5xl px-6 py-8 w-full flex-1">
                <button 
                    onClick={() => router.push(`/leagues/${params.id}`)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft size={16} /> Back to League
                </button>
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white mb-2">Member's Roster</h1>
                        <p className="text-slate-400 flex items-center gap-2 text-sm">You are viewing another manager's team.</p>
                    </div>
                </div>
                {/* Main Pitch Area */}
                <div className="relative bg-[#0a2315] rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-emerald-900/10 mb-8 py-10">
                   <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-x-6 top-6 bottom-6 border border-white/10 rounded" />
                      <div className="absolute inset-x-6 top-1/2 h-0.5 bg-white/10" />
                      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                   </div>

                   <div className="relative z-10 w-full h-full flex flex-col justify-between gap-12 sm:gap-16">
                      <div className="flex justify-center">
                         {startersByPos.GK.map(p => <PlayerNode key={p.id} player={p} />)}
                      </div>
                      <div className="flex justify-evenly px-4 sm:px-12">
                         {startersByPos.DEF.map(p => <PlayerNode key={p.id} player={p} />)}
                      </div>
                      <div className="flex justify-evenly px-4 sm:px-16">
                         {startersByPos.MID.map(p => <PlayerNode key={p.id} player={p} />)}
                      </div>
                      <div className="flex justify-evenly px-4 sm:px-24">
                         {startersByPos.FWD.map(p => <PlayerNode key={p.id} player={p} />)}
                      </div>
                   </div>
                </div>

                {/* Bench Area */}
                <div className="bg-slate-900/60 rounded-3xl border border-white/5 p-6 backdrop-blur-md">
                   <h2 className="text-xl font-bold text-white mb-6">Bench</h2>
                   <div className="flex justify-between sm:justify-center sm:gap-12 px-2">
                      {bench.map(p => <PlayerNode key={p.id} player={p} />)}
                   </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for individual players
function PlayerNode({ player }: { player: Player }) {
   return (
      <div className="relative flex flex-col items-center gap-1 group transition-transform duration-200 z-10 hover:z-20">
         <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 bg-emerald-950 flex items-center justify-center border-emerald-500 shadow-lg shadow-black/40">
            <span className="z-10 text-[10px] sm:text-xs font-bold text-white tracking-widest">{player.position}</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 to-transparent pointer-events-none" />
         </div>
         <div className="flex flex-col items-center select-none">
            <div className="bg-slate-900/90 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold border border-white/10 text-white backdrop-blur-sm truncate max-w-[70px] sm:max-w-[85px]">
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

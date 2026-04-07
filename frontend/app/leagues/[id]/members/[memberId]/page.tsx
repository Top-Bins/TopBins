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
                {/* TO BE CONTINUED IN NEXT COMMIT: PITCH AND BENCH */}
                <div className="text-center py-20 text-slate-400 border-2 border-dashed border-white/10 rounded-3xl h-64 bg-slate-900/30 flex items-center justify-center font-mono">
                    [Pitch Render Area Coming Soon]
                </div>
            </div>
        </div>
    );
}

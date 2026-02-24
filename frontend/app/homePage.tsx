"use client";

import React from "react";
import Link from "next/link"; // Assuming using Next.js Link
// You might need to adjust imports based on your project structure

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                            <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-slate-300 transition hover:text-white">Dashboard</Link>
                            <Link href="/buildTeam" className="text-sm font-medium text-slate-300 transition hover:text-white">Draft</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-300 transition hover:text-white">
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
                {/* Background Glows */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
                </div>

                <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </span>
                        Season 2026 is Live
                    </div>

                    <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                        The Ultimate <br />
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Fantasy Soccer
                        </span>{" "}
                        Experience
                    </h1>

                    <p className="mb-10 max-w-2xl text-lg text-slate-400 sm:text-xl">
                        Draft your dream squad, compete with friends in real-time features, and dominate the league with advanced analytics.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-4 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:scale-105 hover:brightness-110"
                        >
                            Start Your Season
                        </Link>
                        <Link
                            href="/demo"
                            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                        >
                            View Demo
                        </Link>
                    </div>

                    {/* Abstract Visual / Pitch */}
                    <div className="mt-20 w-full max-w-5xl perspective-1000">
                        <div className="relative mx-auto aspect-[16/9] w-full rotate-x-12 rounded-2xl border border-white/10 bg-slate-900/50 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl transition hover:rotate-x-0 duration-700 ease-out">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-slate-700 font-mono text-sm">[ Interactive Pitch Visualization Placeholder ]</span>
                            </div>
                            {/* Decorative grid lines simulating pitch */}
                            <div className="absolute inset-x-0 top-1/4 h-px bg-white/5" />
                            <div className="absolute inset-x-0 bottom-1/4 h-px bg-white/5" />
                            <div className="absolute inset-y-0 left-1/4 w-px bg-white/5" />
                            <div className="absolute inset-y-0 right-1/4 w-px bg-white/5" />
                            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-slate-950 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to win</h2>
                        <p className="mt-4 text-slate-400">Powerful tools built for the modern fantasy manager.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <FeatureCard
                            title="Live Draft Room"
                            desc="Experience the thrill of real-time drafting with our websocket-powered draft room. No lag, just pure strategy."
                            icon="⚡"
                        />
                        <FeatureCard
                            title="Smart Analytics"
                            desc="Make data-driven decisions with player heatmaps, expected goals (xG), and fixture difficulty ratings."
                            icon="📊"
                        />
                        <FeatureCard
                            title="Global Leagues"
                            desc="Join public leagues to compete against managers worldwide or create private leagues for your friends."
                            icon="🌍"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-slate-900 py-12">
                <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-emerald-500/20" />
                        <span className="text-sm font-semibold text-slate-400">TopBins &copy; 2026</span>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-emerald-400">Terms</a>
                        <a href="#" className="hover:text-emerald-400">Privacy</a>
                        <a href="#" className="hover:text-emerald-400">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
    return (
        <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-emerald-500/30 hover:bg-white/10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-2xl shadow-inner shadow-white/10">
                {icon}
            </div>
            <h3 className="mb-3 text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}

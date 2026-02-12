"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        teamName: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert("Signup logic to be implemented!");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
            {/* Left Side: Visuals (Hidden on mobile) */}
            <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-10 transition hover:opacity-80">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                        <span className="text-2xl font-bold tracking-tight text-white">TopBins</span>
                    </Link>
                    <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-white mb-6">
                        Build your dynasty. <br />
                        <span className="text-emerald-400">Dominate the league.</span>
                    </h2>
                    <p className="max-w-sm text-lg text-slate-400">
                        Join thousands of managers competing for glory in the most immersive fantasy soccer experience.
                    </p>
                </div>

                {/* Generated FIFA Card Visual */}
                <div className="relative z-10 mt-12 flex-1 flex items-center justify-center">
                    <div className="relative w-96 rotate-6 transition duration-500 hover:rotate-0 hover:scale-105">
                        <img
                            src="/assets/fifa-card.png"
                            alt="FIFA Ultimate Team Style Card"
                            className="w-full drop-shadow-2xl"
                        />
                    </div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm text-slate-500">
                    <span>© 2026 TopBins</span>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex w-full flex-col justify-center bg-slate-950 p-8 lg:w-1/2 lg:p-24">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                            <span className="text-2xl font-bold tracking-tight text-white">TopBins</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
                        <p className="mt-2 text-slate-400">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Username</label>
                                <input
                                    name="username"
                                    required
                                    placeholder="top_manager"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Team Name</label>
                                <input
                                    name="teamName"
                                    placeholder="AFC Richmond"
                                    value={formData.teamName}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="manager@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="Min. 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </div>

                        <p className="text-center text-xs text-slate-500">
                            By clicking "Create Account", you agree to our <a href="#" className="hover:text-emerald-400 underline">Terms</a> and <a href="#" className="hover:text-emerald-400 underline">Privacy Policy</a>.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

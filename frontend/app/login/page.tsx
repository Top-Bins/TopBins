"use client";


import React, { useMemo, useState } from "react";
import Link from "next/link";

type Props = {
  onLogin?: (email: string, password: string) => Promise<void> | void;
};

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const okEmail = email.trim().includes("@");
    const okPw = password.length >= 6;
    return okEmail && okPw && !loading;
  }, [email, password, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim().includes("@")) return setError("Enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    try {
      setLoading(true);
      await onLogin?.(email.trim(), password);
      // If you’re not passing onLogin yet, this is where you’d call Supabase.
    } catch (err: any) {
      setError(err?.message ?? "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* soft glow background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-40 left-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-24 right-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          {/* Left: Brand */}
          <div className="hidden lg:flex flex-col justify-center px-6">
            <div className="inline-flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">TopBins</h1>
                <p className="text-slate-300">Keep your stuff organized. Fast.</p>
              </div>
            </div>

            <div className="mt-10 space-y-4 text-slate-300">
              <Feature title="Clean dashboard" desc="See everything in one place." />
              <Feature title="Quick search" desc="Find bins and items instantly." />
              <Feature title="Team-ready" desc="Invite people when you're ready." />
            </div>

            <p className="mt-10 text-xs text-slate-500">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </div>

          {/* Right: Login card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              {/* Mobile brand header */}
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">TopBins</h1>
                  <p className="text-sm text-slate-300">Welcome back</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Log in</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Use your email and password to continue.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-slate-200">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="you@topbins.com"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-4 focus:ring-emerald-400/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-200">Password</label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 pr-12 text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-4 focus:ring-emerald-400/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-white/10"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/10" />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-sm text-emerald-300 hover:text-emerald-200"
                      onClick={() => alert("Hook this up to your reset flow.")}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <button
                  disabled={!canSubmit}
                  className={[
                    "w-full rounded-2xl px-4 py-3 font-semibold transition",
                    "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950",
                    "hover:brightness-110 active:brightness-95",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    "shadow-lg shadow-emerald-500/10",
                  ].join(" ")}
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-slate-950 px-3 text-xs text-slate-400">or</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
                    onClick={() => alert("Hook up OAuth here (Google).")}
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
                    onClick={() => alert("Hook up OAuth here (GitHub).")}
                  >
                    GitHub
                  </button>
                </div>

                <p className="pt-2 text-center text-sm text-slate-300">
                  New here?{" "}
                  <Link
                    href="/signup"
                    className="text-emerald-300 hover:text-emerald-200"
                  >
                    Create an account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-slate-100">{title}</div>
      <div className="mt-1 text-sm text-slate-300">{desc}</div>
    </div>
  );
}

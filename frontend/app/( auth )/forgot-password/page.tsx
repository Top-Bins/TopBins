"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim().includes("@")) return setError("Enter a valid email.");

    try {
      setLoading(true);

      // This tells Supabase to send the email and route them to our callback
      // with a special "next" parameter pointing to the update page.
      const redirectTo = `${window.location.origin}/auth/callback?next=/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? "Failed to send reset email. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100 font-sans selection:bg-emerald-500/30">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        
        <div className="mb-8 flex justify-center">
          <Link href="/login" className="flex items-center gap-3 transition hover:opacity-80">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
            <span className="text-2xl font-bold tracking-tight text-white">TopBins</span>
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email to get a reset link.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-center text-sm text-emerald-100">
            Check your inbox! We sent a reset link to <strong>{email}</strong>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                required
                placeholder="manager@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.includes("@")}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline">
            &larr; Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { leagueService } from '@/services/league';

export default function JoinLeaguePage() {
    const [inviteCode, setInviteCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await leagueService.joinLeague(inviteCode);
            router.push('/leagues');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pt-24">
            <div className="mx-auto w-full max-w-md bg-slate-900/50 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Join a League
                </h1>
                <p className="text-slate-400 mb-8">
                    Enter the unique invite code provided by your league owner.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="inviteCode" className="block text-sm font-medium text-slate-300 mb-2">
                            Invite Code
                        </label>
                        <input
                            id="inviteCode"
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            placeholder="e.g. CHAMP-2024-XYZ"
                            required
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all uppercase tracking-wider font-mono font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !inviteCode.trim()}
                        className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 active:scale-[0.98] disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                    >
                        {isSubmitting ? 'Joining...' : 'Join League'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <button
                        type="button"
                        onClick={() => router.push('/leagues/create')}
                        className="text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors"
                    >
                        Want to start your own league instead?
                    </button>
                </div>
            </div>
        </div>
    );
}

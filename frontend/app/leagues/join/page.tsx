'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinLeaguePage() {
    const [inviteCode, setInviteCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // API integration will be done in Phase 2
        console.log('Joining league with code:', inviteCode);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        // router.push('/leagues'); // Navigate to leagues dashboard (planned)
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Join a League
                </h1>
                <p className="text-neutral-400 mb-8">
                    Enter the unique invite code provided by your league owner.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="inviteCode" className="block text-sm font-medium text-neutral-300 mb-2">
                            Invite Code
                        </label>
                        <input
                            id="inviteCode"
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            placeholder="e.g. CHAMP-2024-XYZ"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all uppercase tracking-wider font-mono"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !inviteCode.trim()}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]"
                    >
                        {isSubmitting ? 'Joining...' : 'Join League'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <button
                        type="button"
                        onClick={() => router.push('/leagues/create')}
                        className="text-neutral-400 hover:text-purple-400 text-sm transition-colors"
                    >
                        Want to start your own league instead?
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateLeaguePage() {
    const [leagueName, setLeagueName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // API integration will be done in Phase 2
        console.log('Creating league:', leagueName);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        // router.push('/leagues'); // Navigate to leagues dashboard (planned)
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Create a League
                </h1>
                <p className="text-neutral-400 mb-8">
                    Start your own fantasy soccer league and invite your friends.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="leagueName" className="block text-sm font-medium text-neutral-300 mb-2">
                            League Name
                        </label>
                        <input
                            id="leagueName"
                            type="text"
                            value={leagueName}
                            onChange={(e) => setLeagueName(e.target.value)}
                            placeholder="e.g. The Champions' Circle"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !leagueName.trim()}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-neutral-950 font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
                    >
                        {isSubmitting ? 'Creating...' : 'Create League'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <button
                        type="button"
                        onClick={() => router.push('/leagues/join')}
                        className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors"
                    >
                        Looking to join an existing league instead?
                    </button>
                </div>
            </div>
        </div>
    );
}

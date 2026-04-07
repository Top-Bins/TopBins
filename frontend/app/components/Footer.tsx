"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-slate-950 py-20 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 h-64 w-64 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 translate-y-1/2 rounded-full bg-cyan-500/5 blur-[80px]" />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
                            <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">
                            The ultimate fantasy soccer experience. Build your dream squad, compete with friends, and dominate your league with advanced analytics.
                        </p>

                        <div className="max-w-xs">
                            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Stay updated</h5>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="manager@example.com"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="bg-white text-slate-950 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                                >
                                    Join
                                </button>
                            </form>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="/leagues" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Leagues</Link></li>
                            <li><Link href="/players" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Player Stats</Link></li>
                            <li><Link href="/teams" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Club Stats</Link></li>
                            <li><Link href="/analytics" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Analytics</Link></li>
                            <li><Link href="/pricing" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="/help" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Contact</Link></li>
                            <li><Link href="/status" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Status</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 order-2 md:order-1">
                        <p className="text-sm text-slate-500">
                            &copy; 2026 TopBins Inc. All rights reserved.
                        </p>
                        <div className="hidden md:flex gap-6">
                            <Link href="/terms" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">Terms</Link>
                            <Link href="/privacy" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">Privacy</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 order-1 md:order-2">
                        <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
                        </a>
                        <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <span className="sr-only">GitHub</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        </a>
                        <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <span className="sr-only">Discord</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

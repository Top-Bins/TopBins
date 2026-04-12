"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface UserDropdownProps {
  email: string;
  avatarUrl: string | null;
}

export function UserDropdown({ email, avatarUrl }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); // Force a server refresh to update the Navbar state
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 pr-4 transition hover:bg-white/10 focus:outline-none"
      >
        <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            /* Using standard img to avoid next.config.js remote pattern issues with Supabase URLs */
            <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm">👤</span>
          )}
        </div>
        <span className="text-sm font-medium text-slate-300 hidden sm:block">
          {email}
        </span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-white/10 bg-slate-900/95 py-2 shadow-xl shadow-black/50 backdrop-blur-xl">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-emerald-400"
          >
            Dashboard
          </Link>
          <Link
            href="/roster"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-emerald-400"
          >
            Roster
          </Link>
          <Link
            href="/players"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-emerald-400"
          >
            Player Stats
          </Link>
          <Link
            href="/teams"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-emerald-400"
          >
            Club Stats
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-emerald-400"
          >
            Settings
          </Link>
          <div className="my-1 h-px bg-white/5" />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-rose-400 transition hover:bg-white/5 hover:text-rose-300"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
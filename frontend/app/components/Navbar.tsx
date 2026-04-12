import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserDropdown } from "./UserDropdown";

export async function Navbar() {
  const supabase = await createClient();
  
  // 1. Get auth user
  const { data: { user } } = await supabase.auth.getUser();
  const loggedIn = !!user;

  let avatarUrl = null;

  // 2. If logged in, fetch their profile picture
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();
      
    if (profile?.avatar_url) {
      avatarUrl = profile.avatar_url;
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 z-50 border-b border-white/5 bg-slate-950 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20" />
          <span className="text-xl font-bold tracking-tight text-white">TopBins</span>
        </Link>

        {/* Right side nav */}
        <div className="flex items-center gap-4">
          {!loggedIn ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Sign up
              </Link>
            </>
          ) : (
            <UserDropdown email={user.email!} avatarUrl={avatarUrl} />
          )}
        </div>
      </div>
    </nav>
  );
}
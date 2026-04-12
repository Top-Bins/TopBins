import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protect the route - bounce unauthenticated users back to login
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100 font-sans selection:bg-emerald-500/30">
      <div className="mx-auto max-w-3xl pt-20">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <Link href="/" className="text-sm text-emerald-400 hover:underline">
            &larr; Back Home
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <p className="text-slate-400 mb-6">Manage your TopBins account and preferences.</p>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span className="text-slate-400">Email Address</span>
              <span className="font-medium text-white">{user.email}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span className="text-slate-400">Account Status</span>
              <span className="font-medium text-emerald-400">Active</span>
            </div>
          </div>

          {/* Add your form to change passwords, usernames, or notifications here later */}

        </div>
      </div>
    </div>
  );
}
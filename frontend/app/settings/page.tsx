"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return router.push("/login");
      }
      setUserId(user.id);
      setEmail(user.email ?? "");

      // Fetch profile data (just the avatar)
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      
      setLoading(false);
    }
    loadUser();
  }, [router, supabase]);

  // Handle Profile Picture Upload
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      setMessage(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      // 1. Upload to your 'avatars' Storage Bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // 3. Save URL to your existing Profiles Table
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({ 
          id: userId, 
          avatar_url: publicUrl 
        });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setMessage({ text: "Profile picture updated successfully!", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setUploading(false);
    }
  }

  // Handle Email Update (This updates auth.users)
  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      
      setMessage({ text: "Check both your old and new emails to confirm the change.", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100 font-sans selection:bg-emerald-500/30">
      <div className="mx-auto max-w-2xl pt-20">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <Link href="/dashboard" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

        {message && (
          <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
            message.type === "success" 
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100" 
              : "border-rose-500/30 bg-rose-500/10 text-rose-200"
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* PROFILE PICTURE SECTION */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <h2 className="mb-6 text-xl font-bold text-white">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-800 border-2 border-white/10">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">👤</div>
                )}
              </div>
              <div>
                <label className="cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                  {uploading ? "Uploading..." : "Upload New Picture"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-xs text-slate-400">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>
          </div>

          {/* EMAIL SETTINGS SECTION */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <h2 className="mb-6 text-xl font-bold text-white">Account Email</h2>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:brightness-95 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Update Email"}
              </button>
            </form>
            <p className="mt-4 text-xs text-slate-400">
              * Note: For security, Supabase will send a confirmation link to BOTH your old email and your new email before the change takes effect.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
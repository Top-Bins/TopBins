"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Cropper from "react-easy-crop";

// --- HELPER COMPONENT: THE CROPPER MODAL ---
function ImageCropper({ image, onCropComplete, onCancel }: { 
  image: string; 
  onCropComplete: (blob: Blob) => void; 
  onCancel: () => void 
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropAreaComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    const canvas = document.createElement("canvas");
    const img = new window.Image();
    img.src = image;
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      ctx?.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      
      canvas.toBlob((blob) => {
        if (blob) onCropComplete(blob);
      }, "image/jpeg");
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md">
      <div className="relative h-[400px] w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 border border-white/10">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          onCropChange={setCrop}
          onCropComplete={onCropAreaComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="mt-8 flex gap-4">
        <button onClick={onCancel} className="px-6 py-2 text-slate-400 hover:text-white transition">Cancel</button>
        <button onClick={handleSave} className="rounded-xl bg-emerald-500 px-8 py-2 font-bold text-slate-950 hover:bg-emerald-400 transition">Save Profile Picture</button>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
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

  // NEW: State for the cropping flow
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single();
      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      setLoading(false);
    }
    loadUser();
  }, [router, supabase]);

  // NEW: Triggers when the user picks a file
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // NEW: Handles the final upload after cropping
  const handleCropSave = async (blob: Blob) => {
    setImageToCrop(null);
    setUploading(true);
    setMessage(null);

    try {
      const filePath = `${userId}/${Math.random()}.jpg`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, blob);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.from("profiles").upsert({ 
        id: userId, 
        avatar_url: publicUrl 
      });

      if (updateError) throw updateError;
      setAvatarUrl(publicUrl);
      setMessage({ text: "Profile picture updated!", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setMessage({ text: "Check both emails to confirm change.", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100 font-sans selection:bg-emerald-500/30">
      
      {/* RENDER THE CROPPER MODAL IF AN IMAGE IS SELECTED */}
      {imageToCrop && (
        <ImageCropper 
          image={imageToCrop} 
          onCancel={() => setImageToCrop(null)} 
          onCropComplete={handleCropSave} 
        />
      )}

      <div className="mx-auto max-w-2xl pt-20">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <Link href="/dashboard" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline">&larr; Back</Link>
        </div>

        {message && (
          <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <h2 className="mb-6 text-xl font-bold text-white">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-800 border-2 border-white/10">
                {avatarUrl ? <Image src={avatarUrl} alt="Avatar" fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-3xl">👤</div>}
              </div>
              <div>
                <label className="cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                  {uploading ? "Processing..." : "Upload New Picture"}
                  <input type="file" accept="image/*" onChange={onFileChange} disabled={uploading} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <h2 className="mb-6 text-xl font-bold text-white">Account Email</h2>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition" />
              <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:opacity-60">
                {saving ? "Saving..." : "Update Email"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader, SectionLabel } from "../components/ui";
import { useToast } from "../components/toast";

export function SettingsForm({
  email,
  role,
  hasAnthropicKey,
  commitSha,
}: {
  email: string;
  role: string;
  hasAnthropicKey: boolean;
  commitSha: string | null;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { toast } = useToast();

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast(error.message, "error");
      } else {
        toast("Password updated", "success");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <div className="space-y-8">
      <PageHeader>Settings</PageHeader>

      {/* Account */}
      <section>
        <SectionLabel>Account</SectionLabel>
        <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Email</label>
              <p className="text-sm text-zinc-900">{email}</p>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Role</label>
              <p className="text-sm text-zinc-900 capitalize">{role}</p>
            </div>
          </div>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-3 border-t border-zinc-200 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClasses}
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClasses}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                  {loading && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordForm(false); setNewPassword(""); setConfirmPassword(""); }}
                  className="text-xs text-zinc-400 hover:text-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* System Info */}
      <section>
        <SectionLabel>System Info</SectionLabel>
        <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Anthropic API</span>
              {hasAnthropicKey ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Connected</span>
              ) : (
                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">Not configured</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Supabase</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">App Version</span>
              <span className="font-mono text-xs text-zinc-600">
                {commitSha ? commitSha.slice(0, 7) : "dev"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

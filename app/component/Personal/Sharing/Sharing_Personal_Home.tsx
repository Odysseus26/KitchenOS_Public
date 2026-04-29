"use client";

import "@/app/globals.css";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Building2, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client-side";

import Signup_Loading from "../../Signup/Signup_Loading";
import Crash from "../../utils/Crash";

interface Invite {
  organization_id: string;
  organization_name: string;
}

export default function Sharing_Personal_Home({ user }: { user: User }) {
  const [isLoading, setLoading] = useState(true);
  const [crash, setCrash] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  
  async function fetchInvites() {
    try {
      const { data: userData, error: userError } = await supabase
        .from("User_Metadata")
        .select("invite_requests")
        .eq("user_id", user.id)
        .single();

      if (userError && userError.code !== "PGRST116") throw userError;
      const inviteIds: string[] = userData?.invite_requests ?? [];
      if (inviteIds.length === 0) {
        setInvites([]);
        setLoading(false);
        return;
      }

      
      const { data: orgs, error: orgError } = await supabase
        .from("Organizations")
        .select("organization_id, organization_name")
        .in("organization_id", inviteIds);

      if (orgError) throw orgError;
      setInvites(orgs ?? []);
    } catch (err) {
      console.error(err);
      setCrash(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInvites();
  }, [user.id]);

  async function acceptInvite(orgId: string, orgName: string) {
    setActionLoading(orgId);
    setFeedback(null);
    try {
      
      const { data: orgData, error: orgFetchError } = await supabase
        .from("Organizations")
        .select("users")
        .eq("organization_id", orgId)
        .single();
      if (orgFetchError) throw orgFetchError;

      
      let existingUsers = orgData?.users ?? [];
      
      const newUserJson = JSON.stringify({ user_id: user.id, level: 1 });
      const updatedUsers = [...existingUsers, newUserJson];

      
      const { error: orgUpdateError } = await supabase
        .from("Organizations")
        .update({ users: updatedUsers })
        .eq("organization_id", orgId);
      if (orgUpdateError) throw orgUpdateError;

      
      const { data: userMeta, error: metaFetchError } = await supabase
        .from("User_Metadata")
        .select("organizations_member")
        .eq("user_id", user.id)
        .single();
      if (metaFetchError && metaFetchError.code !== "PGRST116") throw metaFetchError;

      const currentOrgs = userMeta?.organizations_member ?? [];
      const updatedOrgs = [...currentOrgs, orgId];

      
      const { error: metaUpdateError } = await supabase
        .from("User_Metadata")
        .update({ organizations_member: updatedOrgs })
        .eq("user_id", user.id);
      if (metaUpdateError) throw metaUpdateError;

      
      const { data: currentInvites } = await supabase
        .from("User_Metadata")
        .select("invite_requests")
        .eq("user_id", user.id)
        .single();
      const remainingInvites = (currentInvites?.invite_requests ?? []).filter((id: string) => id !== orgId);
      const { error: removeInviteError } = await supabase
        .from("User_Metadata")
        .update({ invite_requests: remainingInvites })
        .eq("user_id", user.id);
      if (removeInviteError) throw removeInviteError;

      
      await fetchInvites();
      setFeedback({ type: "success", text: `Joined ${orgName}!` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Failed to accept invite. Please try again." });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectInvite(orgId: string, orgName: string) {
    if (!confirm(`Reject invitation to join "${orgName}"?`)) return;
    setActionLoading(orgId);
    try {
      
      const { data: currentInvites } = await supabase
        .from("User_Metadata")
        .select("invite_requests")
        .eq("user_id", user.id)
        .single();
      const remainingInvites = (currentInvites?.invite_requests ?? []).filter((id: string) => id !== orgId);
      const { error: removeError } = await supabase
        .from("User_Metadata")
        .update({ invite_requests: remainingInvites })
        .eq("user_id", user.id);
      if (removeError) throw removeError;

      await fetchInvites();
      setFeedback({ type: "success", text: `Rejected invite from ${orgName}.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Failed to reject invite." });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setActionLoading(null);
    }
  }

  if (isLoading) return <Signup_Loading />;
  if (crash) return <Crash message="Invite Requests Error! Try again." />;

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl animate-float"
          style={{ backgroundColor: `var(--PRIMARY_COLOR)`, opacity: 0.2 }}
        />
        <div
          className="absolute bottom-0 left-0 h-80 w-80 rounded-full blur-3xl animate-float [animation-delay:-2s]"
          style={{ backgroundColor: `var(--SECONDARD_COLOR)`, opacity: 0.15 }}
        />
        <div
          className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full blur-3xl animate-float [animation-delay:-4s]"
          style={{ backgroundColor: `var(--THIRD_COLOR)`, opacity: 0.2 }}
        />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0a0a0a]/40 to-[#0a0a0a]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        {}
        <div className="mb-12 text-center">
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{
              background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR), var(--THIRD_COLOR))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% auto",
              animation: "gradient 6s linear infinite",
            }}
          >
            Organisation Invites
          </h2>
          <p className="mt-3 text-text-gray text-lg">
            You have been invited to join these organisations
          </p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>

        {feedback && (
          <div
            className={`mb-6 rounded-xl border p-3 text-center max-w-md mx-auto ${
              feedback.type === "success"
                ? "border-green-500/30 bg-green-500/5 text-green-400"
                : "border-red-500/30 bg-red-500/5 text-red-400"
            }`}
          >
            <p className="text-sm">{feedback.text}</p>
          </div>
        )}

        {invites.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl text-center max-w-md mx-auto">
            <Building2 className="mx-auto h-12 w-12 text-text-gray/50 mb-3" />
            <p className="text-text-gray">No pending invitations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {invites.map((invite) => (
              <div
                key={invite.organization_id}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-light">{invite.organization_name}</h3>
                  <p className="mt-1 text-sm text-text-gray/70">You have been invited to join this organisation.</p>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => acceptInvite(invite.organization_id, invite.organization_name)}
                    disabled={actionLoading === invite.organization_id}
                    className="inline-flex items-center gap-1 rounded-lg bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400 transition hover:scale-105 hover:bg-green-500/30 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    {actionLoading === invite.organization_id ? "Processing..." : "Accept"}
                  </button>
                  <button
                    onClick={() => rejectInvite(invite.organization_id, invite.organization_name)}
                    disabled={actionLoading === invite.organization_id}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:scale-105 hover:bg-red-500/30 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
                <div className="pointer-events-none absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-primary/10 blur-xl" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
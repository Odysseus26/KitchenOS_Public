"use client";

import { supabase } from "@/lib/supabase/client-side";
import { OrganizationDetails } from "../../utils/FetchOrganization";
import { User_Organization, Public_Facing_Info, organizations_members } from "../../utils/type";
import { useState, useEffect } from "react";
import { Users, Edit, Trash2, X, Check, Crown } from "lucide-react";
import "@/app/globals.css";

import Signup_Loading from "../../Signup/Signup_Loading";
import Crash from "../../utils/Crash";

import InviteUsers_Button from "./InviteUsers";
import TransferOwnership_Button from "./TransferOwnershipButton";
import DeleteOrganization_Button from "./DeleteOrganization";

interface ExposedUser extends organizations_members {
  name: string;
  email: string;
}

export default function Organization_Dashboard({ organization_details }: { organization_details: Public_Facing_Info }) {
  const [isLoading, setLoading] = useState(true);
  const [crash, setCrash] = useState(false);
  const [organization, setOrganization] = useState<User_Organization | null>(null);
  const [members, setMembers] = useState<ExposedUser[]>([]);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newLevel, setNewLevel] = useState<number>(1);

  async function fetchOrganizationAndMembers() {
  try {
    const org = await OrganizationDetails(organization_details.organization_id, organization_details.user.id);
    setOrganization(org);

    const userIds: string[] = [];
    const levelMap = new Map<string, number>();
    for (const member of org.users) {
      userIds.push(member.user_id);
      levelMap.set(member.user_id, member.level);
    }

    if (userIds.length === 0) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const { data: userData, error: fetchError } = await supabase
      .from("User_Metadata")
      .select("user_id, first_name, last_name, email")
      .in("user_id", userIds);

    if (fetchError) throw fetchError;
    if (!userData) throw new Error("No user data returned");

    const fullInfo: ExposedUser[] = userData.map((u) => ({
      name: `${u.first_name} ${u.last_name}`,
      email: u.email,
      user_id: u.user_id,
      level: levelMap.get(u.user_id) || 1,
    }));


    setMembers(fullInfo);
  } catch (err) {
    console.error(err);
    setCrash(true);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchOrganizationAndMembers();
  }, [organization_details.organization_id]);

  const permissions = {
    allowed_change: (organization?.level ?? 0) >= 4,
    allowed_kick: (organization?.level ?? 0) >= 4,
  };

  const levelOptions = [1, 2, 3]; 

  const handleEdit = async (userId: string, updatedLevel: number) => {
    setActionMessage(null);
    
    const updatedMembers = members.map((m) =>
      m.user_id === userId ? { ...m, level: updatedLevel } : m
    );
    setMembers(updatedMembers);
    setEditingUserId(null);

    
    const usersForDb: string[] = updatedMembers.map((m) =>
      JSON.stringify({ user_id: m.user_id, level: m.level })
    );

    const {data:Itself,error:Itself_Error} = await supabase.auth.getUser();
    if(Itself_Error) throw Itself_Error
    const self_id = Itself.user.id;

    usersForDb.push(JSON.stringify({
    user_id: self_id,
    level: 4
    }))


    const { error: updateError } = await supabase
      .from("Organizations")
      .update({ users: usersForDb })
      .eq("organization_id", organization!.organization_id);

    if (updateError) {
      setActionMessage({ type: "error", text: "Failed to update user level." });
      
      await fetchOrganizationAndMembers();
    } else {
      setActionMessage({ type: "success", text: "User level updated." });
      
      await fetchOrganizationAndMembers();
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleKick = async (userId: string) => {
    if (!confirm("Remove this member from the organisation? They will lose access.")) return;
    setActionMessage(null);

    
    const { data: userMeta, error: fetchMetaError } = await supabase
      .from("User_Metadata")
      .select("organizations_member")
      .eq("user_id", userId)
      .single();

    if (fetchMetaError && fetchMetaError.code !== "PGRST116") {
      setActionMessage({ type: "error", text: "Could not fetch user metadata." });
      return;
    }

    const currentOrgs = userMeta?.organizations_member ?? [];
    const updatedOrgs = currentOrgs.filter((id: string) => id !== organization!.organization_id);

    const { error: updateMetaError } = await supabase
      .from("User_Metadata")
      .update({ organizations_member: updatedOrgs })
      .eq("user_id", userId);

    if (updateMetaError) {
      setActionMessage({ type: "error", text: "Failed to remove organisation from user." });
      return;
    }

    
    const updatedMembers = members.filter((m) => m.user_id !== userId);
    const usersForDb = updatedMembers.map((m) =>
      JSON.stringify({ user_id: m.user_id, level: m.level })
    );

    const { error: updateOrgError } = await supabase
      .from("Organizations")
      .update({ users: usersForDb })
      .eq("organization_id", organization!.organization_id);

    if (updateOrgError) {
      setActionMessage({ type: "error", text: "Failed to remove user from organisation." });
      return;
    }

    setMembers(updatedMembers);
    setActionMessage({ type: "success", text: "Member removed successfully." });
    setTimeout(() => setActionMessage(null), 3000);
  };

  if (isLoading) return <Signup_Loading />;
  if (crash||!organization) return <Crash message="Something went wrong trying to fetch organisation data." />;

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
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm text-text-gray mb-4">
          <Crown className="h-4 w-4 text-primary" />
          <span>{organization.organization_name}</span>
        </div>
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
          Team Dashboard
        </h2>
        <p className="mt-3 text-text-gray text-lg">
          Manage members and their permissions
        </p>
        <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
      </div>

      {}
      {actionMessage && (
        <div
          className={`mb-6 rounded-xl border p-3 text-center max-w-md mx-auto ${
            actionMessage.type === "success"
              ? "border-green-500/30 bg-green-500/5 text-green-400"
              : "border-red-500/30 bg-red-500/5 text-red-400"
          }`}
        >
          <p className="text-sm">{actionMessage.text}</p>
        </div>
      )}

      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <InviteUsers_Button organization_id={organization_details.organization_id} user_id={organization_details.user.id} />
        <TransferOwnership_Button organization_details={organization_details} />
        <DeleteOrganization_Button organization_id={organization?.organization_id} organization_name={organization?.organization_name}/>
      </div>

      {}
      <div className="mx-auto mb-12 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-2xl">
        <h3 className="mb-3 text-center text-lg font-semibold text-primary">Permission Levels</h3>
        <div className="space-y-2 text-sm text-text-gray">
          <p><span className="font-medium text-white">Level 1 (Member):</span> Can only see and access Recipes.</p>
          <p><span className="font-medium text-white">Level 2 (Staff):</span> Can edit Recipes and see Inventory (cannot edit).</p>
          <p><span className="font-medium text-white">Level 3 (Admin):</span> Can create, delete, make public recipes. Can access and edit Inventory and Vendors.</p>
          <p><span className="font-medium text-white">Level 4 (Owner):</span> Can edit other users' access and transfer ownership.</p>
        </div>
      </div>

      {}
      {members.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl text-center max-w-md mx-auto">
          <Users className="mx-auto h-12 w-12 text-text-gray/50 mb-3" />
          <p className="text-text-gray">No members found in this organisation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-light">{member.name}</h3>
                  <p className="text-sm text-text-gray/70">{member.email}</p>
                </div>
                {}
                <div className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  Level {member.level}
                </div>
              </div>

              {}
              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                {permissions.allowed_kick && member.user_id !== organization_details.user.id && (
                  <button
                    onClick={() => handleKick(member.user_id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-400 transition hover:scale-105 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3 w-3" />
                    Kick
                  </button>
                )}
                {permissions.allowed_change && member.user_id !== organization_details.user.id && (
  editingUserId === member.user_id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newLevel}
                        onChange={(e) => setNewLevel(Number(e.target.value))}
                        className="rounded-lg border border-white/15 bg-black/40 px-2 py-1 text-xs text-text-light"
                      >
                        {levelOptions.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            Level {lvl}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleEdit(member.user_id, newLevel)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUserId(member.user_id);
                        setNewLevel(member.level);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs text-text-gray transition hover:scale-105 hover:bg-white/10"
                    >
                      <Edit className="h-3 w-3" />
                      Edit Level
                    </button>
                  )
                )}
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

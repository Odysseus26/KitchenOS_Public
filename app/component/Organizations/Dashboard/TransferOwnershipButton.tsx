"use client";

import { supabase } from "@/lib/supabase/client-side";
import { Public_Facing_Info, User_Organization, organizations_members } from "../../utils/type";
import { OrganizationDetails } from "../../utils/FetchOrganization";
import { useState, useEffect, useRef } from "react";
import { Crown, UserCog, X, Shield } from "lucide-react";
import "@/app/globals.css";

import Signup_Loading from "../../Signup/Signup_Loading";
import Crash from "../../utils/Crash";

interface ExposedUser extends organizations_members {
  name: string;
  email: string;
}

export default function TransferOwnership_Button({ organization_details }: { organization_details: Public_Facing_Info }) {
  const [organization, setOrganization] = useState<User_Organization | null>(null);
  const [members, setMembers] = useState<ExposedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
        setIsLoading(false);
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

      
      const nowInfo = fullInfo.filter((el) => el.user_id !== organization_details.user.id);
      setMembers(nowInfo);
    } catch (err) {
      console.error(err);
      setError("Failed to load members.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrganizationAndMembers();
  }, [organization_details.organization_id]);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  async function transferOwnership(newOwnerId: string) {
    setFeedback(null);
    setIsTransferring(newOwnerId);

    if (!organization) {
      setFeedback({ type: "error", text: "Organization data missing." });
      setIsTransferring(null);
      return;
    }

    
    const updatedUsers = organization.users.map((user) => {
      if (user.user_id === newOwnerId) {
        return { ...user, level: 4 };
      }
      if (user.user_id === organization_details.user.id) {
        return { ...user, level: 3 };
      }
      return user;
    });

    
    const usersForDb = updatedUsers.map((u) => JSON.stringify({ user_id: u.user_id, level: u.level }));

    
    const { error: updateOrgError } = await supabase
      .from("Organizations")
      .update({
        users: usersForDb,
        owner_id: newOwnerId, 
      })
      .eq("organization_id", organization.organization_id);

    if (updateOrgError) {
      setFeedback({ type: "error", text: "Failed to transfer ownership. Please try again." });
      setIsTransferring(null);
      return;
    }

    
    await fetchOrganizationAndMembers();
    setFeedback({ type: "success", text: "Ownership transferred successfully!" });
    setTimeout(() => {
      setFeedback(null);
      closeModal();
    }, 1500);
    setIsTransferring(null);
  }

  
  if (!organization && isLoading) return <Signup_Loading />;
  if (error) return <Crash message={error} />;
  if (!organization) return null;
  if (organization.level !== 4) return null; 

  return (
    <>
      {}
      <button
        onClick={openModal}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
      >
        <Crown className="h-4 w-4" />
        Transfer Ownership
      </button>

      {}
      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md open:animate-fadeIn"
        style={{ maxWidth: "90vw", width: "32rem", backgroundColor: "transparent", margin: "auto", position: "fixed", inset: 0 }}
      >
        <div className="relative max-h-[85vh] overflow-y-auto p-6 md:p-8">
          {}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          {}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 rounded-full p-1 text-text-gray/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {}
          <h2
            className="mb-4 text-2xl font-bold md:text-3xl pr-8"
            style={{
              background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Transfer Ownership
          </h2>
          <p className="mb-6 text-sm text-text-gray">
            Transfer organisation ownership to another member. You will become an admin (level 3) and the selected member will become owner (level 4).
          </p>

          {}
          {feedback && (
            <div
              className={`mb-4 rounded-xl border p-2 text-center text-sm ${
                feedback.type === "success"
                  ? "border-green-500/30 bg-green-500/5 text-green-400"
                  : "border-red-500/30 bg-red-500/5 text-red-400"
              }`}
            >
              {feedback.text}
            </div>
          )}

          {}
          {members.length === 0 ? (
            <p className="py-8 text-center text-text-gray/60">No other members to transfer ownership to.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {members.map((member) => (
                <li key={member.user_id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-text-light">{member.name}</p>
                    <p className="text-xs text-text-gray/70">{member.email}</p>
                  </div>
                  <button
                    onClick={() => transferOwnership(member.user_id)}
                    disabled={isTransferring === member.user_id}
                    className="rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition hover:scale-105 hover:bg-primary/30 disabled:opacity-50"
                  >
                    {isTransferring === member.user_id ? "Transferring..." : "Make Owner"}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-secondary/5 blur-3xl" />
          </div>
        </div>
      </dialog>
    </>
  );
}
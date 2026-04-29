"use client";

import { supabase } from "@/lib/supabase/client-side";
import { useEffect, useState, useRef } from "react";
import { UserPlus, X, Search } from "lucide-react";

import "@/app/globals.css";

import Signup_Loading from "../../Signup/Signup_Loading";
import Crash from "../../utils/Crash";

interface UserSearch {
  name: string;
  id: string;
  email: string;
}

export default function InviteUsers_Button({ organization_id, user_id }: { organization_id: string, user_id: string }) {
  const [isLoading, setLoading] = useState(true);
  const [crash, setCrash] = useState(false);
  const [allUsers, setAllUsers] = useState<UserSearch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  async function getAllUsers() {
  try {

    const { data: allUsersData, error: allUsersError } = await supabase
      .from("User_Metadata")
      .select("user_id, first_name, last_name, email");
    if (allUsersError || !allUsersData) throw new Error("Failed to fetch users");

    const formatted: UserSearch[] = allUsersData.map((u) => ({
      name: `${u.first_name} ${u.last_name}`,
      id: u.user_id,
      email: u.email,
    }));


    const { data: orgData, error: orgError } = await supabase
      .from("Organizations")
      .select("users")
      .eq("organization_id", organization_id)
      .single();

    if (orgError || !orgData) throw new Error("Failed to fetch organization members");


    const memberIds: string[] = [];
    if (orgData.users && Array.isArray(orgData.users)) {
      for (const entry of orgData.users) {
        try {
          const parsed = typeof entry === "string" ? JSON.parse(entry) : entry;
          if (parsed.user_id) memberIds.push(parsed.user_id);
        } catch (err) {
          console.warn("Failed to parse user entry:", entry);
        }
      }
    }


    const availableUsers = formatted.filter(
      (u) => !memberIds.includes(u.id) && u.id !== user_id
    );

    setAllUsers(availableUsers);
  } catch (err) {
    console.error(err);
    setCrash(true);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    getAllUsers();
  }, []);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function sendInvite(userId: string) {
    setInvitingUserId(userId);
    setFeedback(null);


    const { data: targetUser, error: fetchError } = await supabase
      .from("User_Metadata")
      .select("invite_requests")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      setFeedback({ type: "error", text: "Could not fetch user data." });
      setInvitingUserId(null);
      return;
    }

    const existingRequests = targetUser?.invite_requests ?? [];
    if (existingRequests.includes(organization_id)) {
      setFeedback({ type: "error", text: "Already invited this user." });
      setInvitingUserId(null);
      return;
    }

    const updatedRequests = [...existingRequests, organization_id];


    const { error: updateError } = await supabase
      .from("User_Metadata")
      .update({ invite_requests: updatedRequests })
      .eq("user_id", userId);

    if (updateError) {
      setFeedback({ type: "error", text: "Failed to send invite." });
    } else {
      setFeedback({ type: "success", text: "Invite sent!" });
    }
    setInvitingUserId(null);
    setTimeout(() => setFeedback(null), 3000);
  }

  if (isLoading) return <Signup_Loading />;
  if (crash) return <Crash message="Sorry, failed to load users." />;

  return (
    <>

      <button
        onClick={openModal}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
      >
        <UserPlus className="h-4 w-4" />
        Invite Member
      </button>


      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md open:animate-fadeIn"
        style={{ maxWidth: "90vw", width: "32rem", backgroundColor: "transparent", margin: "auto", position: "fixed", inset: 0 }}
      >
        <div className="relative max-h-[85vh] overflow-y-auto p-6 md:p-8">

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />


          <button
            onClick={closeModal}
            className="absolute right-4 top-4 rounded-full p-1 text-text-gray/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>


          <h2
            className="mb-4 text-2xl font-bold md:text-3xl pr-8"
            style={{
              background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Invite Members
          </h2>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-gray/60" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-9 pr-3 text-text-light placeholder-text-gray/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>


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


          {filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-text-gray/60">No users found.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-text-light">{user.name}</p>
                    <p className="text-xs text-text-gray/70">{user.email}</p>
                  </div>
                  <button
                    onClick={() => sendInvite(user.id)}
                    disabled={invitingUserId === user.id}
                    className="rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition hover:scale-105 hover:bg-primary/30 disabled:opacity-50"
                  >
                    {invitingUserId === user.id ? "Sending..." : "Send Invite"}
                  </button>
                </li>
              ))}
            </ul>
          )}


          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-secondary/5 blur-3xl" />
          </div>
        </div>
      </dialog>
    </>
  );
}
"use client";

import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client-side";
import "@/app/globals.css";
import { Organizations, Vendor, Inventory, Assigned_Tasks } from "../../utils/type";
import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";

export default function CreateOrganization({ user }: { user: User }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [organizationName, setOrganizationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const handleSubmit = async () => {
  setError(null);
  if (!organizationName.trim()) {
    setError("Organization name is required.");
    return;
  }
  setIsSubmitting(true);

  
  const memberJson = JSON.stringify({
    user_id: user.id,
    level: 4, 
  });

  
  const InsertLog = {
    organization_name: organizationName,
    created_by: user.id,
    owner_id: user.id,
    users: [memberJson],               
    recipe_references: [],           
    vendor: [],                        
    inventory: [],                     
    assigned_tasks: [],                
  };

  
  const { data: orgData, error: insertOrgError } = await supabase
    .from("Organizations")
    .insert(InsertLog)
    .select();

  if (insertOrgError || !orgData || orgData.length === 0) {
    setError(insertOrgError?.message || "Failed to create organization.");
    setIsSubmitting(false);
    return;
  }

  
  const newOrgId = orgData[0].organization_id;
  console.log("New organization ID:", newOrgId);

  
  const { data: userData, error: fetchUserError } = await supabase
    .from("User_Metadata")
    .select("organizations_member")
    .eq("user_id", user.id)
    .single();

  let existingOrgs: string[] = [];
  if (fetchUserError && fetchUserError.code !== "PGRST116") {
    setError(fetchUserError.message);
    setIsSubmitting(false);
    return;
  }
  if (userData?.organizations_member) {
    existingOrgs = userData.organizations_member;
  }

  const updatedOrgs = [...existingOrgs, newOrgId];

  
  const { error: updateError } = await supabase
    .from("User_Metadata")
    .update({ organizations_member: updatedOrgs })
    .eq("user_id", user.id);          

  if (updateError) {
    setError(updateError.message);
    setIsSubmitting(false);
    return;
  }

  alert("Organization created successfully!");
  closeModal();
  
   window.location.reload();
};

  return (
    <>
      {}
      <button
        onClick={openModal}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-dark px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
      >
        <Plus className="h-4 w-4" />
        Create Organization
      </button>

      {}
      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md open:animate-fadeIn"
        style={{ maxWidth: "90vw", width: "28rem", backgroundColor: "transparent", margin: "auto", position: "fixed", inset: 0 }}
      >
        <div className="relative p-6 md:p-8">
          {}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="space-y-6">
            {}
            <h2
              className="text-2xl font-bold md:text-3xl"
              style={{
                background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Create New Organization
            </h2>

            {}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-text-gray">Organization Name *</label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Acme Kitchen"
                />
              </div>

              {}
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-text-gray/70">
                <p>You will be the owner of this organization. Additional members, inventory, and tasks can be added later.</p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-center">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !organizationName.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-primary to-dark py-2.5 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2.5 font-semibold text-text-gray transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-secondary/5 blur-3xl" />
          </div>

          {}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 rounded-full p-1 text-text-gray/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </dialog>
    </>
  );
}
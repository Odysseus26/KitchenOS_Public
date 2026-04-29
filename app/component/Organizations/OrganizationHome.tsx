"use client";

import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Organizations } from "../utils/type";
import { supabase } from "@/lib/supabase/client-side";
import "@/app/globals.css";
import { Building2, ChevronRight } from "lucide-react";

import Signup_Loading from "../Signup/Signup_Loading";
import Crash from "../utils/Crash";
import Organization_Prepare from "./Organization_Prepare";

import CreateOrganization from "./ui/Organization_Add";

interface PresentOrganization {
  organization_name: string;
  organization_id: string;
}

export default function OrganizationHome({ user }: { user: User }) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [didCrash, setCrash] = useState<boolean>(false);
  const [organizationOptions, setOptions] = useState<PresentOrganization[]>([]);
  const [didSelect, setSelect] = useState<boolean>(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");

  async function backend_OrganizationCatch() {
  
  const { data: userData, error: fetchError } = await supabase
    .from("User_Metadata")
    .select("organizations_member")
    .eq("user_id", user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    setCrash(true);
    return;
  }

  const storedOrgIds: string[] = userData?.organizations_member ?? [];
  if (storedOrgIds.length === 0) {
    setOptions([]);
    setLoading(false);
    return;
  }

  
  const { data: orgInfo, error: orgError } = await supabase
    .from("Organizations")
    .select("organization_id, organization_name")
    .in("organization_id", storedOrgIds);

  if (orgError) {
    setCrash(true);
    return;
  }

  
  if (!orgInfo || orgInfo.length === 0) {
    const { error: updateError } = await supabase
      .from("User_Metadata")
      .update({ organizations_member: [] })
      .eq("user_id", user.id);
    if (updateError) {
      setCrash(true);
      return;
    }
    setOptions([]);
    setLoading(false);
    return;
  }

  
  const existingIds = orgInfo.map(org => org.organization_id);

  
  const needsUpdate =
    storedOrgIds.length !== existingIds.length ||
    !storedOrgIds.every(id => existingIds.includes(id));

  if (needsUpdate) {
    const { error: updateError } = await supabase
      .from("User_Metadata")
      .update({ organizations_member: existingIds })
      .eq("user_id", user.id);
    if (updateError) {
      setCrash(true);
      return;
    }
  }

  
  setOptions(orgInfo);
  setLoading(false);
}

  useEffect(() => {
    backend_OrganizationCatch();
  }, [user.id]);

  const handleSelect = (id: string) => {
    setSelectedOrganizationId(id);
    setSelect(true);
  };

  if (didCrash) {
    return <Crash message="Oh no! Something went wrong trying to fetch your organizations. Try Again!" />;
  }

  if (isLoading) {
    return <Signup_Loading />;
  }

  
  if (!didSelect) {
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

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">
          <div className="w-full max-w-4xl text-center">
            <h1
              className="mb-4 text-4xl font-bold md:text-5xl"
              style={{
                background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR), var(--THIRD_COLOR))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% auto",
                animation: "gradient 6s linear infinite",
              }}
            >
              Your Organizations
            </h1>
            <p className="mb-12 text-text-gray text-lg">Select one to continue</p>

            <div className="flex justify-center">
                <CreateOrganization user={user} />
            </div>

            <br></br>

            {organizationOptions.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl text-center">
                <Building2 className="mx-auto h-12 w-12 text-text-gray/50 mb-3" />
                <p className="text-text-gray">You are not a member of any organization yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {organizationOptions.map((org) => (
                  <button
                    key={org.organization_id}
                    onClick={() => handleSelect(org.organization_id)}
                    className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10 text-left w-full"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary/20 group-hover:scale-110">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-light">{org.organization_name}</p>
                        <p className="text-xs text-text-gray/70">Organization</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-text-gray/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  
  return <Organization_Prepare user={user} organization_id={selectedOrganizationId} />;
}
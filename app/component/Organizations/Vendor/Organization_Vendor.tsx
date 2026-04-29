"use client";

import { User_Organization, Vendor, Public_Facing_Info } from "../../utils/type";
import { OrganizationDetails } from "../../utils/FetchOrganization";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client-side";
import { Plus, Trash2, Edit, Building2, MapPin, Package, X } from "lucide-react";
import "@/app/globals.css";
import { useRouter } from "next/navigation";

import Signup_Loading from "../../Signup/Signup_Loading";
import Crash from "../../utils/Crash";

export default function Organisation_Vendor({ organization_details }: { organization_details: Public_Facing_Info }) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [crash, setCrash] = useState<boolean>(false);
  const [organization, setOrganization] = useState<User_Organization | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);

  
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [vendorName, setVendorName] = useState("");
  const [vendorLocation, setVendorLocation] = useState("");
  const [itemsInput, setItemsInput] = useState(""); 

  async function fetchOrganizationAndVendors() {
    try {
      const org = await OrganizationDetails(organization_details.organization_id, organization_details.user.id);
      setOrganization(org);
      setVendors(org.vendor || []);
      if(org.level == 0){
        useRouter().push("/Homepage")
      }
    } catch (err) {
      console.error(err);
      setCrash(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrganizationAndVendors();
  }, [organization_details.organization_id, organization_details.user.id]);

  const permissions = {
    allowed_edit: (organization?.level ?? 0) >= 3,
    allowed_delete: (organization?.level ?? 0) >= 3,
    allowed_create: (organization?.level ?? 0) >= 3,
  };

  
  const getItemsArray = (input: string): string[] =>
    input.split(",").map(s => s.trim()).filter(s => s.length > 0);

  async function saveVendor() {
    if (!vendorName.trim() || !organization) return;
    const items = getItemsArray(itemsInput);
    const newVendor: Vendor = {
      vendor_name: vendorName.trim(),
      location: vendorLocation.trim() || null,
      items_found_there: items,
    };

    let newVendors: Vendor[];
    if (editingVendor) {
      newVendors = vendors.map(v =>
        v.vendor_name === editingVendor.vendor_name &&
        v.location === editingVendor.location &&
        JSON.stringify(v.items_found_there) === JSON.stringify(editingVendor.items_found_there)
          ? newVendor
          : v
      );
    } else {
      newVendors = [...vendors, newVendor];
    }

    const { error: updateError } = await supabase
      .from("Organizations")
      .update({ vendor: newVendors })
      .eq("organization_id", organization.organization_id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setVendors(newVendors);
    resetForm();
    setShowModal(false);
  }

  async function deleteVendor(vendorToDelete: Vendor) {
    if (!confirm(`Delete vendor "${vendorToDelete.vendor_name}"?`)) return;
    if (!organization) return;
    const newVendors = vendors.filter(v =>
      !(v.vendor_name === vendorToDelete.vendor_name &&
        v.location === vendorToDelete.location &&
        JSON.stringify(v.items_found_there) === JSON.stringify(vendorToDelete.items_found_there))
    );
    const { error: updateError } = await supabase
      .from("Organizations")
      .update({ vendor: newVendors })
      .eq("organization_id", organization.organization_id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setVendors(newVendors);
  }

  const resetForm = () => {
    setEditingVendor(null);
    setVendorName("");
    setVendorLocation("");
    setItemsInput("");
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setVendorName(vendor.vendor_name);
    setVendorLocation(vendor.location || "");
    setItemsInput(vendor.items_found_there.join(", "));
    setShowModal(true);
  };

  if (isLoading) return <Signup_Loading />;
  if (crash || !organization) return <Crash message="Something went wrong retrieving your Vendors. Try again." />;

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
            <Building2 className="h-4 w-4" />
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
            Vendors
          </h2>
          <p className="mt-3 text-text-gray text-lg">
            Manage your suppliers and the items they provide
          </p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-center max-w-md mx-auto">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {}
        {permissions.allowed_create && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              Add Vendor
            </button>
          </div>
        )}

        {}
        {vendors.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl text-center max-w-md mx-auto">
            <Building2 className="mx-auto h-12 w-12 text-text-gray/50 mb-3" />
            <p className="text-text-gray">No vendors added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vendors.map((vendor, idx) => (
              <div
                key={`${vendor.vendor_name}-${idx}`}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-light">{vendor.vendor_name}</h3>
                    {vendor.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-text-gray/70">
                        <MapPin className="h-3 w-3" />
                        <span>{vendor.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {permissions.allowed_edit && (
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="text-text-gray/60 hover:text-primary transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {permissions.allowed_delete && (
                      <button
                        onClick={() => deleteVendor(vendor)}
                        className="text-text-gray/60 hover:text-red-400 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-xs font-medium text-primary mb-1">
                    <Package className="h-3 w-3" />
                    <span>Items provided</span>
                  </div>
                  {vendor.items_found_there.length === 0 ? (
                    <p className="text-xs text-text-gray/60">No items listed</p>
                  ) : (
                    <ul className="list-disc list-inside text-xs text-text-gray/90 space-y-0.5">
                      {vendor.items_found_there.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="pointer-events-none absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-primary/10 blur-xl" />
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <h2 className="text-2xl font-bold mb-4" style={{ background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {editingVendor ? "Edit Vendor" : "Add Vendor"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-text-gray">Vendor name *</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none"
                  placeholder="e.g., Acme Supplies"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-gray">Location (optional)</label>
                <input
                  type="text"
                  value={vendorLocation}
                  onChange={(e) => setVendorLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-gray">Items provided (comma-separated) *</label>
                <input
                  type="text"
                  value={itemsInput}
                  onChange={(e) => setItemsInput(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none"
                  placeholder="e.g., Flour, Sugar, Spices"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveVendor} className="flex-1 rounded-xl bg-gradient-to-r from-primary to-dark py-2 font-semibold text-white transition hover:scale-[1.02]">
                  {editingVendor ? "Save Changes" : "Add Vendor"}
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2 font-semibold text-text-gray transition hover:bg-white/10">
                  Cancel
                </button>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-secondary/5 blur-3xl" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
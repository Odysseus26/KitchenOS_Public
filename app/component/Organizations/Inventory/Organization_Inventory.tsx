"use client";

import { useState, useEffect } from "react";
import { User_Organization, Inventory, Public_Facing_Info } from "../../utils/type";
import { supabase } from "@/lib/supabase/client-side";
import { Plus, Trash2, Edit, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

import Crash from "../../utils/Crash";
import Signup_Loading from "../../Signup/Signup_Loading";
import { OrganizationDetails } from "../../utils/FetchOrganization";

export default function Organisation_Inventory({ organization_details }: { organization_details: Public_Facing_Info }) {
  const [organization, setOrganization] = useState<User_Organization | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [didCrash, setCrash] = useState(false);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState<number>(0);

  
  async function fetchOrganization() {
    try {
      const org = await OrganizationDetails(
        organization_details.organization_id,
        organization_details.user.id
      );
      setOrganization(org);
      if(org.level == 0){
        router.push("/Homepage")
      }
      return org;
    } catch (err) {
      console.error(err);
      setCrash(true);
      setLoading(false);
      throw err;
    }
  }

  
  async function fetchInventory(orgId: string) {
    try {
      const { data, error: fetchError } = await supabase
        .from("Organizations")
        .select("inventory")
        .eq("organization_id", orgId)
        .single();
      if (fetchError) throw fetchError;
      setInventory(data?.inventory ?? []);
    } catch (err) {
      console.error(err);
      setCrash(true);
    } finally {
      setLoading(false);
    }
  }

  
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const org = await fetchOrganization();
        if (org) {
          await fetchInventory(org.organization_id);
        }
      } catch (err) {
        
      }
    }
    init();
  }, [organization_details.organization_id, organization_details.user.id]);

  
  const userLevel = organization?.level ?? 0;
  const canEdit = userLevel >= 3;
  const canDelete = userLevel >= 3;
  const canAdd = userLevel >= 3;

  async function saveItem() {
    if (!itemName.trim() || !organization) return;
    let newInventory = [...inventory];
    if (editingItem) {
      const index = newInventory.findIndex(i => i.item_name === editingItem.item_name);
      if (index !== -1) {
        newInventory[index] = { item_name: itemName, amount: itemAmount };
      }
    } else {
      newInventory.push({ item_name: itemName, amount: itemAmount });
    }
    const { error: updateError } = await supabase
      .from("Organizations")
      .update({ inventory: newInventory })
      .eq("organization_id", organization.organization_id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setInventory(newInventory);
    setShowModal(false);
    setEditingItem(null);
    setItemName("");
    setItemAmount(0);
  }

  async function deleteItem(itemName: string) {
    if (!confirm(`Delete "${itemName}"?`) || !organization) return;
    const newInventory = inventory.filter(i => i.item_name !== itemName);
    const { error: updateError } = await supabase
      .from("Organizations")
      .update({ inventory: newInventory })
      .eq("organization_id", organization.organization_id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setInventory(newInventory);
  }

  if (didCrash) return <Crash message="Something went wrong! Try again later." />;
  if (isLoading || !organization) return <Signup_Loading />;

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
            <Package className="h-4 w-4" />
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
            Inventory
          </h2>
          <p className="mt-3 text-text-gray text-lg">
            Manage your kitchen stock
          </p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-center max-w-md mx-auto">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {}
        {canAdd && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => {
                setEditingItem(null);
                setItemName("");
                setItemAmount(0);
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>
        )}

        {}
        {inventory.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl text-center max-w-md mx-auto">
            <Package className="mx-auto h-12 w-12 text-text-gray/50 mb-3" />
            <p className="text-text-gray">No inventory items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventory.map((item) => (
              <div
                key={item.item_name}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-text-light">{item.item_name}</h3>
                  <div className="flex gap-1">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setItemName(item.item_name);
                          setItemAmount(item.amount);
                          setShowModal(true);
                        }}
                        className="text-text-gray/60 hover:text-primary transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => deleteItem(item.item_name)}
                        className="text-text-gray/60 hover:text-red-400 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-primary">{item.amount}</p>
                <p className="text-xs text-text-gray/60 mt-1">units in stock</p>
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
              {editingItem ? "Edit Item" : "Add Item"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-text-gray">Item name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none"
                  placeholder="e.g., Flour"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-gray">Amount (units)</label>
                <input
                  type="number"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none"
                  placeholder="e.g., 10"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveItem} className="flex-1 rounded-xl bg-gradient-to-r from-primary to-dark py-2 font-semibold text-white transition hover:scale-[1.02]">
                  {editingItem ? "Save Changes" : "Add Item"}
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
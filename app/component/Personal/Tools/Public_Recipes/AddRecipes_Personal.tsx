"use client";

import "@/app/globals.css";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@/app/component/utils/type";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client-side";
import { getPersonal_Recipes } from "@/app/component/utils/FetchRecipeList";

export default function AddPublicRecipe({
  user,
  organization = null,
  recipes,
}: {
  user: User;
  organization: string | null;
  recipes: Recipe[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"choose" | "confirm">("choose");
  const [destination, setDestination] = useState<"personal" | "organization" | null>(null);

  
  const openModal = () => {
    setStep("choose");
    setDestination(null);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleChoose = (dest: "personal" | "organization") => {
    setDestination(dest);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (destination === "personal") {
      await addToPersonal();
    } else if (destination === "organization") {
      await addToOrganization();
    }
    closeModal();
  };

  
  
  async function addToPersonal() {
    try {
        
        const existingRecipeIds: string[] = await getPersonal_Recipes(user.id);
        
        
        const newRecipeIds = recipes.map((recipe) => recipe.recipe_id);
        
        
        const combined = [...existingRecipeIds, ...newRecipeIds];
        const uniqueRecipeIds = Array.from(new Set(combined));
        
        
        const { error } = await supabase
        .from("User_Metadata")
        .update({ recipe_references: uniqueRecipeIds })
        .eq("user_id", user.id);
        
        if (error) throw error;
        
        
        alert("Added to Personal Library!");
        window.location.reload();
    } catch (err) {
        console.error("Error adding to personal library:", err);
        alert("Failed to add recipes to your personal library. Please try again.");
    }
    }

  async function addToOrganization() {
    console.log("Adding to Organization:", recipes);
    alert(`Add ${recipes.length} recipe(s) to Organization (function not yet implemented)`);
  }
  

  
  if (recipes.length === 0) return null;

  return (
    <>
      {}
      <button
        onClick={openModal}
        className="rounded-lg bg-gradient-to-r from-primary to-dark px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-primary/25"
      >
        Add Selected Recipes ({recipes.length})
      </button>

      {}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            {step === "choose" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-text-light">Where to add these recipes?</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleChoose("personal")}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.04] py-3 text-text-light transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    Personal Library
                  </button>
                  {organization !== null && (
                    <button
                      onClick={() => handleChoose("organization")}
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] py-3 text-text-light transition hover:border-primary/30 hover:bg-primary/5"
                    >
                      Organization: {organization}
                    </button>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="w-full rounded-xl border border-white/20 bg-white/5 py-2 text-sm text-text-gray transition hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            )}

            {step === "confirm" && destination && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-text-light">Confirm addition</h3>
                  <p className="mt-2 text-sm text-text-gray">
                    Add <span className="font-medium text-primary">{recipes.length}</span> recipe(s) to:
                  </p>
                  <p className="mt-1 text-base font-medium text-text-light">
                    {destination === "personal" ? "Personal Library" : `Organization "${organization}"`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirm}
                    className="flex-1 rounded-xl bg-gradient-to-r from-primary to-dark py-2 font-semibold text-white transition hover:scale-[1.02]"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setStep("choose")}
                    className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2 font-semibold text-text-gray transition hover:bg-white/10"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-secondary/5 blur-3xl" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
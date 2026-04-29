"use client";

import "@/app/globals.css";
import { useState, useRef, useEffect } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client-side";
import { Recipe, Ingredient, Step, Difficulty } from "@/app/component/utils/type";

export default function Recipe_EditButton({
  recipe,
  user,
  allowed_public = false,
}: {
  recipe: Recipe;
  user: User;
  allowed_public: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description || "");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | null>(recipe.prep_time_minutes);
  const [cookTimeMinutes, setCookTimeMinutes] = useState<number | null>(recipe.cook_time_minutes);
  const [servings, setServings] = useState<number>(recipe.servings);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(recipe.difficulty);
  const [tags, setTags] = useState(recipe.tags?.join(", ") || "");
  const [isPublic, setIsPublic] = useState(recipe.is_public);
  const [ingredients, setIngredients] = useState<Ingredient[]>([...recipe.ingredients]);
  const [steps, setSteps] = useState<Step[]>([...recipe.steps]);

  
  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: 0, type_amount: "", vendor: "" }]);
  };
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  
  const addStep = () => {
    setSteps([...steps, { desc: "", notes: [] }]);
  };
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };
  const updateStepDesc = (index: number, desc: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], desc };
    setSteps(updated);
  };

  const handleSave = async () => {
    setSubmitError(null);

    if (!title.trim()) {
      setSubmitError("Title is required.");
      return;
    }

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedRecipe = {
      title,
      description: description || null,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
      ingredients,
      steps,
      tags: tagArray.length ? tagArray : null,
      prep_time_minutes: prepTimeMinutes,
      cook_time_minutes: cookTimeMinutes,
      servings,
      difficulty,
      is_public: isPublic,
    };

    setIsSubmitting(true);

    const { error } = await supabase
      .from("Recipes")
      .update(updatedRecipe)
      .eq("recipe_id", recipe.recipe_id);

    if (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
      return;
    }

    alert("Recipe updated successfully!");
    window.location.reload();
  };

  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <>
      {}
      <button
        onClick={openDialog}
        className="group flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-200 hover:scale-110 hover:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="Edit recipe"
      >
        <Edit className="h-4 w-4" />
      </button>

      {}
      <dialog
  ref={dialogRef}
  className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md open:animate-fadeIn"
  style={{
    maxWidth: "90vw",
    width: "56rem",
    backgroundColor: "transparent",
    margin: "auto",        
    position: "fixed",
    inset: 0,
  }}
>
        <div className="relative max-h-[85vh] overflow-y-auto p-6 md:p-8">
          {}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <h2
            className="mb-6 text-2xl font-bold md:text-3xl"
            style={{
              background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Edit Recipe
          </h2>

          <div className="space-y-6">
            {}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-primary">Basic Info</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-text-gray">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-text-gray">
                    Description <span className="text-xs text-text-gray/50">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-primary">Time & Servings</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm text-text-gray">Prep (min) (optional)</label>
                  <input
                    type="number"
                    value={prepTimeMinutes ?? ""}
                    onChange={(e) => setPrepTimeMinutes(e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-gray">Cook (min) (optional)</label>
                  <input
                    type="number"
                    value={cookTimeMinutes ?? ""}
                    onChange={(e) => setCookTimeMinutes(e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-gray">Servings</label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value) || 1)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light"
                  />
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-text-gray">Difficulty (optional)</label>
                <select
                  value={difficulty ?? ""}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty || null)}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light"
                >
                  <option value="">Select</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-gray">Tags (comma‑separated, optional)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light"
                />
              </div>
            </div>

            {}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">Ingredients</h3>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="rounded-lg bg-primary/20 px-3 py-1 text-xs text-primary hover:bg-primary/30"
                >
                  + Add
                </button>
              </div>
              {ingredients.map((ing, idx) => (
                <div key={idx} className="mb-3 rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                        placeholder="Name"
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        value={ing.amount}
                        onChange={(e) => updateIngredient(idx, "amount", parseFloat(e.target.value) || 0)}
                        placeholder="Amount"
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={ing.type_amount}
                        onChange={(e) => updateIngredient(idx, "type_amount", e.target.value)}
                        placeholder="Unit"
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={ing.vendor}
                        onChange={(e) => updateIngredient(idx, "vendor", e.target.value)}
                        placeholder="Vendor (optional)"
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button onClick={() => removeIngredient(idx)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {ingredients.length === 0 && (
                <p className="text-xs text-text-gray/50">No ingredients. Click "+ Add" to start.</p>
              )}
            </div>

            {}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">Steps</h3>
                <button
                  type="button"
                  onClick={addStep}
                  className="rounded-lg bg-primary/20 px-3 py-1 text-xs text-primary hover:bg-primary/30"
                >
                  + Add
                </button>
              </div>
              {steps.map((step, idx) => (
                <div key={idx} className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 p-3">
                  <textarea
                    value={step.desc}
                    onChange={(e) => updateStepDesc(idx, e.target.value)}
                    rows={1}
                    placeholder={`Step ${idx + 1}`}
                    className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light"
                  />
                  <button onClick={() => removeStep(idx)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {steps.length === 0 && (
                <p className="text-xs text-text-gray/50">No steps yet. Click "+ Add" to start.</p>
              )}
            </div>

            {}
            {allowed_public && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary"
                />
                <label htmlFor="isPublic" className="text-sm text-text-gray">
                  Make this recipe public (visible to everyone)
                </label>
              </div>
            )}

            {submitError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-center">
                <p className="text-sm text-red-400">{submitError}</p>
              </div>
            )}

            {}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-dark py-2.5 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={closeDialog}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2.5 font-semibold text-text-gray transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>

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
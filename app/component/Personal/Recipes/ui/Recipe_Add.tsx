"use client";

import "@/app/globals.css";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Ingredient, Step, Difficulty } from "@/app/component/utils/type";
import { supabase } from "@/lib/supabase/client-side";
import { getPersonal_Recipes, getOrganizationalRecipes } from "@/app/component/utils/FetchRecipeList";
import { Organizations } from "@/app/component/utils/type";

import Crash from "@/app/component/utils/Crash";

export default function RecipeCard_Add({ 
  user, 
  onEnd = () => {},
  organization = null
}: { 
  user: User; 
  onEnd?: (input: string) => void;
  organization: Organizations | null
}){
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | null>(null);
  const [cookTimeMinutes, setCookTimeMinutes] = useState<number | null>(null);
  const [servings, setServings] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [tags, setTags] = useState(""); 
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", amount: 0, type_amount: "", vendor: "" },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
  setSubmitError(null);
  if (!title.trim()) {
    setSubmitError("Title is required.");
    return;
  }
  setIsSubmitting(true);

  const tagArray = tags.split(",").map(t => t.trim()).filter(t => t.length > 0);

  const recipeData = {
    title,
    description: description || null,
    created_by: user.id,
    ingredients,
    steps,
    tags: tagArray.length ? tagArray : null,
    prep_time_minutes: prepTimeMinutes,
    cook_time_minutes: cookTimeMinutes,
    servings,
    difficulty,
    is_public: isPublic,
  };

  
  const { data, error } = await supabase
    .from("Recipes")
    .insert(recipeData)
    .select();

  if (error || !data || data.length === 0) {
    setSubmitError(error?.message || "Failed to create recipe.");
    setIsSubmitting(false);
    return;
  }

  const recipeId = data[0].recipe_id;

  
  if(organization==null){
    const prevRecipes = await getPersonal_Recipes(user.id); 
    const newRecipes = [...prevRecipes,recipeId];

    
    
    const { error: updateError } = await supabase
      .from("User_Metadata")
      .update({ recipe_references: newRecipes })
      .eq("user_id", user.id);   

    if (updateError) {
      console.error("Update error:", updateError);
      setSubmitError(updateError.message);
      setIsSubmitting(false);
      return;
    }
  }else{
    const prevRecipes = await getOrganizationalRecipes(organization.organization_id);
    const prevIds = prevRecipes.map(r => r.recipe_id);
    const newRecipes = [recipeId, ...prevIds];

    const {error:updateError} = await supabase.from("Organizations")
    .update({recipe_references: newRecipes})
    .eq("organization_id",organization.organization_id);

    if (updateError) {
      console.error("Update error:", updateError);
      setSubmitError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    

  }

  if (onEnd) onEnd(recipeId);
  alert("Recipe created successfully!");
  if(organization == null) window.location.reload();   
};

  

  return (
    <>
      {}
      <div
        onClick={handleOpenModal}
        className="group relative flex w-48 cursor-pointer flex-col items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0a0a0a] p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10"
        style={{ aspectRatio: "2 / 3" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 transition-all duration-300 group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20">
            <Plus className="h-7 w-7 text-primary" strokeWidth={2} />
          </div>
        </div>
        <div className="w-full text-center">
          <p className="text-sm font-medium text-text-light">New Recipe</p>
          <p className="mt-0.5 text-xs text-text-gray">Create your own</p>
        </div>
        <div className="pointer-events-none absolute -bottom-1 -right-1 h-12 w-12 rounded-full bg-primary/10 blur-xl" />
      </div>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleCloseModal}
          />
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl md:p-8">
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
              New Recipe
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
                      placeholder="e.g., Creamy Garlic Pasta"
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
                      placeholder="A quick and delicious recipe..."
                    />
                  </div>
                </div>
              </div>

              {}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-primary">Time & Servings</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm text-text-gray">
                      Prep (min) <span className="text-xs text-text-gray/50">(optional)</span>
                    </label>
                    <input
                      type="number"
                      value={prepTimeMinutes ?? ""}
                      onChange={(e) => setPrepTimeMinutes(e.target.value ? Number(e.target.value) : null)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-text-gray">
                      Cook (min) <span className="text-xs text-text-gray/50">(optional)</span>
                    </label>
                    <input
                      type="number"
                      value={cookTimeMinutes ?? ""}
                      onChange={(e) => setCookTimeMinutes(e.target.value ? Number(e.target.value) : null)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-text-gray">
                      Servings <span className="text-xs text-text-gray/50">(required)</span>
                    </label>
                    <input
                      type="number"
                      value={servings ?? ""}
                      onChange={(e) => setServings(e.target.value ? Number(e.target.value) : null)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="4"
                    />
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-text-gray">
                    Difficulty <span className="text-xs text-text-gray/50">(optional)</span>
                  </label>
                  <select
                    value={difficulty ?? ""}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty || null)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-gray">
                    Tags <span className="text-xs text-text-gray/50">(optional, comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="italian, pasta, quick"
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
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          value={ing.amount}
                          onChange={(e) => updateIngredient(idx, "amount", parseFloat(e.target.value) || 0)}
                          placeholder="Amount"
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={ing.type_amount}
                          onChange={(e) => updateIngredient(idx, "type_amount", e.target.value)}
                          placeholder="Unit (e.g., grams, cups, tbsp)"
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={ing.vendor}
                          onChange={(e) => updateIngredient(idx, "vendor", e.target.value)}
                          placeholder="Vendor (optional)"
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {ingredients.length === 0 && (
                  <p className="text-xs text-text-gray/50">No ingredients yet. Click "+ Add" to start.</p>
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
                    <div className="flex-1">
                      <textarea
                        value={step.desc}
                        onChange={(e) => updateStepDesc(idx, e.target.value)}
                        rows={1}
                        placeholder={`Step ${idx + 1}`}
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-text-light focus:border-primary focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {steps.length === 0 && (
                  <p className="text-xs text-text-gray/50">No steps yet. Click "+ Add" to start.</p>
                )}
              </div>

              {}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary"
                />
                <label htmlFor="public" className="text-sm text-text-gray">
                  Make this recipe public (visible to everyone)
                </label>
              </div>

              {}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-xl bg-gradient-to-r from-primary to-dark py-2.5 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
                >
                  Create Recipe
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2.5 font-semibold text-text-gray transition hover:bg-white/10 hover:text-white"
                >
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
    </>
  );
}
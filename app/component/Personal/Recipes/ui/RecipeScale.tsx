"use client";

import { ScaleInstructions } from "@/app/component/utils/Recipe_Scale";
import { Ingredient } from "@/app/component/utils/type";
import { useRef, useState } from "react";
import { Scale, X } from "lucide-react";

export default function RecipeScale_Button({ recipe_id }: { recipe_id: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [desiredServings, setDesiredServings] = useState<number | null>(null);
  const [scaledIngredients, setScaledIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setDesiredServings(null);
    setScaledIngredients([]);
    setError(null);
    dialogRef.current?.showModal();
  };

  const closeModal = () => dialogRef.current?.close();

  const handleFetch = async () => {
    if (!desiredServings || desiredServings <= 0) {
      setError("Please enter a positive number of servings.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const scaled = await ScaleInstructions(recipe_id, desiredServings);
      setScaledIngredients(scaled);
    } catch (err) {
      setError("Failed to scale ingredients. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {}
      <button
        onClick={openModal}
        className="group flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-200 hover:scale-110 hover:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="Scale recipe"
      >
        <Scale className="h-4 w-4" />
      </button>

      {}
      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md open:animate-fadeIn self-center justify-self-center-safe"
        style={{ maxWidth: "90vw", width: "32rem", backgroundColor: "transparent" }}
      >
        <div className="relative p-6 md:p-8">
          {}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="space-y-6">
            <h2
              className="text-2xl font-bold md:text-3xl"
              style={{
                background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Scale Recipe
            </h2>

            {scaledIngredients.length === 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-text-gray">
                    Desired number of servings
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={desiredServings ?? ""}
                    onChange={(e) => setDesiredServings(parseInt(e.target.value) || null)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g., 4"
                  />
                  {error && <p className="text-xs text-red-400">{error}</p>}
                </div>
                <button
                  onClick={handleFetch}
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-dark py-2.5 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {isLoading ? "Scaling..." : "Scale Ingredients"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-primary">
                    Scaled Ingredients (for {desiredServings} servings)
                  </h3>
                  {scaledIngredients.length === 0 ? (
                    <p className="text-sm text-text-gray/60">No ingredients to display.</p>
                  ) : (
                    <ul className="space-y-2">
                      {scaledIngredients.map((ing, idx) => (
                        <li key={idx} className="flex flex-wrap justify-between border-b border-white/10 pb-2 text-sm">
                          <span className="text-text-light">{ing.name}</span>
                          <span className="text-text-gray">
                            {Math.round(ing.amount * 10) / 10} {ing.type_amount}
                            {ing.vendor ? ` (${ing.vendor})` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => setScaledIngredients([])}
                  className="w-full rounded-xl border border-white/20 bg-white/5 py-2.5 font-semibold text-text-gray transition hover:bg-white/10 hover:text-white"
                >
                  Scale Another
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-text-gray/60 transition hover:text-white"
              >
                <X className="h-4 w-4" /> Close
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
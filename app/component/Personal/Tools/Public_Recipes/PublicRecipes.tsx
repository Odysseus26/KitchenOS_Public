"use client";

import "@/app/globals.css";
import { User } from "@supabase/supabase-js";
import { getPublicRecipes } from "@/app/component/utils/FetchRecipeList";
import { Recipe,  } from "@/app/component/utils/type";
import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";


import Signup_Loading from "@/app/component/Signup/Signup_Loading";
import Recipe_Card from "../../Recipes/ui/Recipe_Card";
import AddPublicRecipe from "./AddRecipes_Personal";

export default function PublicRecipes({
  user,
  organization = null,
}: {
  user: User;
  organization: string | null;
}) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchRecipes() {
    const state: Recipe[] = await getPublicRecipes();
    setRecipes(state);
    setLoading(false);
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    const query = searchQuery.toLowerCase().trim();
    return recipes.filter((recipe) => {
      
      if (recipe.title.toLowerCase().includes(query)) return true;
      
      if (recipe.description?.toLowerCase().includes(query)) return true;
      
      if (recipe.tags?.some((tag) => tag.toLowerCase().includes(query))) return true;
      
      if (recipe.ingredients?.some((ing) => ing.name.toLowerCase().includes(query))) return true;
      return false;
    });
  }, [recipes, searchQuery]);

  const toggleSelect = (recipe: Recipe) => {
    setSelectedRecipes((prev) => {
      const isAlreadySelected = prev.some((r) => r.recipe_id === recipe.recipe_id);
      if (isAlreadySelected) {
        return prev.filter((r) => r.recipe_id !== recipe.recipe_id);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const clearSearch = () => setSearchQuery("");

  if (isLoading) {
    return <Signup_Loading />;
  }

  const totalFound = filteredRecipes.length;
  const totalRecipes = recipes.length;

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
            Public Recipes
          </h2>
          <p className="mt-3 text-text-gray text-lg">
            Explore & select community recipes to add to your collection
          </p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>

        {}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-gray/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, tags, or ingredients..."
              className="w-full rounded-xl border border-white/15 bg-black/40 py-3 pl-12 pr-10 text-text-light placeholder-text-gray/50 backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray/70 hover:text-text-light"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-xs text-text-gray/60">
            {totalFound} of {totalRecipes} recipe{totalRecipes !== 1 && "s"} found
          </p>
        </div>

        {}
        {selectedRecipes.length > 0 && (
          <div className="sticky top-20 z-20 mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">
                {selectedRecipes.length}
              </div>
              <span className="text-sm text-text-light">
                recipe{selectedRecipes.length !== 1 && "s"} selected
              </span>
            </div>
            <AddPublicRecipe
              user={user}
              organization={organization}
              recipes={selectedRecipes}
            />
          </div>
        )}

        {}
        {filteredRecipes.length === 0 ? (
          <div className="text-center text-text-gray/60 py-12">
            <p>No recipes match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => {
              const isSelected = selectedRecipes.some(
                (r) => r.recipe_id === recipe.recipe_id
              );
              return (
                <div
                  key={recipe.recipe_id}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected ? "scale-[1.02] drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]" : ""
                  }`}
                  onClick={() => toggleSelect(recipe)}
                >
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-white/30 bg-black/50 text-transparent"
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <Recipe_Card
                    user={user}
                    recipe={recipe}
                    allowed_edit={false}
                    allowed_delete={false}
                    allowed_public={false}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
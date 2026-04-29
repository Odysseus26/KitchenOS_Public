"use client";

import { User } from "@supabase/supabase-js";
import "@/app/globals.css";
import { useEffect, useState } from "react";

import RecipeCard_Add from "./ui/Recipe_Add";
import Recipe_Card from "./ui/Recipe_Card";

import Fetch_PersonalRecipes from "./utils/Personal_RecipesFetch";
import Signup_Loading from "../../Signup/Signup_Loading";
import { Recipe } from "../../utils/type";

export default function Personal_RecipePage({ user }: { user: User }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [recipesList, setRecipes] = useState<Recipe[]>([]);

  
  useEffect(() => {
    async function loadRecipes() {
      setLoading(true);
      const recipes = await Fetch_PersonalRecipes({ user });
      setRecipes(recipes);
      setLoading(false);
    }
    loadRecipes();
  }, [user]); 

  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isLoading) {
    return <Signup_Loading />;
  }

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

      {}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {}
        <div
          className={`mb-12 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1
            className="text-4xl font-bold md:text-5xl lg:text-6xl"
            style={{
              background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR), var(--THIRD_COLOR))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% auto",
              animation: "gradient 6s linear infinite",
            }}
          >
            Your Recipe Collection
          </h1>
          <p className="mt-3 text-text-gray text-sm md:text-base">
            Create, organise and share your culinary masterpieces
          </p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {}
          <RecipeCard_Add user={user} organization={null}/>

          {}
          {recipesList.map((recipe) => (
            <Recipe_Card
              key={recipe.recipe_id}
              recipe={recipe}
              allowed_edit={true} 
              allowed_delete={true}
              allowed_public={true}
              user={user}
            />
          ))}
        </div>

        {}
        {recipesList.length === 0 && (
          <div className="mt-12 text-center text-text-gray/60">
            <p>You haven't created any recipes yet. Click the + button to get started!</p>
          </div>
        )}
      </div>
    </section>
  );
}
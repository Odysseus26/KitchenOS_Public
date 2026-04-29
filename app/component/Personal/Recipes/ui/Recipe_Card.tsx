"use client";

import "@/app/globals.css";
import { useState, useEffect } from "react";
import { Clock, Users, ChefHat, Tag, Eye, BookOpen, Flame } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@/app/component/utils/type";

import Recipe_DeleteButton from "./RecipeDelete";
import Recipe_EditButton from "./Recipe_Edit";
import RecipeScale_Button from "./RecipeScale";
import Recipe_ViewFull from "./Recipe_FullView"; 

import { FetchPerson } from "@/app/component/utils/FetchPerson";

export default function Recipe_Card({
  recipe,
  user,
  allowed_edit = false,
  allowed_delete = false,
  allowed_public = false,
}: {
  recipe: Recipe;
  user: User;
  allowed_edit: boolean;
  allowed_delete: boolean;
  allowed_public: boolean;
}) {
  const [creatorName, setCreatorName] = useState<string>("Loading...");
  const [updaterName, setUpdaterName] = useState<string | null>(null);

  
  useEffect(() => {
    async function loadCreator() {
      const name = await FetchPerson(recipe.created_by);
      setCreatorName(`${name.first_name} ${name.last_name}`);
    }
    loadCreator();
  }, [recipe.created_by]);

  
  useEffect(() => {
    if (recipe.updated_by) {
      async function loadUpdater() {
        const name = await FetchPerson(recipe.updated_by!);
        setUpdaterName(`${name.first_name} ${name.last_name}`);
      }
      loadUpdater();
    } else {
      setUpdaterName(null);
    }
  }, [recipe.updated_by]);

  
  const createdDate = new Date(recipe.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const updatedDate = recipe.updated_at
    ? new Date(recipe.updated_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10">
      {}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {}
      <div className="pointer-events-none absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-primary/10 blur-xl" />

      {}
      <div className="flex items-start justify-between gap-4 p-5 pb-3">
        <div>
          <h3 className="text-xl font-bold text-text-light line-clamp-1">{recipe.title}</h3>
          {recipe.description && (
            <p className="mt-1 text-sm text-text-gray line-clamp-2">{recipe.description}</p>
          )}
        </div>

        {}
        <div className="flex flex-shrink-0 gap-2">
          <Recipe_ViewFull recipe={recipe} />           {}
          {allowed_delete && <Recipe_DeleteButton recipe={recipe} />}
          {allowed_edit && (
            <Recipe_EditButton recipe={recipe} user={user} allowed_public={allowed_public} />
          )}
          <RecipeScale_Button recipe_id={recipe.recipe_id} />
        </div>
      </div>

      {}
      <div className="flex flex-wrap gap-3 border-t border-white/10 px-5 py-3 text-xs text-text-gray/80">
        {(recipe.prep_time_minutes || recipe.cook_time_minutes) && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {recipe.prep_time_minutes ? `${recipe.prep_time_minutes} min prep` : ""}
              {recipe.prep_time_minutes && recipe.cook_time_minutes ? " + " : ""}
              {recipe.cook_time_minutes ? `${recipe.cook_time_minutes} min cook` : ""}
            </span>
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{recipe.servings} servings</span>
          </div>
        )}
        {recipe.difficulty && (
          <div className="flex items-center gap-1">
            <ChefHat className="h-3 w-3" />
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          {recipe.is_public ? <Eye className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
          <span>{recipe.is_public ? "Public" : "Private"}</span>
        </div>
      </div>

      {}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="border-t border-white/10 px-5 py-3">
          <div className="flex items-center gap-1 text-xs font-medium text-primary mb-1">
            <BookOpen className="h-3 w-3" /> Ingredients
          </div>
          <ul className="list-inside list-disc text-xs text-text-gray/90">
            {recipe.ingredients.slice(0, 3).map((ing, idx) => (
              <li key={idx} className="truncate">
                {ing.amount} {ing.type_amount} {ing.name}
                {ing.vendor ? ` (${ing.vendor})` : ""}
              </li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li className="text-primary/60">+{recipe.ingredients.length - 3} more</li>
            )}
          </ul>
        </div>
      )}

      {}
      {recipe.steps && recipe.steps.length > 0 && (
        <div className="border-t border-white/10 px-5 py-3">
          <div className="flex items-center gap-1 text-xs font-medium text-primary mb-1">
            <Flame className="h-3 w-3" /> Steps
          </div>
          <ol className="list-decimal space-y-1 pl-4 text-xs text-text-gray/90">
            {recipe.steps.slice(0, 2).map((step, idx) => (
              <li key={idx} className="line-clamp-1">{step.desc}</li>
            ))}
            {recipe.steps.length > 2 && (
              <li className="text-primary/60">+{recipe.steps.length - 2} more steps</li>
            )}
          </ol>
        </div>
      )}

      {}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-5 py-3">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-text-gray/80"
            >
              <Tag className="mr-1 inline h-2 w-2" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {}
      <div className="border-t border-white/10 px-5 py-2 text-[10px] text-text-gray/40 space-y-0.5">
        <div className="flex flex-wrap justify-between">
          <span>Created by {creatorName}</span>
          <span>{createdDate}</span>
        </div>
        {recipe.updated_by && updaterName && updatedDate && (
          <div className="flex flex-wrap justify-between">
            <span>Updated by {updaterName}</span>
            <span>{updatedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
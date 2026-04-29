"use client";

import { useRef } from "react";
import { Eye, Clock, Users, ChefHat, Tag, Calendar, User, Edit, Globe, Lock, X } from "lucide-react";
import { Recipe } from "@/app/component/utils/type";
import "@/app/globals.css";

export default function Recipe_ViewFull({ recipe }: { recipe: Recipe }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  
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
    <>
      {}
      <button
        onClick={openModal}
        className="group flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-200 hover:scale-110 hover:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="View full recipe"
      >
        <Eye className="h-4 w-4" />
      </button>

      {}
      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md open:animate-fadeIn"
        style={{ maxWidth: "90vw", width: "56rem", backgroundColor: "transparent", margin: "auto", position: "fixed", inset: 0 }}
      >
        <div className="relative max-h-[85vh] overflow-y-auto p-6 md:p-8">
          {}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          {}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 rounded-full p-1 text-text-gray/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {}
          <div className="pr-8 mb-6">
            <h2
              className="text-2xl font-bold md:text-3xl"
              style={{
                background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {recipe.title}
            </h2>
            {recipe.description && (
              <p className="mt-2 text-text-gray text-sm md:text-base">{recipe.description}</p>
            )}
          </div>

          {}
          <div className="flex flex-wrap gap-4 border-y border-white/10 py-4 mb-6 text-sm text-text-gray/80">
            {(recipe.prep_time_minutes || recipe.cook_time_minutes) && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {recipe.prep_time_minutes ? `${recipe.prep_time_minutes} min prep` : ""}
                  {recipe.prep_time_minutes && recipe.cook_time_minutes ? " + " : ""}
                  {recipe.cook_time_minutes ? `${recipe.cook_time_minutes} min cook` : ""}
                </span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {recipe.is_public ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              <span>{recipe.is_public ? "Public" : "Private"}</span>
            </div>
          </div>

          {}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold text-primary flex items-center gap-1">
                <Tag className="h-4 w-4" /> Ingredients
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="text-sm text-text-light border-l-2 border-primary/30 pl-3">
                    {ing.amount} {ing.type_amount} {ing.name}
                    {ing.vendor && <span className="text-text-gray/60 text-xs"> ({ing.vendor})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {}
          {recipe.steps && recipe.steps.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold text-primary flex items-center gap-1">
                <ChefHat className="h-4 w-4" /> Steps
              </h3>
              <ol className="list-decimal space-y-3 pl-5">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="text-sm text-text-light">
                    {step.desc}
                    {step.notes && step.notes.length > 0 && (
                      <ul className="list-disc pl-5 mt-1 text-xs text-text-gray/70">
                        {step.notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-text-gray/80"
                >
                  <Tag className="mr-1 inline h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {}
          <div className="border-t border-white/10 pt-4 text-xs text-text-gray/50 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Created {createdDate}</span>
            </div>
            {updatedDate && (
              <div className="flex items-center gap-2">
                <Edit className="h-3 w-3" />
                <span>Updated {updatedDate}</span>
              </div>
            )}
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
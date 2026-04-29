"use client";

import { supabase } from "@/lib/supabase/client-side";
import "@/app/globals.css";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Recipe } from "@/app/component/utils/type";

export default function Recipe_DeleteButton({ recipe }: { recipe: Recipe }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRecipe = async () => {
    
    if (!confirm(`Delete "${recipe.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    const { error } = await supabase
      .from("Recipes")
      .delete()
      .eq("recipe_id", recipe.recipe_id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete recipe. Please try again.");
    } else {
      alert("Recipe deleted successfully!");
      
      
      window.location.reload(); 
    }

    setIsDeleting(false);
  };

  return (
    <button
      onClick={deleteRecipe}
      disabled={isDeleting}
      className="group flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 transition-all duration-200 hover:scale-110 hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Delete recipe"
    >
      {isDeleting ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
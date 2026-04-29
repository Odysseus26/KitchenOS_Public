import { supabase } from "@/lib/supabase/client-side";
import { Ingredient } from "./type";

export async function ScaleInstructions(
  recipe_id: string,
  servings_desired: number
): Promise<Ingredient[]> {
  
  const { data, error } = await supabase
    .from("Recipes")
    .select("ingredients, servings")
    .eq("recipe_id", recipe_id)
    .single(); 

  if (error || !data) {
    console.error("Error fetching recipe:", error?.message);
    return []; 
  }

  const originalIngredients: Ingredient[] = data.ingredients;
  const originalServings: number = data.servings;

  
  if (originalServings <= 0) {
    console.error("Invalid original servings value");
    return [];
  }

  
  const multiplier = servings_desired / originalServings;

  
  const scaledIngredients = originalIngredients.map((ing) => ({
    ...ing,
    amount: ing.amount * multiplier,
  }));

  return scaledIngredients;
}
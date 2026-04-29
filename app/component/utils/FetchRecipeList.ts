import { supabase } from "@/lib/supabase/client-side";
import { Recipe } from "@/app/component/utils/type";

export async function getPersonal_Recipes(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("User_Metadata")
    .select("recipe_references")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return []; 
    throw error;
  }
  
  return data?.recipe_references ?? [];
}


export async function getPublicRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("Recipes")
    .select("*")
    .eq("is_public", true);

  if (error) {
    
    console.error("Error fetching public recipes:", error.message);
    return [];
  }

  return data ?? [];
}


export async function getOrganizationalRecipes(organization_id: string): Promise<Recipe[]> {
  
  const { data, error } = await supabase
    .from("Organizations")
    .select("recipe_references")
    .eq("organization_id", organization_id)
    .single();

  if (error || !data) {
    return [];
  }

  const recipeIds: string[] = data.recipe_references ?? [];
  if (recipeIds.length === 0) {
    return [];
  }

  
  const { data: recipes, error: recipesError } = await supabase
    .from("Recipes")
    .select("*")
    .in("recipe_id", recipeIds);

  if (recipesError) {
    console.error("Error fetching organizational recipes:", recipesError);
    return [];
  }

  return recipes ?? [];
}
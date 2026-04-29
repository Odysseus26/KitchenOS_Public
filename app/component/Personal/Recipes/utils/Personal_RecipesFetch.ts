import { supabase } from "@/lib/supabase/client-side";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@/app/component/utils/type";

export default async function Fetch_PersonalRecipes({ user }: { user: User }): Promise<Recipe[]> {
  
  const { data: userData, error: userError } = await supabase
    .from("User_Metadata")
    .select("recipe_references")
    .eq("user_id", user.id)
    .single(); 

  if (userError || !userData) {
    
    return [];
  }

  const recipeIds: string[] = userData.recipe_references ?? [];

  if (recipeIds.length === 0) {
    return [];
  }

  
  const { data: recipesData, error: recipesError } = await supabase
    .from("Recipes")
    .select("*")
    .in("recipe_id", recipeIds);

  if (recipesError || !recipesData) {
    return [];
  }

  return recipesData as Recipe[];
}
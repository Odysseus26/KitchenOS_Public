"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { User_Organization, Recipe, Public_Facing_Info } from "../../utils/type";
import { OrganizationDetails } from "../../utils/FetchOrganization";
import { getOrganizationalRecipes } from "../../utils/FetchRecipeList";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

import Signup_Loading from "../../Signup/Signup_Loading";
import RecipeCard_Add from "../../Personal/Recipes/ui/Recipe_Add";
import Recipe_Card from "../../Personal/Recipes/ui/Recipe_Card";

export default function Organisation_Recipes({
  organization_details,
}: {
  organization_details: Public_Facing_Info;

}) {
  const user = organization_details.user
  const [organization, setOrganization] = useState<User_Organization | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  
  async function fetchData() {
    try {
      const orgData = await OrganizationDetails(
        organization_details.organization_id,
        organization_details.user.id
      );
      setOrganization(orgData);

      const recipeList = await getOrganizationalRecipes(orgData.organization_id);
      setRecipes(recipeList);
      if(orgData.level == 0){
        router.push("/Homepage")
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load organization data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [organization_details.organization_id]);

  const handleRefresh = () => {
    fetchData();
  };

  if (isLoading) {
    return <Signup_Loading />;
  }

  if (!organization) {
    return null;
  }

  const permissions = {
    allowed_edit: organization.level >= 2,
    allowed_delete: organization.level >= 3,
    allowed_public: organization.level >= 3,
    allowed_create: organization.level >= 3,
  };

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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm text-text-gray mb-4">
            <Building2 className="h-4 w-4" />
            <span>{organization.organization_name}</span>
          </div>
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
            Team Recipes
          </h2>
          <p className="mt-3 text-text-gray text-lg">
            Shared recipes within your organisation
          </p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center max-w-md mx-auto">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {}
        {permissions.allowed_create && (
          <div className="mb-8 flex justify-center">
            <RecipeCard_Add
              user={user}
              organization={organization}
              onEnd={handleRefresh}
            />
          </div>
        )}

        {}
        {recipes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl text-center max-w-md mx-auto">
            <p className="text-text-gray">No recipes yet. Create the first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Recipe_Card
                key={recipe.recipe_id}
                user={user}
                recipe={recipe}
                allowed_edit={permissions.allowed_edit}
                allowed_delete={permissions.allowed_delete}
                allowed_public={permissions.allowed_public}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
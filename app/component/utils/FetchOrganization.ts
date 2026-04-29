import { supabase } from "@/lib/supabase/client-side";
import { User_Organization } from "./type";

export async function OrganizationDetails(
  organization_id: string,
  user_id: string
): Promise<User_Organization> {
  const { data: sourceOrg, error: fetchError } = await supabase
    .from("Organizations")
    .select("*")
    .eq("organization_id", organization_id)
    .single();

  if (fetchError || !sourceOrg) {
    throw new Error(fetchError?.message || "Organization not found");
  }

  console.log("Fetch")

  
  let parsedUsers: { user_id: string; level: number }[] = [];
  if (sourceOrg.users && Array.isArray(sourceOrg.users)) {
    parsedUsers = sourceOrg.users
      .map((entry: string) => {
        try {
          return typeof entry === "string" ? JSON.parse(entry) : entry;
        } catch {
          return null;
        }
      })
      .filter((u): u is { user_id: string; level: number } => u !== null);
  }

  
  const userEntry = parsedUsers.find((u) => u.user_id === user_id);
  const level = userEntry?.level ?? 1; 

  
  const enrichedOrg: User_Organization = {
    ...sourceOrg,
    users: parsedUsers,
    level,
    user_id, 
  };

  return enrichedOrg;
}
import { supabase } from "@/lib/supabase/client-side";

interface Name {
    first_name: string;
    last_name: string;
}

export async function FetchPerson(uuid: string): Promise<Name> {
    const defaultName: Name = { first_name: "N/A", last_name: "N/A" };
    
    const { data, error } = await supabase
        .from("User_Metadata")
        .select("first_name, last_name")
        .eq("user_id", uuid)
        .single();

    if (error) {
        console.error("Error fetching user name:", error.message);
        return defaultName;
    }

    if (!data) {
        return defaultName;
    }

    return {
        first_name: data.first_name ?? defaultName.first_name,
        last_name: data.last_name ?? defaultName.last_name,
    };
}
"use client";

import { supabase } from "@/lib/supabase/client-side";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import PersonalHome from "../component/Personal/PersonalHome";
import Crash from "../component/utils/Crash";
import Signup_Loading from "../component/Signup/Signup_Loading";

export default function PersonalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<string | null>(null);
  const router = useRouter();

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      setAction("Error");
      setLoading(false);
      return; 
    }
    setUser(data.user);    
    setAction("Valid");
    setLoading(false);
  }

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return <Signup_Loading />;
  }

  
  if (action === "Error") {
    router.push("/");
    return null; 
  }

  if (action === "Valid" && user) {
    return <PersonalHome user={user} />;
  }

  
  return <Crash message="Oh no! Something went wrong. Go back to last page and try again." />;
}
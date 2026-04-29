"use client";


import { useState, useEffect } from "react"; 
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client-side";
import { useRouter } from "next/navigation";

import Signup_Loading from "../component/Signup/Signup_Loading";
import Crash from "../component/utils/Crash";
import Homebody from "../component/Homepage/Homebody";
import Home_Information from "../component/Homepage/Home_Info";

export default function Homepage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [action, setAction] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function getRoutePath() {
      try {
        
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
          setAction("Error");
          setLoading(false);
          return;
        }

        const authenticatedUser = authData.user;
        setUser(authenticatedUser);

        
        const { data: userInfo, error: userError } = await supabase
          .from("User_Metadata")
          .select()
          .eq("user_id", authenticatedUser.id);

        if (userError) {
          setAction("Error");
        } else if (!userInfo || userInfo.length === 0) {
          setAction("Information");
        } else {
          setAction("Homepage");
        }
      } catch (err) {
        console.error("Unexpected error in getRoutePath:", err);
        setAction("Error");
      } finally {
        setLoading(false);
      }
    }

    getRoutePath();
  }, []); 

  if (loading) {
    return <Signup_Loading />;
  }

  switch (action) {
    case "Error":
      return (
        <Crash message="Sorry! Something went wrong while trying to fetch your information. Try again." />
      );
    case "Information":
      return <Home_Information user={user} />;
    case "Homepage":
      return <Homebody user={user} />;
    default:
      return (
        <Crash message="Oh, it looks like we couldn't find the page you were looking for. Try again." />
      );
  }
}
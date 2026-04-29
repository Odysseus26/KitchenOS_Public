/**
 * This is where all data is fetched
 */

"use client";

import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { OrganizationDetails } from "../utils/FetchOrganization";
import { Public_Facing_Info } from "../utils/type";
import "@/app/globals.css";

import Signup_Loading from "../Signup/Signup_Loading";
import Crash from "../utils/Crash";
import Organization_Inner from "./Organization_Inner";



export default function Organization_Prepare({
  user,
  organization_id,
}: {
  user: User;
  organization_id: string;
}) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [didCrash, setCrash] = useState<boolean>(false);
  const information: Public_Facing_Info = {
    organization_id: organization_id,
    user: user
  }

  async function OrganizationInfo() {
    try{
      const state = await OrganizationDetails(organization_id,user.id);
      
      setLoading(false)
    }catch(error){
      setCrash(true)
    }
  }

  useEffect(() => {
    OrganizationInfo();
  }, [organization_id, user.id]);

  if (didCrash) {
    return <Crash message="Oh no! Something went wrong while loading the organization. Please try again." />;
  }

  if (isLoading) {
    return <Signup_Loading />;
  }

   return <Organization_Inner organization_details={information} />; 
}
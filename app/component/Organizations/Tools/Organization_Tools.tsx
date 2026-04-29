"use client"

import { Public_Facing_Info } from "../../utils/type"
import { useState } from "react"
import "@/app/globals.css"

import ComingSoon from "../../ComingSoon"
import Organization_Tools_Overview from "./Organization_Tools_Overview"
import PublicRecipes from "../../Personal/Tools/Public_Recipes/PublicRecipes"

export default function Organization_Tools({organization_details}:{
    organization_details: Public_Facing_Info
}){
    const [state,changeState] = useState<string>("OVERVIEW");

    switch(state){
        case "OVERVIEW":
            return <Organization_Tools_Overview onSelect={changeState}/>
        case "PUBLIC":
            return <PublicRecipes user={organization_details.user} organization={organization_details.organization_id}/>
        default:
            return <ComingSoon/>
    }
}
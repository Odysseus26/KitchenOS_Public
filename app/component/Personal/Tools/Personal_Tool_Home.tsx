"use client"

import { useState } from "react"
import {User} from "@supabase/supabase-js"

import Personal_Tools_Overview from "./Personal_Tools_Overview"
import ComingSoon from "../../ComingSoon"
import PublicRecipes from "./Public_Recipes/PublicRecipes"

export default function Personal_Tool_Home({user}:{
    user: User
}){
    const [state,changeState] = useState<string>("OVERVIEW")

    switch(state){
        case "OVERVIEW":
            return <Personal_Tools_Overview user={user} onSelect={changeState}/>
        case "PUBLIC":
            return <PublicRecipes user={user} organization={null}/>
        default:
            return <ComingSoon/>
    }
}
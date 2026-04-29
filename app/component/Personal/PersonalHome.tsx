"use client"


import {User} from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import Personal_Navigation from "./PersonalNav"
import Personal_Render from "./PersonalRender"

export default function PersonalHome({user}:{
    user: User
}){
    const [state,changeState] = useState<string>("RECIPES")

    /* useEffect(()=>{
        console.log(state)
    },[state])
 */
    return (
        <>
        <Personal_Navigation onSelect={changeState}/>
        <Personal_Render state={state} user={user} />
        </>
    )
}
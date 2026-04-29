"use client"

import { Public_Facing_Info } from "../utils/type"
import { useState } from "react"

import Organization_Inner_Nav from "./Organization_Inner_Nav"
import Organization_Inner_Render from "./Organization_Inner_Render"

export default function Organization_Inner({organization_details}:{
    organization_details: Public_Facing_Info
}){
    const [state,changeState] = useState<string>("RECIPES")
    return (
        <>
        <Organization_Inner_Nav organization_details={organization_details} onSelect={changeState} state={state}/>
        <Organization_Inner_Render organization_details={organization_details} state={state}/>
        </>
    )
}
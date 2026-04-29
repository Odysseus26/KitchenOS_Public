"use client"

import "@/app/globals.css"

import { supabase } from "@/lib/supabase/client-side"
import { useState,useEffect } from "react"

import Signup_Loading from "./Signup_Loading"
import Signup_ErrorRedirect from "./Signup_ErrorRedirect"
import SignUp_Password_Allowed from "./PasswordAllowed"

export default function Signup_Password({email}:{
    email: string
}){
    const [loading,setLoading] = useState<boolean>(true)
    const [stateAddress,setState] = useState<string>("")

    const [password,setPassword] = useState<string>("");
    const [confirmPassword,setCheckPassword] = useState<string>("")

    async function DoubleCheck_Email() {
        const {data,error} = await supabase.from("Users_SignIn").select().eq("email",email);
        console.log(data,error)
        if(error){
            setState("Error")
        }else{
            if(data.length == 0) setState("Allowed");
            else setState("Blocked")
        }

        setLoading(false);
        
    }

    useEffect(()=>{
        DoubleCheck_Email()
    },[])

    if(loading){
        return <Signup_Loading/>
    }else{
        switch(stateAddress){
            case "Error":
                return <Signup_ErrorRedirect message="Sorry something went wrong! Try again" />
            case "Blocked":
                return <Signup_ErrorRedirect message="Sorry, that email is already in use!" />
            case "Allowed":
                return <SignUp_Password_Allowed email={email}/>
        }
    }
}
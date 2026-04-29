"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Signup_Loading from "../component/Signup/Signup_Loading";
import Signup_ErrorRedirect from "../component/Signup/Signup_ErrorRedirect";
import Signup_Password from "../component/Signup/PasswordRedirect";

export default function SignUp() {   
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [errorBar,setError] = useState<boolean>(false)
  const [loading,setLoading] = useState<boolean>(true)

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }else{
        setError(true);
    }
    setLoading(false);
  }, [searchParams]);

  if(loading){
    return <Signup_Loading/>
  }

  if(errorBar){
    return <Signup_ErrorRedirect message="Sorry, something went wrong. Try again"/>
  }

  return (
    <>
      <Signup_Password email={email} />
    </>
  );
}
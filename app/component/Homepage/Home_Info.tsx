"use client";

import "@/app/globals.css";
import { User } from "@supabase/supabase-js";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client-side";
import { useRouter } from "next/navigation";

import Crash from "../utils/Crash";

export default function Home_Information({ user }: { user: User }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCrash,SetCrash] = useState<boolean>(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    age: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    age: "",
  });
  const router = useRouter()
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.length < 2) return "First name must be at least 2 characters";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.length < 2) return "Last name must be at least 2 characters";
        return "";
      case "age":
        if (!value) return "Age is required";
        const ageNum = Number(value);
        if (isNaN(ageNum)) return "Age must be a number";
        if (ageNum < 16) return "You must be at least 16 years old";
        if (ageNum > 120) return "Please enter a valid age";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, field === "age" ? age : field === "firstName" ? firstName : lastName);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: string, value: string) => {
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "age") setAge(value);


    if (touched[field as keyof typeof touched]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field as keyof typeof errors]: error });
    }
  };

  const isFormValid = () => {
    const firstNameError = validateField("firstName", firstName);
    const lastNameError = validateField("lastName", lastName);
    const ageError = validateField("age", age);
    return !firstNameError && !lastNameError && !ageError;
  };

  async function handleSubmit() {
  setTouched({ firstName: true, lastName: true, age: true });
  const firstNameError = validateField("firstName", firstName);
  const lastNameError = validateField("lastName", lastName);
  const ageError = validateField("age", age);

  if (firstNameError || lastNameError || ageError) {
    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      age: ageError,
    });
    return;
  }

  setIsSubmitting(true);
  
  const ageNumber = typeof age === "string" ? parseInt(age, 10) : age;

  const { error: insertPersonalError } = await supabase.from("User_Metadata").insert({
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    age: ageNumber,
    email: user.email,
  });

  if (insertPersonalError) {
    SetCrash(true);
    setIsSubmitting(false);
  } else {

    window.location.reload();
  }
}

  if(isCrash){
    return <Crash message="Something went wrong during submit! Try again."/>
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl animate-float"
          style={{ backgroundColor: `var(--PRIMARY_COLOR)`, opacity: 0.2 }}
        />
        <div
          className="absolute bottom-0 left-0 h-80 w-80 rounded-full blur-3xl animate-float [animation-delay:-2s]"
          style={{ backgroundColor: `var(--SECONDARD_COLOR)`, opacity: 0.15 }}
        />
        <div
          className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full blur-3xl animate-float [animation-delay:-4s]"
          style={{ backgroundColor: `var(--THIRD_COLOR)`, opacity: 0.2 }}
        />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0a0a0a]/40 to-[#0a0a0a]/80" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl md:p-12">

          <div className="mb-8 text-center">
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{
                background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR), var(--THIRD_COLOR))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% auto",
                animation: "gradient 6s linear infinite",
              }}
            >
              Tell us about yourself
            </h2>
            <p className="mt-2 text-text-gray text-sm">We need a few details to personalize your experience.</p>
          </div>

          <div className="space-y-8">

            <div className="relative">
              <input
                ref={firstNameRef}
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                className={`peer w-full rounded-xl border bg-black/40 px-5 py-3.5 text-text-light placeholder-transparent transition-all focus:outline-none focus:ring-1 ${
                  errors.firstName && touched.firstName
                    ? "border-red-500/70 focus:ring-red-500"
                    : "border-white/15 focus:border-primary focus:ring-primary"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="firstName"
                className={`absolute left-5 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none
                  peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary
                  ${firstName ? "top-1 -translate-y-0 text-xs" : ""}
                  ${errors.firstName && touched.firstName ? "text-red-400" : "text-text-gray"}
                `}
              >
                First name
              </label>
              {errors.firstName && touched.firstName && (
                <p className="mt-1.5 text-xs text-red-400 transition-all animate-fadeIn">{errors.firstName}</p>
              )}
            </div>


            <div className="relative">
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                className={`peer w-full rounded-xl border bg-black/40 px-5 py-3.5 text-text-light placeholder-transparent transition-all focus:outline-none focus:ring-1 ${
                  errors.lastName && touched.lastName
                    ? "border-red-500/70 focus:ring-red-500"
                    : "border-white/15 focus:border-primary focus:ring-primary"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="lastName"
                className={`absolute left-5 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none
                  peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary
                  ${lastName ? "top-1 -translate-y-0 text-xs" : ""}
                  ${errors.lastName && touched.lastName ? "text-red-400" : "text-text-gray"}
                `}
              >
                Last name
              </label>
              {errors.lastName && touched.lastName && (
                <p className="mt-1.5 text-xs text-red-400 animate-fadeIn">{errors.lastName}</p>
              )}
            </div>


            <div className="relative">
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => handleChange("age", e.target.value)}
                onBlur={() => handleBlur("age")}
                className={`peer w-full rounded-xl border bg-black/40 px-5 py-3.5 text-text-light placeholder-transparent transition-all focus:outline-none focus:ring-1 ${
                  errors.age && touched.age
                    ? "border-red-500/70 focus:ring-red-500"
                    : "border-white/15 focus:border-primary focus:ring-primary"
                } appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                placeholder=" "
                min="16"
                max="120"
              />
              <label
                htmlFor="age"
                className={`absolute left-5 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none
                  peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary
                  ${age ? "top-1 -translate-y-0 text-xs" : ""}
                  ${errors.age && touched.age ? "text-red-400" : "text-text-gray"}
                `}
              >
                Age
              </label>
              {errors.age && touched.age && (
                <p className="mt-1.5 text-xs text-red-400 animate-fadeIn">{errors.age}</p>
              )}
            </div>


            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid()}
              className="group relative w-full overflow-hidden rounded-xl py-4 text-center font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, var(--PRIMARY_COLOR) 0%, var(--DARKER) 100%)` }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                {isSubmitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating your profile...
                  </>
                ) : (
                  <>
                    Continue →
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
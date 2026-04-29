"use client";

import { supabase } from "@/lib/supabase/client-side";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X, AlertTriangle } from "lucide-react";
import "@/app/globals.css";

export default function DeleteOrganization_Button({
  organization_id,
  organization_name,
}: {
  organization_id: string;
  organization_name: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from("Organizations")
        .delete()
        .eq("organization_id", organization_id);
      if (deleteError) throw new Error(deleteError.message);
      router.push("/Homepage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete organization.");
      setIsDeleting(false);
    }
  };

  return (
    <>

      <button
        onClick={openDialog}
        className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:scale-[1.02] hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20"
      >
        <Trash2 className="h-4 w-4" />
        Delete Organization
      </button>


      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md open:animate-fadeIn"
        style={{ maxWidth: "90vw", width: "28rem", backgroundColor: "transparent", margin: "auto", position: "fixed", inset: 0 }}
      >
        <div className="relative p-6 md:p-8">

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />


          <button
            onClick={closeDialog}
            className="absolute right-4 top-4 rounded-full p-1 text-text-gray/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>


          <div className="mb-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
              <AlertTriangle className="h-7 w-7 text-red-400" />
            </div>
            <h2
              className="mt-4 text-2xl font-bold"
              style={{
                background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Delete Organization
            </h2>
          </div>


          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
            <p className="text-sm text-red-300">
              Are you sure you want to delete <span className="font-semibold">{organization_name}</span>?
            </p>
            <p className="mt-2 text-xs text-text-gray/70">
              This action <strong>cannot be undone</strong>. All recipes, members, inventory, and vendor data will be permanently removed.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}


          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-800 py-2.5 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
            <button
              onClick={closeDialog}
              className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2.5 font-semibold text-text-gray transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
          </div>


          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-secondary/5 blur-3xl" />
          </div>
        </div>
      </dialog>
    </>
  );
}
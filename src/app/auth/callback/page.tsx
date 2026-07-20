"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Callback error:", error);
        router.replace("/login");
        return;
      }

      if (!data.session) {
        router.replace("/login");
        return;
      }

      router.replace("/work");
    };

    handleCallback();
  }, [router]);

  return <p className="p-6 text-sm text-foreground/70">Accesso in corso...</p>;
}

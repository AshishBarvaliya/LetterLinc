"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_hooks/useAuth";

export default function Dashboard() {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, router, user]);

  return user ? <div className="flex h-screen">dashboard</div> : null;
}

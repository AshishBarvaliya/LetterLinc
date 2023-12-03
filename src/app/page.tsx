"use client";

import { useEffect } from "react";
import { LoginForm } from "./_components/login-form";
import { LoginHeader } from "./_components/login-header";
import { LoginHero } from "./_components/login-hero";
import { useAuth } from "./_hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, router, user]);

  return (
    <div className="flex h-screen">
      <LoginHeader buttonText="Sign up" href="/sign-up" />
      <div className="hidden w-1/2 bg-zinc-900 border-r lg:flex">
        <LoginHero />
      </div>
      <div className="flex w-full lg:w-1/2 justify-center p-6">
        <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

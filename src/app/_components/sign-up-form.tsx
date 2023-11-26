"use client";

import * as React from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "../_lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuth } from "../_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "../_hooks/use-toast";

export function SignupForm({ className }: { className?: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const { signUp, loading, setLoading } = useAuth();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (e.target[2].value === e.target[3].value) {
      signUp({
        name: e.target[0].value,
        email: e.target[1].value,
        password: e.target[2].value,
      }).then((response: any) => {
        setLoading(false);
        if (response?.error) {
          toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: response.error.message,
          });
        } else {
          router.push("/dashboard");
        }
      });
    } else {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "Passwords do not match. Please try again.",
      });
    }
  };

  return (
    <div className={cn("grid gap-6", className)}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Input
              id="name"
              type="name"
              label="Name"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="email"
              type="email"
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="password"
              type="password"
              label="Password"
              autoComplete="off"
              autoCorrect="off"
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="password-verify"
              type="password"
              label="Confirm Password"
              autoComplete="off"
              autoCorrect="off"
              disabled={loading}
              required
            />
          </div>
          <Button disabled={loading} className="mt-5">
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
}

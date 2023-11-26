"use client";

import * as React from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "../_lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuth } from "../_hooks/useAuth";

export function LoginForm({ className }: { className?: string }) {
  const { signIn, loading } = useAuth();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signIn({
      email: e.target[0].value,
      password: e.target[1].value,
    }).then((response: any) => {
      if (response?.error) {
        console.log(response.error.message);
      }
    });
  };

  return (
    <div className={cn("grid gap-6", className)}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Input
              id="email"
              type="email"
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading}
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
            />
          </div>
          <Button disabled={loading} className="mt-5">
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}

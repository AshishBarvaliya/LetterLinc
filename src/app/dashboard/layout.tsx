"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../_hooks/useAuth";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import { cn } from "../_lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, user, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, router, user]);

  return loading ? null : user ? (
    <div className="flex h-screen">
      <div className="flex justify-between fixed inset-0 items-center h-16 px-6 border-b border-border bg-background">
        <div className="flex gap-8 items-center">
          <div className="relative z-20 flex items-center text-lg font-bold gap-2">
            <Image src="/logo.png" alt="Logo" width={24} height={24} />
            LetterLinc
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className={cn(
                "cursor-pointer hover:text-white/60",
                pathname === "/dashboard" ? "text-white/90" : "text-white/70"
              )}
            >
              Generate
            </Link>
            <Link
              href="/dashboard/my-cover-letters"
              className={cn(
                "cursor-pointer hover:text-white/60",
                pathname === "/dashboard/my-cover-letters"
                  ? "text-white/90"
                  : "text-white/70"
              )}
            >
              My Cover Letters
            </Link>
          </div>
        </div>
        <div className="flex items-center cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                size="icon"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {user?.name ? user?.name[0] : ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => signOut()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {children}
    </div>
  ) : null;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "../_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../_components/ui/select";
import { Label } from "../_components/ui/label";
import { useToast } from "../_hooks/use-toast";
import { UploadButton } from "../_components/upload-button";
import { ViewResumeDialog } from "../_components/view-resume-dialog";

export default function Dashboard() {
  const router = useRouter();
  const { loading, user, signOut } = useAuth();
  const { toast } = useToast();

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, router, user]);

  return loading ? null : user ? (
    <div className="flex h-screen">
      <div className="flex justify-between fixed inset-0 items-center h-16 px-6 border-b border-border bg-background">
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <Image src="/logo.png" alt="Logo" width={24} height={24} />
          LetterLinc
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
      <div
        className="divWithDotsBackground flex flex-1 justify-center mt-16 p-6"
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="rgb(73, 73, 73)" /></svg>')`,
        }}
      >
        <div className="flex flex-col gap-4 w-[800px] p-6 h-full border-border border rounded-md justify-between bg-background">
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-3">
              <Label>Resume</Label>
              <div className="flex justify-between gap-4">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Resume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <UploadButton
                  setSubmitLoading={setSubmitLoading}
                  submitLoading={submitLoading}
                />
                <ViewResumeDialog submitLoading={submitLoading} />
              </div>
            </div>
            <Textarea label={"Job Description"} />
          </div>
          <div className="flex justify-end">
            <Button disabled={submitLoading}>Generate</Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

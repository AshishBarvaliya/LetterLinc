"use client";

import { useState } from "react";
import moment from "moment";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { ExternalLink } from "lucide-react";
import { UploadButton } from "./upload-button";
import { useHelpers } from "../_hooks/use-helpers";
import { useAuth } from "../_hooks/useAuth";
import { ReloadIcon } from "@radix-ui/react-icons";
import { cn } from "../_lib/utils";

interface UploadButtonProps {
  submitLoading: boolean;
}

export const ViewResumeDialog: React.FC<UploadButtonProps> = ({
  submitLoading,
}) => {
  const { user } = useAuth();
  const { resumesData, fetchResumes, isFetching } = useHelpers();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        disabled={submitLoading}
        onClick={() => setOpen(true)}
      >
        Manage Resumes
      </Button>
      <Dialog
        open={open}
        onOpenChange={(toggle) => {
          setOpen(toggle);
        }}
      >
        <DialogContent className="p-8 border w-[740px] min-h-[460px] max-w-[740px] border-border bg-background">
          <h4 className="text-lg">Your Resumes</h4>
          <div className="flex flex-wrap gap-4 min-h-[282px]">
            {isFetching ? (
              <p>Loading...</p>
            ) : resumesData.length ? (
              resumesData
                //@ts-ignore
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((resume, index) => (
                  <div
                    key={index}
                    className="w-52 p-2 border border-border bg-white/5"
                  >
                    <embed src={resume.url} width="100%" height="200px" />
                    <p className="truncate my-2">{resume.filename}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-white/80">
                        {moment(resume.createdAt).fromNow()}
                      </p>
                      <Button
                        className="p-0 w-6 h-6"
                        onClick={() => {
                          window.open(resume.url, "_blank");
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <p>No resumes</p>
            )}
          </div>
          <div className="flex flex-1 justify-between mt-3 items-center">
            <p
              className={cn(
                "text-xs",
                resumesData.length >= 6 ? "text-destructive" : "text-white/60"
              )}
            >
              Max 6 resumes allowed
            </p>
            <UploadButton
              disabled={submitLoading || isUploading || resumesData.length >= 6}
              setIsUploading={setIsUploading}
              setSubmitLoading={() => {}}
              successCallback={() => fetchResumes(user?.email)}
            />
          </div>
        </DialogContent>
      </Dialog>
      {isUploading ? (
        <div className="fixed inset-0 z-60 bg-background/80 backdrop-blur-sm flex justify-center items-center">
          <h4 className="text-lg flex justify-center items-center">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Uploaing....
          </h4>
        </div>
      ) : null}
    </>
  );
};

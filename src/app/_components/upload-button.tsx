"use client";

import { useRef } from "react";
import { useAuth } from "../_hooks/useAuth";
import { Button } from "./ui/button";
import { useToast } from "../_hooks/use-toast";
import { db, storage } from "../_lib/firebase";
import axios from "axios";

interface UploadButtonProps {
  disabled: boolean;
  setSubmitLoading: (submitLoading: boolean) => void;
  successCallback?: () => void;
  setIsUploading: (isUploading: boolean) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  setSubmitLoading,
  disabled,
  successCallback,
  setIsUploading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const storageRef = storage.ref();

  const uploadFile = async (file: File) => {
    if (file) {
      setSubmitLoading(true);
      setIsUploading(true);
      toast({
        title: "Uploading file...",
      });
      const filename = user.email + "/" + (+new Date() + "_" + file.name);

      const fileRef = storageRef.child(filename);
      const uploadTask = fileRef.put(file);

      uploadTask.then(async () => {
        const url = await fileRef.getDownloadURL();
        axios
          .post(`/api/run`, {
            url,
            vectorSpace: filename + "vectorSpace",
          })
          .then(() => {
            db.collection("resumes")
              .add({
                createdAt: new Date().toISOString(),
                email: user.email,
                filename: file.name,
                filepath: filename,
                vectorSpace: filename + "vectorSpace",
              })
              .then(() => {
                successCallback?.();
                toast({
                  variant: "success",
                  title: "The file has been uploaded!",
                });
              });
          })
          .catch((error: any) => {
            toast({
              variant: "destructive",
              title: `Failed to upload ${file.name}: ${error}`,
            });
            console.error(`Failed to upload ${file.name}: ${error}`);
          })
          .finally(() => {
            setSubmitLoading(false);
            setIsUploading(false);
          });
      });
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="application/pdf"
        name="files"
        id="files"
        onChange={async (e) => {
          if (e.target.files?.length) {
            //@ts-ignore
            if (e.target.files[0].size > 1000000) {
              toast({
                variant: "destructive",
                title: "File too large: 1MB max",
              });
            } else {
              await uploadFile(e.target.files[0]);
            }
          }
        }}
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Upload
      </Button>
    </>
  );
};

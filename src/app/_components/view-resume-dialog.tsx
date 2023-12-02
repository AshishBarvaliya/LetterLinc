"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { db, storage } from "../_lib/firebase";
import { useAuth } from "../_hooks/useAuth";
import { ExternalLink } from "lucide-react";
import { UploadButton } from "./upload-button";

interface UploadButtonProps {
  submitLoading: boolean;
}

interface ResumeProps {
  id: string;
  filename: string;
  createdAt: string;
  url: string;
}

export const ViewResumeDialog: React.FC<UploadButtonProps> = ({
  submitLoading,
}) => {
  const { user } = useAuth();
  const storageRef = storage.ref();
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [resumesData, setResumesData] = useState<ResumeProps[]>([]);

  const fetchPdfFiles = async () => {
    setFetching(true);
    db.collection("resumes")
      .where("email", "==", user.email)
      .get()
      .then((res) => {
        let resumes: ResumeProps[] = [];
        res.forEach(async (doc) => {
          const itemRef = storageRef.child(doc.data().filepath);
          let url = await itemRef.getDownloadURL();
          resumes.push({
            id: doc.id,
            createdAt: doc.data().createdAt,
            filename: doc.data().filename,
            url: url,
          });
        });
        setResumesData(resumes);
        setFetching(false);
      });
  };

  useEffect(() => {
    fetchPdfFiles();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        disabled={submitLoading}
        onClick={() => setOpen(true)}
      >
        View all
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
            {fetching ? (
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
          <div className="flex flex-1 justify-end mt-3">
            <UploadButton
              submitLoading={submitLoading}
              setSubmitLoading={() => {}}
              successCallback={fetchPdfFiles}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

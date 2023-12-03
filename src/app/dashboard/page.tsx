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
import { ViewResumeDialog } from "../_components/view-resume-dialog";
import { useHelpers } from "../_hooks/use-helpers";
import axios from "axios";
import Loader from "../_components/loader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { SaveDialog } from "../_components/save-dialog";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 20,
    padding: 20,
    flexGrow: 1,
    fontSize: 12,
  },
});
export default function Dashboard() {
  const router = useRouter();
  const { loading, user, signOut } = useAuth();
  const { fetchResumes, resumesData, isFetching } = useHelpers();
  const { toast } = useToast();
  const [data, setData] = useState<any>({
    resume: "",
    jobDescription: "",
  });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState<string>("");
  const [saveOpen, setSaveOpen] = useState<boolean>(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>("hu");

  const handleGenerate = async () => {
    if (!data.resume) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a resume",
      });
      return;
    }
    if (!data.jobDescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a job description",
      });
      return;
    }
    if (data.jobDescription.trim().length < 30) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Job description must be at least 30 characters",
      });
      return;
    }
    setSubmitLoading(true);
    await axios
      .post("/api/generate", {
        vectorSpace: resumesData.find((resume) => resume.id === data.resume)
          ?.vectorSpace,
        jobDescription: data.jobDescription,
      })
      .then((data: any) => {
        setGeneratedLetter(data.data.text);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error generating the cover letter",
        });
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  useEffect(() => {
    if (user && user?.email) {
      fetchResumes(user?.email);
    }
  }, [user]);

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
          {submitLoading ? (
            <div>
              <Loader />
            </div>
          ) : generatedLetter ? (
            <>
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Generated Cover Letter</h2>
                {editMode ? null : (
                  <PDFDownloadLink
                    document={
                      <Document>
                        <Page size="A4" style={styles.page}>
                          <View style={styles.section}>
                            <Text>{generatedLetter}</Text>
                          </View>
                        </Page>
                      </Document>
                    }
                    fileName="cover_letter.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? null : <Button>Download</Button>
                    }
                  </PDFDownloadLink>
                )}
              </div>
              {editMode ? (
                <Textarea
                  value={editedCoverLetter}
                  onChange={(e) => setEditedCoverLetter(e.target.value)}
                  autoFocus
                />
              ) : (
                <div className="flex flex-1 overflow-x-auto whitespace-break-spaces text-white/80">
                  {generatedLetter}
                </div>
              )}
              <div className="flex justify-between">
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setEditMode(false);
                    setGeneratedLetter("");
                    setData({
                      resume: "",
                      jobDescription: "",
                    });
                  }}
                >
                  Discard
                </Button>
                <div className="flex gap-4">
                  {editMode ? (
                    <>
                      <Button
                        variant={"outline"}
                        onClick={() => setEditMode(!editMode)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setGeneratedLetter(editedCoverLetter);
                          setEditMode(!editMode);
                        }}
                      >
                        Update
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          setEditMode(!editMode);
                          setEditedCoverLetter(generatedLetter);
                        }}
                      >
                        Edit
                      </Button>
                      <Button onClick={() => setSaveOpen(true)}>Save</Button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-5 flex-1">
                <div className="flex flex-col gap-3">
                  <Label>Resume</Label>
                  <div className="flex justify-between gap-4">
                    <Select
                      onValueChange={(value) =>
                        setData({ ...data, resume: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {resumesData?.map((resume) => (
                          <SelectItem key={resume?.id} value={resume?.id}>
                            {resume?.filename}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ViewResumeDialog submitLoading={submitLoading} />
                  </div>
                </div>
                <Textarea
                  label={"Job Description"}
                  value={data?.jobDescription}
                  onChange={(e) =>
                    setData({ ...data, jobDescription: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button disabled={submitLoading} onClick={handleGenerate}>
                  Generate
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <SaveDialog
        open={saveOpen}
        setOpen={setSaveOpen}
        generatedLetter={generatedLetter}
        selectedResume={data.resume}
      />
    </div>
  ) : null;
}

"use client";
 
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { useAuth } from "../_hooks/useAuth";
import { useToast } from "../_hooks/use-toast";
import { db } from "../_lib/firebase";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
 
interface SaveDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  generatedLetter: string;
  selectedResume: string;
}
 
export const SaveDialog: React.FC<SaveDialogProps> = ({
  open,
  setOpen,
  generatedLetter,
  selectedResume,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [saveLoading, setSaveLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
 
  const handleSave = async () => {
    if (!generatedLetter) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please generate a cover letter first",
      });
      return;
    } else if (!title) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a title",
      });
      return;
    } else {
      setSaveLoading(true);
      db.collection("letters")
        .add({
          createdAt: new Date().toISOString(),
          email: user?.email,
          letter: generatedLetter,
          title: title,
          resume: selectedResume,
          description: description,
        })
        .then(() => {
          setOpen(false);
          toast({
            title: "Cover letter has been saved",
          });
          router.push("/dashboard/my-cover-letters");
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was an error saving the cover letter",
          });
        })
        .finally(() => {
          setSaveLoading(false);
        });
    }
  };
 
  return (
    <Dialog
      open={open}
      onOpenChange={(toggle) => {
        setOpen(toggle);
      }}
    >
      <DialogContent className="p-8 border w-[740px] max-w-[440px] border-border bg-background">
        <h4 className="text-lg">Save Cover Letter</h4>
        <div className="grid gap-4 mt-2">
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Title"
            required
          />
          <Input
            id="description"
            name="description"
            value={description}
            onChange={(e) => setTitle(e.target.value)}
            label="Description"
            required
          />
        </div>
        <div className="flex flex-1 justify-end mt-3 items-center">
          <Button disabled={saveLoading} onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

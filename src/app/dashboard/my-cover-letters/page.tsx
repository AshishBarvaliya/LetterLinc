"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/app/_lib/firebase";
import { useAuth } from "@/app/_hooks/useAuth";
import { Button } from "@/app/_components/ui/button";
import moment from "moment";

export default function MyCoverLetters() {
  const router = useRouter();
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    db.collection("letters")
      .where("email", "==", user.email)
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot.docs.map((doc) => doc.data()));
        setCoverLetter(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as any
        );
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="divWithDotsBackground flex flex-1 justify-center mt-16 p-6"
      style={{
        backgroundImage: `url('data:image/svg+xml;utf8,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="rgb(73, 73, 73)" /></svg>')`,
      }}
    >
      <div className="flex flex-col gap-4 w-[800px] p-6 h-full border-border border rounded-md justify-between bg-background">
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-bold">My Cover Letters</h1>
          {loading ? (
            <p>Loading...</p>
          ) : coverLetter.length ? (
            <div className="flex flex-wrap gap-4 mt-4 overflow-y-auto">
              {coverLetter //@ts-ignore
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((letter, ind) => (
                  <div
                    key={ind}
                    className="flex flex-col border border-border p-2 w-[220px] gap-3 bg-white/5 min-h-[235px]"
                  >
                    <p className="text-lg">{letter.title}</p>
                    <div className="flex flex-1">
                      <p
                        className="text-sm text-gray-200"
                        style={{
                          display: "-webkit-box",
                          maxWidth: "200px",
                          WebkitLineClamp: 7,
                          WebkitBoxOrient: "vertical",
                          overflow: " hidden",
                        }}
                      >
                        {letter.letter}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {moment(letter.createdAt).fromNow()}
                      </p>
                      <Button
                        className="p-0 w-10 h-6"
                        onClick={() => {
                          router.push(
                            `/dashboard/my-cover-letters/${letter.id}`
                          );
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {"You don't have any cover letters yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

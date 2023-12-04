"use client";

import { createContext, useContext, useState } from "react";
import { db, storage } from "../_lib/firebase";

interface ResumeProps {
  id: string;
  filename: string;
  createdAt: string;
  url: string;
  vectorSpace: string;
}

type Context = {
  resumesData: ResumeProps[];
  fetchResumes: (email: string) => Promise<void>;
  isFetching: boolean;
};

const HelpersContext = createContext({
  resumesData: [],
  fetchResumes: async () => {},
  isFetching: false,
} as Context);

export const HelpersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storageRef = storage.ref();
  const [isFetching, setIsFetching] = useState(false);
  const [resumesData, setResumesData] = useState<ResumeProps[]>([]);

  const fetchResumes = async (email: string) => {
    setIsFetching(true);
    db.collection("resumes")
      .where("email", "==", email)
      .get()
      .then((res) => {
        let promises: Promise<ResumeProps>[] = [];

        res.forEach((doc) => {
          const itemRef = storageRef.child(doc.data().filepath);
          const promise = itemRef.getDownloadURL().then((url) => {
            return {
              id: doc.id,
              createdAt: doc.data().createdAt,
              filename: doc.data().filename,
              url: url,
              vectorSpace: doc.data().vectorSpace,
            };
          });
          promises.push(promise);
        });

        Promise.all(promises).then((resumes) => {
          setResumesData(resumes);
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return (
    <HelpersContext.Provider
      value={{
        resumesData,
        fetchResumes,
        isFetching,
      }}
    >
      {children}
    </HelpersContext.Provider>
  );
};

export const useHelpers = () => {
  return useContext(HelpersContext);
};

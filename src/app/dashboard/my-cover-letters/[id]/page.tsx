"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/app/_lib/firebase";
import { Button } from "@/app/_components/ui/button";
import {
  Document,
  PDFDownloadLink,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

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

export default function CoverLetter({ params }: any) {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    db.collection("letters")
      .doc(params.id)
      .get()
      .then((doc) => {
        setCoverLetter({
          ...doc.data(),
          id: doc.id,
        });
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
        <div className="flex flex-col h-full gap-4 flex-1">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">{coverLetter?.title}</h1>
            <PDFDownloadLink
              document={
                <Document>
                  <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                      <Text>{coverLetter?.letter}</Text>
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
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : coverLetter ? (
            <>
              <div className="flex flex-1 overflow-y-auto whitespace-break-spaces text-white/80">
                {coverLetter.letter}
              </div>
              <div className="flex justify-end">
                Resume: {coverLetter.resume}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { makeChain } from "@/app/_lib/makechain";
import { NextRequest, NextResponse } from "next/server";
import { PINECONE_INDEX_NAME, initPinecone } from "@/app/_lib/pineconde";

export async function POST(req: NextRequest) {
  const pinecone = await initPinecone();
  const { vectorSpace, jobDescription } = await req.json();

  if (!vectorSpace) {
    return new NextResponse(JSON.stringify({ error: "vectorSpace missing" }), {
      status: 400,
    });
  }

  if (!jobDescription) {
    return new NextResponse(
      JSON.stringify({ error: "jobDescription missing" }),
      {
        status: 400,
      }
    );
  }
  const sanitizedQuestion = jobDescription.trim().replaceAll("\n", " ");

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: "text",
        namespace: vectorSpace,
      }
    );

    const chain = makeChain(vectorStore);
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: [],
    });

    return new NextResponse(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

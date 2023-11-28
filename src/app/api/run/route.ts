import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CustomPDFLoader } from "../../_utils/customPDFLoader";
import { NextRequest, NextResponse } from "next/server";
import { PINECONE_INDEX_NAME, initPinecone } from "@/app/_lib/pineconde";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.url || !body.vectorSpace) {
      return new NextResponse(JSON.stringify({ error: "url missing" }), {
        status: 400,
      });
    }
    const filePath = body.url;
    const vectorSpace = body.vectorSpace;

    const pinecone = await initPinecone();
    const loader = new CustomPDFLoader(filePath);
    const rawDocs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    const chunkSize = 50;
    for (let i = 0; i < docs.length; i += chunkSize) {
      const chunk = docs.slice(i, i + chunkSize);
      await PineconeStore.fromDocuments(chunk, embeddings, {
        pineconeIndex: index,
        namespace: vectorSpace,
        textKey: "text",
      });
    }
    return new NextResponse(JSON.stringify({ message: "success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("error", error);
    return new NextResponse(JSON.stringify({ error }), {
      status: 400,
    });
  }
}

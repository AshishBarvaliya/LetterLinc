import { PineconeClient } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error("Missing Pinecone index name in .env file");
}

export const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "";

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error("Pinecone environment or api key vars missing");
}

export async function initPinecone() {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? "",
      apiKey: process.env.PINECONE_API_KEY ?? "",
    });

    return pinecone;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

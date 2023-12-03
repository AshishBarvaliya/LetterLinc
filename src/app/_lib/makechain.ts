import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { CallbackManager } from "langchain/callbacks";

const QA_PROMPT = `You are a helpful cover letter AI assistant. Use the following pieces of context/resume information and job description to write a cover letter. 
NOTE: MAXIMUM LENGTH OF THE LETTER MUST NOT BE MORE THAN 150 WORDS.

{context}

Job description: {question}
Cover letter:`;

export const makeChain = (
  vectorstore: PineconeStore,
  onTokenStream?: (token: string) => void
) => {
  const model = new OpenAI({
    temperature: 1,
    modelName: "gpt-3.5-turbo",
    streaming: Boolean(onTokenStream),
    callbackManager: onTokenStream
      ? CallbackManager.fromHandlers({
          async handleLLMNewToken(token) {
            onTokenStream(token);
          },
        })
      : undefined,
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      returnSourceDocuments: true,
    }
  );
  return chain;
};

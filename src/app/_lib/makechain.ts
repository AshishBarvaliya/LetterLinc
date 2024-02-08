import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { CallbackManager } from "langchain/callbacks";
 
const QA_PROMPT = `You're a supportive AI cover letter assistant. Craft a cover letter using the provided resume details and job description.
Keep it concise, not exceeding 150 words.
 
{context}
 
Job description: {question}
Cover letter:`;
 
export const makeChain = (
  vectorstore: PineconeStore,
  onTokenStream?: (token: string) => void
) => {
  const model = new OpenAI({
    temperature: 0.5,
    modelName: "gpt-4-0125-preview",
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

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { createAgent, dynamicSystemPromptMiddleware, tool } from "langchain";
import { z } from "zod";


const pdfPaths = [
    "C:/Users/gokul/personal-projects/langchainFramework/rag/docs/nke-10k-2023.pdf",
    "C:/Users/gokul/personal-projects/langchainFramework/rag/docs/Nike-Inc-2025_10K.pdf",
    "C:/Users/gokul/personal-projects/langchainFramework/rag/docs/nike-growth-story.pdf"
]

const allDocs = [];

for (const path of pdfPaths) {
    const loader = new PDFLoader(path);
    const docs = await loader.load();
    allDocs.push(...docs);
};


console.log(`Number of pages in PDF: ${allDocs.length}`);

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const allSplits = await textSplitter.splitDocuments(allDocs);
console.log(`Number of chunks created: ${allSplits.length}`);

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
});

const vectorStore = new MemoryVectorStore(embeddings);
await vectorStore.addDocuments(allSplits);


const retrieve_tool = tool(async ({query}) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 2);
    const docsContent = retrievedDocs
        .map((doc) => (typeof doc.pageContent === "string" ? doc.pageContent : ""))
        .join("/n/n");
    return `You are an AI assistant helping users by providing information based on the following context from a document:\n\n${docsContent}\n\n
    Use this information to answer the user's question as accurately as possible. 
    If the information is not available in the context, respond with "I don't know."`;
}, {
    name: "retrieve_document_info",
    description: "Retrieve information from documents based on user query",
    schema: z.object({
        query: z.string()
    })
});

const get_weather = tool((input) => {
    return `The weather in ${input.city} is sunny with a high of 25°C.`;
  }, 
  {
    name: "get_weather",
    description: "Get the current weather in given city",
    schema: z.object({
      city: z.string()
    })
  });


const agent = createAgent({
    model: "gpt-4o-mini",
    tools: [retrieve_tool, get_weather]
});

// const response = await agent.invoke({
//     messages: [{role: "user", content: "What is Nike's mission? & what's the weather in New York?"}]
// });

export const graph = agent;
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";


const pdfPaths = [
    "./docs/nke-10k-2023.pdf",
    "./docs/Nike-Inc-2025_10K.pdf",
    "./docs/nike-growth-story.pdf"
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

// const results = await vectorStore.similaritySearch("When was nike incorporated?");
// console.log(results);

const ragMiddleware = dynamicSystemPromptMiddleware(async (state) => {

    const userMessage = state.messages[0].content;
    const query = typeof userMessage === "string" ? userMessage : "";
    const retrivedDocs = await vectorStore.similaritySearch(query, 2);
    const docsContent = retrivedDocs.map((doc) => doc.pageContent).join("/n/n");
    return `You are an AI assistant helping users by providing information based on the following context from a document:\n\n${docsContent}\n\n
    Use this information to answer the user's question as accurately as possible. 
    If the information is not available in the context, respond with "I don't know."`;
});

const agent = createAgent({
    model: "gpt-4o-mini",
    tools: [],
    middleware: [ragMiddleware]
});

const response = await agent.invoke({
    messages: [{role: "user", content: "What is Nike's mission?"}]
});

console.log(response);
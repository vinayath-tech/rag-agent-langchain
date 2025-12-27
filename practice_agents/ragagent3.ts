import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";


const loader = new DocxLoader("./docs/nike-growth-story.docx");
const docs = await loader.load();


console.log(`Number of pages in PDF: ${docs.length}`);

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const allSplits = await textSplitter.splitDocuments(docs);
console.log(`Number of chunks created: ${allSplits.length}`);

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
});

const vectorStore = new MemoryVectorStore(embeddings);
await vectorStore.addDocuments(allSplits);

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
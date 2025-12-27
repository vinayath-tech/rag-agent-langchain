import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const loader = new PDFLoader("./docs/nke-10k-2023.pdf");
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

const results = await vectorStore.similaritySearch("When was nike incorporated?");
console.log(results);
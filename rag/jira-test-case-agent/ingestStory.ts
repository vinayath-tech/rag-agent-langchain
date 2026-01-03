import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";

export async function ingestStory(normalizedStory: string) {
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
    });

    // const vectorStore = await MemoryVectorStore.fromDocuments(
    //     [
    //         new Document({
    //         pageContent: normalizedStory,
    //         metadata: { source: "jira-story"},
    //         })
    //   ],
    //     embeddings
    // );

    const vectorStore =  MemoryVectorStore.fromTexts(
        [normalizedStory],
        [{ source: "jira-story" }],
        embeddings
    );

    console.log("Ingested Jira story into vector store.");
    return vectorStore;
}
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";  
import { fetchConfluencePage } from "./confluenceFetchTool";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import "dotenv/config";
import { createAgent, tool } from "langchain";
import { z } from "zod";

const textSplitters = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const docText = await fetchConfluencePage("131074");

//Create a document object
const doc = new Document({
    pageContent: docText,
    metadata: { source: "Confluence Page 131074" },
});

const allSplits = await textSplitters.splitDocuments([doc]);
console.log(`Total no of chunks are ${allSplits.length}`);

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
});

const vectorStore = new MemoryVectorStore(embeddings);
await vectorStore.addDocuments(allSplits);
console.log("Vector store created successfully");

const retriever_tool = tool(async ({ query }: { query: string }) => 
    {
        const retrievedDocs = await vectorStore.similaritySearch(query, 2);
        const docsContent = retrievedDocs
            .map((doc) => doc.pageContent).join("\n\n");

        return `Context from Confluence page:\n\n${docsContent}`;
    },
    {
        name: "retrieve_confluence_page",
        description: "Retrieve Confluence page content to generate user stories & acceptance criteria",
        schema: z.object({
            query: z.string().describe("Generate User story & acceptance criteria for the given feature")
        })
    }
);

const agent = createAgent({
        model: "gpt-4o-mini",
        tools: [retriever_tool],
        middleware: [],
        systemPrompt: `You are a Senior Business Analyst with strong domain experience.

        Your task is to generate comprehensive User Stories and Acceptance Criteria.

        IMPORTANT: Format your response EXACTLY as JSON with this structure:
        {
        "title": "Brief title of the user story",
        "userStory": "As a [role], I want [goal] so that [benefit]",
        "acceptanceCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
        }

        Do not include any other text, only the JSON object.`
});


const response = await agent.invoke({
    messages: [{ role: "user", content: "Generate user story and acceptance criteria for the given feature" }]
});

try {
    const lastMessageIndex = response.messages.length - 1;
    console.log(`Total messages on response is ${lastMessageIndex}`);
    const agentResponse = response.messages[lastMessageIndex].content;
    console.log(agentResponse);
} catch (error) {
    console.log("Raw response:", response);
}

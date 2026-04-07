import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

export async function generateTestCasesFromStory(vectorStore: any, issueKey: string) {

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const promptFile = load(
        readFileSync(resolve(__dirname, "./prompts/test-prompt.yaml"), "utf-8")
    ) as Array<{ role: string, content: string}>

  
    const llm = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0.2,
    });

    //Create a tool to retrieve context from the vector store
    const retrieveStoryTool = new DynamicStructuredTool({
        name: "retrieve_jira_story",
        description: "Retrieve JIRA story details & acceptance criteria to generate test cases",
        schema: z.object({
            query: z.string().describe("JIRA ticket number")
        }),
        func: async ({ query }) => {
            const retriever = vectorStore.asRetriever();
            const docs = await retriever.invoke(query);
            return docs.map((d: any) => d.pageContent).join("\n\n");
        }
    });


    const agent = createReactAgent({
        llm,
        tools: [retrieveStoryTool],
    });

    const systemPrompt = promptFile.find(p => p.role === "system")!.content;
    const humanPrompt = promptFile.find(p => p.role === "user")!.content;

    const result = await agent.invoke({
        messages: [ 
            new SystemMessage(systemPrompt),
            new HumanMessage(humanPrompt.replace("{issueKey}", issueKey))
        ]
    });

    const messages = result.messages;
    const finalResponse = messages[messages.length - 1].content;
    return finalResponse;
}


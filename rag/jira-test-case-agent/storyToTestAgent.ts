import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "langchain";
import { z } from "zod";
import "dotenv/config";

export async function generateTestCasesFromStory(vectorStore: any) {

  
    const llm = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0.2,
    });

    //Create a tool to retrieve context from the vector store
    const retrieveStoryTool = tool(
        async ({ query }) => {
            const retriever = vectorStore.asRetriever();
            const docs = await retriever.invoke(query);
            return docs.map((d: any) => d.pageContent).join("\n\n");
        },
        {
            name:"retrieve_jira_story",
            description: "Retrieve JIRA story details & acceptance criteria to generate test cases",
            schema: z.object({
                query: z.string().describe("JIRA ticket number")
            })
        }
    );


    const agent = createReactAgent({
        llm,
        tools: [retrieveStoryTool],
    });

    const result = await agent.invoke({
        messages: [ 
            {
                role: "system",
                content: `You are a Senior SDET with strong domain expertise.
                
                Your task is to generate comprehensive test cases. Follow these steps:
                1. Use the retrieve_jira_story tool to get the story details
                2. Analyze the acceptance criteria carefully
                3. Generate test cases in the following categories:
                   - Happy path test cases
                   - Negative test cases
                   - Boundary value test cases
                4. Format each test case with: title, description, precondition, steps, expected results
                5. Generate BDD Gherkin scenarios
                6. Identify missing or ambiguous acceptance criteria
                
                Rules:
                - Do NOT invent business rules
                - Clearly separate sections
                - Ask clarification questions if needed
                - Base everything on the retrieved context`
            },
            {
                role: "user",
                content: `Generate detailed test cases for the JIRA story with ticket number: {issueKey}`
            }
        ]
    });

    const messages = result.messages;
    const finalResponse = messages[messages.length - 1].content;
    return finalResponse;
}


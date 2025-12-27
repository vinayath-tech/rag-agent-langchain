import { createAgent, llmToolSelectorMiddleware, modelFallbackMiddleware, piiMiddleware, summarizationMiddleware, tool } from "langchain";
import { z } from "zod";
import "dotenv/config";


const searchTool = tool((query) => {
    return `Search results for query: ${query}`;
},
    {
        name: "search_tool",
        description: "A tool to search the web",
        schema: z.object({
            query: z.string().describe("The search query string")
        })
    });


const emailTool = tool((recipient, subject) => {
    return `Email sent to ${recipient} with subject: ${subject}`;
},
    {
        name: "email_tool",
        description: "A tool to send emails",
        schema: z.object({
            recipient: z.string().describe("The email recipient"),
            subject: z.string().describe("The email subject")
        })
    });


const getWeather = tool((input) => {
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
    model: "gpt-4o",
    tools: [searchTool, emailTool, getWeather],
    middleware: [
        modelFallbackMiddleware("gpt-4o-mini"),
        summarizationMiddleware({
            model: "gpt-4o",
            maxTokensBeforeSummary: 8000,
            messagesToKeep: 5
        }),
        llmToolSelectorMiddleware({
            model: "gpt-4o-mini",
            maxTools: 2
        }),
        piiMiddleware(
            "credit_card",
            { strategy: "mask", applyToInput: true}
        )
    ]
})

const response = await agent.invoke({
    messages: [{ role: "user", content: "The card number is 1234-5678-9021-2233, is this Master or visa?" }]
});

console.log(response);
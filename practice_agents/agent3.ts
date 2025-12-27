import { createAgent, initChatModel, tool } from "langchain";
import "dotenv/config";
import { z } from "zod";
import { MemorySaver } from "@langchain/langgraph";

const systemPrompt = `You are an expert weather assistannt with a great sense of humor.

You have access to below 2 tools:

get_wether: Get the current weather in given city
get_user_location: Retrieve user information based on user ID

If a user asks for weather without specifying a city, use get_user_location tool to find the user's city based on their user ID in the context, then use get_weather tool to get the weather for that city.`;


const getUserLocation = tool((_, config)=> {

    const userId = config.context.user_id;
    return userId === "1" ? "London" : "New York";
},{
        name: "get_user_location",
        description: "Retrieve user information based on user ID",
        schema: z.object({})
  }
);

const getWeather = tool((input) => {
    return `The weather in ${input.city} is sunny with a high of 25°C.`;
  }, 
  {
    name: "get_weather",
    description: "Get the current weather in given city",
    schema: z.object({
      city: z.string()
    })
  }
);

const config = {
    configurable: {thread_id: "1"},
    context : {user_id: "1"}
}

const responseFormat = z.object({
    humour_response: z.string().describe("A humorous response about the weather"),
    weather_response: z.string().describe("The actual weather information")
})

const checkPointer =  new MemorySaver();

const model = await initChatModel(
    "gpt-4o",
    {
        temperature: 0.7, timeout: 30000, max_tokens: 1000
    }
)

const agent = createAgent({
    model: model,
    tools: [getUserLocation, getWeather],
    systemPrompt: systemPrompt,
    responseFormat: responseFormat,
    checkpointer: checkPointer
});

const response = await agent.invoke({
    messages: [{role: "user", content: "What is weather outside?"}]
}, config);

console.log(response.structuredResponse);

const response2 = await agent.invoke({
    messages: [{role: "user", content: "What is the city you mentioned weather for?"}]
}, config);

console.log(response2.structuredResponse);

const response3 = await agent.invoke({
    messages: [{role: "user", content: "Suggest some good activities to do in that city?"}]
}, config);

console.log(response3.structuredResponse);
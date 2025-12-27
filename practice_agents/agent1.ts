import { createAgent, tool } from "langchain";
import "dotenv/config";
import { z } from "zod";

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

const getTime = tool((input) => {
    return `The current time in ${input.city} is 3:00 PM.`;
  },
  {
    name:"get_time",
    description: "Get the current time in given city",
    schema: z.object({
      city: z.string()
    })
  }
);

const agent = createAgent(
    {
      model: "gpt-4o",
      tools: [getWeather, getTime],
    },
);

const response = await agent.invoke({
    messages : [{ role: "user", content: "What is the weather today & current time in London?" }]
});

console.log(response);


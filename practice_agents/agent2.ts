import { createAgent, tool } from "langchain";
import "dotenv/config";
import { z } from "zod";
import { get } from "http";


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
    context : {user_id: "1"}
}

const agent = createAgent({
    model: "gpt-4o",
    tools: [getUserLocation, getWeather]
});

const response = await agent.invoke({
    messages: [{role: "user", content: "What is weather outside?"}]
}, config);

console.log(response);
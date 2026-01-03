import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";

export async function generateTestCasesFromStory(vectorStore: any) {

    // const llm = new ChatOpenAI({
    //     model: "gpt-4o",
    //     temperature: 0.2,
    // });

    // const retriever = vectorStore.asRetriever({
    //     k:3
    // });

    // const qaChain = RetrievalQAChain.fromLLM(llm, retriever, {
    //     returnSourceDocuments: true,
    // });

    // const result = await qaChain.call({
    //     query: `
    //         You are an Senior SDET    
    //         Generate detailed test cases for the following JIRA story.
    //         Generate:
    //             1. Happy path test cases
    //             2. Negative test cases
    //             3. Boundary cases
    //             4. BDD Gherkin scenarios
    //             5. Missing acceptance criteria questions

    //             Follow risk-based testing.
    //         `
    // });

    // return result;

    const TEST_CASE_PROMPT = PromptTemplate.fromTemplate(`
        You are a Senior SDET with strong domain expertise.

        Using ONLY the context below:
        - Generate happy path test cases
        - Generate negative test cases
        - Generate boundary value test cases
        - Generate BDD Gherkin scenarios
        - Identify missing or ambiguous acceptance criteria

        Rules:
        - Do NOT invent business rules
        - Clearly separate sections
        - Ask clarification questions if needed

        CONTEXT:
        {context}
    `);

    const llm = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0.2,
    });

    const retriever = vectorStore.asRetriever({
        k: 3
    });

  const sequence = RunnableSequence.from([
    {
      context: async () => {
        const docs = await retriever.invoke(
          "jira story acceptance criteria"
        );
        return docs.map((d: any) => d.pageContent).join("\n\n");
      },
    },
    TEST_CASE_PROMPT,
    llm,
    new StringOutputParser(),
  ]);

   return await sequence.invoke("Generate detailed test cases for the given JIRA story.");

}
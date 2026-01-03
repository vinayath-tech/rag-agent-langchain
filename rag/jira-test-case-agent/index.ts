import { getJiraStory } from "./jiraClient";
import { normalizeStory } from "./storyNormalizer";
import { ingestStory } from "./ingestStory";
import { generateTestCasesFromStory } from "./storyToTestAgent"; 

async function runJiraTestCaseAgent() {
  const story = await getJiraStory("DEV-1");

  const normalized = normalizeStory(story);

  const vectorStore = await ingestStory(normalized);

  const result = await generateTestCasesFromStory(vectorStore);

  console.log(result);
}

runJiraTestCaseAgent();

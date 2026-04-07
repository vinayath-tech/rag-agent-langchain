import { getJiraStory } from "./jiraClient.js";
import { normalizeStory } from "./storyNormalizer.js";
import { ingestStory } from "./ingestStory.js";
import { generateTestCasesFromStory } from "./storyToTestAgent.js"; 

export async function runJiraTestCaseAgent(issueKey: string) {
  const story = await getJiraStory(issueKey);

  const normalized = normalizeStory(story);

  const vectorStore = await ingestStory(normalized);

  const result = await generateTestCasesFromStory(vectorStore, issueKey);

  return result;
}

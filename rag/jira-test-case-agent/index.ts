import { getJiraStory } from "./jiraClient";
import { normalizeStory } from "./storyNormalizer";
import { ingestStory } from "./ingestStory";
import { generateTestCasesFromStory } from "./storyToTestAgent"; 

export async function runJiraTestCaseAgent(issueKey: string) {
  const story = await getJiraStory(issueKey);

  const normalized = normalizeStory(story);

  const vectorStore = await ingestStory(normalized);

  const result = await generateTestCasesFromStory(vectorStore);

  return result;
}

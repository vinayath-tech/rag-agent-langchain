export function normalizeStory(story: any): string {

    return `
    JIRA Story
    key: ${story.key}
    summary: ${story.summary}
    description: ${story.description}
    acceptanceCriteria: ${story.acceptanceCriteria}
    issueType: ${story.issueType}
    status: ${story.status}
    `
}
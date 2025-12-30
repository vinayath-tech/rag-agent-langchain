import axios from "axios";
import "dotenv/config";

const jira = axios.create({
    baseURL: process.env.JIRA_BASE_URL,
    auth: {
        username: process.env.JIRA_EMAIL || "",
        password: process.env.JIRA_API_TOKEN || "",
    },
    headers: {
        "Accept": "application/json"
    }
});

const issueKey = "DEV-1";

async function extractTextFromContent(content: any): Promise<string> {
    if(!content || !Array.isArray(content)) return "";
    const textArray = await Promise.all(
        content.map(async (item: any) => {
            if(item.type === "text") {
                return item.text;
            } else if(item.content) {
                return await extractTextFromContent(item.content);
            }
            return "";
        })
    );
    return textArray.join("\n");
}

export async function getJiraStory() {

    console.log("getJiraStory called with issueKey:DEV-1");

    try {
        const response =  await jira.get(`/rest/api/3/issue/DEV-1`);
        const fields = response.data.fields;

        const descriptionText = fields.description 
                ? await extractTextFromContent(fields.description?.content)
                : "";

        const acceptanceCriteriaText = fields.customfield_10072
                ? await extractTextFromContent(fields.customfield_10072?.content)
                : "";

        console.log("Jira Issue Description:", descriptionText);
        console.log("Jira Issue Acceptance Criteria:", acceptanceCriteriaText);
        console.log("Jira Issue type:", fields.issuetype.name);
        console.log("Jira Issue status:", fields.status?.name);
        return {
            key: 'DEV-1',
            summary: fields.summary,
            description: descriptionText || "",
            acceptanceCriteria: acceptanceCriteriaText || "",
            issueType: fields.issuetype.name,
            status: fields.status?.name || "",
        };
    }
    catch (error) {
        console.error("Error fetching Jira issue:", error);
        throw error;
    }
}
    
getJiraStory();



import  axios  from "axios";

export async function fetchConfluencePage(pageId: string) {
    const response = await axios.get(
        `https://vinayathtech.atlassian.net/wiki/rest/api/content/${pageId}?expand=body.storage`,
        {
            auth: {
                username: process.env.JIRA_EMAIL || "",
                password: process.env.JIRA_API_TOKEN || ""
            }
        }
    );
    return response.data.body.storage.value;
}

// fetchConfluencePage();
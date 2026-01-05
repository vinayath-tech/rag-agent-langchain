import express from 'express';
import cors from 'cors';
import { runJiraTestCaseAgent } from '../testCaseAgent';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/jira-test-case-agent', async (req, res) => {
    console.log('Received request body:', req.body);
    
    const { query } = req.body;
    
    if (!query) {
        console.log('Query field is missing');
        return res.status(400).json({ error: "Query is required" });
    }
    
    try {
        const result = await runJiraTestCaseAgent(query);
        console.log('Generated test cases:', result);
        
        // Extract the actual text content from the result
        let testCases = '';
        
        if (typeof result === 'string') {
            testCases = result;
        } else {
            testCases = JSON.stringify(result, null, 2);
        }
        
        res.json({ result: testCases });
    } catch (error) {
        console.error("Error generating test cases:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3001, () => console.log('JIRA Test Case Agent running on port 3001'));
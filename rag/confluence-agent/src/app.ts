import express from 'express';
import cors from 'cors';
import { initializeUserStoryAgent } from './../userStoryAgent.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/confluence-user-story-agent', async (req, res) => {
    console.log('Received request body:', req.body);
    
    const { query } = req.body;

    if (!query) {
        console.log('Query field is missing');
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        const response = await initializeUserStoryAgent(query);
        console.log(`Generated user story & acceptance criteria:\n${response}`);

        let result = response;
        if(typeof response === 'string') {
            try {
                result = JSON.parse(response);
            } catch (error) {
                result = response; // keep as string if parsing fails
            }
        }
        res.json({ result });
    } catch (error) {
        console.error("Error invoking agent:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', agent: 'confluence-user-story-agent' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Confluence User Story Agent running on port ${PORT}`));
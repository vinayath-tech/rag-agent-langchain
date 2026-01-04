import express from 'express';
import cors from 'cors';
import { runJiraTestCaseAgent } from './../index';

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());

app.post('/jira-test-case-agent', async (req, res) => {
  const { query } = req.body;
  const result = await runJiraTestCaseAgent(query);
  res.json({ result });
});

app.listen(3001, () => console.log('JIRA Test Case Agent running on port 3001'));
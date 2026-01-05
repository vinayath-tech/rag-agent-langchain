import express from 'express';
import cors from 'cors';
import { initializeAgent } from './../ragagent';

const app = express();
app.use(cors());

app.use(express.json());

const agent = await initializeAgent();

app.post('/nike-question-agent', async (req, res) => {
    const { question } = req.body;

   if (!question)  return res.status(400).json({ error: "Question is required" });
    try {
            const response = await agent.invoke({
                messages: [{ role: "user", content: question }],
            });

            res.json({ answer: response });
    } catch (error) {
            console.error("Error invoking agent:", error);
            res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () => console.log('Nike Question Agent running on port 3000'));
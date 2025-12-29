import express from "express";
import "dotenv/config";
import { initializeAgent } from "./ragagent";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const port = 3000;

// Resolve the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

(async () => {
    const agent = await initializeAgent();

    app.post("/ask", async (req, res) => {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

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

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
# LangChainFramework

This project demonstrates the use of LangChain, a powerful framework for building AI agents with tools, middleware, and document-based retrieval capabilities. This project includes various agents, tools, and a server implementation to interact with the agents via a web-based interface.

## Features

- **Document Retrieval**: Load and process PDF documents, split them into chunks, and perform similarity searches using embeddings.
- **Custom Tools**: Define tools for retrieving weather, user location, and more.
- **Dynamic Middleware**: Use middleware for dynamic model selection, summarization, and PII masking.
- **Web Interface**: Interact with the agents through a simple chat interface built with HTML, CSS, and JavaScript.
- **Agent Variants**: Multiple agent implementations for different use cases, including RAG (Retrieval-Augmented Generation) agents.
- **JIRA Integration**: JIRA test agent for interacting with JIRA APIs to create Positive / Negative test cases & to identify gaps in requirements

## Prerequisites

-Node.js (v16+)
- npm or yarn
- OpenAI API key (set in `.env` file)
- JIRA API credentials (for JIRA agent)
- Confluence API credentials (for Confluence agent)

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:vinayath-tech/rag-agent-langchain.git
   cd rag-agent-langchain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory (or use the existing one).
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your-openai-api-key
     ```
   - For JIRA agent, add JIRA credentials:
     ```
     JIRA_HOST=your-jira-instance.atlassian.net
     JIRA_EMAIL=your-email@example.com
     JIRA_API_TOKEN=your-jira-api-token
     ```

   - For Confluence agent, add Confluence credentials:
     ```
     MONGODB_ATLAS_URI=mongo DB connection string
     MONGODB_ATLAS_COLLECTION_NAME=collection-name
     MONGODB_ATLAS_DB_NAME=database-name
     ```

## Usage

### Running the Nike RAG Agent Server

1. Start the Nike RAG agent backend server:
   ```bash
   npm run start-nike-agent
   ```

2. Start the frontend UI (in a separate terminal):
   ```bash
   npm run start:ui
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

4. Interact with the agent by typing questions in the chat interface.

### Running the JIRA Test Agent

1. Start the JIRA agent backend server:
   ```bash
   npm run start-jira-agent
   ```

2. Start the frontend UI (in a separate terminal):
   ```bash
   npm run start:ui
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

4. Interact with the JIRA agent to:
   - Type the Ticket number in chat & get your test cases generated for the User story

### Running the Confluence Agent

1. Start the Confluence agent backend server:
   ```bash
   npm run start-confluence-agent
   ```

2. Make a /POST call to below endpoint by passing `PageID` number in request payload:
   ```
   http://localhost:3002/confluence-user-story-agent
   ```

   Request payload format
   ```
   {
      "query": "<PageId>"
   }
   ```

3. Verify the User-story & AC returned by the Agent in API response:


### Running Practice Agents

You can run individual practice agents to test their functionality. For example:
```bash
npx tsx practice_agents/agent1.ts
```

## Key Components

### Nike RAG Agent

The Nike RAG (Retrieval-Augmented Generation) agent is implemented in `rag/nike-question-agent/ragagent.ts`. It processes PDF documents, splits them into chunks, and uses embeddings for similarity searches. The agent is exposed via an Express server in `rag/nike-question-agent/server.ts`.

### JIRA Test Agent

The JIRA RAG agent is implemented in `jira-test-agent/jira-agent.ts`. It provides tools to interact with JIRA APIs, including:
- Type the Ticket number in chat & get your test cases generated for the User story

The agent is exposed via an Express server in `jira-test-agent/server.ts`.

### Confluence Agent

The Confluence agent is implemented in `confluence-agent/confluence-agent.ts`. It provides tools to interact with Confluence APIs :
- To fetch User story from the BRD
- To fetch Acceptance criteria from BRD

The agent is exposed via an Express server in `confluence-agent/server.ts`.


### Frontend

The frontend is located in the `public` directory (shared across agents):
- `index.html`: Chat interface.
- `style.css`: Styling for the chat interface.
- `script.js`: Handles user interactions and communicates with the backend.

The frontend automatically connects to the backend server running on port 3000.

## Available Scripts

- `npm run start:rag` - Start the RAG agent backend server
- `npm run start:jira` - Start the JIRA agent backend server
- `npm run start:confluence` - Start the Confluence agent backend server
- `npm run start:ui` - Start the frontend UI server (serves public folder on port 8080)

## Configuration

### LangGraph

The project uses LangGraph for managing agents and tools. The configuration is defined in `langgraph.json`. The `rag_agent` graph is mapped to the RAG agent in `practice_agents/ragagent4.ts`.

### TypeScript

The TypeScript configuration is defined in `tsconfig.json`. The compiled files are output to the `dist` directory.

## Dependencies

- [LangChain](https://github.com/hwchase17/langchain)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://github.com/colinhacks/zod)
- [dotenv](https://github.com/motdotla/dotenv)

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [LangChain](https://github.com/hwchase17/langchain) for providing the framework.
- OpenAI for the GPT models used in this project.
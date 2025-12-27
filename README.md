# LangChainFramework

This project demonstrates the use of LangChain, a powerful framework for building AI agents with tools, middleware, and document-based retrieval capabilities. This project includes various agents, tools, and a server implementation to interact with the agents via a web-based interface.

## Features

- **Document Retrieval**: Load and process PDF documents, split them into chunks, and perform similarity searches using embeddings.
- **Custom Tools**: Define tools for retrieving weather, user location, and more.
- **Dynamic Middleware**: Use middleware for dynamic model selection, summarization, and PII masking.
- **Web Interface**: Interact with the agents through a simple chat interface built with HTML, CSS, and JavaScript.
- **Agent Variants**: Multiple agent implementations for different use cases, including RAG (Retrieval-Augmented Generation) agents.

## Project Structure

```
.
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── langgraph.json              # LangGraph configuration
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── practice_agents/            # Practice agent implementations
├── rag/                        # RAG agent and server implementation
│   ├── docs/                   # PDF documents for retrieval
│   ├── public/                 # Frontend files (HTML, CSS, JS)
│   ├── ragagent.ts             # RAG agent implementation
│   ├── server.ts               # Express server
└── README.md                   # Project documentation
```

## Prerequisites

- Node.js (v16+)
- npm or yarn
- OpenAI API key (set in `.env` file)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/langchainframework.git
   cd langchainframework
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

## Usage

### Running the RAG Agent Server

1. Start the server:
   ```bash
   npx tsx rag/server.ts
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Interact with the agent by typing questions in the chat interface.

### Running Practice Agents

You can run individual practice agents to test their functionality. For example:
```bash
npx tsx practice_agents/agent1.ts
```

## Key Components

### RAG Agent

The RAG (Retrieval-Augmented Generation) agent is implemented in `rag/ragagent.ts`. It processes PDF documents, splits them into chunks, and uses embeddings for similarity searches. The agent is exposed via an Express server in `rag/server.ts`.


### Frontend

The frontend is located in the `rag/public` directory:
- `index.html`: Chat interface.
- `style.css`: Styling for the chat interface.
- `script.js`: Handles user interactions and communicates with the backend.

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

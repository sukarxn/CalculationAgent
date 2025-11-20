# Calculation Agent

An AI-powered arithmetic agent built with LangChain and Google's Gemini model. This agent can perform mathematical calculations by intelligently using tools for addition, multiplication, and division.

## Features

- **Tool-based calculations**: Uses LangChain tools for add, multiply, and divide operations
- **Multi-step reasoning**: Handles complex arithmetic problems requiring multiple operations
- **Google Gemini integration**: Powered by Gemini 2.5 Flash model
- **LangGraph workflow**: Implements an agentic workflow with iterative tool calling

## Prerequisites

- Node.js (v18 or higher)
- A Google API key for Gemini

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sukarxn/CalculationAgent.git
cd CalculationAgent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
GOOGLE_API_KEY=your-google-api-key-here
```

## Usage

Run the agent:
```bash
npm start
```

The default example asks: *"What do we get on dividing 225 by 15 and then multiplying by 4?"*

To modify the question, edit the query in `index.ts`:
```typescript
const result = await agent.invoke([new HumanMessage("Your question here")]);
```

## How It Works

1. **Tools Definition**: Three arithmetic tools (add, multiply, divide) are defined using LangChain's tool framework
2. **Model Setup**: Google Gemini model is configured with tool bindings
3. **Agent Loop**: The agent:
   - Receives a user message
   - Calls the LLM to determine which tools to use
   - Executes the tools
   - Feeds results back to the LLM
   - Repeats until the problem is solved

## Project Structure

```
.
├── index.ts          # Main agent implementation
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── .env             # Environment variables (not committed)
└── README.md        # This file
```

## Technologies

- **LangChain**: Framework for building LLM applications
- **LangGraph**: Library for building stateful, multi-actor applications
- **Google Gemini**: AI model for natural language understanding
- **TypeScript**: Type-safe JavaScript
- **Zod**: Schema validation

## What I learnt in this project

Developing this basic Agent that performs the calculation for the user helped me understand how the langgraph framework for agent orchestration works. I have gained an understanding of how i can implement ai agents to solve problems using this framework.

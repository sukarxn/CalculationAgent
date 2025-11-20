import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
  temperature: 0,
});

const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "Divide two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const toolsByName = {
    [add.name]: add,
    [multiply.name]: multiply,
    [divide.name]:divide
};

const tools  = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);

// Define Model node

import { task, entrypoint } from "@langchain/langgraph";
import { SystemMessage, type BaseMessage } from "@langchain/core/messages";
const callLlm = task({ name: "callLlm" }, async (messages: BaseMessage[]) => {
  return modelWithTools.invoke([
    new SystemMessage(
      "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    ),
    ...messages,
  ]);
});

// Define tool node
import type { ToolCall } from "@langchain/core/messages/tool";
const callTool = task({ name: "callTool"}, async (toolCall: ToolCall) => {
    const tool = toolsByName[toolCall.name];
    return tool.invoke(toolCall);
})

// Define Agent
import { addMessages } from "@langchain/langgraph";
import { isAIMessage } from "@langchain/core/messages";
const agent = entrypoint({ name: "agent" }, async (messages: BaseMessage[]) => {
let modelResponse = await callLlm(messages);

  while (true) {
    if (!modelResponse.tool_calls?.length) {
      break;
    }

    // Execute tools
    const toolResults = await Promise.all(
      modelResponse.tool_calls.map((toolCall) => callTool(toolCall))
    );
    messages = addMessages(messages, [modelResponse, ...toolResults]);
    modelResponse = await callLlm(messages);
  }
  return messages;
});

// Invoke
import { HumanMessage } from "@langchain/core/messages";
const result = await agent.invoke([new HumanMessage("What do we get on dividing 225 by 15 and then multiplying by 4?")]);

for (const message of result) {
  console.log(`[${message.getType()}]: ${message.text}`);
}
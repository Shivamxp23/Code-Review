#!/usr/bin/env node
// Ponytail MCP server: serves the lazy-senior-dev ruleset over stdio as a
// prompt (user-invoked) and a tool (for hosts that pull context via tools).
// It does NOT replace the always-on adapters; it's the clean option for hosts
// whose only injection point is the prompt menu (see #70).
import fs from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { MODES, buildInstructions, resolveMode, getSkillInstructions } from "./instructions.js";

const { version } = JSON.parse(
  await fs.promises.readFile(new URL("../package.json", import.meta.url), "utf8")
);
const server = new McpServer({ name: "ponytail", version });

const modeArg = z
  .enum(MODES)
  .optional()
  .describe("Ponytail intensity: lite, full, or ultra. Omit for the configured default.");

server.registerPrompt(
  "ponytail",
  {
    title: "Ponytail mode",
    description: "Lazy senior dev instructions: YAGNI, stdlib first, the smallest correct change.",
    argsSchema: { mode: modeArg },
  },
  ({ mode }) => ({
    messages: [{ role: "user", content: { type: "text", text: buildInstructions(mode) } }],
  }),
);

server.registerTool(
  "ponytail_instructions",
  {
    title: "Ponytail instructions",
    description: "Return the Ponytail ruleset for the given intensity (lite, full, or ultra).",
    inputSchema: { mode: modeArg },
    outputSchema: { mode: z.string(), instructions: z.string() },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  ({ mode }) => {
    const resolvedMode = resolveMode(mode);
    const instructions = buildInstructions(resolvedMode);
    const structuredContent = { mode: resolvedMode, instructions };
    return { content: [{ type: "text", text: instructions }], structuredContent };
  },
);

server.registerTool(
  "reviewer_qa",
  {
    title: "QA Analysis",
    description: "Run holistic QA analysis on the current codebase",
    inputSchema: { 
      path: z.string().describe("Path to the repository to analyze") 
    },
    outputSchema: { instructions: z.string() },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  ({ path }) => {
    const instructions = getSkillInstructions("reviewer-qa");
    const structuredContent = { instructions };
    return { content: [{ type: "text", text: instructions }], structuredContent };
  },
);

server.registerTool(
  "reviewer_impact",
  {
    title: "Impact Analysis",
    description: "Analyze the impact of a proposed change on the codebase",
    inputSchema: { 
      prompt: z.string().describe("The change request to analyze"),
      path: z.string().describe("Path to the repository") 
    },
    outputSchema: { instructions: z.string() },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  ({ prompt, path }) => {
    const instructions = getSkillInstructions("reviewer-impact");
    const structuredContent = { instructions };
    return { content: [{ type: "text", text: instructions }], structuredContent };
  },
);

server.registerTool(
  "reviewer_plan",
  {
    title: "Implementation Plan",
    description: "Generate an atomic implementation plan for a proposed change",
    inputSchema: { 
      prompt: z.string().describe("The change request to plan"),
      path: z.string().describe("Path to the repository") 
    },
    outputSchema: { instructions: z.string() },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  ({ prompt, path }) => {
    const instructions = getSkillInstructions("reviewer-plan");
    const structuredContent = { instructions };
    return { content: [{ type: "text", text: instructions }], structuredContent };
  },
);

await server.connect(new StdioServerTransport());

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GitHubService } from "./services/github.js";
import {
  handleListSkills,
  getSkillSchema,
  handleGetSkill,
  getSkillsSchema,
  handleGetSkills,
} from "./tools/index.js";

const server = new McpServer({
  name: "my-personal-code-mcp",
  version: "1.0.0",
  description: "MCP server for AI best practices skills from GitHub repository",
});

let githubService: GitHubService;

try {
  githubService = new GitHubService();
} catch (error) {
  console.error("Failed to initialize GitHub service:", error);
  process.exit(1);
}

server.registerTool(
  "list_skills",
  {
    description: "Returns a list of all available best practice skills",
  },
  async () => {
    try {
      const result = await handleListSkills(githubService);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "get_skill",
  {
    description: "Returns the content of a specific best practice skill",
    inputSchema: getSkillSchema,
  },
  async (input) => {
    try {
      const result = await handleGetSkill(githubService, input);
      return {
        content: [{ type: "text", text: result.content }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "get_skills",
  {
    description: "Returns the content of multiple best practice skills",
    inputSchema: getSkillsSchema,
  },
  async (input) => {
    try {
      const result = await handleGetSkills(githubService, input);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

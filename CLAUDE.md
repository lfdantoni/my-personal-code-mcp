# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run build    # Compile TypeScript to dist/
npm run dev      # Watch mode - recompile on changes
npm start        # Run the compiled server
```

## Architecture

This is an MCP (Model Context Protocol) server that exposes skills (markdown files) from a GitHub repository as tools for AI assistants.

### Core Components

- **`src/index.ts`**: MCP server entry point. Registers two tools (`list_skills`, `get_skill`) and connects via stdio transport.
- **`src/services/github.ts`**: `GitHubService` class wrapping Octokit. Handles fetching directory listings and file contents from GitHub. Includes custom error handling with typed error codes (`NOT_FOUND`, `RATE_LIMIT`, `AUTH_ERROR`, `UNKNOWN`).
- **`src/tools/`**: Tool handlers with Zod schemas for input validation.

### Configuration

The server requires environment variables at runtime:
- `SKILLS_REPO_OWNER` (required): GitHub username/org
- `SKILLS_REPO_NAME` (required): Repository name
- `SKILLS_PATH` (optional): Subdirectory containing skill files
- `GITHUB_TOKEN` (optional): Required for private repos

### Key Patterns

- Uses ES modules (`"type": "module"` in package.json)
- Tool schemas use Zod for validation
- Strict TypeScript configuration with full null checking

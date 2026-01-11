# my-personal-code-mcp

An MCP (Model Context Protocol) server that provides AI assistants with access to best practice skills stored as markdown files in a GitHub repository.

## Features

- **list_skills**: Returns a list of all available skill names from the configured repository
- **get_skill**: Retrieves the content of a specific skill by name

## Installation

```bash
# Clone the repository
git clone https://github.com/lfdantoni/my-personal-code-mcp.git
cd my-personal-code-mcp

# Install dependencies
npm install

# Build
npm run build
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SKILLS_REPO_OWNER` | GitHub repository owner (username or organization) | Yes |
| `SKILLS_REPO_NAME` | GitHub repository name | Yes |
| `SKILLS_PATH` | Subdirectory containing skill files (default: root) | No |
| `GITHUB_TOKEN` | GitHub personal access token (required for private repos) | No |

### Skills Repository Structure

Your skills repository should contain markdown files (`.md`) with best practices:

```
your-skills-repo/
├── typescript-best-practices.md
├── react-patterns.md
├── testing-guidelines.md
└── ...
```

Or with a subdirectory:

```
your-skills-repo/
└── skills/
    ├── typescript-best-practices.md
    ├── react-patterns.md
    └── ...
```

## MCP Client Configuration

### Cursor

Add the following to your Cursor MCP settings file (`~/.cursor/mcp.json` or via Settings > MCP):

```json
{
  "mcpServers": {
    "my-personal-code-mcp": {
      "command": "node",
      "args": ["C:/path/to/my-personal-code-mcp/dist/index.js"],
      "env": {
        "SKILLS_REPO_OWNER": "your-github-username",
        "SKILLS_REPO_NAME": "your-skills-repo",
        "SKILLS_PATH": "",
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Claude Desktop

Add the following to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "my-personal-code-mcp": {
      "command": "node",
      "args": ["C:/path/to/my-personal-code-mcp/dist/index.js"],
      "env": {
        "SKILLS_REPO_OWNER": "your-github-username",
        "SKILLS_REPO_NAME": "your-skills-repo",
        "SKILLS_PATH": "",
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Claude Code CLI

Add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "my-personal-code-mcp": {
      "command": "node",
      "args": ["/path/to/my-personal-code-mcp/dist/index.js"],
      "env": {
        "SKILLS_REPO_OWNER": "your-github-username",
        "SKILLS_REPO_NAME": "your-skills-repo"
      }
    }
  }
}
```

## Available Tools

### list_skills

Returns a list of all available skill names.

**Input**: None

**Output**:
```json
{
  "skills": ["typescript-best-practices", "react-patterns", "testing-guidelines"]
}
```

### get_skill

Returns the content of a specific skill.

**Input**:
```json
{
  "skill_name": "typescript-best-practices"
}
```

**Output**: The markdown content of the skill file.

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Run the server
npm start
```

## License

ISC

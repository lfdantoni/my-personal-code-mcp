import { Octokit } from "octokit";

export interface SkillFile {
  name: string;
  path: string;
}

export class GitHubServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "NOT_FOUND" | "RATE_LIMIT" | "AUTH_ERROR" | "UNKNOWN"
  ) {
    super(message);
    this.name = "GitHubServiceError";
  }
}

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private skillsPath: string;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    this.owner = process.env.SKILLS_REPO_OWNER || "";
    this.repo = process.env.SKILLS_REPO_NAME || "";
    this.skillsPath = process.env.SKILLS_PATH || "";

    if (!this.owner || !this.repo) {
      throw new Error(
        "SKILLS_REPO_OWNER and SKILLS_REPO_NAME environment variables are required"
      );
    }

    this.octokit = new Octokit({ auth: token });
  }

  async listSkillFiles(): Promise<SkillFile[]> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: this.skillsPath,
      });

      if (!Array.isArray(response.data)) {
        throw new GitHubServiceError(
          "Expected directory but found file",
          "UNKNOWN"
        );
      }

      return response.data
        .filter((item) => item.type === "file" && item.name.endsWith(".md"))
        .map((item) => ({
          name: item.name.replace(/\.md$/, ""),
          path: item.path,
        }));
    } catch (error) {
      throw this.handleError(error, "listing skills");
    }
  }

  async getSkillContent(skillName: string): Promise<string> {
    const filePath = this.skillsPath
      ? `${this.skillsPath}/${skillName}.md`
      : `${skillName}.md`;

    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
      });

      if (Array.isArray(response.data)) {
        throw new GitHubServiceError(
          `"${skillName}" is a directory, not a skill file`,
          "NOT_FOUND"
        );
      }

      if (response.data.type !== "file" || !("content" in response.data)) {
        throw new GitHubServiceError(
          `"${skillName}" is not a valid skill file`,
          "NOT_FOUND"
        );
      }

      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      );
      return content;
    } catch (error) {
      throw this.handleError(error, `fetching skill "${skillName}"`);
    }
  }

  private handleError(error: unknown, context: string): GitHubServiceError {
    if (error instanceof GitHubServiceError) {
      return error;
    }

    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;

      switch (status) {
        case 404:
          return new GitHubServiceError(
            `Resource not found while ${context}`,
            "NOT_FOUND"
          );
        case 403:
          const message =
            "message" in error ? String(error.message) : "Rate limit exceeded";
          if (message.toLowerCase().includes("rate limit")) {
            return new GitHubServiceError(
              `GitHub API rate limit exceeded while ${context}`,
              "RATE_LIMIT"
            );
          }
          return new GitHubServiceError(
            `Access forbidden while ${context}. Check GITHUB_TOKEN.`,
            "AUTH_ERROR"
          );
        case 401:
          return new GitHubServiceError(
            `Authentication failed while ${context}. Check GITHUB_TOKEN.`,
            "AUTH_ERROR"
          );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new GitHubServiceError(
      `Error ${context}: ${errorMessage}`,
      "UNKNOWN"
    );
  }
}

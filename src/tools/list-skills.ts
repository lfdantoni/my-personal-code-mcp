import { GitHubService, GitHubServiceError } from "../services/github.js";

export const listSkillsSchema = {};

export interface SkillInfo {
  name: string;
  description?: string;
}

export interface ListSkillsResult {
  skills: SkillInfo[];
}

export async function handleListSkills(
  githubService: GitHubService
): Promise<ListSkillsResult> {
  try {
    const files = await githubService.listSkillFiles();
    const skills = files.map((file) => ({
      name: file.name,
      ...(file.description && { description: file.description }),
    }));
    return { skills };
  } catch (error) {
    if (error instanceof GitHubServiceError) {
      throw new Error(`Failed to list skills: ${error.message}`);
    }
    throw error;
  }
}

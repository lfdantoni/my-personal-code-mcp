import { z } from "zod";
import { GitHubService, GitHubServiceError } from "../services/github.js";

export const listSkillsSchema = {};

export interface ListSkillsResult {
  skills: string[];
}

export async function handleListSkills(
  githubService: GitHubService
): Promise<ListSkillsResult> {
  try {
    const files = await githubService.listSkillFiles();
    const skills = files.map((file) => file.name);
    return { skills };
  } catch (error) {
    if (error instanceof GitHubServiceError) {
      throw new Error(`Failed to list skills: ${error.message}`);
    }
    throw error;
  }
}

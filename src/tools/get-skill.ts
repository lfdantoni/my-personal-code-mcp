import { z } from "zod";
import { GitHubService, GitHubServiceError } from "../services/github.js";

export const getSkillSchema = {
  skill_name: z.string().describe("The name of the skill to retrieve"),
};

export interface GetSkillInput {
  skill_name: string;
}

export interface GetSkillResult {
  skill_name: string;
  content: string;
}

export async function handleGetSkill(
  githubService: GitHubService,
  input: GetSkillInput
): Promise<GetSkillResult> {
  const { skill_name } = input;

  if (!skill_name || typeof skill_name !== "string") {
    throw new Error("skill_name is required and must be a string");
  }

  const trimmedName = skill_name.trim();
  if (trimmedName.length === 0) {
    throw new Error("skill_name cannot be empty");
  }

  try {
    const content = await githubService.getSkillContent(trimmedName);
    return {
      skill_name: trimmedName,
      content,
    };
  } catch (error) {
    if (error instanceof GitHubServiceError) {
      if (error.code === "NOT_FOUND") {
        throw new Error(`Skill "${trimmedName}" not found`);
      }
      throw new Error(`Failed to get skill: ${error.message}`);
    }
    throw error;
  }
}

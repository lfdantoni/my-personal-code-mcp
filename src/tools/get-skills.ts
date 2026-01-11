import { z } from "zod";
import { GitHubService, GitHubServiceError } from "../services/github.js";

export const getSkillsSchema = {
  skill_names: z
    .array(z.string())
    .describe("The names of the skills to retrieve"),
};

export interface GetSkillsInput {
  skill_names: string[];
}

export interface SkillResult {
  skill_name: string;
  content: string;
  error?: string;
}

export interface GetSkillsResult {
  skills: SkillResult[];
}

export async function handleGetSkills(
  githubService: GitHubService,
  input: GetSkillsInput
): Promise<GetSkillsResult> {
  const { skill_names } = input;

  if (!Array.isArray(skill_names) || skill_names.length === 0) {
    throw new Error("skill_names is required and must be a non-empty array");
  }

  const results = await Promise.all(
    skill_names.map(async (name): Promise<SkillResult> => {
      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        return {
          skill_name: name,
          content: "",
          error: "Skill name cannot be empty",
        };
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
            return {
              skill_name: trimmedName,
              content: "",
              error: `Skill "${trimmedName}" not found`,
            };
          }
          return {
            skill_name: trimmedName,
            content: "",
            error: error.message,
          };
        }
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
          skill_name: trimmedName,
          content: "",
          error: message,
        };
      }
    })
  );

  return { skills: results };
}


import { GoogleGenAI } from "@google/genai";
import type { Selections } from '../types';
import { PLAYBOOK_OPTIONS } from "../constants";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(selections: Selections): string {
    let prompt = `
You are an expert Ansible automation engineer. Your task is to generate a comprehensive and well-structured set of Ansible playbooks for a homelab environment based on the user's selections.

**Requirements:**
- The output must be valid YAML.
- Structure the project with roles for modularity and reusability.
- Ensure all operations are idempotent.
- Follow Ansible best practices, including using handlers for service restarts and supporting check mode.
- Use variables for configuration to make playbooks flexible.
- For secrets, show placeholders for Ansible Vault integration (e.g., {{ vault_my_secret }}).
- Provide the content for a main \`site.yml\` playbook and the key files for the requested roles (e.g., \`roles/common/tasks/main.yml\`).
- If documentation is requested, generate a comprehensive README.md file in Markdown format. This README must include detailed explanations for each selected component, covering variables, dependencies, clear execution instructions with examples, and a detailed 'Troubleshooting' section. This section must address common issues for the selected services (e.g., Docker permission errors, Kubernetes networking, firewall port conflicts, reverse proxy configuration issues) and provide specific commands and steps to diagnose and resolve them.
- If 'Check mode (dry-run) support' is selected, the execution instructions in the README.md must explicitly demonstrate how to run the playbook with the \`--check\` flag for a dry run.
- If 'Custom Variables File' is selected, modify the main playbook (\`site.yml\`) to include a \`vars_files\` section pointing to a placeholder path like \`vars/custom_vars.yml\`. Also, mention in the README.md how to create and use this file for overriding default variables.

Based on the selections below, generate the necessary Ansible playbook content. Present the output as a single block of text, using YAML comments (---) to separate different files (e.g., site.yml, roles/common/tasks/main.yml, README.md).

**User Selections:**
`;

    // Dynamically build the selections part of the prompt
    for (const categoryKey in PLAYBOOK_OPTIONS) {
        const key = categoryKey as keyof Selections;
        const categoryData = PLAYBOOK_OPTIONS[key];
        const selectedItems = Object.keys(selections[key]).filter(
            option => selections[key][option]
        );

        if (selectedItems.length > 0) {
            prompt += `\n**${categoryData.title}:**\n`;
            selectedItems.forEach(item => {
                prompt += `- ${item}\n`;
            });
        }
    }

    return prompt;
}

export const generatePlaybook = async (selections: Selections): Promise<string> => {
    const prompt = buildPrompt(selections);
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        if (response.text) {
             // Clean up the response to remove markdown backticks for code blocks
            return response.text.replace(/```(yaml|markdown)?/g, '').trim();
        } else {
            throw new Error("The API returned an empty response.");
        }

    } catch (error) {
        console.error("Error generating playbook:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred while generating the playbook.");
    }
};
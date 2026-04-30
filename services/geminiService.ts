
import { GoogleGenAI, Type } from "@google/genai";
import type { Selections, DocSuggestion } from '../types';
import { PLAYBOOK_OPTIONS } from "../constants";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(selections: Selections, customVariables: string, ansibleVersion: string): string {
    const securitySelections = selections.securityHardening;
    const isVaultSelected = securitySelections && securitySelections['Ansible Vault integration'];

    let prompt = `
You are an expert Ansible automation engineer. Your task is to generate a comprehensive and well-structured set of Ansible playbooks for a homelab environment based on the user's selections.

**Requirements:**
- Target Ansible Version: ${ansibleVersion}
- The output must be valid YAML, clearly separated by file using YAML comments like "--- # filename.yml".
- Structure the project with roles for modularity and reusability.
- Ensure all operations are idempotent.
- Follow Ansible best practices, including using handlers for service restarts and supporting check mode.
- Use variables for configuration to make playbooks flexible.
${isVaultSelected ? "- **Ansible Vault Integration:** Since 'Ansible Vault integration' is selected, you MUST use placeholders for all sensitive information (passwords, API keys, etc.) like `{{ vault_db_password }}` and ensure the documentation references Ansible Vault best practices." : "- For secrets, show placeholders for Ansible Vault integration (e.g., {{ vault_my_secret }})."}
- Provide the content for a main \`site.yml\` playbook and the key files for the requested roles (e.g., \`roles/common/tasks/main.yml\`).
`;

    const docSelections = selections.documentation;
    const isDocRequested = Object.values(docSelections).some(v => v);

    if (isDocRequested) {
        prompt += `
**Documentation Generation:**
Based on the user's documentation selections below, generate the appropriate files.
`;
        if (docSelections['Playbook reference (README)']) {
            prompt += `
- **Generate a main README.md:** This file MUST be highly structured and include the following sections, populated with relevant information based on all other user selections:
    1.  **Prerequisites:** List all requirements, such as Ansible version, required collections (e.g., \`community.docker\`), and any necessary pre-configuration on the target hosts.
    2.  **Role Overview:** Briefly describe the purpose of each selected role in the playbook.
    3.  **Variable Configuration:** Detail the most important variables that users might need to change (e.g., usernames, ports, domain names), explaining what they do and providing examples.
    4.  **Execution:** Provide clear, step-by-step instructions on how to run the playbook, including how to set up the inventory file and the exact \`ansible-playbook\` command to use. If 'Check mode' is selected, show how to use the \`--check\` flag.
    5.  **Troubleshooting:** Provide a very detailed and practical troubleshooting section. For each major service selected (e.g., Docker, Nginx, PostgreSQL, Media Server), identify 2-3 common real-world problems. For each problem, provide clear, step-by-step solutions with the exact shell commands needed to diagnose and fix the issue. Make this section highly actionable for a user who is stuck. Examples:
        *   **General:** "How to check service status (\`systemctl status <service>\`) and view logs (\`journalctl -u <service>\`)."
        *   **Networking:** "Firewall ports being blocked (\`ufw status\`) and how to allow traffic."
        *   **Docker:** "Resolving 'permission denied' errors by adding users to the \`docker\` group." or "Debugging container restart loops with \`docker logs <container_name>\`."
        *   **Nginx/Reverse Proxy:** "Debugging '502 Bad Gateway' errors by checking backend service logs."
        *   **Databases:** "Connection issues due to incorrect host-based authentication in \`pg_hba.conf\`."
        *   **Media Server (Plex/Jellyfin):** "Resolving permission issues accessing media files (check user/group ownership) or "Hardware transcoding not working due to incorrect Docker device mapping (\`/dev/dri\`)."
        *   **Home Assistant:** "Debugging Z-Wave/Zigbee USB stick detection issues by checking device paths and container permissions."
        *   **Backups:** "Troubleshooting failed database backups due to permissions issues with the backup directory or incorrect credentials."
    6.  **Security Best Practices:** Offer practical advice and configuration tips relevant to the selected services, such as "Ensure all default passwords are changed", "Regularly update installed packages", "Configure firewalls to allow only necessary ports", and "Use Ansible Vault for sensitive data".
    7.  **Best Practices:** Based on the user's selections, provide a list of best practices for managing this setup. For example:
        *   If 'Git' is involved: Recommend storing the playbook in a Git repository and using feature branches for changes.
        *   If 'Vault' is selected: Emphasize regularly rotating secrets and never committing the vault password file.
        *   If 'Docker' is selected: Mention pinning image versions (e.g., \`image: portainer/portainer-ce:2.18.4\`) instead of using \`:latest\`, and regularly running \`docker system prune\`.
        *   If 'Backups' are selected: Stress the importance of periodically testing backup restoration procedures.
    8.  **Security Hardening Checklist:** Provide an actionable checklist of post-deployment security tasks tailored to the selected services. This should be more of a checklist than a descriptive section.
        *   [ ] **General:** Regularly run the playbook to apply updates.
        *   [ ] **SSH:** Verify that password authentication is disabled and only key-based authentication is allowed on all servers.
        *   [ ] **Web Services:** Scan exposed web services with a tool like securityheaders.com or Mozilla Observatory.
        *   [ ] **Databases:** Confirm the database is not publicly exposed and that all default passwords have been changed.
        *   [ ] **User Accounts:** Periodically review user accounts and sudo privileges to ensure the principle of least privilege is met.
    9.  **Advanced Customization:** Offer clear, actionable ideas for how a user could extend or customize the generated playbook.
        *   Explain how to add a new role to the \`site.yml\` playbook to extend functionality.
        *   Show an example of using tags to run only a specific part of the playbook (e.g., \`ansible-playbook site.yml --tags docker\`).
        *   If 'Custom Variables File' is selected, explain how to add new variables to \`group_vars/all/custom.yml\` to override role defaults.
`;
        }
        if (docSelections['Role documentation']) {
            prompt += `
- **Generate Role-Specific READMEs:** For each generated role, create a separate \`roles/<role_name>/README.md\`. This file must explain the role's purpose, its variables, and include a section on **Usage Examples** that demonstrates how to properly include the role in a playbook and provide relevant variable examples. Enhance the **Usage Examples** section to include more practical scenarios, such as demonstrating how to pass group-specific variables to a role when it's included in the main playbook. It must also include a dedicated **Dependencies** section. This section MUST be dynamically populated based on the user's other selections. For example, if the user selects 'Gitea' and also selects 'Docker installation and configuration' and 'PostgreSQL Server', the README for the 'gitea' role MUST list both 'docker' and 'postgresql' as dependencies clearly and explain how they are managed within the playbook structure, referencing the \`meta/main.yml\` file if applicable.
`;
        }
        if (docSelections['Variable reference']) {
            prompt += `
- **Generate a Centralized Variable Reference:** Create a separate \`variables.md\` file. This document should provide a single source of truth for all tunable parameters in the project, organized by role, with descriptions and default values.
- **Explain Variable Precedence in \`variables.md\`:** At the beginning of the \`variables.md\` file, include a brief section explaining the order of variable precedence in Ansible to help users understand how overrides work. A simplified hierarchy is fine (e.g., role defaults < group_vars < inventory vars < command-line vars). Ensure the generated \`variables.md\` file includes detailed examples of how to override variables using \`group_vars\` and \`host_vars\`.
`;
        }
        if (docSelections['Best practices guide']) {
            prompt += `
- **Generate a Best Practices Guide:** Create a \`CONTRIBUTING.md\` or \`BEST_ PRACTICES.md\` file. This guide should include guidelines on code style, commit messages, and branching strategy to help maintain a high-quality project.
- **Expand on Ansible Vault in the Best Practices Guide:** Add a detailed section on using Ansible Vault. It should include CLI examples for creating and editing vault files (\`ansible-vault create vars/secrets.yml\`, \`ansible-vault edit vars/secrets.yml\`), explain how to reference vaulted variables in playbooks, and show how to run playbooks using \`--ask-vault-pass\`.
`;
        }
    }


    const testingSelections = selections.testing;
    const isTestingRequested = testingSelections && Object.values(testingSelections).some(v => v);

    if (isTestingRequested) {
        prompt += `
**Testing Configuration:**
Based on the user's testing selections below, generate the appropriate configuration files.
`;
        if (testingSelections['Ansible Lint configuration']) {
            prompt += `
- **Generate .ansible-lint:** Create a basic configuration file for ansible-lint to promote code quality.
`;
        }
        if (testingSelections['YAML Linting']) {
            prompt += `
- **Generate .yamllint:** Create a basic configuration file for yamllint to check YAML file syntax for consistency and correctness.
`;
        }
        if (testingSelections['Pre-commit hooks']) {
            prompt += `
- **Generate .pre-commit-config.yaml:** Create a configuration file for pre-commit to automate code quality checks on every commit.
`;
        }
    }

    const automationSelections = selections.automationFeatures;
    if (automationSelections) {
        if (automationSelections['Dynamic inventory (script-based)']) {
            prompt += `
**Dynamic Inventory:**
- **Generate a Dynamic Inventory Script:** Since 'Dynamic inventory (script-based)' is selected, create a sample python or shell script (e.g., \`inventory.py\` or \`inventory.sh\`) that follows the Ansible dynamic inventory script specification and outputs a valid JSON representation of a sample inventory (including at least two groups and some hostvars).
`;
        }
        if (automationSelections['Configuration Management Tool (e.g., Ansible Tower/AWX, Rundeck)']) {
            prompt += `
**Configuration Management Tool:**
- **Generate Deployment Role:** Since 'Configuration Management Tool (e.g., Ansible Tower/AWX, Rundeck)' is selected, generate a role to deploy a centralized management UI. For AWX, provide a setup using the AWX Operator on Kubernetes or a standalone Docker Compose setup. For Rundeck, provide a Docker-based deployment.
`;
        }
    }

    const baseConfigSelections = selections.baseConfig;
    if (baseConfigSelections) {
        if (baseConfigSelections['Ansible Collection Management']) {
            prompt += `
**Ansible Collection Management:**
- **Generate requirements.yml:** Since 'Ansible Collection Management' is selected, create a \`requirements.yml\` file listing common collections (e.g., \`community.docker\`, \`community.general\`, \`community.mysql\`).
- **Generate Installation Tasks:** Include a task (ideally in a 'setup' role or as a pre-task) that runs \`ansible-galaxy collection install -r requirements.yml\` to ensure all dependencies are met.
`;
        }
    }

    const serviceSelections = selections.servicePlaybooks;
    if (serviceSelections) {
        if (serviceSelections['Kubernetes (k3s) cluster setup']) {
            prompt += `
**Kubernetes (k3s):**
- **Generate k3s Role:** Since 'Kubernetes (k3s) cluster setup' is selected, you MUST generate a robust role for deploying a lightweight k3s cluster. This should include tasks for master node initialization, extracting the node token, and registering agent nodes, as well as configuring basic cluster parameters via variables.
`;
        }
    }

    prompt += `

Based on the selections below, generate the necessary Ansible playbook content. Present the output as a single block of text, using YAML comments (--- # path/to/file.yml) to separate different files.

**User Selections:**
`;

    // Dynamically build the selections part of the prompt
    for (const categoryKey in PLAYBOOK_OPTIONS) {
        const key = categoryKey as keyof Selections;
        const categoryData = PLAYBOOK_OPTIONS[key as keyof typeof PLAYBOOK_OPTIONS];
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

    if (customVariables && customVariables.trim() !== '') {
        prompt += `
**Custom Variables:**
The user has provided the following custom variables in YAML format. You MUST incorporate these into the playbook. The best practice is to create a 'group_vars/all/custom.yml' file for these variables and ensure it's referenced or automatically loaded.

\`\`\`yaml
${customVariables}
\`\`\`
`;
    }

    return prompt;
}

export const generatePlaybook = async (selections: Selections, customVariables: string, ansibleVersion: string = 'latest'): Promise<string> => {
    const prompt = buildPrompt(selections, customVariables, ansibleVersion);
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        if (response.text) {
            return response.text.trim();
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

function buildSuggestionPrompt(selections: Selections, customVariables: string, ansibleVersion: string): string {
    let prompt = `
You are an expert technical writer and documentation strategist specializing in infrastructure-as-code.
Based on the user's Ansible playbook selections (Target Version: ${ansibleVersion}) and custom variables, suggest the most appropriate documentation style. Your response must be a valid JSON object.

Here are the available documentation styles:
- "Minimal README": A basic README with only setup and execution steps. Best for simple, single-purpose playbooks.
- "Comprehensive README": A detailed single README covering prerequisites, role overviews, variables, execution, and troubleshooting. Ideal for most medium-sized projects.
- "Role-Specific Docs + README": A main README for the overview, plus separate, detailed READMEs inside each role's directory. Best for complex projects with distinct, reusable roles.
- "Full Knowledge Base Structure": A complete set of documents including a main README, role-specific docs, and a separate, detailed variable reference file (variables.md). Suitable for large, multi-faceted automation repositories intended for team use.

Analyze the complexity and breadth of the following user selections and provide your recommendation. A simple selection (e.g., only one service) warrants a simpler documentation style. A complex selection (e.g., multiple services, networking, and custom variables) warrants a more comprehensive style.
`;

    let selectionCount = 0;
    for (const categoryKey in selections) {
        const key = categoryKey as keyof Selections;
        const categoryData = PLAYBOOK_OPTIONS[key as keyof typeof PLAYBOOK_OPTIONS];
        const selectedItems = Object.keys(selections[key]).filter(
            option => selections[key][option]
        );

        if (selectedItems.length > 0) {
            prompt += `\n**${categoryData.title}:** ${selectedItems.join(', ')}`;
            selectionCount += selectedItems.length;
        }
    }

    if (customVariables && customVariables.trim() !== '') {
        prompt += `\n**Custom Variables:** User has provided custom variables.`;
    }

    if (selectionCount === 0 && customVariables.trim() === '') {
        prompt += "\nNo selections were made."
    }

    prompt += "\nNow, provide your suggestion in the specified JSON format, with a 'suggestion' and a concise 'reason'.";
    return prompt;
}


export const lintPlaybook = async (playbookContent: string): Promise<string> => {
    const prompt = `
You are an expert Ansible linter. Your task is to perform a basic syntax check and linting on the provided Ansible playbook content, simulating the output of \`ansible-lint\`.

Analyze the following Ansible playbook content and identify any syntax errors, deprecation warnings, or deviations from Ansible best practices.
Provide your feedback in a clear, concise format, similar to how \`ansible-lint\` would output it. If there are no errors or warnings, state "No issues found."

**Playbook Content:**
\`\`\`yaml
${playbookContent}
\`\`\`
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        if (response.text) {
            return response.text.trim();
        } else {
            throw new Error("The API returned an empty response.");
        }
    } catch (error) {
        console.error("Error linting playbook:", error);
        throw new Error("Could not perform linting on the playbook.");
    }
};
export const getDocumentationSuggestion = async (selections: Selections, customVariables: string, ansibleVersion: string = 'latest'): Promise<DocSuggestion> => {
    const prompt = buildSuggestionPrompt(selections, customVariables, ansibleVersion);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestion: { 
                            type: Type.STRING,
                            description: "The suggested documentation style."
                        },
                        reason: { 
                            type: Type.STRING,
                            description: "A brief explanation for the suggestion."
                        }
                    },
                    required: ["suggestion", "reason"]
                }
            }
        });
        
        if (response.text) {
            // The response from the API is a string that needs to be parsed into a JSON object.
            const result = JSON.parse(response.text);
            return result as DocSuggestion;
        } else {
            throw new Error("The documentation suggestion API returned an empty response.");
        }
    } catch (error) {
        console.error("Error getting documentation suggestion:", error);
        throw new Error("Could not generate a documentation suggestion.");
    }
};

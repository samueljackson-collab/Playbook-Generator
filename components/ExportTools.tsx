
import React, { useState } from 'react';
import { lintPlaybook } from '../services/geminiService';

interface ExportToolsProps {
    code: string;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export const ExportTools: React.FC<ExportToolsProps> = ({ code }) => {
    const [wikiTitle, setWikiTitle] = useState('My Ansible Homelab Playbook');
    const [isLinting, setIsLinting] = useState(false);
    const [lintResult, setLintResult] = useState<string | null>(null);
    const [repoUrl, setRepoUrl] = useState('');
    const [branch, setBranch] = useState('main');
    const [commitMessage, setCommitMessage] = useState('Add generated Ansible playbook');
    const [isCommitting, setIsCommitting] = useState(false);
    const [commitResult, setCommitResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleLint = async () => {
        setIsLinting(true);
        setLintResult(null);
        try {
            const result = await lintPlaybook(code);
            setLintResult(result);
        } catch (error) {
            setLintResult(error instanceof Error ? error.message : 'An error occurred during linting.');
        } finally {
            setIsLinting(false);
        }
    };

    const handleCommit = async () => {
        if (!repoUrl) {
            setCommitResult({ success: false, message: 'Repository URL is required.' });
            return;
        }
        setIsCommitting(true);
        setCommitResult(null);
        try {
            const response = await fetch('/api/git/commit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl, branch, commitMessage, playbookContent: code }),
            });
            const data = await response.json();
            if (response.ok) {
                setCommitResult({ success: true, message: data.message });
            } else {
                setCommitResult({ success: false, message: data.error || 'Failed to commit.' });
            }
        } catch (error) {
            setCommitResult({ success: false, message: 'Network error occurred while committing.' });
        } finally {
            setIsCommitting(false);
        }
    };

    const handleGenerateWiki = () => {
        const parsedFiles = parseCode(code);
        const wikiContent = formatForWikiJs(parsedFiles, wikiTitle);
        downloadFile(wikiContent, 'ansible-playbook-knowledge-base.md');
    };

    const parseCode = (rawCode: string): { filename: string; content: string }[] => {
        const chunks = rawCode.split(/---\s*?#/m);
        return chunks
            .map(chunk => {
                if (!chunk.trim()) return null;
                const lines = chunk.trim().split('\n');
                const firstLine = lines.shift() || '';
                const filename = firstLine.trim().replace(/#\s*/, '');
                
                // Re-add the YAML separator for all but the first file
                const content = (chunks.length > 1 ? '---\n' : '') + lines.join('\n');

                return { filename: filename || 'playbook.yml', content: content.trim() };
            })
            .filter(Boolean) as { filename: string; content: string }[];
    };


    const formatForWikiJs = (files: { filename: string; content: string }[], title: string): string => {
        let markdown = `---
title: ${title}
tags:
  - ansible
  - homelab
  - generated
description: An Ansible playbook and documentation generated for a homelab setup.
---

# ${title}

This document contains the generated Ansible playbook files and associated documentation.

`;

        files.forEach(({ filename, content }) => {
            const isMarkdown = filename.toLowerCase().endsWith('.md');
            if (isMarkdown) {
                markdown += `\n---\n\n## ${filename}\n\n${content}\n`;
            } else {
                 const lang = 'yaml';
                 markdown += `\n---\n\n## ${filename}\n\n\`\`\`${lang}\n${content}\n\`\`\`\n`;
            }
        });

        return markdown;
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-inner p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Export & Documentation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Generate a single Markdown file from your playbook, formatted for easy import into a knowledge base like Wiki.js.
                </p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="wiki-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Knowledge Base Page Title
                        </label>
                        <input
                            type="text"
                            id="wiki-title"
                            value={wikiTitle}
                            onChange={(e) => setWikiTitle(e.target.value)}
                            className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <button
                        onClick={handleGenerateWiki}
                        className="w-full flex items-center justify-center px-4 py-2 text-white font-bold rounded-lg transition-all duration-300 ease-in-out bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800"
                    >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Generate Wiki.js Page
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-inner p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Ansible Lint</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Run a simulated \`ansible-lint\` check on the generated playbook to identify syntax errors or best practice violations.
                </p>
                <button
                    onClick={handleLint}
                    disabled={isLinting}
                    className="w-full flex items-center justify-center px-4 py-2 text-white font-bold rounded-lg transition-all duration-300 ease-in-out bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:bg-gray-500"
                >
                    {isLinting ? 'Linting...' : 'Run Ansible Lint'}
                </button>
                {lintResult && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                            {lintResult}
                        </pre>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-inner p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Git Integration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Commit and push the generated playbook to a Git repository.
                </p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Repository URL (HTTPS with token)
                        </label>
                        <input
                            type="text"
                            id="repo-url"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://user:token@github.com/user/repo.git"
                            className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="git-branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Branch
                        </label>
                        <input
                            type="text"
                            id="git-branch"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="commit-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Commit Message
                        </label>
                        <input
                            type="text"
                            id="commit-message"
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <button
                        onClick={handleCommit}
                        disabled={isCommitting || !repoUrl}
                        className="w-full flex items-center justify-center px-4 py-2 text-white font-bold rounded-lg transition-all duration-300 ease-in-out bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-800 disabled:bg-gray-500"
                    >
                        {isCommitting ? 'Committing...' : 'Commit to Git'}
                    </button>
                    {commitResult && (
                        <div className={`mt-4 p-3 border rounded-md ${commitResult.success ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
                            {commitResult.success && <CheckIcon className="w-5 h-5 inline mr-2" />}
                            {commitResult.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

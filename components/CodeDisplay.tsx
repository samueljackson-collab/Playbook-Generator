
import React, { useState, useEffect } from 'react';

interface CodeDisplayProps {
    code: string;
    isLoading: boolean;
    error: string | null;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

const placeholderPlaybook = `---
# This is an example of a simple Ansible playbook.
# Select options from the sidebar and click "Generate Playbook"
# to create your own customized, role-based configuration.

- name: Example | Install and start a web server
  hosts: all
  become: true

  tasks:
    - name: "Install the latest version of Nginx"
      ansible.builtin.package:
        name: nginx
        state: latest
      # This task is idempotent. If Nginx is already the latest version,
      # Ansible will report "ok" instead of "changed".

    - name: "Ensure Nginx is running and enabled on boot"
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: yes
      # This task is also idempotent. It only acts if the
      # service is not already started and enabled.
`;

const formatErrorWithLineNumbers = (errorMessage: string): React.ReactNode => {
    const regex = /(\b(line|column|position)\s+\d+)/gi;
    if (!errorMessage) return '';
    
    const parts = errorMessage.split(regex);

    return (
        <>
            {parts.map((part, index) => {
                if (part && part.match(regex)) {
                    return (
                        <span key={index} className="bg-red-200 dark:bg-red-800/50 rounded px-1 py-0.5 font-semibold">
                            {part}
                        </span>
                    );
                }
                return part;
            })}
        </>
    );
};

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, isLoading, error }) => {
    const [copied, setCopied] = useState(false);
    const [errorCopied, setErrorCopied] = useState(false);
    const [showErrorDetails, setShowErrorDetails] = useState(false);

    useEffect(() => {
        if (code) setCopied(false);
    }, [code]);

    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyError = () => {
        if (!error) return;
        navigator.clipboard.writeText(error);
        setErrorCopied(true);
        setTimeout(() => setErrorCopied(false), 2000);
    };


    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <svg className="animate-spin h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg">Generating your Ansible playbook...</p>
                    <p className="text-sm mt-2">This may take a moment.</p>
                </div>
            );
        }

        if (error) {
            let title = "Error Generating Playbook";
            let message = "An unexpected error occurred. Please try again.";
            
            const lowerCaseError = error.toLowerCase();

            if (lowerCaseError.includes('api key')) {
                title = "API Key Error";
                message = "There seems to be an issue with your Gemini API key. Please ensure it's correctly configured and has the necessary permissions.";
            } else if (lowerCaseError.includes('rate limit')) {
                title = "Rate Limit Exceeded";
                message = "You've made too many requests in a short period. Please wait a moment before trying again.";
            } else if (lowerCaseError.includes('network') || lowerCaseError.includes('fetch')) {
                title = "Network Error";
                message = "Could not connect to the Gemini API. Please check your internet connection.";
            } else if (lowerCaseError.includes('empty response')) {
                title = "Empty Response";
                message = "The API returned no data. This might be a temporary issue or a problem with the request. Please try again.";
            }

            return (
                <div className="flex items-center justify-center h-full text-red-500 dark:text-red-400">
                    <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 p-6 rounded-lg text-center max-w-lg">
                        <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">{title}</h3>
                        <p className="text-red-700 dark:text-gray-300">{message}</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() => setShowErrorDetails(!showErrorDetails)}
                                className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-500"
                            >
                                {showErrorDetails ? 'Hide Details' : 'View Details'}
                            </button>
                             <button
                                onClick={handleCopyError}
                                className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-500"
                            >
                                {errorCopied ? 'Copied!' : 'Copy Error'}
                            </button>
                        </div>
                        {showErrorDetails && (
                            <pre className="mt-4 p-3 bg-gray-200/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-md text-left text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                <code>{formatErrorWithLineNumbers(error)}</code>
                            </pre>
                        )}
                    </div>
                </div>
            );
        }
        
        if (!code) {
             return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-500 p-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">Welcome to the Playbook Generator</h2>
                    <p className="mt-2 mb-6 text-center max-w-xl">
                        Select configurations from the sidebar, then click "Generate Playbook". Your custom Ansible code will appear here.
                    </p>
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-900/70 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700/50">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-t-lg">
                            <p className="text-sm font-mono text-gray-500 dark:text-gray-400">Example Playbook</p>
                        </div>
                        <pre className="p-4 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-auto">
                            <code>{placeholderPlaybook}</code>
                        </pre>
                    </div>
                </div>
            );
        }

        return (
            <div className="relative h-full">
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                    aria-label="Copy code to clipboard"
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                </button>
                <pre className="h-full w-full overflow-auto bg-white dark:bg-gray-900/70 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    <code>{code}</code>
                </pre>
            </div>
        );
    };

    return (
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-inner p-2 h-full">
            {renderContent()}
        </div>
    );
};

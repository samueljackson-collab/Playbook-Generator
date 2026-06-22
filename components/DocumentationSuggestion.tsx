
import React from 'react';
import type { DocSuggestion } from '../types';

interface DocumentationSuggestionProps {
    suggestion: DocSuggestion | null;
    isLoading: boolean;
}

const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const DocumentationSuggestion: React.FC<DocumentationSuggestionProps> = ({ suggestion, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-inner p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                     <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing for documentation recommendation...</span>
                </div>
            </div>
        );
    }

    if (!suggestion) {
        return null; // Don't render anything if there's no suggestion and we're not loading
    }

    return (
        <div className="bg-blue-50 dark:bg-gray-900 rounded-xl shadow-inner p-4 border border-blue-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <LightbulbIcon className="w-6 h-6 mr-2 text-blue-500" />
                Documentation Suggestion
            </h3>
            <div className="pl-8">
                <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{suggestion.suggestion}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="font-semibold">Reasoning:</span> {suggestion.reason}
                </p>
            </div>
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.11 3.56-5.447 6.833-6.166M9 5.062A7.025 7.025 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.054 10.054 0 01-1.325 3.386m-3.386-3.386a3 3 0 11-4.243-4.243M1 1l22 22" />
  </svg>
);

const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 0110.257-4.257m1.5-1.5a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 0110.257-4.257m1.5-1.5" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WifiOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.172a4 4 0 105.544 5.544m0-5.544l-5.544 5.544M3 10a11.917 11.917 0 0118 0M5 14a7.917 7.917 0 0114 0" />
    </svg>
);

const DocumentRemoveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
);

const ExclamationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const ServerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
);

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
            let Icon = <ExclamationCircleIcon className="h-8 w-8 text-red-500 dark:text-red-400 mb-3" />;
            
            const lowerCaseError = error.toLowerCase();

            if (lowerCaseError.includes('api key')) {
                title = "API Key Error";
                message = "There seems to be an issue with your Gemini API key. Please ensure it's correctly configured and has the necessary permissions.";
                Icon = <KeyIcon className="h-8 w-8 text-red-500 dark:text-red-400 mb-3" />;
            } else if (lowerCaseError.includes('rate limit')) {
                title = "Rate Limit Exceeded";
                message = "You've made too many requests in a short period. Please wait a moment before trying again.";
                Icon = <ClockIcon className="h-8 w-8 text-red-500 dark:text-red-400 mb-3" />;
            } else if (lowerCaseError.includes('network') || lowerCaseError.includes('fetch')) {
                title = "Network Error";
                message = "Could not connect to the Gemini API. Please check your internet connection.";
                Icon = <WifiOffIcon className="h-8 w-8 text-red-500 dark:text-red-400 mb-3" />;
            } else if (lowerCaseError.includes('empty response')) {
                title = "Empty Response";
                message = "The API returned no data. This might be a temporary issue or a problem with the request. Please try again.";
                Icon = <DocumentRemoveIcon className="h-8 w-8 text-red-500 dark:text-red-400 mb-3" />;
            } else if (lowerCaseError.includes('400 bad request') || lowerCaseError.includes('invalid argument')) {
                title = "Invalid Request";
                message = "The request sent to the API was invalid. This could be due to a malformed prompt or an issue with the selected options.";
                Icon = <CodeIcon className="h-8 w-8 text-red-500 dark:text-red-400 mb-3" />;
            } else if (lowerCaseError.includes('500') || lowerCaseError.includes('internal server error') || lowerCaseError.includes('service unavailable')) {
                 title = "Server Error";
                 message = "The Gemini API is currently experiencing issues or is unavailable. Please try again later.";
                 Icon = <ServerIcon className="h-8 w-8 text-red-500 dark:text-red-400 mb-3" />;
            }


            return (
                <div className="flex items-center justify-center h-full text-red-500 dark:text-red-400">
                    <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 p-6 rounded-lg text-center max-w-lg flex flex-col items-center">
                        {Icon}
                        <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">{title}</h3>
                        <p className="text-red-700 dark:text-gray-300">{message}</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() => setShowErrorDetails(!showErrorDetails)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-500"
                            >
                                {showErrorDetails ? (
                                    <>
                                        <EyeOffIcon className="w-5 h-5 mr-2" />
                                        <span>Hide Details</span>
                                    </>
                                ) : (
                                    <>
                                        <EyeIcon className="w-5 h-5 mr-2" />
                                        <span>View Details</span>
                                    </>
                                )}
                            </button>
                             <button
                                onClick={handleCopyError}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-500"
                            >
                                {errorCopied ? (
                                    <>
                                        <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <CopyIcon className="w-5 h-5 mr-2" />
                                        <span>Copy Error</span>
                                    </>
                                )}
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
        
        return (
            <div className="relative h-full">
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors z-10"
                    aria-label="Copy code to clipboard"
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                </button>
                <div className="h-full w-full overflow-auto bg-white dark:bg-gray-900/70 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-200 prose dark:prose-invert max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]}>{code}</Markdown>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-inner p-2 h-full">
            {renderContent()}
        </div>
    );
};

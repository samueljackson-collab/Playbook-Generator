
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodeDisplay } from './components/CodeDisplay';
import { Header } from './components/Header';
import { generatePlaybook } from './services/geminiService';
import type { Selections } from './types';

type Theme = 'light' | 'dark';

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

const App: React.FC = () => {
    const [generatedCode, setGeneratedCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme || (userPrefersDark ? 'dark' : 'light');
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
        if (notificationVisible) {
            const timer = setTimeout(() => {
                setNotificationVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notificationVisible]);

    const handleGenerate = async (selections: Selections) => {
        setIsLoading(true);
        setError(null);
        setGeneratedCode('');
        try {
            const code = await generatePlaybook(selections);
            setGeneratedCode(code);
            setNotificationVisible(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200 font-sans transition-colors duration-300">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar onGenerate={handleGenerate} isLoading={isLoading} />
                <main className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 bg-gray-100/50 dark:bg-gray-800/50">
                    <CodeDisplay code={generatedCode} isLoading={isLoading} error={error} />
                </main>
                <div 
                    aria-live="assertive"
                    className={`absolute bottom-5 right-5 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-800 dark:text-green-200 py-2 px-4 rounded-lg shadow-lg flex items-center transition-all duration-500 transform ${notificationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                >
                    <CheckCircleIcon className="w-6 h-6 mr-2" />
                    <span>Playbook generated successfully!</span>
                </div>
            </div>
        </div>
    );
};

export default App;

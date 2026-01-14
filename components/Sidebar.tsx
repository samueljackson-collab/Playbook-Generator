
import React, { useState, useMemo } from 'react';
import type { Selections } from '../types';
import { PLAYBOOK_OPTIONS } from '../constants';

interface SidebarProps {
    onGenerate: (selections: Selections) => void;
    isLoading: boolean;
}

const initialSelections = Object.keys(PLAYBOOK_OPTIONS).reduce((acc, key) => {
    const categoryKey = key as keyof typeof PLAYBOOK_OPTIONS;
    acc[categoryKey] = PLAYBOOK_OPTIONS[categoryKey].options.reduce((opts, option) => {
        opts[option.label] = false;
        return opts;
    }, {} as { [key: string]: boolean });
    return acc;
}, {} as Selections);

const Checkbox: React.FC<{ id: string; label: string; tooltip: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ id, label, tooltip, checked, onChange }) => (
    <div className="relative group flex items-center my-2">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-200 border-gray-400 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-800 dark:text-gray-300 select-none cursor-pointer">
            {label}
        </label>
        <div className="absolute left-0 bottom-full mb-2 w-64 p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            {tooltip}
        </div>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-gray-100 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transform transition-all duration-200 hover:translate-x-1"
            >
                {title}
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && <div className="pl-4 mt-2 border-l-2 border-gray-300 dark:border-gray-700">{children}</div>}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ onGenerate, isLoading }) => {
    const [selections, setSelections] = useState<Selections>(initialSelections);

    const handleCheckboxChange = (category: keyof Selections, optionLabel: string, checked: boolean) => {
        setSelections(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [optionLabel]: checked
            }
        }));
    };

    const isAnyOptionSelected = useMemo(() => {
        return Object.values(selections).some(category => 
            Object.values(category).some(value => value)
        );
    }, [selections]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(selections);
    };

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 p-4 overflow-y-auto flex flex-col shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                <div className="flex-grow">
                    {Object.entries(PLAYBOOK_OPTIONS).map(([key, value]) => (
                        <Section key={key} title={value.title}>
                            {value.options.map(option => (
                                <Checkbox
                                    key={option.label}
                                    id={`${key}-${option.label}`}
                                    label={option.label}
                                    tooltip={option.tooltip}
                                    checked={selections[key as keyof Selections][option.label]}
                                    onChange={(checked) => handleCheckboxChange(key as keyof Selections, option.label, checked)}
                                />
                            ))}
                        </Section>
                    ))}
                </div>

                <div className="mt-auto pt-4 sticky bottom-0 bg-white dark:bg-gray-800">
                    <button
                        type="submit"
                        disabled={isLoading || !isAnyOptionSelected}
                        className="w-full flex items-center justify-center px-4 py-3 text-white font-bold rounded-lg transition-all duration-300 ease-in-out
                        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800
                        disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-gray-400"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            'Generate Playbook'
                        )}
                    </button>
                </div>
            </form>
        </aside>
    );
};

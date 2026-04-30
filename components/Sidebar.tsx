
import React, { useState, useMemo } from 'react';
import type { Selections } from '../types';
import { PLAYBOOK_OPTIONS, QUICK_START_TEMPLATES } from '../constants';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism.css';
import yaml from 'js-yaml';

interface SidebarProps {
    onGenerate: (selections: Selections, customVariables: string, ansibleVersion: string) => void;
    isLoading: boolean;
    isSuccess: boolean;
    onInteraction: () => void;
}

const initialSelections: Selections = Object.keys(PLAYBOOK_OPTIONS).reduce((acc, key) => {
    const categoryKey = key as keyof typeof PLAYBOOK_OPTIONS;
    acc[categoryKey] = PLAYBOOK_OPTIONS[categoryKey].options.reduce((opts, option) => {
        opts[option.label] = false;
        return opts;
    }, {} as { [key: string]: boolean });
    return acc;
}, {} as Selections);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

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
        <div className="absolute left-0 bottom-full mb-2 w-64 p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-pre-wrap">
            {tooltip}
        </div>
    </div>
);

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode; defaultOpen?: boolean; }> = ({ title, description, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-4">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-gray-100 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transform transition-all duration-200 hover:translate-x-1"
                aria-expanded={isOpen}
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
            {isOpen && (
                <div className="pl-4 mt-2 border-l-2 border-gray-300 dark:border-gray-700">
                    {description && <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic">{description}</p>}
                    {children}
                </div>
            )}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ onGenerate, isLoading, isSuccess, onInteraction }) => {
    const [selections, setSelections] = useState<Selections>(initialSelections);
    const [customVariables, setCustomVariables] = useState<Record<string, string>>({
        'General': ''
    });
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [ansibleVersion, setAnsibleVersion] = useState('latest');
    const [yamlErrors, setYamlErrors] = useState<Record<string, string | null>>({});

    const handleCheckboxChange = (category: keyof Selections, optionLabel: string, checked: boolean) => {
        onInteraction();
        setSelections(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [optionLabel]: checked
            }
        }));
         setSelectedTemplate(''); // Deselect template if a manual change is made
    };

    const handleTemplateSelect = (templateName: string) => {
        onInteraction();
        setSelectedTemplate(templateName);

        if (templateName === '') {
            setSelections(initialSelections);
            return;
        }

        const template = QUICK_START_TEMPLATES.find(t => t.name === templateName);
        if (!template) return;

        const newSelections = JSON.parse(JSON.stringify(initialSelections));

        Object.keys(template.selections).forEach(categoryKey => {
            const category = categoryKey as keyof Selections;
            if (newSelections[category]) {
                const templateOptions = template.selections[category] as { [key: string]: boolean };
                Object.keys(templateOptions).forEach(optionLabel => {
                    if (newSelections[category].hasOwnProperty(optionLabel)) {
                        newSelections[category][optionLabel] = true;
                    }
                });
            }
        });
        setSelections(newSelections);
    };

    const clearSelections = () => {
        onInteraction();
        setSelections(initialSelections);
        setCustomVariables({ 'General': '' });
        setSelectedTemplate('');
        setAnsibleVersion('latest');
    };

    const handleExportConfig = () => {
        const config = {
            selections,
            customVariables,
            ansibleVersion
        };
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'playbook-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const config = JSON.parse(event.target?.result as string);
                if (config.selections) {
                    setSelections(config.selections);
                }
                if (config.customVariables !== undefined) {
                    setCustomVariables(config.customVariables);
                }
                if (config.ansibleVersion) {
                    setAnsibleVersion(config.ansibleVersion);
                }
            } catch (error) {
                console.error('Failed to parse config file', error);
                alert('Invalid configuration file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const isAnyOptionSelected = useMemo(() => {
        const hasCheckboxSelection = Object.values(selections).some(category => 
            Object.values(category).some(value => value)
        );
        const hasCustomVariables = Object.values(customVariables).some(val => val.trim() !== '');
        return hasCheckboxSelection || hasCustomVariables;
    }, [selections, customVariables]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customVariablesString = Object.entries(customVariables)
            .filter(([_, val]) => val.trim() !== '')
            .map(([group, val]) => `# Group: ${group}\n${val}`)
            .join('\n\n');
        onGenerate(selections, customVariablesString, ansibleVersion);
    };

    const addVariableGroup = () => {
        const newGroupName = prompt('Enter new variable group name (e.g., Database, Network):');
        if (newGroupName && !customVariables[newGroupName]) {
            setCustomVariables(prev => ({ ...prev, [newGroupName]: '' }));
        }
    };

    const removeVariableGroup = (groupName: string) => {
        if (confirm(`Are you sure you want to remove the "${groupName}" variable group?`)) {
            setCustomVariables(prev => {
                const newVars = { ...prev };
                delete newVars[groupName];
                return newVars;
            });
        }
    };

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 p-4 overflow-y-auto flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Configuration</h2>
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={handleExportConfig}
                        className="p-2 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                        title="Export Configuration"
                    >
                        Export
                    </button>
                    <label className="p-2 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 cursor-pointer" title="Import Configuration">
                        Import
                        <input type="file" accept=".json" className="hidden" onChange={handleImportConfig} />
                    </label>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                <div className="flex-grow">
                     <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Quick Start Templates</h3>
                         <div className="flex items-center space-x-2">
                             <select
                                 value={selectedTemplate}
                                 onChange={(e) => handleTemplateSelect(e.target.value)}
                                 className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                 aria-label="Select a playbook template"
                             >
                                 <option value="">Select a template...</option>
                                 {QUICK_START_TEMPLATES.map(template => (
                                     <option key={template.name} value={template.name}>
                                         {template.name}
                                     </option>
                                 ))}
                             </select>
                             <button type="button" onClick={clearSelections} className="p-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500" aria-label="Clear all selections">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                             </button>
                         </div>
                         {selectedTemplate && (
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                {QUICK_START_TEMPLATES.find(t => t.name === selectedTemplate)?.description}
                            </p>
                         )}
                    </div>

                    <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Target Ansible Version</h3>
                        <select
                            value={ansibleVersion}
                            onChange={(e) => {
                                onInteraction();
                                setAnsibleVersion(e.target.value);
                            }}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            aria-label="Select target Ansible version"
                        >
                            <option value="latest">Latest</option>
                            <option value="2.16">2.16</option>
                            <option value="2.15">2.15</option>
                            <option value="2.14">2.14</option>
                            <option value="2.13">2.13</option>
                            <option value="2.12">2.12</option>
                        </select>
                    </div>

                    {Object.entries(PLAYBOOK_OPTIONS).map(([key, value]) => (
                        <Section key={key} title={value.title} description={value.description}>
                            {value.options.map(option => (
                                <Checkbox
                                    key={option.label}
                                    id={`${key}-${option.label}`}
                                    label={option.label}
                                    tooltip={option.tooltip}
                                    checked={selections[key as keyof Selections]?.[option.label] || false}
                                    onChange={(checked) => handleCheckboxChange(key as keyof Selections, option.label, checked)}
                                />
                            ))}
                        </Section>
                    ))}
                     <Section title="Advanced: Custom Variables" description="Define custom variables here in YAML format. These will be included in your playbook, typically in a group_vars/all/custom.yml file." defaultOpen={false}>
                        <div className="space-y-4">
                            {Object.entries(customVariables).map(([groupName, groupValue]) => (
                                <div key={groupName} className="border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{groupName} Variables</h4>
                                        {groupName !== 'General' && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariableGroup(groupName)}
                                                className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                            >
                                                Remove Group
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                        <Editor
                                            value={groupValue}
                                            onValueChange={(code) => {
                                                onInteraction();
                                                setCustomVariables(prev => ({ ...prev, [groupName]: code }));
                                                try {
                                                    yaml.load(code);
                                                    setYamlErrors(prev => ({ ...prev, [groupName]: null }));
                                                } catch (e: any) {
                                                    setYamlErrors(prev => ({ ...prev, [groupName]: e.message }));
                                                }
                                            }}
                                            highlight={code => Prism.highlight(code, Prism.languages.yaml, 'yaml')}
                                            padding={10}
                                            style={{
                                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                                fontSize: 14,
                                                minHeight: '128px',
                                            }}
                                            className="w-full text-sm text-gray-800 dark:text-gray-200"
                                            textareaClassName="focus:outline-none"
                                        />
                                    </div>
                                    {yamlErrors[groupName] && (
                                        <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400 rounded-r-md flex items-start" role="alert">
                                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="font-bold text-sm">Invalid YAML syntax</p>
                                                <p className="text-xs mt-1 font-mono break-all">{yamlErrors[groupName]}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addVariableGroup}
                                className="w-full py-2 px-4 border border-dashed border-gray-400 dark:border-gray-600 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                + Add Variable Group
                            </button>
                        </div>
                    </Section>
                </div>

                <div className="mt-auto pt-4 sticky bottom-0 bg-white dark:bg-gray-800">
                    <button
                        type="submit"
                        disabled={isLoading || !isAnyOptionSelected}
                        className={`w-full flex items-center justify-center px-4 py-3 text-white font-bold rounded-lg transition-all duration-300 ease-in-out
                        ${isSuccess && !isLoading 
                            ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800'
                        }
                        disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-gray-400`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : isSuccess ? (
                            <>
                                <CheckIcon className="w-6 h-6 mr-2" />
                                Generated Successfully!
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

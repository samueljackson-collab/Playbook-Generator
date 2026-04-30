
import React from 'react';

const ChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6.343 6.343l2.829 2.829m-2.83-2.829l2.829 2.829M15 3v4M13 5h4M12 21v-4M10 19h4M17.657 17.657l-2.829-2.829m2.829 2.829l-2.829-2.829" />
    </svg>
);

const DocumentDownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const NumberedStep: React.FC<{ number: string; title: string; children: React.ReactNode; icon: React.ReactNode; isLast?: boolean }> = ({ number, title, children, icon, isLast = false }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-4">
            <div>
                <div className="flex items-center justify-center w-10 h-10 border rounded-full bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-600">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-300">{number}</span>
                </div>
            </div>
            {!isLast && <div className="w-px h-full bg-gray-300 dark:bg-gray-600"></div>}
        </div>
        <div className="pb-8">
            <p className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                {icon}
                <span className="ml-3">{title}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-400">{children}</p>
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const iconStyles = "w-6 h-6 text-blue-600 dark:text-blue-300";
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-4 md:p-8 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
                    Welcome to the Ansible Homelab Playbook Generator
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                    An intelligent tool designed to streamline the creation of robust and reusable Ansible playbooks for your homelab. Select your desired configurations, and let the Gemini API craft a high-quality, idempotent automation script for you.
                </p>

                <div className="text-left max-w-md mx-auto">
                     <NumberedStep number="1" title="Select Your Configuration" icon={<ChecklistIcon className={iconStyles} />}>
                        Use the sidebar to choose from a wide range of options, from base system hardening and networking to specific application deployments like Plex or Home Assistant.
                    </NumberedStep>
                    <NumberedStep number="2" title="Customize with Variables" icon={<SettingsIcon className={iconStyles} />}>
                        In the "Advanced" section, you can provide your own YAML variables to override defaults and tailor the playbook precisely to your needs, like setting custom ports or domain names.
                    </NumberedStep>
                     <NumberedStep number="3" title="Generate Your Playbook" icon={<SparklesIcon className={iconStyles} />}>
                        Click the "Generate Playbook" button. The Gemini API will analyze your selections and create a complete, role-based Ansible project structure in the code display.
                    </NumberedStep>
                    <NumberedStep number="4" title="Review & Export" icon={<DocumentDownloadIcon className={iconStyles} />} isLast={true}>
                        Once generated, you can review the code. Use the "Export Tools" to download a Wiki.js-compatible Markdown file for your knowledge base.
                    </NumberedStep>
                </div>

                 <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
                    Get started by making your selections in the sidebar on the left.
                </p>
            </div>
        </div>
    );
};

export default HomePage;


export interface SelectionCategory {
    [key: string]: boolean;
}

export interface Selections {
    baseConfig: SelectionCategory;
    networking: SelectionCategory;
    servicePlaybooks: SelectionCategory;
    fileSharing: SelectionCategory;
    databaseManagement: SelectionCategory;
    appDeployments: SelectionCategory;
    automationFeatures: SelectionCategory;
    securityHardening: SelectionCategory;
    testing: SelectionCategory;
    documentation: SelectionCategory;
    advancedConfiguration: SelectionCategory;
}

export interface DocSuggestion {
    suggestion: string;
    reason: string;
}

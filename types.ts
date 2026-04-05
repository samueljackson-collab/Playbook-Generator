
export interface SelectionCategory {
    [key: string]: boolean;
}

export interface Selections {
    baseConfig: SelectionCategory;
    servicePlaybooks: SelectionCategory;
    appDeployments: SelectionCategory;
    automationFeatures: SelectionCategory;
    testing: SelectionCategory;
    documentation: SelectionCategory;
    advancedConfiguration: SelectionCategory;
    sdePlaybooks: SelectionCategory;
    desktopSupportPlaybooks: SelectionCategory;
    grcPlaybooks: SelectionCategory;
}
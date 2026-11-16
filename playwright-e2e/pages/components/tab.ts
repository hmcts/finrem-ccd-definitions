export interface TabContent {
    tabItem: string;
    value: string;
    exact?: boolean; // Optional property for matching content
    clickable?: boolean; // Optional property to indicate if the item is clickable
    position?: number;
    valueColumn?: number;
}
  
export type TabContentItem = TabContent | string;

export interface Tab {
    tabName: string;
    tabContent: TabContentItem[];
    expandAccordions?: boolean; // Expand complex-panel rows before validation
    excludedContent?: string[]; // Optional property
}

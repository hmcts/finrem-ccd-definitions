export interface TabContent {
    tabItem: string;
    value: string;
    exact?: boolean; // Optional property for matching content
}
  
export type TabContentItem = TabContent | string;

export interface Tab {
    tabName: string;
    tabContent: TabContentItem[];
    excludedContent?: string[]; // Optional property
}

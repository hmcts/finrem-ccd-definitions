export interface TabContent {
    tabItem: string;
    value: string;
    exact?: boolean; // Optional property for matching content
    clickable?: boolean; // Optional property to indicate if the item is clickable
}
  
export type TabContentItem = TabContent | string;

export interface Tab {
    tabName: string;
    tabContent: TabContentItem[];
    excludedContent?: string[]; // Optional property
}

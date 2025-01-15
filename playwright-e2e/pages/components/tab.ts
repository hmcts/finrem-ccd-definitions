export interface TabContent {
    tabItem: string;
    value: string;
}
  
export type TabContentItem = TabContent | string;

export interface Tab {
    tabName: string;
    tabContent: TabContentItem[];
}

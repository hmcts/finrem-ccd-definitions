export interface RowContent {
    cellItem: string;
    value: string;
}

export type TableRowItem = RowContent | string;

export interface Table {
    tableName: string;
    rows: TableRowItem[];
}

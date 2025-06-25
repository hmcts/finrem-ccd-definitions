export interface RowContent {
    cellItem: string;
    value: string;
    rowType?: 'label-value-adjacent' | 'default';
}

export type TableRowItem = RowContent | string;

export interface Table {
    tableName?: string;
    rows: TableRowItem[];
}

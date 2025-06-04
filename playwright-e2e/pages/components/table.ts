export type TableRowItem = string[] | string;

export interface Table {
    tableName: string;
    tableRows: TableRowItem[];
}

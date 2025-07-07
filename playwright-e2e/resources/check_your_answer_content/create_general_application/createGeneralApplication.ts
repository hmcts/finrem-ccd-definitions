import { Table } from "../../../pages/components/table"

export const createGeneralApplicationTableData: Table = {
    tableName: 'Check your answers',
    rows: [
        //"General Applications 1",
        { cellItem: "Application recieved from", value: "Applicant", rowType: 'label-value-adjacent'},
        { cellItem: "Is a hearing required", value: "Yes", rowType: 'label-value-adjacent'},
        { cellItem:"Time estimate", value: "5", rowType: 'label-value-adjacent'},
        //{ cellItem:"Upload General Application", value: "test.docx", rowType: 'label-value-adjacent'},
    ]
}
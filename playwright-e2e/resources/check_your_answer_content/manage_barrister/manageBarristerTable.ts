import { Table } from "../../../pages/components/table"

export const manageBarristerApplicantTableData: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: "Select Party to which the barrister change applies:", value: "Applicant", rowType: 'label-value-adjacent'},
        "Applicant's Barristers",
        { cellItem: "Full name", value: "Tester Gollum" },
        { cellItem: "Email", value: "fr_applicant_barrister1@mailinator.com" },
        { cellItem:"Name:", value: "FinRem-1-Org"},
    ]
}
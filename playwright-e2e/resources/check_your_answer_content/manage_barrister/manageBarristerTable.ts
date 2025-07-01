import { Table } from "../../../pages/components/table"

export const manageApplicantBarristerApplicantTableData: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: "Select Party to which the barrister change applies:", value: "Applicant", rowType: 'label-value-adjacent'},
        "Applicant's Barristers",
        "Barrister Details",
        { cellItem: "Full Name", value: "Tester Gollum", rowType: 'label-value-adjacent'},
        { cellItem: "Email", value: "fr_applicant_barrister1@mailinator.com", rowType: 'label-value-adjacent'},
        { cellItem:"Name:", value: "FinRem-1-Org", rowType: 'label-value-adjacent'},
    ]
}

export const manageRespondentBarristerApplicantTableData: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: "Select Party to which the barrister change applies:", value: "Respondent", rowType: 'label-value-adjacent'},
        "Respondent's Barristers",
        "Barrister Details",
        { cellItem: "Full Name", value: "Frodo Test Baggins", rowType: 'label-value-adjacent'},
        { cellItem: "Email", value: "fr_res_barrister1@mailinator.com", rowType: 'label-value-adjacent'},
        { cellItem:"Name:", value: "FinRem-2-Org", rowType: 'label-value-adjacent'},
    ]
}

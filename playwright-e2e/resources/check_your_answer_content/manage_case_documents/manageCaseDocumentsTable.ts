import { Table } from "../../../pages/components/table";

export const manageCaseDocumentsTable: Table = {
    tableName: 'Check your answers',
    rows: [
        {cellItem: "Please upload any case documents", value: "test.docx"},
        {cellItem: "Document type", value: "Other"},
        {cellItem: "Please specify document type", value: "test"},
        {cellItem: "Provide the date of hearing and a description of the document", value: "test case"},
        {cellItem: "Is the document confidential?", value: "Yes" },
    ]
}

export const manageCaseDocumentsTableNewConfidential: Table = {
    tableName: 'Check your answers',
    rows: [
        {cellItem: "Please upload any case documents", value: "caseDoc.docx"},
        {cellItem: "Document type", value: "Other"},
        {cellItem: "Please specify document type", value: "test"},
        {cellItem: "Provide the date of hearing and a description of the document", value: "test case"},
        {cellItem: "Is the document confidential?", value: "Yes" },
        {cellItem: "Document on behalf of?", value: "Applicant" },
    ]
}

export const manageCaseDocumentsTableNewFdrDoc: Table = {
    tableName: 'Check your answers',
    rows: [
        {cellItem: "Please upload any case documents", value: "fdrDoc.docx"},
        {cellItem: "Document type", value: "Bill of Costs"},
        {cellItem: "Provide the date of hearing and a description of the document", value: "fdr doc test"},
        {cellItem: "Is the document confidential?", value: "No" },
        {cellItem: "Is this a Financial Dispute Resolution document (FDR)?", value: "Yes" },
        {cellItem: "Document on behalf of?", value: "Respondent" },
    ]
}

export const manageCaseDocumentsTableSpecialTypeConfidential: Table = {
    tableName: 'Check your answers',
    rows: [
        {cellItem: "Please upload any case documents", value: "confidentialDoc.docx"},
        {cellItem: "Document type", value: "Attendance Sheets"},
        {cellItem: "Provide the date of hearing and a description of the document", value: "confidential special type test"},
        {cellItem: "Is the document confidential?", value: "Yes" },
    ]
}

export const manageCaseDocumentsTableWithoutPrejudice: Table = {
    tableName: 'Check your answers',
    rows: [
        {cellItem: "Please upload any case documents", value: "withoutPrejudice.docx"},
        {cellItem: "Document type", value: "Without Prejudice offers"},
        {cellItem: "Provide the date of hearing and a description of the document", value: "without prejudice test"},
    ]
}

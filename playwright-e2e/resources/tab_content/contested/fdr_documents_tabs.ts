import { Tab } from "../../../pages/components/tab";

export function getFdrDocumentsTabData(uploadDateTime: string): Tab {
    return {
        tabName: "FDR documents",
        tabContent: [
            "1",
            { tabItem: "Please upload any case documents", value: "test.docx" },
            { tabItem: "Document type", value: "Other" },
            { tabItem: "Please specify document type", value: "test" },
            // { tabItem: "Provide the date of hearing and a description of the document", value: "test case" },
            { tabItem: "Is the document confidential?", value: "No" },
            { tabItem: "Is this a Financial Dispute Resolution document (FDR)?", value: "Yes" },
            { tabItem: "What type of document is this?", value: "Case" },
            { tabItem: "Upload DateTime", value: uploadDateTime, exact: false },
        ]
    };
}
import { Tab } from "../../../pages/components/tab";

export const processOrderCaseDocumentsTabData: Tab[] = [{
  tabName: "Case documents",
  tabContent: [
    "Agreed draft orders following a hearing 1", 
    { tabItem: "Draft order", value: "agreed-draft-order-document.pdf"},
    { tabItem: "Cover Letter", value: "agreed-draft-order-document - cover letter.pdf"},
    { tabItem: "Document status", value: "Processed" },
    { tabItem: "Submitted by", value: "Claire Mumford" },
    { tabItem: "Uploaded on behalf of", value: "The applicant" },
    { tabItem: "Is this a resubmission?", value: "No" }
  ]
}]
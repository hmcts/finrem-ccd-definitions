import { DateHelper } from "../../../data-utils/DateHelper";

export const createCaseTabData = [
  {
    tabName: 'Applicant',
    tabContent: [
      "Applicant’s Details",
      { tabItem: "Current First and Middle names", value: "Frodo" },
      { tabItem: "Current Last Name", value: "Baggins" },
      "Urgent Case",
      { tabItem: "Is this an urgent case ?", value: "No" },
      "Is the Applicant represented ?",
      { tabItem: "Keep the Applicant's contact details private from the Respondent?", value: "Yes" },
      { tabItem: "Is the Applicant currently a resident in a refuge?", value: "Yes" },
      "Solicitor Details",
      { tabItem: "Your reference number", value: "Y707HZM" },
      { tabItem: "Solicitor’s name", value: "Bilbo Baggins" },
      { tabItem: "Solicitor’s firm", value: "FinRem-1-Org" },
    ]
  }, 
  {
    tabName: 'Divorce / Dissolution Details',
    tabContent: [
      { tabItem: "Divorce / Dissolution Case Number", value: "LV12D12345" },
      { tabItem: "Date of marriage / civil partnership", value: "1 Jan 1999" },
      { tabItem: "Application Issued Date", value: DateHelper.getTodayFormattedDate() },
      { tabItem: "Name of Court / Divorce Centre where petition issued", value: "Shire Court" },
      { tabItem: "What stage has the divorce / dissolution case reached ?", value: "Petition / Application Issued" },
      { tabItem: "Upload Petition", value: "PETITION FORM A.docx" },
      { tabItem: "Does this FR case relate to a Dissolution of a Civil Partnership?", value: "No" }
    ]
  }, 
  {
    tabName: 'Respondent',
    tabContent: [
      "Respondent’s Details",
      { tabItem: "Current First and Middle names", value: "Smeagol" },
      { tabItem: "Current Last Name", value: "Gollum" },
      "Is the respondent represented ?",
      "Respondent’s Solicitor’s Details",
      { tabItem: "Solicitor’s name", value: "Sauron" },
      { tabItem: "Solicitor’s firm", value: "Mnt Doom Sols" },
    ],
    excludedContent: ["Is the Respondent currently a resident in a refuge?"]
  }
];

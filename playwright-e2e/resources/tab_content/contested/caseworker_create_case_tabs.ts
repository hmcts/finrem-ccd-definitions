import { DateHelper } from "../../../data-utils/DateHelper";
import {Tab} from "../../../pages/components/tab.ts";
import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

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
      { tabItem: "Your reference number", value: envTestData.ORG_ID_1 },
      { tabItem: "Solicitor’s name", value: "Bilbo Baggins" },
      { tabItem: "Solicitor’s firm", value: "FinRem-1-Org" },
    ]
  },
  {
    tabName: 'Divorce / Dissolution Details',
    tabContent: [
      { tabItem: "Divorce / Dissolution Case Number", value: "LV12D12345" },
      { tabItem: "Date of marriage / civil partnership", value: "1 Jan 1999" },
      { tabItem: "Application Issued Date", value:DateHelper.getTodayFormattedDate() },
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
      { tabItem: "Is the Respondent currently a resident in a refuge?", value: "Yes" },
      "Is the respondent represented ?",
      "Respondent’s Solicitor’s Details",
      { tabItem: "Solicitor’s name", value: "Sauron" },
      { tabItem: "Solicitor’s firm", value: "Mnt Doom Sols" },
    ]
  }
];

export const createPaperCaseTabDataChildrensAct: Tab[] = [
  {
    tabName: 'Applicant',
    tabContent: [
      "Applicant’s Details",
      { tabItem: "Current First and Middle names", value: "Frodo" },
      { tabItem: "Current Last Name", value: "Baggins" },
      { tabItem: "Is this an urgent case ?", value: "No" },
      { tabItem: "Keep the Applicant's contact details private from the Respondent?", value: "Yes" },
      { tabItem: "Is the Applicant currently a resident in a refuge?", value: "Yes" },
      "Solicitor Details",
      { tabItem: "Your reference number", value: envTestData.ORG_ID_1 },
      { tabItem: "Solicitor’s name", value: "Bilbo Baggins" },
      { tabItem: "Solicitor’s firm", value: "FinRem-1-Org" },
      { tabItem: "Was the application made on paper?", value: "Yes" },
      "Under paragraph 1 or 2 of schedule 1 children act 1989"
    ]
  },
  {
    tabName: 'Schedule 1/Child Details',
    tabContent: [
      { tabItem: "Does the child live in England or Wales?", value: "Yes" },
      { tabItem: "Full Name", value: "Child A" },
      { tabItem: "Date of birth", value: "1 Jan 2010" },
      { tabItem: "Gender", value: "Female" },
      { tabItem: "Relationship of applicant to the child", value: "Mother" },
      { tabItem: "Relationship of respondent to the child", value: "Father" }
    ]
  },
  {
    tabName: 'Respondent',
    tabContent: [
      "Respondent’s Details",
      { tabItem: "Current First and Middle names", value: "Smeagol" },
      { tabItem: "Current Last Name", value: "Gollum" },
      "Respondent’s Solicitor’s Details",
      { tabItem: "Solicitor’s name", value: "Sauron" },
      { tabItem: "Respondent solicitor’s reference", value: "MNT12345" },
      { tabItem: "Solicitor’s firm", value: "Mnt Doom Sols" },
      "Respondent’s Solicitor’s Contact Details",
      { tabItem: "Building and Street", value: "Coral, 65-68" },
      { tabItem: "Address Line 2", value: "Leadenhall 2nd Street" },
      { tabItem: "Town or City", value: "Manchester" },
      { tabItem: "County", value: "test" },
      { tabItem: "Postcode/Zipcode", value: "EC3A 2AF" },
      { tabItem: "Country", value: "United Kingdom" },
      { tabItem: "Phone Number", value: "07111111111" },
      { tabItem: "Email", value: "fr_respondent_solicitor1@mailinator.com" }
    ]
  }
  ];

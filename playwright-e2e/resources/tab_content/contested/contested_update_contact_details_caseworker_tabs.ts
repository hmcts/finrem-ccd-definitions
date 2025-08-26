import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

export const contestedUpdateContactDetailsTabData = [
  {
    tabName: 'Applicant',
    tabContent: [
      "Applicant’s Details",
      { tabItem: "Current First and Middle names", value: "Frodo" },
      { tabItem: "Current Last Name", value: "Baggins" },
      { tabItem: "Is the Applicant currently a resident in a refuge?", value: "Yes" },
      "Solicitor Details",
      { tabItem: "Your reference number", value: envTestData.ORG_ID_1 },
      { tabItem: "Solicitor’s name", value: "Bilbo Baggins" },
      { tabItem: "Solicitor’s firm", value: "FinRem-1-Org" },
    ]
  },
  {
    tabName: 'Respondent',
    tabContent: [
      "Respondent’s Details",
      { tabItem: "Current First and Middle names", value: "Smeagol" },
      { tabItem: "Current Last Name", value: "Gollum" },
      { tabItem: "Is the Respondent currently a resident in a refuge?", value: "Yes" },
      "Respondent’s Solicitor’s Details",
      { tabItem: "Solicitor’s name", value: "Sauron" },
      { tabItem: "Solicitor’s firm", value: "Mnt Doom Sols" }
    ]
  }
];

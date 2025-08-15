import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

export const updateRespondentNonRepresentedContactDetailsTabData = [
  {
    tabName: 'Applicant',
    tabContent: [
      "APPLICANT DETAILS",
      { tabItem: "Current First and Middle names", value: "Tester case" },
      { tabItem: "Current Last Name", value: "Baggins" },
      { tabItem: "Please state in which Financial Remedies Court Zone the applicant resides", value: "Midlands"},
      { tabItem: "This should be the FRC local to the applicant", value: "Nottingham FRC" },
      { tabItem: "Where is the Applicant’s Local Court?", value: "LEICESTER COUNTY COURT AND FAMILY COURT" },
    "SOLICITOR DETAILS",
      { tabItem: "Solicitor’s name", value: "Test Baggins" },
      { tabItem: "Name of your firm", value: "FinRem-1-Org" },
      { tabItem: "Your reference", value: envTestData.ORG_ID_1 },
    ]
  },
  {
    tabName: 'Respondent',
    tabContent: [
      "RESPONDENT DETAILS",
      { tabItem: "Current First and Middle names", value: "Smeagol" },
      { tabItem: "Current Last Name", value: "Gollum" },
      { tabItem: "Is the Respondent currently a resident in a refuge?", value: "Yes" },
      { tabItem: "Is the respondent represented ?", value: "No" },
      "RESPONDENT SERVICE ADDRESS DETAILS",
      { tabItem: "Building and Street", value: "10 Selsdon Road" },
      { tabItem: "Town or City", value: "London" },
      { tabItem: "Country", value: "United Kingdom" },
      { tabItem: "Postcode/Zipcode", value: "NW2 7NE" },
    ]
  }
];

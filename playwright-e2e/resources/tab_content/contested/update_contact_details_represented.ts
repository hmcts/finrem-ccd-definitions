import {envTestData} from '../../../data-utils/test_data/EnvTestDataConfig.ts';

export const updateContestedApplicantRepresentedContactDetailsTabData = [
  {
    tabName: 'Applicant',
    tabContent: [
      'Applicant’s Details',
      { tabItem: 'Current First and Middle names', value: 'Tester case' },
      { tabItem: 'Current Last Name', value: 'Baggins' },
      { tabItem: 'Does the applicant live outside of the UK?', value: 'No' },
      'Solicitor Details',
      { tabItem: 'Your reference number', value: envTestData.ORG_ID_1 },
      { tabItem: 'Solicitor’s name', value: 'Test Baggins' },
      { tabItem: 'Solicitor’s firm', value: 'FinRem-1-Org' }
    ]
  },
  {
    tabName: 'Respondent',
    tabContent: [
      'Respondent’s Details',
      { tabItem: 'Current First and Middle names', value: 'Smeagol' },
      { tabItem: 'Current Last Name', value: 'Gollum' },
      'Respondent’s Solicitor’s Details',
      { tabItem: 'Solicitor’s name', value: 'Sauron' },
      { tabItem: 'Solicitor’s firm', value: 'Mnt Doom Sols' }
    ]
  }
];

export const contestedUpdateContactDetailsRespondentRepresentedAddressChangeTabData = [
  {
    tabName: 'Respondent',
    tabContent: [
      'Respondent’s Details',
      { tabItem: 'Current First and Middle names', value: 'Smeagol' },
      { tabItem: 'Current Last Name', value: 'Gollum' },
      { tabItem: 'Is the Respondent currently a resident in a refuge?', value: 'Yes' },
      'Respondent’s Solicitor’s Details',
      { tabItem: 'Solicitor’s name', value: 'Sauron' },
      { tabItem: 'Solicitor’s firm', value: 'Mnt Doom Sols' },
      'Respondent’s Solicitor’s Contact Details',
      { tabItem: 'Building and Street', value: '10 Selsdon Road' },
      { tabItem: 'Town or City', value: 'London' },
      { tabItem: 'Postcode/Zipcode', value: 'NW2 7NE' },
      { tabItem: 'Country', value: 'United Kingdom' },
      { tabItem: 'Phone Number', value: '07821 639001' },
      { tabItem: 'Email', value: 'fr_respondent_solicitor1@mailinator.com' }
    ]
  }
];

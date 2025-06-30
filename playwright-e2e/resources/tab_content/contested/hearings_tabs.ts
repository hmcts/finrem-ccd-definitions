const getFormattedDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const migratedListForHearingsTabDataOnHearing1 = [
  {
    tabName: 'Hearings',
    tabContent: [
      "Hearing 1",
      { tabItem: "Type of Hearing", value: "Final Hearing (FH)" },
      { tabItem: "Court", value: "Chesterfield County Court" },
      { tabItem: "Hearing date", value: getFormattedDate() + ' 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Unknown' },
      { tabItem: "Additional information about the hearing", value: 'Some additional information' }
    ]
  }
];

export const migratedListForHearingsTabDataOnHearing2 = [
    {
    tabName: 'Hearings',
    tabContent: [
      "Hearing 1",
      { tabItem: "Type of Hearing", value: "Pre-Trial Review (PTR)" },
      { tabItem: "Court", value: "Central Family Court" },
      { tabItem: "Hearing attendance", value: "Remote - Video call" },
      { tabItem: "Hearing date", value: '23 Sept 2025 10:00 AM' },
      { tabItem: "Hearing time estimate", value: '2 hours' },
      { tabItem: "Who has received this notice", value: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum' },
      { tabItem: "Additional information about the hearing", value: 'Hearing details here' },
      { tabItem: "Hearing documents", value: 'HearingNotice.pdf' },
      "Hearing 2",
      { tabItem: "Type of Hearing", value: "Final Hearing (FH)" },
      { tabItem: "Court", value: "Chesterfield County Court" },
      { tabItem: "Hearing date", value: getFormattedDate() + ' 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Unknown' },
      { tabItem: "Additional information about the hearing", value: 'Some additional information' }
    ]
  }
];

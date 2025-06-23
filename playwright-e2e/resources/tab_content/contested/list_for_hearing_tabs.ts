const getFormattedDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const listForHearingTabData = [
  {
    tabName: 'Scheduling and Listing',
    tabContent: [
      "First Hearing (caseworker S&L)",
      { tabItem: "Time Estimate", value: "1 hour" },
      { tabItem: "Hearing Date", value: getFormattedDate() },
      { tabItem: "Type of Hearing", value: 'Final Hearing (FH)' },
      { tabItem: "Hearing Time", value: '10:00' },
      { tabItem: "Please state in which Financial Remedies Court Zone the applicant resides", value: "Midlands" },
      { tabItem: "Please choose the FRC which covers the area within which the Applicant resides.", value: "Nottingham FRC" },
      { tabItem: "Where is the Applicant’s Local Court?", value: "CHESTERFIELD COUNTY COURT" },
    ]
  },
];

const getFormattedDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const migratedListForHearingsTabData = [
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
  },
];

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
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: getFormattedDate() + ' 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'Some additional information' },
      { tabItem: "Hearing documents", value: 'test.pdf' }
    ]
  }
];

export const migratedListForHearingsTabDataOnHearing2 = [
    // Hearing 1 is the hearing made by Manage Hearings event.
    // Hearing 2 is the migrated List for Hearing
    {
    tabName: 'Hearings',
    tabContent: [
      "Hearing 1",
      { tabItem: "Type of Hearing", value: "Pre-Trial Review (PTR)" },
      { tabItem: "Court", value: "Central Family Court" },
      { tabItem: "Hearing attendance", value: "Remote - Video call" },
      { tabItem: "Hearing date", value: '03 Mar 2024 10:00 AM' },
      { tabItem: "Hearing time estimate", value: '2 hours' },
      { tabItem: "Who has received this notice", value: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum' },
      { tabItem: "Additional information about the hearing", value: 'Hearing details here' },
      { tabItem: "Hearing documents", value: 'HearingNotice.pdf' },
      "Hearing 2",
      { tabItem: "Type of Hearing", value: "Final Hearing (FH)" },
      { tabItem: "Court", value: "Chesterfield County Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: getFormattedDate() + ' 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'Some additional information' },
      { tabItem: "Hearing documents", value: 'test.pdf' }
    ]
  }
];

export const migratedListForInterimHearingsTabDataOnHearing = [
  {
    tabName: 'Hearings',
    tabContent: [
      "Hearing 1",
      { tabItem: "Type of Hearing", value: "Maintenance Pending Suit (MPS)" },
      { tabItem: "Court", value: "Chesterfield County Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '01 Jan 2026 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'MPS: Additional information about the hearing' },
      { tabItem: "Hearing documents", value: 'MPSfile.pdf' },
      "Hearing 2",
      { tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)" },
      { tabItem: "Court", value: "Derby Combined Court Centre" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '02 Feb 2026 11:00' },
      { tabItem: "Hearing time estimate", value: '2 hours' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'FDA: Additional information about the hearing' },
      { tabItem: "Hearing documents", value: 'FDAfile.pdf' },
      "Hearing 3",
      { tabItem: "Type of Hearing", value: "Financial Dispute Resolution (FDR)" },
      { tabItem: "Court", value: "Nottingham County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '03 Mar 2026 12:00' },
      { tabItem: "Hearing time estimate", value: '3 hours' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'FDR: Additional information about the hearing' },
      { tabItem: "Hearing documents", value: 'FDRfile.pdf' },
      "Hearing 4",
      { tabItem: "Type of Hearing", value: "Final Hearing (FH)" },
      { tabItem: "Court", value: "Leicester County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '04 Apr 2026 13:00' },
      { tabItem: "Hearing time estimate", value: '4 hours' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'FH: Additional information about the hearing' },
      { tabItem: "Hearing documents", value: 'FHfile.pdf' },
      "Hearing 5",
      { tabItem: "Type of Hearing", value: "Directions (DIR)" },
      { tabItem: "Court", value: "Boston County Court And Family Court" },
      { tabItem: "Hearing date", value: '05 May 2026 14:00' },
      { tabItem: "Hearing time estimate", value: '30 minutes' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'DIR: Additional information about the hearing' },
      { tabItem: "Hearing documents", value: 'DIRfile.pdf' },
      "Hearing 6",
      { tabItem: "Type of Hearing", value: "Directions (DIR)" },
      { tabItem: "Court", value: "Lincoln County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '06 Jun 2026 15:00' },
      { tabItem: "Hearing time estimate", value: '40 minutes' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'No File: Additional information about the hearing' }
    ]
  }
];

export const migratedGeneralApplicationDirectionsTabDataOnHearing1 = [
  {
    tabName: 'Hearings',
    tabContent: [
      "Hearing 1",
      { tabItem: "Type of Hearing", value: "Application Hearing" },
      { tabItem: "Court", value: "Bromley County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '01 Jan 2025 10:00' },
      { tabItem: "Hearing time estimate", value: '3 hours' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'Whatever information is required for the hearing' }
    ]
  }
];

export const migratedHearingsCreatedFromProcessOrderTabData = [
  {
    tabName: 'Hearings',
    tabContent: [
      // Hearing 1 is the hearing made by List for Hearing event.
      "Hearing 1",
      { tabItem: "Type of Hearing", value: "Directions (DIR)" },
      { tabItem: "Court", value: "Chester Civil And Family Justice Centre" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '01 Jan 2024 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: '' },
      "Hearing 2",
      { tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)" },
      { tabItem: "Court", value: "Nottingham County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '02 Oct 2025 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'This is additional information about the hearing' },
      { tabItem: "Hearing documents", value: '1.pdf' },
    ]
  }
];

export const migratedMultipleHearingsCreatedFromProcessOrderTabData = [
  {
    tabName: 'Hearings',
    tabContent: [
      "Hearing 1",
      { tabItem: "Type of Hearing", value: "Directions (DIR)" },
      { tabItem: "Court", value: "Chester Civil And Family Justice Centre" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '01 Jan 2024 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: "" },
      "Hearing 2",
      { tabItem: "Type of Hearing", value: "Directions (DIR)" },
      { tabItem: "Court", value: "Bromley County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '02 Jan 2024 11:00' },
      { tabItem: "Hearing time estimate", value: '2 hours' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: "" },
      "Hearing 3",
      { tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)" },
      { tabItem: "Court", value: "Nottingham County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '02 Oct 2025 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'This is additional information about the hearing' },
      { tabItem: "Hearing documents", value: '1.pdf' }
    ]
  }
];

export const migratedMultipleHearingsCreatedFromProcessOrderWithAnyManageHearingsEventTabData = [
  {
    tabName: 'Hearings',
    tabContent: [
      "Hearing 1",
      { tabItem: "Type of Hearing", value: "Directions (DIR)" },
      { tabItem: "Court", value: "Chester Civil And Family Justice Centre" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '01 Jan 2024 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: "" },
      "Hearing 2",
      { tabItem: "Type of Hearing", value: "Directions (DIR)" },
      { tabItem: "Court", value: "Bromley County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '02 Jan 2024 11:00' },
      { tabItem: "Hearing time estimate", value: '2 hours' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: "" },
      "Hearing 3",
      { tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)" },
      { tabItem: "Court", value: "Nottingham County Court And Family Court" },
      { tabItem: "Hearing attendance", value: "Hearing mode not specified" },
      { tabItem: "Hearing date", value: '02 Oct 2025 10:00' },
      { tabItem: "Hearing time estimate", value: '1 hour' },
      { tabItem: "Who has received this notice", value: 'Confidential parties not specified' },
      { tabItem: "Additional information about the hearing", value: 'This is additional information about the hearing' },
      { tabItem: "Hearing documents", value: '1.pdf' },
      "Hearing 4",
      { tabItem: "Type of Hearing", value: "Pre-Trial Review (PTR)" },
      { tabItem: "Court", value: "Central Family Court" },
      { tabItem: "Hearing attendance", value: "Remote - Video call" },
      { tabItem: "Hearing date", value: '03 Mar 2026 10:00 AM' },
      { tabItem: "Hearing time estimate", value: '2 hours' },
      { tabItem: "Who has received this notice", value: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum' },
      { tabItem: "Additional information about the hearing", value: 'by Manage Hearings event.' },
      { tabItem: "Hearing documents", value: 'HearingNotice.pdf' }
    ]
  }
];

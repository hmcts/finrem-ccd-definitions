import { DateHelper } from "../../../data-utils/DateHelper";

export const processOrderHearingTabData = [
  {
    tabName: 'Hearings',
    tabContent: buildHearingsTabContent([
      {
        typeOfHearing: "First Directions Appointment (FDA)",
        hearingDate: "01 Jan 2024 10:00",
        whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
        court: "Coventry Combined Court Centre",
        hearingAttendance: "In Person",
        hearingTimeEstimate: "30",
        additionalInformation: "This is a test hearing",
        hearingDocuments: 'HearingNotice.pdf\nForm-G.pdf\nPfdNcdrComplianceLetter.pdf\nPfdNcdrCoverLetter.pdf\nOutOfFamilyCourtResolution.pdf\nForm-C.pdf'
      }
    ])
  }
];

export const migratedListForHearingsTabDataOnHearing1 = [
  {
    tabName: 'Hearings',
    tabContent: buildHearingsTabContent([
      {
        typeOfHearing: "Final Hearing (FH)",
        court: "Chesterfield County Court",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: DateHelper.getNumericShortFormattedDateToday() + ' 10:00',
        hearingTimeEstimate: '1 hour',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'Some additional information',
        hearingDocuments: 'test.pdf'
      }
    ])
  }
];

export const migratedListForHearingsTabDataOnHearing2 = [
  {
    tabName: 'Hearings',
    tabContent: buildHearingsTabContent([
      {
        typeOfHearing: "Pre-Trial Review (PTR)",
        court: "Central Family Court",
        hearingAttendance: "Remote - Video call",
        hearingDate: '03 Mar 2024 10:00 AM',
        hearingTimeEstimate: '2 hours',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'Hearing details here',
        hearingDocuments: 'HearingNotice.pdf'
      },
      {
        typeOfHearing: "Final Hearing (FH)",
        court: "Chesterfield County Court",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: DateHelper.getNumericShortFormattedDateToday() + ' 10:00',
        hearingTimeEstimate: '1 hour',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'Some additional information',
        hearingDocuments: 'test.pdf'
      }
    ])
  }
];

export const migratedListForInterimHearingsTabDataOnHearing = [
  {
    tabName: 'Hearings',
    tabContent: buildHearingsTabContent([
      {
        typeOfHearing: "Maintenance Pending Suit (MPS)",
        court: "Chesterfield County Court",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: '01 Jan 2026 10:00',
        hearingTimeEstimate: '1 hour',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'MPS: Additional information about the hearing',
        hearingDocuments: 'MPSfile.pdf'
      },
      {
        typeOfHearing: "First Directions Appointment (FDA)",
        court: "Derby Combined Court Centre",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: '02 Feb 2026 11:00',
        hearingTimeEstimate: '2 hours',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'FDA: Additional information about the hearing',
        hearingDocuments: 'FDAfile.pdf'
      },
      {
        typeOfHearing: "Financial Dispute Resolution (FDR)",
        court: "Nottingham County Court And Family Court",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: '03 Mar 2026 12:00',
        hearingTimeEstimate: '3 hours',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'FDR: Additional information about the hearing',
        hearingDocuments: 'FDRfile.pdf'
      },
      {
        typeOfHearing: "Final Hearing (FH)",
        court: "Leicester County Court And Family Court",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: '04 Apr 2026 13:00',
        hearingTimeEstimate: '4 hours',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'FH: Additional information about the hearing',
        hearingDocuments: 'FHfile.pdf'
      },
      {
        typeOfHearing: "Directions (DIR)",
        court: "Boston County Court And Family Court",
        hearingAttendance: undefined,
        hearingDate: '05 May 2026 14:00',
        hearingTimeEstimate: '30 minutes',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'DIR: Additional information about the hearing',
        hearingDocuments: 'DIRfile.pdf'
      },
      {
        typeOfHearing: "Directions (DIR)",
        court: "Lincoln County Court And Family Court",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: '06 Jun 2026 15:00',
        hearingTimeEstimate: '40 minutes',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'No File: Additional information about the hearing'
      }
    ])
  }
];

export const migratedGeneralApplicationDirectionsTabDataOnHearing1 = [
  {
    tabName: 'Hearings',
    tabContent: buildHearingsTabContent([
      {
        typeOfHearing: "Application Hearing",
        court: "Bromley County Court And Family Court",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: '01 Jan 2025 10:00',
        hearingTimeEstimate: '3 hours',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'Whatever information is required for the hearing'
      }
    ])
  }
];

export const migratedUploadApprovedOrderTabDataOnHearing1 = [
  {
    tabName: 'Hearings',
    tabContent: buildHearingsTabContent([
      {
        typeOfHearing: "Final Hearing (FH)",
        court: "Birmingham Civil And Family Justice Centre",
        hearingAttendance: "Hearing mode not specified",
        hearingDate: '01 Jan 2022 10:00',
        hearingTimeEstimate: '30 minutes',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: ''
      }
    ])
  }
];

export const newUploadApprovedOrderMHTabDataOnHearing1 = [
  {
    tabName: 'Hearings',
    tabContent: buildHearingsTabContent([
      {
        typeOfHearing: "First Directions Appointment (FDA)",
        court: "Bromley County Court And Family Court",
        hearingAttendance: "Remote - Video call",
        hearingDate: '01 Jan 2025 10:00',
        hearingTimeEstimate: '3 hours',
        whoHasReceivedThisNotice: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'This is a test hearing',
        hearingDocuments: 'HearingNotice.pdf\nForm-G.pdf\nPfdNcdrComplianceLetter.pdf\nPfdNcdrCoverLetter.pdf\nOutOfFamilyCourtResolution.pdf\nForm-C.pdf\nOtherDoc.doc'
      }
    ])
  }
];

export function generateHearingsTabData(hearings: Array<{
  label?: string, // Optional, defaults to "Hearing N"
  typeOfHearing: string,
  court: string,
  hearingAttendance: string,
  hearingDate: string,
  hearingTimeEstimate: string,
  whoHasReceivedThisNotice: string,
  additionalInformation: string,
  hearingDocuments?: string
}>) {
  const tabContent: any[] = [];
  hearings.forEach((hearing, idx) => {
    tabContent.push(hearing.label ?? `Hearing ${idx + 1}`);
    tabContent.push({ tabItem: "Type of Hearing", value: hearing.typeOfHearing });
    tabContent.push({ tabItem: "Court", value: hearing.court });
    tabContent.push({ tabItem: "Hearing Attendance", value: hearing.hearingAttendance });
    tabContent.push({ tabItem: "Hearing Date", value: hearing.hearingDate });
    tabContent.push({ tabItem: "Hearing Time Estimate", value: hearing.hearingTimeEstimate });
    tabContent.push({ tabItem: "Who has received this notice", value: hearing.whoHasReceivedThisNotice });
    tabContent.push({ tabItem: "Additional information about the hearing", value: hearing.additionalInformation });
    if (hearing.hearingDocuments) {
      tabContent.push({ tabItem: "Hearing Documents", value: hearing.hearingDocuments });
    }
  });
  return [{
    tabName: 'Hearings',
    tabContent
  }];
}

export function buildHearingsTabContent(hearings: Array<{
  typeOfHearing: string,
  hearingDate: string,
  whoHasReceivedThisNotice: string,
  court: string,
  hearingAttendance?: string,
  hearingTimeEstimate: string,
  additionalInformation: string,
  hearingDocuments?: string
}>) {
  const tabContent: any[] = [];
  if (hearings.length > 0) {
    tabContent.push("Hearing");
  }
  hearings.forEach(hearing => {
    tabContent.push({ tabItem: "Type of Hearing", value: "Hearing Date | Who has received this notice", exact: false });
    tabContent.push({
      tabItem: hearing.typeOfHearing,
      value: `${hearing.hearingDate} | ${hearing.whoHasReceivedThisNotice}`,
      clickable: true
    });
    tabContent.push({ tabItem: "Court", value: hearing.court });
    tabContent.push({ tabItem: "Hearing Attendance", value: hearing.hearingAttendance });
    tabContent.push({ tabItem: "Hearing Time Estimate", value: hearing.hearingTimeEstimate });
    tabContent.push({ tabItem: "Additional information about the hearing", value: hearing.additionalInformation });
    tabContent.push({ tabItem: "Hearing Documents", value: hearing.hearingDocuments });
  });
  return tabContent;
}

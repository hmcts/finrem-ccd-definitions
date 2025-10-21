import { DateHelper } from "../../../data-utils/DateHelper";
import { Tab } from "../../../pages/components/tab";

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

export function newUploadApprovedOrderMHTabDataOnHearing1() : Tab[] {
  return [
    {
      tabName: 'Hearings',
      tabContent: [
        "Hearing 1",
        {tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)"},
        {tabItem: "Court", value: "Bromley County Court And Family Court"},
        {tabItem: "Hearing Attendance", value: "Remote - Video call"},
        {tabItem: "Hearing Date", value: '01 Jan 2025 10:00'},
        {tabItem: "Hearing Time Estimate", value: '3 hours'},
        {tabItem: "Who has received this notice", value: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum'},
        {tabItem: "Additional information about the hearing", value: 'This is a test hearing'},
        {
          tabItem: "Hearing Documents", value:
            'HearingNotice.pdf\nForm-G.pdf\nPfdNcdrComplianceLetter.pdf\nPfdNcdrCoverLetter.pdf\nOutOfFamilyCourtResolution.pdf\nForm-C.pdf\nOtherDoc.doc'
        }
      ]
    }
  ];
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

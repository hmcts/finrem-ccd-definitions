import { DateHelper } from "../../../data-utils/DateHelper";
import { Tab } from "../../../pages/components/tab";

export const processOrderHearingTabData =[{ 
  tabName: "Hearings",
  tabContent: [
    "Hearings",
    { tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)" },
    { tabItem: "Court", value: "Bromley County Court And Family Court" },
    { tabItem: "Hearing Attendance", value: "In Person" },
    { tabItem: "Hearing Date", value: "01 Jan 2024 10:00" },
    { tabItem: "Hearing Time Estimate", value: "30" }, 
    { tabItem: "Who has received this notice", value: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum" },
    { tabItem: "Additional information about the hearing", value: "This is a test hearing" },
  ]
}];

export function newUploadApprovedOrderMHTabDataOnHearing1(date?: string) : Tab[] {
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
    },
    {
      tabName: 'Orders',
      tabContent: [
        "Finalised Orders",
        "Finalised Orders 1",
        {tabItem: "Upload Document", value: "approvedOrder.pdf"},
        {tabItem: "Order created at", value: date ?? DateHelper.getUtcDateTimeFormatted(), exact: false},
      ]
    }
  ];
}

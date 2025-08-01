import { DateHelper } from "../../../data-utils/DateHelper";
import { Tab } from "../../../pages/components/tab";

export const createDraftOrdersApprovedWithHearingTabData = (hearingDate: string): Tab[] => [{
  tabName: "Draft orders",
  tabContent: [
    "Draft Orders 1",
    { tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)" }, 
    { tabItem: "Hearing Date", value: DateHelper.formatToDayMonthYearShort(hearingDate) },
    { tabItem: "Hearing Time", value: "10:00" },
    { tabItem: "Order status", value: "Processed" },
    { tabItem: "Judge name", value: "Peter Chapman"},
    { tabItem: "Cover letter", value: "agreed-draft-order-document - cover letter.pdf"},
    { tabItem: "Submitted by", value: "Claire Mumford" },
    { tabItem: "Uploaded on behalf of", value: "The applicant" },
    { tabItem: "Is this a resubmission?", value: "No" }, 
    { tabItem: "Draft order", value: "agreed-draft-order-document.pdf"}
  ]
}];

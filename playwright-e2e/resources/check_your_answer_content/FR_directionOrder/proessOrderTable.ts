import {Table, TableRowItem} from "../../../pages/components/table.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export const unprocessedApprovedOrders: TableRowItem[] = [
  "Unprocessed Approved Orders",
  { cellItem: "Upload Document", value: "agreed-draft-order-document.docx" },
]

export const unprocessedApprovedOrdersWithOldHearingTable: Table = {
  tableName: "Check Your Answers", 
  rows: [
    ...unprocessedApprovedOrders,
    "Next Hearing Details",
    { cellItem: "Is there another hearing to be listed ?", value: "Yes" },
    { cellItem: "Time Estimate", value: "30" },
    { cellItem: "Hearing Date", value: DateHelper.formatToDayMonthYearShort("2024-01-01") },
    { cellItem: "Hearing Time", value: "10:00" },
    { cellItem: "Please state in which Financial Remedies Court Zone the applicant resides", value: "Midlands" },
    { cellItem: "Type of hearing values", value: "First Directions Appointment (FDA)" }
  ]
};

export const unprocessedApprovedOrdersWithNewHearingTable: Table = {
  tableName: "Check Your Answers", 
  rows: [
    ...unprocessedApprovedOrders,
    { cellItem: "Do you want to add a hearing?", value: "Yes" },
    { cellItem: "Type of Hearing", value: "First Directions Appointment (FDA)" },
    { cellItem: "Hearing Time Estimate", value: "30" },
    { cellItem: "Hearing Date", value: DateHelper.formatToDayMonthYearShort("2024-01-01") },
    { cellItem: "Hearing Time", value: "10:00" },
    { cellItem: "Please state in which Financial Remedies Court Zone the applicant resides", value: "Midlands" },
    { cellItem: "Hearing attendance", value: "In person" },
    { cellItem: "Additional information about the hearing", value: "This is a test hearing" },
    { cellItem: "Do you want to upload any other documents?", value: "No" },
    { cellItem: "Do you want to send a notice of hearing?", value: "Yes" }
  ]
};

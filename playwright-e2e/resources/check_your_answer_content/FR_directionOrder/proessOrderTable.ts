import {Table, TableRowItem} from "../../../pages/components/table.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export const unprocessedApprovedOrders: TableRowItem[] = [
  "Unprocessed Approved Orders",
  { cellItem: "Upload Document", value: "agreed-draft-order-document.docx" },
]

export const unprocessedApprovedOrdersWithHearingTable: Table = {
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

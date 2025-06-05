import {Table} from "../../../pages/components/table";

const getFormattedDate = (): string => {
    const today = new Date();
    today.setDate(today.getDate() + 12 * 7 + 1);
    return today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export function getManageHearingTableData(params?: {
    typeOfHearing?: string,
    duration?: string,
    hearingDate?: string,
    hearingTime?: string,
    courtZone?: string,
    attendance?: string,
    additionalInformation?: string,
    uploadAnySupportingDocuments?: boolean,
    uploadFiles?: string[],
    sendANoticeOfHearing?: boolean,
    whoShouldSeeOrder?: string
}): Table {
    return {
        tableName: 'Hearing',
        rows: [
            {cellItem: "Type of Hearing", value: params?.typeOfHearing ?? "Final Hearing (FH)"},
            {cellItem: "Hearing Time Estimate", value: params?.duration ?? "2 hours"},
            {cellItem: "Hearing Date", value: params?.hearingDate ?? getFormattedDate()},
            {cellItem: "Hearing Time", value: params?.hearingTime ?? "10:00 AM"},
            "This would usually be the applicants local Court",
            {cellItem: "Please state in which Financial Remedies Court Zone the applicant resides", value: params?.courtZone ?? "London"},
            {cellItem: "Hearing attendance", value: params?.attendance ?? "Remote - video call"},
            {cellItem: "Additional information about the hearing", value: params?.additionalInformation ?? "Hearing details here"},
            {cellItem: "Do you want to upload any other documents?", value: (params?.uploadAnySupportingDocuments ?? true) ? "Yes" : "No"},
            {cellItem: "Please upload any additional documents related to your application.", value: (params?.uploadFiles ?? ["final_hearing_file1.pdf", "final_hearing_file2.pdf"]).join(' ')},
            {cellItem: "Do you want to send a notice of hearing?", value: (params?.sendANoticeOfHearing ?? true) ? "Yes" : "No"},
            {cellItem: "Who should see this order?", value: params?.whoShouldSeeOrder ?? "Applicant - Frodo Baggins\nRespondent - Smeagol Gollum"},
        ]
    };
}

export const manageHearingTableData: Table = getManageHearingTableData();

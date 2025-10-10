import { DateHelper } from "../../../data-utils/DateHelper";
import { Tab } from "../../../pages/components/tab.ts";

/**
 * Returns tab data for the Hearings tab in the same format as buildHearingsTabContent.
 */
export function getManageHearingTabData(params?: {
    typeOfHearing?: string,
    court?: string,
    attendance?: string,
    hearingDate?: string,
    hearingTime?: string,
    duration?: string,
    whoShouldSeeOrder?: string,
    additionalInformation?: string,
    uploadFiles?: string[]
}): Tab {
    const hearingDate = params?.hearingDate ?? DateHelper.getUnFormattedDateTwelveWeeksLater();
    const hearingTime = params?.hearingTime ?? "10:00 AM";
    const whoHasReceivedThisNotice = params?.whoShouldSeeOrder ?? "Applicant - Frodo Baggins, Respondent - Smeagol Gollum, Intervener1 - intApp1, Intervener2 - intResp1";
    const hearingDocuments = (params?.uploadFiles ?? ["HearingNotice.pdf", "final_hearing_file1.pdf", "final_hearing_file2.pdf"]).join('\n');

    return {
        tabName: 'Hearings',
        tabContent: [
            "Hearing",
            { tabItem: "Type of Hearing", value: "Hearing Date | Who has received this notice", exact: false },
            {
                tabItem: params?.typeOfHearing ?? "Financial Dispute Resolution (FDR)",
                value: `${hearingDate} ${hearingTime} | ${whoHasReceivedThisNotice}`,
                clickable: true
            },
            { tabItem: "Court", value: params?.court ?? "Central Family Court" },
            { tabItem: "Hearing Attendance", value: params?.attendance ?? "In Person" },
            { tabItem: "Hearing Time Estimate", value: params?.duration ?? "2 hours" },
            { tabItem: "Additional information about the hearing", value: params?.additionalInformation ?? "Hearing details here" },
            { tabItem: "Hearing Documents", value: hearingDocuments }
        ]
    };
}

export const manageHearingTabData: Tab = getManageHearingTabData();

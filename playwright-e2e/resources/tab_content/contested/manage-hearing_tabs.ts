import { DateHelper } from "../../../data-utils/DateHelper";
import {Tab} from "../../../pages/components/tab.ts";

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
    return {
        tabName: 'Hearings',
        tabContent: [
            "Hearing 1",
            {tabItem: "Type of Hearing", value: params?.typeOfHearing ?? "Financial Dispute Resolution (FDR)"},
            {tabItem: "Court", value: params?.court ?? "Central Family Court"},
            {tabItem: "Hearing Attendance", value: params?.attendance ?? "In Person"},
            {tabItem: "Hearing Date", value: (params?.hearingDate ?? DateHelper.getFormattedDateTwelveWeeksLater()) + " " + (params?.hearingTime ?? "10:00 AM")},
            {tabItem: "Hearing Time Estimate", value: params?.duration ?? "2 hours"},
            {tabItem: "Who has received this notice", value: params?.whoShouldSeeOrder ?? "Applicant - Frodo Baggins, Respondent - Smeagol Gollum, Intervener1 - intApp1, Intervener2 - intResp1"},
            {tabItem: "Additional information about the hearing", value: params?.additionalInformation ?? "Hearing details here"},
            {tabItem: "Hearing Documents", value: (params?.uploadFiles ?? ["HearingNotice.pdf","final_hearing_file1.pdf", "final_hearing_file2.pdf"]).join(' ')},
        ]
    };
}

export const manageHearingTabData: Tab = getManageHearingTabData();

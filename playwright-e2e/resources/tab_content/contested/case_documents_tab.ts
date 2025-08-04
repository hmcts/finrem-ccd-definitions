import { DateHelper } from "../../../data-utils/DateHelper";
import { Tab } from "../../../pages/components/tab";

export function createGeneralEmailTabDataContested(date?: string) :Tab[] { 
    return [
    {
    tabName: 'Case documents',
    tabContent: [
        "Upload case documents",
        { tabItem: "Recipient's email", value: "validEmail1@mailinator.com" },
        { tabItem: "Email created by", value: "Claire Mumford"},
        { tabItem: "Date Sent", value: date ?? DateHelper.getUtcDateTimeFormatted(), exact: false },
        { tabItem: "Body", value: "This is a test" },
        { tabItem: "Upload Document", value: "test.pdf" },
        ]
    },
  ];
}

import {Tab} from "../../../pages/components/tab.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export const upload_draft_order_tabs: Tab[] = [
    {
        tabName: "Draft orders",
        tabContent: [
            "Draft Orders 1",
            { tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)"},
            { tabItem: "Hearing Date", value: DateHelper.getFormattedDateTwelveWeeksLater()},
            { tabItem: "Hearing Time", value: "10:00"},
            'Uploaded draft orders',
            'Uploaded draft orders 1',
            { tabItem: "Order status", value: "To be reviewed"},
            { tabItem: "Type of hearing", value: "First Directions Appointment (FDA)" },
            { tabItem:"Order filed by", value: " The applicant"},
            { tabItem: "Submitted by", value: "Claire Mumford"},
            { tabItem:"Uploaded on behalf of", value: "The applicant"},
            { tabItem: "Is this a resubmission?", value: "No"},
            {tabItem: "Draft order", value:"agreed-draft-order-document.docx"},
            'Uploaded pension sharing annexes',
            'Uploaded pension sharing annexes 1',
            { tabItem: "Order status", value: "To be reviewed"},
            { tabItem: "Type of hearing", value: "First Directions Appointment (FDA)" },
            { tabItem: "Order filed by", value: " The applicant"},
            { tabItem: "Submitted by", value: "Claire Mumford"},
            { tabItem: "Uploaded on behalf of", value: "The applicant"},
            { tabItem: "Pension sharing annex", value: "BagginsFDA.pdf"},
        ]
    }
]

export const approved_upload_draft_order_tabs: Tab[] = [
    {
        tabName: "Draft orders",
        tabContent: [
            "Draft Orders 1",
            { tabItem: "Type of Hearing", value: "First Directions Appointment (FDA)"},
            { tabItem: "Hearing Date", value: DateHelper.getFormattedDateTwelveWeeksLater()},
            { tabItem: "Hearing Time", value: "10:00"},
            'Uploaded draft orders',
            'Uploaded draft orders 1',
            { tabItem: "Order status", value: "Approved by judge"},
            { tabItem: "Type of hearing", value: "First Directions Appointment (FDA)" },
            { tabItem: "Judge name", value: "Peter Chapman"},
            { tabItem:"Order filed by", value: " The applicant"},
            { tabItem: "Submitted by", value: "Claire Mumford"},
            { tabItem:"Uploaded on behalf of", value: "The applicant"},
            { tabItem: "Is this a resubmission?", value: "No"},
            {tabItem: "Draft order", value:"agreed-draft-order-document.docx"},
            'Uploaded pension sharing annexes',
            'Uploaded pension sharing annexes 1',
            { tabItem: "Order status", value: "Approved by judge"},
            { tabItem: "Type of hearing", value: "First Directions Appointment (FDA)" },
            { tabItem: "Judge name", value: "Peter Chapman"},
            { tabItem: "Order filed by", value: " The applicant"},
            { tabItem: "Submitted by", value: "Claire Mumford"},
            { tabItem: "Uploaded on behalf of", value: "The applicant"},
            { tabItem: "Pension sharing annex", value: "BagginsFDA.pdf"},
        ]
    }
]

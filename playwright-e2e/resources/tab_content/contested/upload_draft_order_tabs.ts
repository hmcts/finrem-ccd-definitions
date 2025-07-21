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
    },
    {
        tabName: "Case documents",
        tabContent: [
            "Agreed draft orders following a hearing",
            "Agreed draft orders following a hearing 1",
            { tabItem: 'Draft order', value: 'agreed-draft-order-document.docx' },
            { tabItem: "Uploaded on behalf of", value: "The applicant"},
            { tabItem: "Is this a resubmission?", value: "No"},
            "Agreed draft orders following a hearing 2",
            { tabItem: 'Pension Sharing Annex', value: 'BagginsFDA.pdf'},
            { tabItem: "Uploaded on behalf of", value: "The applicant"},
        ]
    }
];

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
];

export const suggested_draft_order_case_document_tabs: Tab[] = [
    {
        tabName: "Case documents",
        tabContent: [
            "Suggested draft orders prior to a hearing",
            "Suggested draft orders prior to a hearing 1",
            { tabItem: 'Draft order', value: 'agreed-draft-order-document.docx' },
            { tabItem: "Uploaded on behalf of", value: "The applicant"},
            "Suggested draft orders prior to a hearing 2",
            { tabItem: 'Pension Sharing Annex', value: 'BagginsFDA.pdf'},
            { tabItem: "Uploaded on behalf of", value: "The applicant"},
        ]
    }
];

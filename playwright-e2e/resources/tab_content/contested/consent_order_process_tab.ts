import {Tab} from "../../../pages/components/tab.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export const consent_order_process_tab: Tab[] = [
    {
        tabName: "Consent Order Process",
        tabContent: [
           "CONSENT ORDER PROCESS",
            { tabItem :"The application is for:", value : 'Maintenance Pending SuitLump Sum OrderProperty Adjustment OrderA settlement or a transfer of property for the benefit of the child(ren)Periodical Payment OrderPension Sharing OrderPension Compensation Sharing OrderPension Attachment OrderPension Compensation Attachment OrderVariation Order'},
            { tabItem : "Address details", value: "1234 Test Street" },
            { tabItem : "Mortgage details", value: "Mortgage details" },
            "ORDER FOR CHILDREN",
            { tabItem: "Does the application contain any application for periodical payments, or secured periodical payments for children?", value: "Yes" },
            { tabItem: "Is there a written agreement?", value: "No" },
            { tabItem: "Select what the payments are for:", value: "When either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom"},
            { tabItem: "Original order to be varied", value: "Variation order.pdf"},
            { tabItem: "Draft Consent Order", value: "Variation order.pdf" },
            { tabItem: "Form D81 Joint Document", value: "test.pdf" },
            { tabItem: "Type of document", value: "Form P1" },
            { tabItem: "Document", value: "Form P1.pdf" },
            { tabItem: "Online Form A", value: "OnlineForm.pdf" },
            { tabItem: "Court order date", value: DateHelper.getTodayFormattedDate() }
        ]
    },
    {
        tabName: "Orders",
        tabContent: [
            "Latest General Order",
        ]
    }
]

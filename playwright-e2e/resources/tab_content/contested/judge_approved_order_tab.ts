import { Tab } from "../../../pages/components/tab";

export const judgeApprovedOrderTabData: Tab[] = [{
    tabName: "Orders",
    tabContent: [
        "Finalised Orders",
        { tabItem: "Upload Document", value: "judgeApprovedOrder.pdf" },
        { tabItem: "Additional attachments", value: "additionalAttachment.pdf" },
    ]
},
{
    tabName: "Case documents",
    tabContent: [
        "Upload approved order",
        { tabItem: "Upload Draft Document", value: "judgeApprovedOrder.docx" },
        { tabItem: "Additional attachments", value: "additionalAttachment.pdf" },
    ]
}
];

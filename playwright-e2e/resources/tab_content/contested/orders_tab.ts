import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export const contestedSendOrderTabData = [
  {
    tabName: 'Orders',
    tabContent: [
      "Finalised Orders 1",
      { tabItem: "Draft order", value: "agreed-draft-order-document.pdf" },
      { tabItem: "Submitted by", value: "Claire Mumford" },
      { tabItem: "Judge name", value: envTestData.JUDGE_NAME },
      { tabItem: "Final order", value: "No" },
      { tabItem: "Cover Letter", value: "agreed-draft-order-document - cover letter.pdf" },
      ]
    }
  ];

  export const UploadApprovedOrderOrdersTabData = [
    {
      tabName: 'Orders',
      tabContent: [
        "Finalised Orders 1",
        { tabItem: "Upload Document", value: "approvedOrder.pdf" },
        { tabItem: "Additional attachments", value: "additionalAttachment.pdf" },
        { tabItem: "Order created at", value: DateHelper.getUtcDateTimeFormatted(), exact: false},
        "Finalised Orders 2",
        { tabItem: "Upload Document", value: "approvedOrder.pdf" },
        { tabItem: "Order created at", value: DateHelper.getUtcDateTimeFormatted(), exact: false},
      ]
    }
  ];

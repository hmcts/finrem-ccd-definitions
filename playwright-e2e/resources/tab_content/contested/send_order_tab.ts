import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

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

import type { Tab } from '../../../pages/components/tab.ts';

// The approved order created by Approve Application or Upload Approved Order,
// and the judge recorded on it.
export const approvedOrderTabs = (judgeName: string): Tab[] => {
  return [
    {
      tabName: 'Approved Order',
      tabContent: [
        { tabItem: 'Approved Order Letter', value: 'ApprovedConsentOrderLetter.pdf' },
        'Consent Order / Variation Order Annexed and Stamped'
      ]
    },
    {
      tabName: 'Judiciary Outcome',
      tabContent: [{ tabItem: 'Name of Judge', value: judgeName }]
    }
  ];
};

// The refusal recorded by Application Not Approved.
export const refusedOrderTabs = (reason: string, judgeName: string): Tab[] => {
  return [{
    tabName: 'Judiciary Outcome',
    tabContent: [
      'Application Not Approved',
      // The reason is in a multi-select table, so check it as text on the tab.
      'Reason for Refusal',
      reason,
      { tabItem: 'Name of Judge', value: judgeName }
    ]
  }];
};

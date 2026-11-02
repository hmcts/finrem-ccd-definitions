
import { Tab } from '../../../pages/components/tab';
import { buildOrdersTabContent } from './orders_tab';
import { DateHelper } from '../../../data-utils/DateHelper';

export const judgeApprovedOrderTabData: Tab[] = [
  {
    tabName: 'Orders',
    tabContent: buildOrdersTabContent([
      {
        uploadDocument: 'judgeApprovedOrder.pdf',
        additionalAttachments: 'additionalAttachment.pdf',
        orderCreatedAt: DateHelper.getTodayFormattedDate()
      },
      {
        uploadDocument: 'judgeApprovedOrder2.pdf',
        orderCreatedAt: DateHelper.getTodayFormattedDate()
      }
    ])
  },
  {
    tabName: 'Case documents',
    tabContent: [
      'Upload Approved Order 1',
      { tabItem: 'Upload Document', value: 'judgeApprovedOrder.pdf' },
      { tabItem: 'Additional attachments', value: 'additionalAttachment.pdf' },
      'Upload Approved Order 2',
      { tabItem: 'Upload Document', value: 'judgeApprovedOrder2.pdf' }
    ]
  }
];

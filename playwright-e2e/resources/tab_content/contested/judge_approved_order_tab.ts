import { Tab } from '../../../pages/components/tab';

export const judgeApprovedOrderTabData: Tab[] = [{
  tabName: 'Orders',
  tabContent: [
    'Finalised Orders 1',
    { tabItem: 'Upload Document', value: 'judgeApprovedOrder.pdf' },
    { tabItem: 'Additional attachments', value: 'additionalAttachment.pdf' },
    'Finalised Orders 2',
    { tabItem: 'Upload Document', value: 'judgeApprovedOrder2.pdf' }
  ]
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

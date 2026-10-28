import { DateHelper } from '../../../data-utils/DateHelper';
import { envTestData } from '../../../data-utils/test_data/EnvTestDataConfig';
import { Tab, TabContentItem } from '../../../pages/components/tab';

export interface OrderData {
  uploadDocument?: string;
  orderCreatedAt?: string;
  additionalAttachments?: string;
  draftOrder?: string;
  submittedBy?: string;
  judgeName?: string;
  finalOrder?: string;
  coverLetter?: string;
}


export function buildOrdersTabContent(
  orders: OrderData[]
): TabContentItem[] {
  const tabContent: TabContentItem[] = [];

  if (orders.length > 0) {
    tabContent.push('Finalised Orders');
  }

  orders.forEach(order => {
    if (order.uploadDocument) {
      tabContent.push({
        tabItem: order.uploadDocument,
        value: order.orderCreatedAt ?? '',
        exact: false,
        valueColumn: 3,
        clickable: true
      });
    }

    if (order.draftOrder) {
      tabContent.push({
        tabItem: order.draftOrder,
        value: order.submittedBy ?? '',
        exact: false,
        valueColumn: 2,
        clickable: true
      });

      if (order.finalOrder) {
        tabContent.push({
          tabItem: order.draftOrder,
          value: order.finalOrder,
          exact: false,
          valueColumn: 4,
          position: 0
        });
      }
    }

    if (order.additionalAttachments) {
      tabContent.push({
        tabItem: 'Additional attachments',
        value: order.additionalAttachments
      });
    }

    if (order.judgeName) {
      tabContent.push({
        tabItem: 'Judge name',
        value: order.judgeName
      });
    }

    if (order.coverLetter) {
      tabContent.push({
        tabItem: 'Cover Letter',
        value: order.coverLetter
      });
    }
  });

  return tabContent;
}


export const UploadApprovedOrderOrdersTabData: Tab[] = [
  {
    tabName: 'Orders',
    tabContent: buildOrdersTabContent([
      {
        uploadDocument: 'approvedOrder.pdf',
        additionalAttachments: 'additionalAttachment.pdf',
        orderCreatedAt: DateHelper.getTodayFormattedDate()
      },
      {
        uploadDocument: 'approvedOrder.pdf',
        orderCreatedAt: DateHelper.getTodayFormattedDate()
      }
    ])
  }
];


export const contestedSendOrderTabData: Tab[] = [
  {
    tabName: 'Orders',
    tabContent: buildOrdersTabContent([
      {
        draftOrder: 'agreed-draft-order-document.pdf',
        submittedBy: 'Claire Mumford',
        judgeName: envTestData.JUDGE_NAME,
        finalOrder: 'No',
        coverLetter: 'agreed-draft-order-document - cover letter.pdf'
      }
    ])
  }
];


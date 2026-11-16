import {Tab, TabContentItem} from '../../../pages/components/tab.ts';
import {DateHelper} from '../../../data-utils/DateHelper.ts';
import {envTestData} from '../../../data-utils/test_data/EnvTestDataConfig.ts';

type DraftOrderCaseDocEntry = {
  fileName: string;
  submittedBy: string;
  sectionLabel?: string;
  details: Array<{ tabItem: string; value: string; exact?: boolean }>;
};

export function buildDraftOrderCaseDocumentsContent(
  sectionTitle: string,
  entries: DraftOrderCaseDocEntry[]
): TabContentItem[] {
  const tabContent: TabContentItem[] = [sectionTitle];

  entries.forEach((entry, index) => {
    if (index === 0) {
      tabContent.push({
        tabItem: entry.fileName,
        value: entry.submittedBy,
        exact: false,
        valueColumn: 2
      });
    } else if (entry.sectionLabel) {
      tabContent.push({
        tabItem: entry.sectionLabel,
        value: entry.fileName
      });
    } else {
      tabContent.push({
        tabItem: entry.fileName,
        value: entry.submittedBy,
        exact: false,
        valueColumn: 2
      });
    }

    tabContent.push(...entry.details);
  });

  return tabContent;
}

export const upload_draft_order_tabs: Tab[] = [
  {
    tabName: 'Draft orders',
    tabContent: [
      'Draft Orders 1',
      { tabItem: 'Type of Hearing', value: 'First Directions Appointment (FDA)'},
      { tabItem: 'Hearing Date', value: DateHelper.getFormattedDateTwelveWeeksLater()},
      {
        tabItem: 'Hearing Time',
        value: '10:00',
        exact: false
      },
      'Uploaded draft orders',
      'Uploaded draft orders 1',
      { tabItem: 'Order status', value: 'To be reviewed'},
      { tabItem: 'Type of hearing', value: 'First Directions Appointment (FDA)' },
      { tabItem:'Order filed by', value: ' The applicant'},
      { tabItem: 'Submitted by', value: 'Claire Mumford'},
      { tabItem:'Uploaded on behalf of', value: 'The applicant'},
      {tabItem: 'Draft order', value:'agreed-draft-order-document.docx'},
      'Uploaded pension sharing annexes',
      'Uploaded pension sharing annexes 1',
      { tabItem: 'Order status', value: 'To be reviewed'},
      { tabItem: 'Type of hearing', value: 'First Directions Appointment (FDA)' },
      { tabItem: 'Order filed by', value: ' The applicant'},
      { tabItem: 'Submitted by', value: 'Claire Mumford'},
      { tabItem: 'Uploaded on behalf of', value: 'The applicant'},
      { tabItem: 'Pension sharing annex', value: 'BagginsFDA.pdf'}
    ]
  },
  {
    tabName: 'Case documents',
    expandAccordions: true,
    tabContent: buildDraftOrderCaseDocumentsContent('Agreed draft orders following a hearing', [
      {
        fileName: 'agreed-draft-order-document.docx',
        submittedBy: 'Claire Mumford',
        details: [
          { tabItem: 'Order type', value: 'An agreed order following a hearing' },
          { tabItem: 'Document status', value: 'To be reviewed' },
          { tabItem: 'Uploaded on behalf of', value: 'The applicant' },
          { tabItem: 'Attachments', value: '' }
        ]
      },
      {
        sectionLabel: 'Pension Sharing Annex',
        fileName: 'BagginsFDA.pdf',
        submittedBy: 'Claire Mumford',
        details: [
          { tabItem: 'Order type', value: 'An agreed order following a hearing' },
          { tabItem: 'Document status', value: 'To be reviewed' },
          { tabItem: 'Uploaded on behalf of', value: 'The applicant' },
          { tabItem: 'Attachments', value: '' }
        ]
      }
    ])
  }
];

export const approved_upload_draft_order_tabs: Tab[] = [
  {
    tabName: 'Draft orders',
    tabContent: [
      'Draft Orders 1',
      { tabItem: 'Type of Hearing', value: 'First Directions Appointment (FDA)'},
      { tabItem: 'Hearing Date', value: DateHelper.getFormattedDateTwelveWeeksLater()},
      {
        tabItem: 'Hearing Time',
        value: '10:00',
        exact: false
      },
      'Uploaded draft orders',
      'Uploaded draft orders 1',
      { tabItem: 'Order status', value: 'Approved by judge'},
      { tabItem: 'Type of hearing', value: 'First Directions Appointment (FDA)' },
      { tabItem: 'Judge name', value: envTestData.JUDGE_NAME},
      { tabItem:'Order filed by', value: ' The applicant'},
      { tabItem: 'Submitted by', value: 'Claire Mumford'},
      { tabItem:'Uploaded on behalf of', value: 'The applicant'},
      {tabItem: 'Draft order', value:'agreed-draft-order-document.docx'},
      'Uploaded pension sharing annexes',
      'Uploaded pension sharing annexes 1',
      { tabItem: 'Order status', value: 'Approved by judge'},
      { tabItem: 'Type of hearing', value: 'FDR' },
      { tabItem: 'Judge name', value: envTestData.JUDGE_NAME},
      { tabItem: 'Order filed by', value: ' The applicant'},
      { tabItem: 'Submitted by', value: 'Claire Mumford'},
      { tabItem: 'Uploaded on behalf of', value: 'The applicant'},
      { tabItem: 'Pension sharing annex', value: 'BagginsFDA.pdf'}
    ]
  }
];

export const suggested_draft_order_case_document_tabs: Tab[] = [
  {
    tabName: 'Case documents',
    expandAccordions: true,
    tabContent: buildDraftOrderCaseDocumentsContent('Suggested draft orders prior to a hearing', [
      {
        fileName: 'agreed-draft-order-document.docx',
        submittedBy: 'The applicant',
        details: [
          { tabItem: 'Attachments', value: '' },
          { tabItem: 'Submitted by', value: 'Claire Mumford' }
        ]
      },
      {
        sectionLabel: 'Pension Sharing Annex',
        fileName: 'BagginsFDA.pdf',
        submittedBy: 'The applicant',
        details: [
          { tabItem: 'Attachments', value: '' },
          { tabItem: 'Submitted by', value: 'Claire Mumford' }
        ]
      }
    ])
  }
];

export const suggested_draft_order_solicitor_case_document_tabs: Tab[] = [
  {
    tabName: 'Case documents',
    expandAccordions: true,
    tabContent: buildDraftOrderCaseDocumentsContent('Suggested draft orders prior to a hearing', [
      {
        fileName: 'agreed-draft-order-document.docx',
        submittedBy: '',
        details: [
          { tabItem: 'Submitted by', value: 'APP APP' },
          { tabItem: 'Submitted by (email address)', value: 'fr_applicant_solicitor1@mailinator.com' }
        ]
      },
      {
        sectionLabel: 'Pension Sharing Annex',
        fileName: 'BagginsFDA.pdf',
        submittedBy: '',
        details: [
          { tabItem: 'Submitted by', value: 'APP APP' },
          { tabItem: 'Submitted by (email address)', value: 'fr_applicant_solicitor1@mailinator.com' }
        ]
      }
    ])
  }
];

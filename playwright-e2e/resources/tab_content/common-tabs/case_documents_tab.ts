import { DateHelper } from '../../../data-utils/DateHelper';
import { Tab } from '../../../pages/components/tab';

export function createGeneralEmailTabData(date?: string, tabName: string = 'Case Documents'): Tab[] { 
  return [
    {
      tabName,
      tabContent: buildCaseDocTabGeneralEmailContent([
        {
          emailDate: date ?? DateHelper.getUtcDateTimeFormatted(),
          recipientEmail: 'fr_respondent_solicitor1@mailinator.com',
          createdBy: 'Claire Mumford',
          body: 'This is a test',
          uploadedDoc: 'test.pdf'
        }
      ])
    }
  ];
}

export function buildNoticeOfChangeTabData(caseType : string, nocRequestedByEmail: string, previousSolicitorEmail: string, fromTimestamp: string): Tab[] {
  return [
    {
      tabName: 'Applicant',
      tabContent: [
        { tabItem: caseType === 'contested' ? 'Solicitor’s firm' : 'Name of your firm', value: 'FinRem-3-Org' },
        { tabItem: 'Last NoC Requested By', value: nocRequestedByEmail },
        'Previous Organisations 1',
        { tabItem: 'From Timestamp', value: fromTimestamp, exact: false },
        { tabItem: 'Organisation Name', value: 'FinRem-1-Org' },
        { tabItem: 'Email', value: previousSolicitorEmail }
      ]
    }
  ];
}

export const processOrderCaseDocumentsTabData: Tab[] = [{
  tabName: 'Case documents',
  tabContent: [
    'Agreed draft orders following a hearing 1', 
    { tabItem: 'Draft order', value: 'agreed-draft-order-document.pdf'},
    { tabItem: 'Cover Letter', value: 'agreed-draft-order-document - cover letter.pdf'},
    { tabItem: 'Document status', value: 'Processed' },
    { tabItem: 'Submitted by', value: 'Claire Mumford' },
    { tabItem: 'Uploaded on behalf of', value: 'The applicant' },
    'This is not a resubmission.'
  ]
}];

export const UploadApprovedOrderCaseDocumentsTabData: Tab[] = [{
  tabName: 'Case documents',
  tabContent: [
    'Upload Approved Order 1', 
    { tabItem: 'Upload Document', value: 'approvedOrder.pdf'},
    { tabItem: 'Additional attachments', value: 'additionalAttachment.pdf'},
    'Upload Approved Order 2', 
    { tabItem: 'Upload Document', value: 'approvedOrder.pdf'}
  ]
}];

export const CaseDocumentsTabOnlineFormATabData: Tab[] = [{
  tabName: 'Case documents',
  tabContent: [
    { tabItem: 'Online Form A', value: 'OnlineForm.pdf' }
  ]
}];

export function buildCaseDocTabGeneralEmailContent(emails: Array<{
  emailDate: string,
  recipientEmail: string,
  createdBy: string,
  body: string,
  uploadedDoc?: string
}>) {
  const tabContent: any[] = [];
  emails.forEach(email => {
    tabContent.push('General Email');
    tabContent.push({ tabItem: 'Date Sent', value: 'Recipient\'s email' });
    tabContent.push({
      tabItem: email.emailDate, 
      value: email.recipientEmail,
      clickable: true,
      exact: false
    });
    tabContent.push({ tabItem: 'Email created by', value: email.createdBy });
    tabContent.push({ tabItem: 'Body', value: email.body });
    if (email.uploadedDoc) {
      tabContent.push({ tabItem: 'Upload Document(s)', value: email.uploadedDoc });
    }
  });
  return tabContent;
}

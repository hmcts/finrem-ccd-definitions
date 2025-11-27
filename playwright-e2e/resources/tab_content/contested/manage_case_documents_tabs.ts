import { Tab } from '../../../pages/components/tab';

export function getFdrDocumentsTabData(uploadDateTime: string): Tab {
  return {
    tabName: 'FDR documents',
    tabContent: [
      '1',
      { tabItem: 'Please upload any case documents', value: 'fdrDoc.docx' },
      { tabItem: 'Document type', value: 'Bill of Costs' },
      { tabItem: 'Is the document confidential?', value: 'No' },
      { tabItem: 'Is this a Financial Dispute Resolution document (FDR)?', value: 'Yes' },
      { tabItem: 'What type of document is this?', value: 'Respondent' },
      { tabItem: 'Upload DateTime', value: uploadDateTime, exact: false }
    ]
  };
}

export function getConfidentialDocumentsTabData(uploadDateTime: string): Tab {
  return {
    tabName: 'Confidential Documents',
    tabContent: [
      'Confidential documents 1',
      { tabItem: 'Please upload any case documents', value: 'caseDoc.docx' },
      { tabItem: 'Document type', value: 'Other' },
      { tabItem: 'Please specify document type', value: 'test' },
      { tabItem: 'Is the document confidential?', value: 'Yes' },
      { tabItem: 'What type of document is this?', value: 'Applicant' },
      { tabItem: 'Upload DateTime', value: uploadDateTime, exact: false }
    ]
  };
}

export function getSpecialTypeConfidentialDocumentsTabData(uploadDateTime: string): Tab {
  return {
    tabName: 'Confidential Documents',
    tabContent: [
      'Confidential documents 1',
      { tabItem: 'Please upload any case documents', value: 'confidentialDoc.docx' },
      { tabItem: 'Document type', value: 'Attendance Sheets' },
      { tabItem: 'Is the document confidential?', value: 'Yes' },
      { tabItem: 'What type of document is this?', value: 'Case' },
      { tabItem: 'Upload DateTime', value: uploadDateTime, exact: false }
    ]
  };
}

export function getWithoutPrejudiceDocumentsTabData(uploadDateTime: string): Tab {
  return {
    tabName: 'FDR documents',
    tabContent: [
      '1',
      { tabItem: 'Please upload any case documents', value: 'withoutPrejudice.docx' },
      { tabItem: 'Document type', value: 'Without Prejudice offers' },
      { tabItem: 'Is the document confidential?', value: 'No' },
      { tabItem: 'Is this a Financial Dispute Resolution document (FDR)?', value: 'Yes' },
      { tabItem: 'Upload DateTime', value: uploadDateTime, exact: false }
    ]
  };
}

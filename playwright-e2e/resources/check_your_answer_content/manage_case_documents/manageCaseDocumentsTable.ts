import { Table } from '../../../pages/components/table';

export const manageCaseDocumentsTableNewNonConfidential: Table = {
  tableName: 'Check your answers',
  rows: [
    {cellItem: 'Please upload any case documents', value: 'test.docx'},
    {cellItem: 'Document type', value: 'Other'},
    {cellItem: 'Please specify document type', value: 'test document type'},
    {cellItem: 'Is the document confidential?', value: 'No' },
    {cellItem: 'Is this a Financial Dispute Resolution document (FDR)?', value: 'No'},
    {cellItem: 'Document on behalf of?', value: 'Applicant' }
  ]
};

export const manageCaseDocumentsTableNewConfidential: Table = {
  tableName: 'Check your answers',
  rows: [
    {cellItem: 'Please upload any case documents', value: 'test.docx'},
    {cellItem: 'Document type', value: 'Other'},
    {cellItem: 'Please specify document type', value: 'test'},
    {cellItem: 'Is the document confidential?', value: 'Yes' },
    {cellItem: 'Document on behalf of?', value: 'Applicant' }
  ]
};

export const manageCaseDocumentsTableNonConfidentialWitnessSummons: Table = {
  tableName: 'Check your answers',
  rows: [
    { cellItem: 'Please upload any case documents', value: 'test.docx' },
    { cellItem: 'Document type', value: 'Witness Summons' },
    { cellItem: 'Is the document confidential?', value: 'No' }
  ]
};

import { Table } from '../../../pages/components/table';

export const manageCaseDocumentsTable: Table = {
  tableName: 'Check your answers',
  rows: [
    {cellItem: 'Please upload any case documents', value: 'test.docx'},
    {cellItem: 'Document type', value: 'Other'},
    {cellItem: 'Please specify document type', value: 'test'},
    {cellItem: 'Provide the date of hearing and a description of the document', value: 'test case'},
    {cellItem: 'Is the document confidential?', value: 'Yes' }
  ]
};

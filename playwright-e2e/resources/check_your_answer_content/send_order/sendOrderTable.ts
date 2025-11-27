import { Table } from '../../../pages/components/table';

export const sendOrderTableData: Table = {
  tableName: 'Check your answers',
  rows: [
    { cellItem: 'Send?', value: 'Yes' },
    { cellItem: 'Who should receive this order?', value: 'Applicant - Frodo Baggins\nRespondent - Smeagol Gollum' },
    { cellItem: 'What state should this case move to:', value: 'Order Sent' }
  ]
};

export const sendOrderTableDataWithUploadApprovedOrder: Table = {
  tableName: 'Check your answers',
  rows: [
    'Which order(s) would you like to send?',
    'Case documents tab [Approved Order] - approvedOrder.pdf',
    { cellItem: 'Send?', value: 'Yes' },
    'Case documents tab [Approved Order] - approvedOrder.pdf',
    { cellItem: 'Send?', value: 'Yes' },
    { cellItem: 'Include supporting documents', value: 'Yes' },
    'additionalAttachment.pdf',
    { cellItem: 'Send?', value: 'Yes' },
    { cellItem: 'Who should receive this order?', value: 'Applicant - Frodo Baggins\nRespondent - Smeagol Gollum' },
    { cellItem: 'What state should this case move to:', value: 'Prepare for Hearing' }
  ]
};

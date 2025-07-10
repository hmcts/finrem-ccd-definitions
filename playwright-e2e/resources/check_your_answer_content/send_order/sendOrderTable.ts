import { Table } from "../../../pages/components/table"

export const sendOrderTableData: Table = {
  tableName: 'Check your answers',
  rows: [
    { cellItem: 'Send?', value: 'Yes' },
    { cellItem: 'Who should receive this order?', value: 'Applicant - Frodo Baggins\nRespondent - Smeagol Gollum' },
    { cellItem: 'What state should this case move to:', value: 'Order Sent' }
  ]
};


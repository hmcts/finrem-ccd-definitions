// Common fee data - update here if the fee changes
export const APPLICATION_FEE = {
  amount: '£62.00',
  code: 'FEE0228',
  type: 'Application (without notice)'
};

export const ORDER_SUMMARY: string[][] = [
  [APPLICATION_FEE.code, APPLICATION_FEE.type, APPLICATION_FEE.amount],
  ['', 'Total', APPLICATION_FEE.amount]
];

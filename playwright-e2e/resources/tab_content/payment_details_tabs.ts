const FEE_AND_PAY_UI_COMPONENT_PAYMENTS_HEADING = 'Payments';

export const paymentDetailsTabData = (
    feeCode: string,
    feeType: string,
    amount: string
) => [
  {
    tabName: 'Payment History',
    tabContent: [
      'Order Summary',
      feeCode,
      feeType,
      amount,
      FEE_AND_PAY_UI_COMPONENT_PAYMENTS_HEADING
    ]
  }
];

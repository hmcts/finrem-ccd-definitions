import { DateHelper } from '../../data-utils/DateHelper.ts';
import {YesNoRadioEnum} from '../../pages/helpers/enums/RadioEnums.ts';

export const paymentDetailsTabData = (
  feeCode: string,
  feeType: string,
  amount: string,
  hwfCode?: string
) => {return [{
  tabName: 'Payment History',
  tabContent: [
    'Order Summary',
    feeCode,
    feeType,
    amount
  ]
}];
};

export function paymentDetailsReviewData(
  amount: string,
  helpWithFees: YesNoRadioEnum,
  feeCode: string,  
  pbaNumber: string,
  reference: string,
  currentDateTimeFull: string
) {
  return [
    'Payment details',
    { tabItem: 'Payment amount', value: amount },
    {
      tabItem: 'Payment method',
      value: helpWithFees === YesNoRadioEnum.NO ? 'payment by account' : 'HWF'
    },
    { tabItem: 'PBA account name', value: feeCode === 'FEE0228' ? 'FinRem-1-Org' : 'Bag End' },
    { tabItem: 'PBA number', value: pbaNumber },
    { tabItem: 'Customer internal reference', value: reference },
    'Payment status history',
    { tabItem: 'Status', value: 'Date and time' },
    { tabItem: 'Success', value: currentDateTimeFull, exact: false }
  ];
}

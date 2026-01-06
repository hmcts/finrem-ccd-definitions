import { DateHelper } from '../../data-utils/DateHelper.ts';
import {YesNoRadioEnum} from '../../pages/helpers/enums/RadioEnums.ts';

export const paymentDetailsTabData = (
  helpWithFees: YesNoRadioEnum,
  pbaNumber: string,
  reference: string,
  currentDateTimeFull: string,
  amount: string,
  feeCode: string,
  feeType: string
) => {return [{
  tabName: 'Payment History',
  tabContent: [
    'Order Summary',
    
    feeCode,
    feeType,
    amount,
    
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


  ]
}];};

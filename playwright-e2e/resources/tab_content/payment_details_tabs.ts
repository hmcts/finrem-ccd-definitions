import { DateHelper } from '../../data-utils/DateHelper.ts';
import {YesNoRadioEnum} from '../../pages/helpers/enums/RadioEnums.ts';

export const paymentDetailsTabData  = (helpWithFees: YesNoRadioEnum, pbaNumber: string, reference: string, currentDateTimeFull: string) => {return [{
  tabName: 'Payment History',
  tabContent: [
    'Order Summary',
    // { tabItem: 'FEE0229', value: 'Application for a financial order'},
    { tabItem: 'Payment amount', value: '£313.00' },
    {
      tabItem: 'Payment method',
      value: helpWithFees === YesNoRadioEnum.NO ? 'Payment by account' : 'HWF'
    },
    { tabItem: 'PBA account name', value: 'Bag End' },
    { tabItem: 'PBA number', value: pbaNumber },
    { tabItem: 'Customer internal reference', value: reference },
    'Payment status history',
    { tabItem: 'Status', value: 'Date and time' },
    { tabItem: 'Success', value: currentDateTimeFull }


  ]
}];};

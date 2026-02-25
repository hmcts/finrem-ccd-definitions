import { envTestData } from '../../data-utils/test_data/EnvTestDataConfig.ts';
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
  currentDateTimeFull: string,
  caseType: 'Consented' | 'Contested'
) {
  const isDemo = process.env.RUNNING_ENV === 'demo';
  const isAat = process.env.RUNNING_ENV === 'aat';
  const pbaAccountName =
    isDemo && caseType === 'Consented'
      ? 'solicitorFirm'
      : isAat && caseType === 'Consented'
        ? 'FinRem-1-Org'
        : envTestData.PBA_ACCOUNT_NAME;

  return [
    'Payment details',
    { tabItem: 'Payment amount', value: amount },
    {
      tabItem: 'Payment method',
      value: helpWithFees === YesNoRadioEnum.NO ? 'payment by account' : 'HWF'
    },
    { tabItem: 'PBA account name', value: pbaAccountName },
    { tabItem: 'PBA number', value: pbaNumber },
    { tabItem: 'Customer internal reference', value: reference },
    'Payment status history',
    { tabItem: 'Status', value: 'Date and time' },
    { tabItem: 'Success', value: currentDateTimeFull, exact: false, position: 1 }
  ];
}

import { envTestData } from '../../data-utils/test_data/EnvTestDataConfig.ts';
import {YesNoRadioEnum} from '../../pages/helpers/enums/RadioEnums.ts';

const FEE_AND_PAY_UI_COMPONENT_PAYMENTS_HEADING = 'Payments';
const FEE_AND_PAY_UI_COMPONENT_REFUNDS_HEADING = 'Refunds';

export const paymentDetailsTabData = (
  feeCode: string,
  feeType: string,
  amount: string
) => {return [{
  tabName: 'Payment History',
  tabContent: [
    'Order Summary',
    feeCode,
    feeType,
    amount,
    FEE_AND_PAY_UI_COMPONENT_PAYMENTS_HEADING,
    FEE_AND_PAY_UI_COMPONENT_REFUNDS_HEADING
  ]
}];
};

import {YesNoRadioEnum} from "../../pages/helpers/enums/RadioEnums.ts";

export const paymentDetailsTabData  = (helpWithFees: YesNoRadioEnum, pbaNumber: string, reference: string) => [{
  tabName: 'Payment details',
  tabContent: [
    { tabItem: "Has the applicant applied for help with fees online?", value: helpWithFees},
    { tabItem: "Enter your account number", value: pbaNumber },
    { tabItem: "Enter your reference", value: reference }
  ],
}];

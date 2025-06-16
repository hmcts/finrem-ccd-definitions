export const paymentDetailsTabData  = (helpWithFees: boolean, pbaNumber: string, reference: string) => [{
  tabName: 'Payment details',
  tabContent: [
    { tabItem: "Has the applicant applied for help with fees online?", value: helpWithFees ? "Yes" : "No" },
    { tabItem: "Enter your account number", value: pbaNumber },
    { tabItem: "Enter your reference", value: reference }
  ],
}];

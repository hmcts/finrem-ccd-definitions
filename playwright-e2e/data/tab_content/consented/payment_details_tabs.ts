export const paymentDetailsTabData  = (pbaNumber: string, reference: string) => [{
    tabName: 'Payment details',
    tabContent: [
      { tabItem: "Enter your account number", value: pbaNumber },
      { tabItem: "Enter your reference", value: reference }
    ],
  }];

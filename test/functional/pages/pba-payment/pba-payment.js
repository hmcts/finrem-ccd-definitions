async function pbaPayment(paymentRef) {
  const I = this;
  await I.waitForPage('#PBANumber', 'Enter your account number');
  I.fillField('#PBANumber', 'PBA0000539');
  I.fillField(paymentRef)
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { pbaPayment };
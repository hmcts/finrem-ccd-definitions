/* eslint-disable no-invalid-this */

function orderForChildren() {
  const I = this;
  I.waitForPage('input[id="orderForChildrenQuestion1-Yes"]');
  I.checkOption('input[id="orderForChildrenQuestion1-Yes"]');
  I.checkOption('input[id="natureOfApplication5-No"]');
  I.checkOption('input[id="natureOfApplication6-Step Child or Step Children"]');
  I.checkOption('input[id="natureOfApplication6-In addition to child support"]');
  I.checkOption('input[id="natureOfApplication6-disability expenses"]');
  I.checkOption('input[id="natureOfApplication6-training"]');
  I.checkOption('input[id="natureOfApplication6-When not habitually resident"]');
  I.checkOption('input[id="natureOfApplication6-Other"]');
  I.fillField('#natureOfApplication7', 'Other Test');
  // I.wait(5);
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  // I.wait(5);
}

function contestedOrderForChildren() {
  const I = this;
  I.waitForPage('#paymentForChildrenDecision input');
  I.checkOption('input[id="paymentForChildrenDecision-No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { orderForChildren, contestedOrderForChildren };
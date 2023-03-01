
async function childrenDetails() {
  const I = this;
  I.waitForText('Child(ren) details');
  I.click('//*[@id="childrenCollection"]/div/button');
  I.waitForText('Does the child live in England or Wales');
 I.click('#childrenCollection_0_childrenLivesInEnglandOrWales_Yes');
 I.fillField('#childrenCollection_0_childFullname', 'Jackie Joe');
 I.fillField('#childDateOfBirth-day', '1');
  I.fillField('#childDateOfBirth-month', '11');
  I.fillField('#childDateOfBirth-year', '2009');
  I.checkOption('input[id="childrenCollection_0_childGender-Male"]');
  I.selectOption('select[id="childrenCollection_0_childApplicantRelation"]', 'Mother');
  I.selectOption('select[id="childrenCollection_0_childRespondentRelation"]', 'Father');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { childrenDetails};
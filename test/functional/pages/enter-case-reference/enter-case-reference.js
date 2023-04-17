
async function enterCaseReference(caseRef) {
  const I = this;
  I.fillField('input[id="caseReference"]', caseRef);
  I.click('Find');
}

module.exports = { enterCaseReference };
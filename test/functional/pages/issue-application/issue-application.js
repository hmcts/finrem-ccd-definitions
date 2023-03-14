const { constant } = require('loadsh/util');

module.exports = { issueApplication,
  fields: {
    caseReference: '//*[@id="undefined"]/dt/ccd-markdown/div/markdown/p/strong',
  }
};
async function issueApplication(){
  const I = this;
  await I.waitForPage('select[id="next-step"]');
  I.selectOption('select[id="next-step"]', 'Issue Application');
  I.wait('2');
  I.click('Go');
  I.waitForText('Issue Application', '30');
  I.click('Continue');
  I.waitForText('Event summary (optional)');
  I.click('Submit');
  I.waitForText('Issue Application', '60');
  pause();
  const caRef = I.grabTextFrom(this.caseReference);
  return caRef;
}


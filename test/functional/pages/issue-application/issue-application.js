const { constant } = require('loadsh/util');

module.exports = {
  issueApplication, getCaseRefFromScreen
  }

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
}

async function getCaseRefFromScreen(){
  const I = this;
  const caseRef = await I.grabTextFrom('//*[@id="undefined"]/dt/ccd-markdown/div/markdown/p/strong');
  return caseRef;
}



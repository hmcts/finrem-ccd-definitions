const { constant } = require('loadsh/util');

module.exports = {
  issueApplication, getCaseRefFromScreen
  }

  async function issueApplication(){
    const I = this;
    await I.waitForPage('select[id="next-step"]');
    I.selectOption('select[id="next-step"]', 'Issue Application');
    I.click('Go');
    I.waitForText('Issue Date');
    I.click('Submit');
    I.waitForText('Event summary (optional)');
    I.click('Submit');
    I.waitForText('Issue Application', '60');
}

async function getCaseRefFromScreen(){
  const I = this;
  const caseRef = await I.grabTextFrom('//*[@id="undefined"]/dt/ccd-markdown/div/markdown/p/strong');
  return caseRef;
}



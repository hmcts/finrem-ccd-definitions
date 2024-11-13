 

const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;
const config = require('config');

const sauceUsername = process.env.SAUCE_USERNAME || config.saucelabs.username;
const sauceKey = process.env.SAUCE_ACCESS_KEY || config.saucelabs.key;


function updateSauceLabsResult(result, sessionId) {
  console.log('SauceOnDemandSessionID=' + sessionId + ' job-name=Financial Remedy XUI tests');
   
  return 'curl -X PUT -s -d \'{"passed": ' + result + '}\' -u ' + sauceUsername + ':' + sauceKey + ' https://eu-central-1.saucelabs.com/rest/v1/' + sauceUsername + '/jobs/' + sessionId;
}

 
module.exports = function() {
  // Setting test success on SauceLabs
  event.dispatcher.on(event.test.passed, () => {
    const sessionId = container.helpers('WebDriver').browser.sessionId;
    exec(updateSauceLabsResult('true', sessionId));
  });

  // Setting test failure on SauceLabs
  event.dispatcher.on(event.test.failed, () => {
    const sessionId = container.helpers('WebDriver').browser.sessionId;
    exec(updateSauceLabsResult('false', sessionId));
  });
};

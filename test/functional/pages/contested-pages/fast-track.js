/* eslint-disable no-invalid-this */

function fastTrack() {
  const I = this;
  I.waitForPage('#fastTrackDecision');
  I.checkOption('input[id="fastTrackDecision-No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { fastTrack };

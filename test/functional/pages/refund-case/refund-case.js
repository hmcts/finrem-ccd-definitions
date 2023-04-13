function refundCase() {
    const I = this;
    I.waitForPage('select[id="next-step"]');
    I.selectOption('select[id="next-step"]', 'Refund');
    I.wait('2');
    I.click("Go");
    I.waitForText('Submit');
    I.click("Submit");
    I.see("Refund");
  }
  
  module.exports = { refundCase };
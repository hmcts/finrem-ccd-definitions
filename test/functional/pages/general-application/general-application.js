function solicitorCreateGeneralApplication() {
    const I = this;
    I.waitForPage('select[id="next-step"]');
    I.selectOption('select[id="next-step"]', 'Create General Application');
    I.wait("2");
    I.click("Go");
    I.waitForText("General Applications");
    I.click("Add new");
}

module.exports = { solicitorCreateGeneralApplication };
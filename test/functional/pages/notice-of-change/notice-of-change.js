const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

module.exports = {
    noticeOfChange: 'Notice of change',
    fields: {
        caseRefSearch: '#caseRef',
        clientFirstName: '#clientFirstName',
        clientLastName: '#clientLastName',
        confirmNoC: '#affirmation'
    },

    async nocRequest() {
        const I = this;
        await I.retryUntilExists(() => I.click(this.noticeOfChange));
        if (testForAccessibility=='true') {
            await I.runAccessibilityTest();
        }
        I.fillField(this.fields.caseRefSearch, 'caseRef');
        await I.retryUntilExists(() => I.click('Continue'),
        I.fillField(this.fields.clientFirstName, 'John');
        I.fillField(this.fields.clientLastName, 'Smith');

        await I.retryUntilExists(() => I.click('Continue'), this.fields.confirmNoC);
        I.checkOption(this.fields.confirmNoC);
        await I.retryUntilExists(() => I.click('Submit'), '.govuk-panel--confirmation');
        I.see('Notice of change successful');
    }
}
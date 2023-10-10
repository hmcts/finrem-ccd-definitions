function addNote() {
  const I = this;
  I.waitForPage('select[id="next-step"]');
  I.selectOption('select[id="next-step"]', 'Add Note');
  I.wait('2');
  I.click('Go');
  I.wait('2');
  I.waitForText('Notes');
  I.click('Add new');
  I.waitForText('Author');
  I.fillField('input[id="caseNotesCollection_0_caseNoteAuthor"]', 'Peter');
  I.fillField('input[id="caseNoteDate-day"]', '111');
  I.see('The data entered is not valid for Date');//Validation Message error
  I.wait('2');
  I.fillField('input[id="caseNoteDate-day"]', '01');
  I.fillField('input[id="caseNoteDate-month"]', '01');
  I.fillField('input[id="caseNoteDate-year"]', '2023');
  I.wait('2');
  I.fillField('Note', 'Thank you');
  I.click('Continue');
  I.wait('2');
  I.click('Submit');
  I.see('Add Note');

}

module.exports = { addNote };
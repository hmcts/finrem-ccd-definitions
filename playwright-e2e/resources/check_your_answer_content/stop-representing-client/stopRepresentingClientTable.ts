import { Table } from '../../../pages/components/table';

export const applicantStopRepresentingClientTable: Table = {
  tableName: 'Check your answers',
  rows: [
    'Client\'s address for service (Applicant)',
    { cellItem: 'Building and Street', value: '10 Selsdon Road' },
    { cellItem: 'Town or City', value: 'London' },
    { cellItem: 'Postcode/Zipcode', value: 'NW2 7NE' },
    { cellItem: 'Country', value: 'United Kingdom' },
    { cellItem: 'Keep the Applicant\'s contact details private from the Respondent?', value: 'Yes' },
    { cellItem: 'Does your client consent to you stopping representation?', value: 'No' },
    { cellItem: 'Do you have judicial approval to stop representation?', value: 'Yes' }
  ]
};

export const respondentStopRepresentingClientTable: Table = {
  tableName: 'Check your answers',
  rows: [
    'Client\'s address for service (Respondent)',
    { cellItem: 'Building and Street', value: '10 Selsdon Road' },
    { cellItem: 'Town or City', value: 'London' },
    { cellItem: 'Postcode/Zipcode', value: 'NW2 7NE' },
    { cellItem: 'Country', value: 'United Kingdom' },
    { cellItem: 'Keep the Respondent\'s contact details private from the Applicant?', value: 'No' },
    { cellItem: 'Does your client consent to you stopping representation?', value: 'No' },
    { cellItem: 'Do you have judicial approval to stop representation?', value: 'Yes' }
  ]
};

export const intervenerAndRespondentStopRepresentingClientTable: Table = {
  tableName: 'Check your answers',
  rows: [
    'Client\'s address for service (Intervener 2)',
    { cellItem: 'Building and Street', value: '10 Selsdon Road' },
    { cellItem: 'Town or City', value: 'London' },
    { cellItem: 'Postcode/Zipcode', value: 'NW2 7NE' },
    { cellItem: 'Country', value: 'United Kingdom' },
    { cellItem: 'Keep the Intervener 2\'s contact details private from the Applicant & Respondent?', value: 'No' },
    'Client\'s address for service (Respondent)',
    { cellItem: 'Building and Street', value: '10 Selsdon Road' },
    { cellItem: 'Town or City', value: 'London' },
    { cellItem: 'Postcode/Zipcode', value: 'NW2 7NE' },
    { cellItem: 'Country', value: 'United Kingdom' },
    { cellItem: 'Keep the Respondent\'s contact details private from the Applicant?', value: 'No' },
    { cellItem: 'Does your client consent to you stopping representation?', value: 'No' },
    { cellItem: 'Do you have judicial approval to stop representation?', value: 'Yes' }
  ]
};

export const intervenerAndApplicantStopRepresentingClientTable: Table = {
  tableName: 'Check your answers',
  rows: [
    'Client\'s address for service (Intervener 1)',
    { cellItem: 'Building and Street', value: '10 Selsdon Road' },
    { cellItem: 'Town or City', value: 'London' },
    { cellItem: 'Postcode/Zipcode', value: 'NW2 7NE' },
    { cellItem: 'Country', value: 'United Kingdom' },
    { cellItem: 'Keep the Intervener 1\'s contact details private from the Applicant & Respondent?', value: 'Yes' },
    'Client\'s address for service (Applicant)',
    { cellItem: 'Building and Street', value: '12 Selsdon Road' },
    { cellItem: 'Town or City', value: 'London' },
    { cellItem: 'Postcode/Zipcode', value: 'NW2 7NE' },
    { cellItem: 'Country', value: 'United Kingdom' },
    { cellItem: 'Keep the Applicant\'s contact details private from the Respondent?', value: 'Yes' },
    { cellItem: 'Does your client consent to you stopping representation?', value: 'No' },
    { cellItem: 'Do you have judicial approval to stop representation?', value: 'Yes' }
  ]
};

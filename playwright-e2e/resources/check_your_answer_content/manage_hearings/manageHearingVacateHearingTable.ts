import { DateHelper } from '../../../data-utils/DateHelper';
import { Table } from '../../../pages/components/table';

const hearingDate =  DateHelper.getFormattedDateTwelveWeeksLater();

export const vacateHearingNotRelistedTableData: Table = {
  tableName: 'Check your answers',
  rows: [
    'Adjourn or Vacate hearing',
    {cellItem: 'Adjourn or Vacate a hearing?', value: 'Vacate hearing'},
    {cellItem: 'Which hearing?', value: hearingDate + ' 10:00am - First Directions Appointment (FDA)'},
    {cellItem: 'When was the hearing adjourned or vacated?', value: '12 Dec 2025'},
    {cellItem: 'Why is the hearing being adjourned or vacated?', value: 'Other - Please specify'},
    'The hearing is no longer required',
    {cellItem: 'Will you be relisting the hearing and adding a new date now?', value: 'No'},
    {cellItem: 'Do you want to send notices?', value: 'Yes'}
  ]
};

export const vacateHearingRelistedTableData: Table = {
  tableName: 'Check your answers',
  rows: [
    'Adjourn or Vacate hearing',
    {cellItem: 'Adjourn or Vacate a hearing?', value: 'Vacate hearing'},
    {cellItem: 'Which hearing?', value: hearingDate + ' 10:00am - First Directions Appointment (FDA)'},
    {cellItem: 'When was the hearing adjourned or vacated?', value: '12 Dec 2025'},
    {cellItem: 'Why is the hearing being adjourned or vacated?', value: 'Other - Please specify'},
    {cellItem: 'Will you be relisting the hearing and adding a new date now?', value: 'Yes - I can add the new date now'},
    'Hearing',
    {cellItem: 'Type of Hearing', value: 'Pre-Trial Review (PTR)'},
    {cellItem: 'Hearing Time Estimate', value: '2 hours'},
    {cellItem: 'Hearing Date', value: hearingDate},
    {cellItem: 'Hearing Time', value: '10:00 AM'},
    {cellItem: 'Please state in which Financial Remedies Court Zone the applicant resides', value: 'London'},
    {cellItem: 'Hearing Attendance', value: 'Remote - video call'},
    {cellItem: 'Additional information about the hearing', value: 'Hearing details here'},
    {cellItem: 'Do you want to upload any other documents?', value: 'Yes'},
    {cellItem: 'Please upload any additional documents related to your application.', value: 'final_hearing_file1.pdf'},
    {cellItem: 'Do you want to send a notice of hearing?', value: 'Yes'},
    {cellItem: 'Who should see this order?', value: 'Applicant - Frodo Baggins\nIntervener1 - intApp1\nIntervener2 - intResp1'}
  ]
};

export const vacateHearingRelistedStandardFdaTableData: Table = {
  tableName: 'Check your answers',
  rows: [
    'Adjourn or Vacate hearing',
    {cellItem: 'Adjourn or Vacate a hearing?', value: 'Vacate hearing'},
    {cellItem: 'Which hearing?', value: hearingDate + ' 10:00am - First Directions Appointment (FDA)'},
    {cellItem: 'When was the hearing adjourned or vacated?', value: '12 Dec 2025'},
    {cellItem: 'Why is the hearing being adjourned or vacated?', value: 'Other - Please specify'},
    {cellItem: 'Will you be relisting the hearing and adding a new date now?', value: 'Yes - I can add the new date now'},
    'Hearing',
    {cellItem: 'Type of Hearing', value: 'First Directions Appointment (FDA)'},
    {cellItem: 'Hearing Time Estimate', value: '2 hours'},
    {cellItem: 'Hearing Date', value: hearingDate},
    {cellItem: 'Hearing Time', value: '10:00 AM'},
    {cellItem: 'Please state in which Financial Remedies Court Zone the applicant resides', value: 'London'},
    {cellItem: 'Hearing Attendance', value: 'Remote - video call'},
    {cellItem: 'Additional information about the hearing', value: 'Hearing details here'},
    {cellItem: 'Do you want to upload any other documents?', value: 'Yes'},
    {cellItem: 'Please upload any additional documents related to your application.', value: 'final_hearing_file1.pdf'},
    {cellItem: 'Do you want to send a notice of hearing?', value: 'Yes'},
    {cellItem: 'Who should see this order?', value: 'Applicant - Frodo Baggins\nRespondent - Smeagol Gollum\nIntervener1 - intApp1\nIntervener2 - intResp1'}
  ]
};

export const vacateHearingRelistedExpressFdrTableData: Table = {
  tableName: 'Check your answers',
  rows: [
    'Adjourn or Vacate hearing',
    {cellItem: 'Adjourn or Vacate a hearing?', value: 'Vacate hearing'},
    {cellItem: 'Which hearing?', value: hearingDate + ' 10:00am - First Directions Appointment (FDA)'},
    {cellItem: 'When was the hearing adjourned or vacated?', value: '12 Dec 2025'},
    {cellItem: 'Why is the hearing being adjourned or vacated?', value: 'Other - Please specify'},
    {cellItem: 'Will you be relisting the hearing and adding a new date now?', value: 'Yes - I can add the new date now'},
    'Hearing',
    {cellItem: 'Type of Hearing', value: 'Financial Dispute Resolution (FDR)'},
    {cellItem: 'Hearing Time Estimate', value: '2 hours'},
    {cellItem: 'Hearing Date', value: hearingDate},
    {cellItem: 'Hearing Time', value: '10:00 AM'},
    {cellItem: 'Please state in which Financial Remedies Court Zone the applicant resides', value: 'London'},
    {cellItem: 'Hearing Attendance', value: 'Remote - video call'},
    {cellItem: 'Additional information about the hearing', value: 'Hearing details here'},
    {cellItem: 'Do you want to upload any other documents?', value: 'Yes'},
    {cellItem: 'Please upload any additional documents related to your application.', value: 'final_hearing_file1.pdf'},
    {cellItem: 'Do you want to send a notice of hearing?', value: 'Yes'},
    {cellItem: 'Who should see this order?', value: 'Applicant - Frodo Baggins\nRespondent - Smeagol Gollum\nIntervener1 - intApp1\nIntervener2 - intResp1'}
  ]
};

import { DateHelper } from '../../../data-utils/DateHelper.ts';
import { Tab } from '../../../pages/components/tab.ts';

/**
 * Returns tab data for the Hearings tab in the same format as buildHearingsTabContent.
 */
export function getManageHearingTabData(params?: {
  typeOfHearing?: string,
  court?: string,
  attendance?: string,
  hearingDate?: string,
  hearingTime?: string,
  duration?: string,
  whoShouldSeeOrder?: string,
  additionalInformation?: string,
  uploadFiles?: string[]
}): Tab {
  const hearingDate = params?.hearingDate ?? DateHelper.getFormattedDateTwelveWeeksLater();
  const hearingTime = params?.hearingTime ?? '10:00 AM';
  const whoHasReceivedThisNotice = params?.whoShouldSeeOrder ?? 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum, Intervener1 - intApp1, Intervener2 - intResp1';
  const hearingDocuments = (params?.uploadFiles ?? ['HearingNotice.pdf', 'final_hearing_file1.pdf', 'final_hearing_file2.pdf']).join('\n');

  return {
    tabName: 'Hearings',
    tabContent: [
      'Hearings',
      { tabItem: 'Type of Hearing', value: 'Hearing Date | Who has received this notice', exact: false },
      {
        tabItem: params?.typeOfHearing ?? 'Financial Dispute Resolution (FDR)',
        value: `${hearingDate} ${hearingTime} | ${whoHasReceivedThisNotice}`,
        clickable: true
      },
      { tabItem: 'Court', value: params?.court ?? 'Central Family Court'},
      { tabItem: 'Hearing Attendance', value: params?.attendance ?? 'In Person'},
      { tabItem: 'Hearing Time Estimate', value: params?.duration ?? '2 hours'},
      { tabItem: 'Additional information about the hearing', value: params?.additionalInformation ?? 'Hearing details here'},
      { tabItem: 'Hearing Documents', value: hearingDocuments}
    ]
  };
}

/**
 * Returns tab data for the Vacated or Adjourned Hearings tab.
 */
export function getVacatedHearingTabData(params?: {
  typeOfHearing?: string,
  vacatedOrAdjournedDate?: string,
  hearingStatus?: string,
  court?: string,
  attendance?: string,
  hearingDate?: string,
  hearingTime?: string,
  duration?: string,
  whoShouldSeeOrder?: string,
  additionalInformation?: string,
  uploadFiles?: string[],
  reasonForVacating?: string,
  otherReasonForVacating?: string
}): Tab {
  const vacatedOrAdjournedDate = params?.vacatedOrAdjournedDate ?? DateHelper.getFormattedDateTwelveWeeksLater();
  const hearingDate = params?.hearingDate ?? DateHelper.getFormattedDateTwelveWeeksLater();
  const hearingTime = params?.hearingTime ?? '10:00am';
  const hearingStatus = params?.hearingStatus ?? 'Vacated';
  const hearingDocuments = (params?.uploadFiles ?? ['HearingNotice.pdf']).join('\n');
  const whoHasReceivedThisNotice = params?.whoShouldSeeOrder ?? 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum, Intervener1 - intApp1, Intervener2 - intResp1';
  const reasonForVacating = params?.reasonForVacating ?? 'Other - Please specify';
  const otherReasonForVacating = params?.otherReasonForVacating ?? 'The hearing is no longer required';

  // Build tabContent array
  const tabContent = [
    'Vacated or Adjourned Hearings',
    { tabItem: 'Type of Hearing', value: 'Vacated or Adjourned date | Hearing status', exact: false },
    {
      tabItem: params?.typeOfHearing ?? 'Financial Dispute Resolution (FDR)',
      value: `${vacatedOrAdjournedDate} | ${hearingStatus}`,
      clickable: true
    },
    { tabItem: 'Court', value: params?.court ?? 'Central Family Court' },
    { tabItem: 'Hearing Attendance', value: params?.attendance ?? 'In Person' },
    { tabItem: 'Hearing Date', value: params?.hearingDate ?? `${hearingDate} ${hearingTime}` },
    { tabItem: 'Hearing Time Estimate', value: params?.duration ?? '2 hours' },
    { tabItem: 'Who has received this notice', value: whoHasReceivedThisNotice },
    { tabItem: 'Additional information about the hearing', value: params?.additionalInformation ?? 'Hearing details here' },
    { tabItem: 'Reason', value: reasonForVacating }
  ];

  // Only add "Other Reason" if reasonForVacating is "Other - Please specify"
  if (reasonForVacating === 'Other - Please specify') {
    tabContent.push({ tabItem: 'Other Reason', value: otherReasonForVacating });
  }

  tabContent.push({ tabItem: 'Hearing Documents', value: hearingDocuments });

  return {
    tabName: 'Hearings',
    tabContent
  };
}

export const manageHearingTabData: Tab = getManageHearingTabData();
export const vacatedHearingTabData: Tab = getVacatedHearingTabData();

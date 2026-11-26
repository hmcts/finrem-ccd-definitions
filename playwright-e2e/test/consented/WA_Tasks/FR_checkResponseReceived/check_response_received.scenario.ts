import { CommonEvents, ConsentedEvents, type CaseEvent } from '../../../../config/case-data.ts';
import { DateHelper } from '../../../../data-utils/DateHelper.ts';
import type { ConsentedHearingDetails } from '../../../../pages/events/list-for-hearing/ListForHearingPage.ts';
import type { HistoryEvent } from '../../../../pages/CaseHistoryPage.ts';
import {
  assignedTaskActions,
  unassignedTaskActions
} from '../../../../pages/WAtasks/TaskTypes.ts';
import { defineTaskScenario } from '../../../../pages/WAtasks/TaskScenario.ts';

export interface CompletionEventScenario {
  readonly event: CaseEvent;
  readonly expectedState: string;
}

export const checkResponseReceived = defineTaskScenario({
  taskName: 'Check Response Received',
  taskType: 'checkResponseReceived',
  dueInWorkingDays: 5,
  roles: {
    admin: {
      unassignedActions: unassignedTaskActions.admin,
      assignedActions: assignedTaskActions.admin
    },
    teamLeader: {
      unassignedActions: unassignedTaskActions.teamLeader,
      assignedActions: assignedTaskActions.teamLeader
    }
  }
} as const);

export const TASK_PRIORITY = 'low';
export const UNASSIGNED = 'Unassigned';
export const TASK_COMPLETED_REFRESH_ATTEMPTS = 3;
export const INFORMATION_RECEIVED_STATE = 'Information Received';
export const INFORMATION_RECEIVED_CCD_STATE = 'infoReceived';
export const CONSENTED_CASE_TYPE = 'Financial Remedy Consented';

export const TASK_CREATING_EVENT: HistoryEvent = {
  event: ConsentedEvents.solicitorUploadDocument.listItem,
  author: 'App APP',
  endState: INFORMATION_RECEIVED_STATE
};

export const completionEvents: readonly CompletionEventScenario[] = [
  { event: ConsentedEvents.issueApplicationFromInfoReceived, expectedState: 'Application Issued' },
  { event: ConsentedEvents.awaitingInformation, expectedState: 'Awaiting Information' },
  { event: CommonEvents.createGeneralEmail, expectedState: INFORMATION_RECEIVED_STATE },
  { event: ConsentedEvents.createGeneralLetter, expectedState: INFORMATION_RECEIVED_STATE },
  { event: ConsentedEvents.generalOrderFromInfoReceived, expectedState: 'Consent Order Not Approved' },
  { event: ConsentedEvents.listForHearing, expectedState: 'Ready For Hearing' },
  { event: CommonEvents.closeCase, expectedState: 'Close' }
];

export const NEXT_STEPS = completionEvents.map(({ event }) => {
  return event.listItem;
});

export const GENERAL_EMAIL_BODY = 'Check Response Received test email';
export const GENERAL_LETTER_ADDRESSEE = 'Applicant Solicitor';
export const GENERAL_LETTER_BODY = 'Check Response Received test letter';

export const finalHearingDetails = (): ConsentedHearingDetails => {
  const [year, month, day] = DateHelper.getHearingDateTwelveWeeksLaterInISOFormat().split('-');

  return {
    hearingType: 'Final Hearing (FH)',
    timeEstimate: '1 hour',
    date: { year, month, day },
    time: '10:00',
    region: 'London',
    frc: 'London FRC',
    court: 'CENTRAL FAMILY COURT',
    additionalInformation: 'Check Response Received test hearing'
  };
};

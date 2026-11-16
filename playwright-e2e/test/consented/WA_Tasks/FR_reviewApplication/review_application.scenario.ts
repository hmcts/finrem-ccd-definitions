import config from '../../../../config/config.ts';
import { envTestData } from '../../../../data-utils/test_data/EnvTestDataConfig.ts';
import {
  assignedTaskActions,
  unassignedTaskActions
} from '../../../../pages/WAtasks/TaskTypes.ts';
import {
  defineTaskScenario,
  type TaskUserScenario
} from '../../../../pages/WAtasks/TaskScenario.ts';
import type { ReplacementAction } from '../../../../types/replacement-action.ts';

export const APPROVE_APPLICATION = 'Approve Application';
export const UPLOAD_APPROVED_ORDER = 'Upload Approved Order';
export const APPLICATION_NOT_APPROVED = 'Application Not Approved';

export const CaseState = {
  ConsentOrderApproved: 'Consent Order Approved',
  ConsentOrderNotApproved: 'Consent Order Not Approved'
} as const;

export const reviewApplication = defineTaskScenario({
  taskName: 'Review Application',
  taskType: 'reviewApplication',
  dueInWorkingDays: 10,
  roles: {
    judge: {
      unassignedActions: unassignedTaskActions.judge,
      assignedActions: assignedTaskActions.judge
    },
    leadJudge: {
      unassignedActions: unassignedTaskActions.leadJudge,
      assignedActions: assignedTaskActions.leadJudge
    }
  }
} as const);

// The task is only visible to judges in the case's region, so create the case
// at Bristol (South West) to match the lead judge.
export const bristolCourtReplacements: ReplacementAction[] = [
  { action: 'delete', key: 'regionList' },
  { action: 'delete', key: 'midlandsFRCList' },
  { action: 'delete', key: 'nottinghamCourtList' },
  { action: 'insert', key: 'regionList', value: 'southwest' },
  { action: 'insert', key: 'southWestFRCList', value: 'bristol' },
  { action: 'insert', key: 'bristolCourtList', value: 'FR_bristolList_1' }
];

// Approve Application only ends in Consent Order Approved when the case has
// pension documents; without them the case moves to Close.
export const pensionDocumentReplacements: ReplacementAction[] = [
  { action: 'insert', key: 'natureOfApplication2[1]', value: 'Pension Sharing Order' },
  { action: 'insert', key: 'pensionCollection[0].value.typeOfDocument', value: 'Form P1' },
  { action: 'insert', key: 'pensionCollection[0].value.uploadedDocument.document_url', value: envTestData.DOCUMENT_URL },
  { action: 'insert', key: 'pensionCollection[0].value.uploadedDocument.document_binary_url', value: envTestData.DOCUMENT_BINARY_URL },
  { action: 'insert', key: 'pensionCollection[0].value.uploadedDocument.document_filename', value: 'form-p1.pdf' }
];

const leadJudge = {
  role: 'leadJudge',
  name: config.waLeadJudge.name,
  email: config.waLeadJudge.email,
  password: config.waLeadJudge.password
} as const;

export interface ReviewApplicationScenario extends TaskUserScenario {
  readonly expectedState?: string;
}

export const reviewApplicationUserScenarios = [
  {
    user: leadJudge,
    completionAction: APPROVE_APPLICATION,
    expectedState: CaseState.ConsentOrderApproved
  },
  {
    user: leadJudge,
    completionAction: UPLOAD_APPROVED_ORDER,
    expectedState: CaseState.ConsentOrderApproved
  },
  {
    user: leadJudge,
    completionAction: APPLICATION_NOT_APPROVED,
    expectedState: CaseState.ConsentOrderNotApproved
  },
  {
    user: leadJudge,
    completionAction: 'Mark as done'
  },
  {
    user: leadJudge,
    completionAction: 'Cancel task'
  }
] as const satisfies readonly ReviewApplicationScenario[];

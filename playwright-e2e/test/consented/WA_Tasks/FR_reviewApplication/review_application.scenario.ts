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

// The task is only visible to judges in the case's region, so each scenario
// creates its case at a court in its judge's region. The base payload is at
// Nottingham (Midlands), so that court is removed first.
const courtIn = (
  region: string,
  frcListKey: string,
  frc: string,
  courtListKey: string,
  court: string
): ReplacementAction[] => {
  return [
    { action: 'delete', key: 'regionList' },
    { action: 'delete', key: 'midlandsFRCList' },
    { action: 'delete', key: 'nottinghamCourtList' },
    { action: 'insert', key: 'regionList', value: region },
    { action: 'insert', key: frcListKey, value: frc },
    { action: 'insert', key: courtListKey, value: court }
  ];
};

export const bristolCourtReplacements = courtIn('southwest', 'southWestFRCList', 'bristol', 'bristolCourtList', 'FR_bristolList_1');
export const londonCourtReplacements = courtIn('london', 'londonFRCList', 'london', 'londonCourtList', 'FR_londonList_13');
export const clevelandCourtReplacements = courtIn('northeast', 'northEastFRCList', 'cleveland', 'clevelandCourtList', 'FR_clevelandList_4');

// Approve Application only ends in Consent Order Approved when the case has
// pension documents; without them the case moves to Close.
export const pensionDocumentReplacements: ReplacementAction[] = [
  { action: 'insert', key: 'natureOfApplication2[1]', value: 'Pension Sharing Order' },
  { action: 'insert', key: 'pensionCollection[0].value.typeOfDocument', value: 'Form P1' },
  { action: 'insert', key: 'pensionCollection[0].value.uploadedDocument.document_url', value: envTestData.DOCUMENT_URL },
  { action: 'insert', key: 'pensionCollection[0].value.uploadedDocument.document_binary_url', value: envTestData.DOCUMENT_BINARY_URL },
  { action: 'insert', key: 'pensionCollection[0].value.uploadedDocument.document_filename', value: 'form-p1.pdf' }
];

const { amandaLove, lopez, karenHoward, bettyMatthews } = config.waJudges;

// A judge can only be logged in once at a time, so tests that log in as the
// same judge must not run at the same time. Each test belongs to the group of
// judges it logs in as: groups run in parallel, and the tests in a group run
// one after another. The reassign test logs in as both North East judges, so
// they share one group.
export const JudgeLoginGroup = {
  SouthWest: 'South West judge (Amanda Love)',
  London: 'London judge (Mr Justice Lopez)',
  NorthEast: 'North East judges (Karen Howard, Betty Matthews)'
} as const;

export type JudgeLoginGroup = typeof JudgeLoginGroup[keyof typeof JudgeLoginGroup];

export interface ReviewApplicationScenario extends TaskUserScenario {
  readonly expectedState?: string;
  readonly courtReplacements: readonly ReplacementAction[];
  readonly checkOtherActionsHidden?: boolean;
  readonly loginGroup: JudgeLoginGroup;
  // Only add the re-review test for this scenario.
  readonly reReviewOnly?: boolean;
}

// Only four salaried judges see Review Application on preview (South West,
// London and two in North East), so some judges run more than one scenario.
// The scenarios are spread so that each judge group takes about as long as
// the others, as the slowest group sets the length of the run.
export const reviewApplicationUserScenarios = [
  {
    user: { ...amandaLove, role: 'leadJudge' },
    completionAction: APPROVE_APPLICATION,
    expectedState: CaseState.ConsentOrderApproved,
    courtReplacements: [...bristolCourtReplacements, ...pensionDocumentReplacements],
    loginGroup: JudgeLoginGroup.SouthWest
  },
  {
    user: { ...amandaLove, role: 'leadJudge' },
    completionAction: 'Cancel task',
    courtReplacements: bristolCourtReplacements,
    loginGroup: JudgeLoginGroup.SouthWest
  },
  {
    user: { ...lopez, role: 'leadJudge' },
    completionAction: UPLOAD_APPROVED_ORDER,
    expectedState: CaseState.ConsentOrderApproved,
    courtReplacements: londonCourtReplacements,
    loginGroup: JudgeLoginGroup.London
  },
  {
    user: { ...lopez, role: 'leadJudge' },
    completionAction: APPLICATION_NOT_APPROVED,
    expectedState: CaseState.ConsentOrderNotApproved,
    courtReplacements: londonCourtReplacements,
    loginGroup: JudgeLoginGroup.London,
    // Every re-review test first refuses the application with Application
    // Not Approved, so a first-review test for it would repeat that.
    reReviewOnly: true
  },
  {
    user: { ...bettyMatthews, role: 'judge' },
    completionAction: 'Mark as done',
    // Known issue: Betty also gets lead judge actions from her roles in other
    // jurisdictions. Another team is fixing it; until then only check that the
    // judge actions are shown, not that the lead judge ones are hidden.
    checkOtherActionsHidden: false,
    courtReplacements: clevelandCourtReplacements,
    loginGroup: JudgeLoginGroup.NorthEast
  }
] as const satisfies readonly ReviewApplicationScenario[];

// Reassignment needs two judges in the same region.
export const reassignScenario = {
  leadJudge: karenHoward,
  recipient: bettyMatthews,
  courtReplacements: clevelandCourtReplacements,
  loginGroup: JudgeLoginGroup.NorthEast
} as const;

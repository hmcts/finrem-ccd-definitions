import config from '../../../../config/config.ts';
import {
  assignedTaskActions,
  TaskCompletionEventName,
  TaskName,
  unassignedTaskActions,
  type TaskManagementAction,
  type TaskUserRole
} from '../../../../pages/WAtasks/TaskTypes.ts';
import { defineTaskScenario } from '../../../../pages/WAtasks/TaskScenario.ts';

export const CaseState = {
  AwaitingHWFDecision: 'Awaiting HWF Decision',
  ApplicationSubmitted: 'Application Submitted',
  AwaitingPaymentResponse: 'Awaiting Payment Response'
} as const;

export const checkHelpWithFees = defineTaskScenario({
  taskName: TaskName.CheckHelpWithFees,
  taskType: 'checkHelpWithFees',
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

export const PRIORITY = 'low';

// Every Next steps event offered on the task.
export const NEXT_STEPS = [
  TaskCompletionEventName.HWFApplicationAccepted,
  TaskCompletionEventName.FeeAccountDebited,
  TaskCompletionEventName.AwaitingPaymentResponse
] as const;

export const workAllocationColumns = {
  'Case name': /Baggins vs Gollum/,
  'Case category': /FR Consented/
} as const;

export type CtscUser = {
  readonly role: Extract<TaskUserRole, 'admin' | 'teamLeader'>;
  readonly name: string;
  readonly email: string;
  readonly password: string;
};

export const ctscAdmin: CtscUser = {
  role: 'admin',
  name: 'CTSC Admin',
  email: config.ctsc_admin.email,
  password: config.ctsc_admin.password
};

export const ctscTeamLeader: CtscUser = {
  role: 'teamLeader',
  name: 'CTSC Team Leader',
  email: config.ctsc_teamleader.email,
  password: config.ctsc_teamleader.password
};

// Actions when the task is assigned to someone else.
export const assignedToOtherActions: Readonly<Record<
  CtscUser['role'],
  { readonly visible: readonly TaskManagementAction[]; readonly notChecked: readonly TaskManagementAction[] }
>> = {
  admin: { visible: [], notChecked: ['Assign to me'] },
  teamLeader: {
    visible: ['Reassign task', 'Unassign task', 'Cancel task', 'Mark as done'],
    notChecked: []
  }
};

// Each Next steps event and the state it moves the case to.
export const completionEvents = [
  {
    event: TaskCompletionEventName.HWFApplicationAccepted,
    expectedState: CaseState.ApplicationSubmitted
  },
  {
    event: TaskCompletionEventName.FeeAccountDebited,
    expectedState: CaseState.ApplicationSubmitted
  },
  {
    event: TaskCompletionEventName.AwaitingPaymentResponse,
    expectedState: CaseState.AwaitingPaymentResponse
  }
] as const satisfies readonly {
  readonly event: typeof NEXT_STEPS[number];
  readonly expectedState: typeof CaseState[keyof typeof CaseState];
}[];

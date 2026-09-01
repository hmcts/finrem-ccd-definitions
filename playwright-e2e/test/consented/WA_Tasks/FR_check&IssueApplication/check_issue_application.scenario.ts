import config from '../../../../config/config.ts';
import {
  assignedTaskActions,
  unassignedTaskActions
} from '../../../../pages/WAtasks/TaskTypes.ts';
import {
  defineTaskScenario,
  type TaskUserScenario
} from '../../../../pages/WAtasks/TaskScenario.ts';

export const ISSUE_APPLICATION = 'Issue Application';

export const checkIssueApplication = defineTaskScenario({
  taskName: 'Check and Issue Application',
  taskType: 'checkIssueApplication',
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

export const checkIssueApplicationUserScenarios = [
  {
    user: {
      role: 'admin',
      name: 'CTSC Admin',
      email: config.ctsc_admin.email,
      password: config.ctsc_admin.password
    },
    completionAction: 'Mark as done'
  },
  {
    user: {
      role: 'teamLeader',
      name: 'CTSC Team Leader',
      email: config.ctsc_teamleader.email,
      password: config.ctsc_teamleader.password
    },
    completionAction: ISSUE_APPLICATION
  },
  {
    user: {
      role: 'admin',
      name: 'CTSC Admin',
      email: config.ctsc_admin.email,
      password: config.ctsc_admin.password
    },
    completionAction: 'Cancel task'
  }
] as const satisfies readonly TaskUserScenario[];

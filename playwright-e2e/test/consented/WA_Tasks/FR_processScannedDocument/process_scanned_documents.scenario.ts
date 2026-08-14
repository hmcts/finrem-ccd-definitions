import config from '../../../../config/config.ts';
import {
  assignedTaskActions,
  unassignedTaskActions
} from '../../../../pages/WAtasks/TaskTypes.ts';
import {
  defineTaskScenario,
  type TaskUserScenario
} from '../../../../pages/WAtasks/TaskScenario.ts';

export const ATTACH_SCANNED_DOCUMENT = 'Attach scanned document';

export const processScannedDocuments = defineTaskScenario({
  taskName: 'Process Scanned Documents',
  taskType: 'processScannedDocuments',
  dueInWorkingDays: 5,
  roles: {
    admin: {
      workAllocationTabs: ['My work'],
      unassignedActions: unassignedTaskActions.admin,
      assignedActions: assignedTaskActions.admin
    },
    teamLeader: {
      workAllocationTabs: ['All work', 'My work'],
      unassignedActions: unassignedTaskActions.teamLeader,
      assignedActions: assignedTaskActions.teamLeader
    }
  }
} as const);

export const processScannedDocumentUserScenarios = [
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
    completionAction: ATTACH_SCANNED_DOCUMENT
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

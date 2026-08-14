import type {
  TaskManagementAction,
  TaskUserRole
} from './TaskTypes.ts';

export type TaskCompletionAction = 'Mark as done' | string;

export interface TaskRoleExpectation {
  readonly assignedActions: readonly TaskManagementAction[];
  readonly unassignedActions: readonly TaskManagementAction[];
  readonly workAllocationTabs: readonly ('All work' | 'My work')[];
}

export interface TaskScenario {
  readonly taskName: string;
  readonly taskType: string;
  readonly dueInWorkingDays: number;
  readonly roles: Readonly<Record<TaskUserRole, TaskRoleExpectation>>;
}

export interface TaskUserScenario {
  readonly completionAction: TaskCompletionAction;
  readonly user: {
    readonly email: string;
    readonly name: string;
    readonly password: string;
    readonly role: TaskUserRole;
  };
}

export function defineTaskScenario<T extends TaskScenario>(scenario: T): T {
  return scenario;
}

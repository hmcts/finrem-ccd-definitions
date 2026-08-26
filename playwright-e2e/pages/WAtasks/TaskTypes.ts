export const taskManagementActions = [
  'Assign task',
  'Reassign task',
  'Cancel task',
  'Assign to me',
  'Mark as done',
  'Unassign task'
] as const;

export type TaskManagementAction = typeof taskManagementActions[number];

export type TaskUserRole = 'admin' | 'teamLeader';

export interface TaskDetails {
  readonly name: string;
  readonly priority: string;
  readonly dueDate: string;
  readonly assignedTo: string;
}

export const unassignedTaskActions: Readonly<Record<
    TaskUserRole,
    readonly TaskManagementAction[]
>> = {
  admin: ['Assign to me'],
  teamLeader: ['Assign task', 'Cancel task', 'Assign to me']
};

export const assignedTaskActions: Readonly<Record<
    TaskUserRole,
    readonly TaskManagementAction[]
>> = {
  admin: ['Cancel task', 'Mark as done'],
  teamLeader: [
    'Cancel task',
    'Mark as done',
    'Reassign task',
    'Unassign task'
  ]
};

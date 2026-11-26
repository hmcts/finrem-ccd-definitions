import config from '../../../../../config/config.ts';
import type { CheckResponseReceivedManageTaskUser } from '../check_response_received.common.ts';

export const ctscTeamLeader: CheckResponseReceivedManageTaskUser = {
  name: 'CTSC Team Leader',
  email: config.ctsc_teamleader.email,
  password: config.ctsc_teamleader.password,
  historyAuthor: 'Ctsc TEAMLEADER',
  checksAllWork: true,
  role: 'teamLeader',
  searchName: 'Ctsc Teamleader',
  assignedToName: 'Ctsc Teamleader',
  manageActions: ['Cancel task', 'Mark as done', 'Reassign task'],
  assignTask: {
    unauthorisedPerson: {
      searchName: 'Claire Mumford',
      email: config.caseWorker.email
    },
    assignee: {
      searchName: 'CTSC Admin',
      email: config.ctsc_admin.email,
      assignedToName: 'Ctsc Admin'
    }
  }
};

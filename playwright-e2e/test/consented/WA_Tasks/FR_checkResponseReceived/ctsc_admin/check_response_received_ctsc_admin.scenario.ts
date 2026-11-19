import config from '../../../../../config/config.ts';
import type { CheckResponseReceivedManageTaskUser } from '../check_response_received.common.ts';

export const ctscAdmin: CheckResponseReceivedManageTaskUser = {
  name: 'CTSC Admin',
  email: config.ctsc_admin.email,
  password: config.ctsc_admin.password,
  historyAuthor: 'Ctsc ADMIN',
  checksAllWork: false,
  role: 'admin',
  searchName: 'CTSC Admin',
  assignedToName: 'Ctsc Admin',
  manageActions: ['Cancel task', 'Mark as done']
};

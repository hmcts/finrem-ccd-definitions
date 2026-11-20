import {
  describeCheckResponseReceivedManageTaskTests,
  describeCheckResponseReceivedTests
} from '../check_response_received.common.ts';
import { ctscTeamLeader } from './check_response_received_ctsc_team_leader.scenario.ts';

describeCheckResponseReceivedTests(ctscTeamLeader);
describeCheckResponseReceivedManageTaskTests(ctscTeamLeader);

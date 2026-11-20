import {
  describeCheckResponseReceivedManageTaskTests,
  describeCheckResponseReceivedTests
} from '../check_response_received.common.ts';
import { ctscAdmin } from './check_response_received_ctsc_admin.scenario.ts';

describeCheckResponseReceivedTests(ctscAdmin);
describeCheckResponseReceivedManageTaskTests(ctscAdmin);

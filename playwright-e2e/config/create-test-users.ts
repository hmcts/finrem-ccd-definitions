import { setupTestUsers } from './setup-test-users.ts';

setupTestUsers().catch(error => {
  console.error('Failed to create IDAM test users:', error);
  process.exit(1);
});

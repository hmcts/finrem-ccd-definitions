import { setupTestUsers } from './setup-test-users';

export default async function globalSetup(): Promise<void> {
  await setupTestUsers();
}

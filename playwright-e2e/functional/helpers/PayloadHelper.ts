import { updateCaseInCcd } from '../../../test/helpers/utils';
import config from '../../config/config';

export async function updateCaseWorkerSteps(caseId: string, steps: { event: string, payload?: string }[]): Promise<void> {
  for (const step of steps) {
    await updateCaseInCcd(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      'FinancialRemedyContested',
      step.event,
      step.payload || '' // Provide a default empty string if payload is undefined
    );
  }
}

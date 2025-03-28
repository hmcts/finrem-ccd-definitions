import { createCaseInCcd } from '../../../test/helpers/utils';
import { ReplacementAction } from '../../types/replacement-action';

const QUALIFIED_REPLACEMENT: ReplacementAction[] = [
  { action: 'delete', key: 'regionList' },
  { action: 'insert', key: 'regionList', value: 'northwest' },
  { action: 'delete', key: 'midlandsFRCList' },
  { action: 'insert', key: 'northWestFRCList', value: 'lancashire' },
  { action: 'delete', key: 'birminghamCourtList' },
  { action: 'insert', key: 'lancashireCourtList', value: 'FR_lancashireList_1' }
];

export async function createCaseWithExpressPilot(
  email: string,
  password: string,
  payloadPath: string,
  caseType: string,
  event: string,
  isExpressPilot: boolean = true
): Promise<string> {
  const replacement: ReplacementAction[] = isExpressPilot ? QUALIFIED_REPLACEMENT : [];
  return await createCaseInCcd(email, password, payloadPath, caseType, event, replacement);
}

export async function createCaseWithEstimateAssetUnder1M(
  email: string,
  password: string,
  payloadPath: string,
  caseType: string,
  event: string
): Promise<string> {
  return await createCaseInCcd(email, password, payloadPath, caseType, event, [
    { action: 'delete', key: 'netValueOfHome' },
    { action: 'insert', key: 'netValueOfHome', value: '999999' },
    { action: 'delete', key: 'estimatedAssetsChecklistV2' },
    { action: 'insert', key: 'estimatedAssetsChecklistV2', value: 'underOneMillionPounds' }
  ]);
}

import { createCaseInCcd } from '../../../test/helpers/utils';
import config from '../../config/config';
import { ReplacementAction } from '../../types/replacement-action';

const PARTICIPATING_COURT_REPLACEMENT: ReplacementAction[] = [
  { action: 'delete', key: 'regionList' },
  { action: 'insert', key: 'regionList', value: 'northwest' },
  { action: 'delete', key: 'midlandsFRCList' },
  { action: 'insert', key: 'northWestFRCList', value: 'lancashire' },
  { action: 'delete', key: 'birminghamCourtList' },
  { action: 'insert', key: 'lancashireCourtList', value: 'FR_lancashireList_1' }
];

export class ExpressPilotHelper {
  static async createCaseWithExpressPilot(
    email: string,
    password: string,
    payloadPath: string,
    caseType: string,
    event: string,
    isExpressPilot: boolean = true
  ): Promise<string> {
    const replacement: ReplacementAction[] = isExpressPilot ? PARTICIPATING_COURT_REPLACEMENT : [];
    return await createCaseInCcd(email, password, payloadPath, caseType, event, replacement);
  }

  static async createCaseWithEstimateAssetUnder1M(
    email: string,
    password: string,
    payloadPath: string,
    caseType: string,
    event: string
  ): Promise<string> {
    const replacement = [
      ...PARTICIPATING_COURT_REPLACEMENT,
      { action: 'delete', key: 'netValueOfHome' },
      { action: 'insert', key: 'netValueOfHome', value: '999999' },
      { action: 'delete', key: 'estimatedAssetsChecklistV2' },
      { action: 'insert', key: 'estimatedAssetsChecklistV2', value: 'underOneMillionPounds' }
    ];
    return await createCaseInCcd(email, password, payloadPath, caseType, event, replacement);
  }

  static async createCaseWithNonParticipatingFrcCourt(
    email: string,
    password: string,
    payloadPath: string,
    caseType: string,
    event: string
  ): Promise<string> {
    return await createCaseInCcd(email, password, payloadPath, caseType, event);
  }

  static async createContestedPaperCaseWithEstimatedAssetUnder1M(): Promise<string> {
    return await this.createCaseWithEstimateAssetUnder1M(      
      config.caseWorker.email,
      config.caseWorker.password,
      './playwright-e2e/data/payload/contested/paper_case/ccd-contested-base.json',
      'FinancialRemedyContested', 'FR_newPaperCase');
  }
}

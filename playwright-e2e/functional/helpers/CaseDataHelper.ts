import { createCaseInCcd } from '../../../test/helpers/utils';
import { contestedEvents } from '../../config/case_events';
import config from '../../config/config';
import { ReplacementAction } from '../../types/replacement-action';

const EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT: ReplacementAction[] = [
  { action: 'delete', key: 'regionList' },
  { action: 'insert', key: 'regionList', value: 'northwest' },
  { action: 'delete', key: 'midlandsFRCList' },
  { action: 'insert', key: 'northWestFRCList', value: 'lancashire' },
  { action: 'delete', key: 'birminghamCourtList' },
  { action: 'insert', key: 'lancashireCourtList', value: 'FR_lancashireList_1' }
];

const CONTESTED_FORM_A_BASE_PAYLOAD = './playwright-e2e/data/payload/contested/forma/ccd-contested-base.json';
const CONTESTED_PAPER_BASE_PAYLOAD = './playwright-e2e/data/payload/contested/paper_case/ccd-contested-base.json';
const CONTESTED_APPLICATION_TYPE = 'FinancialRemedyContested';

export class CaseDataHelper {

  private static async createCase(
    email: string,
    password: string,
    payloadPath: string,
    caseType: string,
    event: string,
    isExpressPilot: boolean = false
  ): Promise<string> {
    const replacement: ReplacementAction[] = isExpressPilot ? EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT : [];
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
      ...EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT,
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

  static async createContestedPaperCaseWithNonParticipatingCourt(): Promise<string> {
    const caseId = await this.createCaseWithNonParticipatingFrcCourt(
      config.caseWorker.email,
      config.caseWorker.password,
      CONTESTED_PAPER_BASE_PAYLOAD,
      CONTESTED_APPLICATION_TYPE, 
      contestedEvents.CreatePaperCase.ccdCallback
    );
    return caseId;
  }

  static async createContestedPaperCaseWithEstimatedAssetUnder1M(): Promise<string> {
    return await this.createCaseWithEstimateAssetUnder1M(      
      config.caseWorker.email,
      config.caseWorker.password,
      CONTESTED_PAPER_BASE_PAYLOAD,
      CONTESTED_APPLICATION_TYPE, 
      contestedEvents.CreatePaperCase.ccdCallback);
  }

  static async createContestedPaperCaseWithExpressPilotEnrolled(): Promise<string> {
    return await this.createCase (      
      config.caseWorker.email,
      config.caseWorker.password,
      CONTESTED_PAPER_BASE_PAYLOAD,
      CONTESTED_APPLICATION_TYPE, 
      contestedEvents.CreatePaperCase.ccdCallback, 
      true);
  }

  static async createContestedFormAWithExpressPilotEnrolled(): Promise<string> {
    return await this.createCase(      
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      CONTESTED_FORM_A_BASE_PAYLOAD,
      CONTESTED_APPLICATION_TYPE,
      contestedEvents.CreateCase.ccdCallback,
      true);
  }

  static async createBaseContestedFormA(): Promise<string> {
    return await this.createCase(      
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      CONTESTED_FORM_A_BASE_PAYLOAD,
      CONTESTED_APPLICATION_TYPE,
      contestedEvents.CreateCase.ccdCallback
    );
  }

  static async createBaseContestedPaperCase(): Promise<string> {
    return await this.createCase(      
      config.caseWorker.email,
      config.caseWorker.password,
      CONTESTED_PAPER_BASE_PAYLOAD,
      CONTESTED_APPLICATION_TYPE, 
      contestedEvents.CreatePaperCase.ccdCallback
    );
  }
}

import { ccdApi } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ConsentedEvents, CaseType, PayloadPath } from '../../../config/case-data';
import { DateHelper } from '../../DateHelper';
import { envTestData } from '../../test_data/EnvTestDataConfig';

export class ConsentedEventApi {

  private static async updateCaseWorkerSteps(
    caseId: string,
    steps: { event: string; payload?: string }[]
  ): Promise<void> {
    for (const step of steps) {
      await ccdApi.updateCaseInCcd(
        config.caseWorker.email,
        config.caseWorker.password,
        caseId,
        CaseType.Consented,
        step.event,
        step.payload || ''
      );
    }
  }

  static async solicitorSubmitCase(caseId: string) {
    await ccdApi.updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      CaseType.Consented,
      ConsentedEvents.applicationPaymentSubmission.ccdCallback,
      PayloadPath.Consented.applicationPaymentSubmission
    );
  }

  static async solicitorSubmitCaseWithPBA(caseId: string) {
    await ccdApi.updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      CaseType.Consented,
      ConsentedEvents.applicationPaymentSubmission.ccdCallback,
      PayloadPath.Consented.applicationPaymentSubmission,
      [
        { action: 'insert', key: 'helpWithFeesQuestion', value: 'No' },
        { action: 'delete', key: 'HWFNumber' },
        { action: 'insert', key: 'PBANumber', value: envTestData.PBA_NUMBER },
        { action: 'insert', key: 'PBAreference', value: 'Reference' },
        { action: 'insert', key: 'amountToPay', value: '6200' },
        { action: 'insert', key: 'orderSummary.PaymentTotal', value: '6200' },
        { action: 'insert', key: 'orderSummary.Fees[0].value.FeeAmount', value: '6200' },
        { action: 'insert', key: 'orderSummary.Fees[0].value.FeeVersion', value: '6' }
      ]
    );
  }

  static async caseWorkerAttachScannedDocuments(
    caseId: string,
    supplementaryEvidenceHandled: boolean
  ): Promise<void> {
    await ccdApi.updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      CaseType.Consented,
      'attachScannedDocs',
      { evidenceHandled: supplementaryEvidenceHandled ? 'Yes' : 'No' }
    );
  }

  static async caseWorkerHWFDecisionMade(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.hwfDecisionMade.ccdCallback}
    ]);
  }

  static async caseWorkerHwfFeeAccountDebited(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.hwfFeeAccountDebited.ccdCallback}
    ]);
  }

  static async caseWorkerIssueApplication(caseId: string) {
    await this.caseWorkerHWFDecisionMade(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.issueApplication.ccdCallback, payload: PayloadPath.Consented.issueApplication }
    ]);
  }

  static async caseWorkerAwaitingInformation(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.awaitingInformation.ccdCallback }
    ]);
  }

  static async solicitorUploadDocument(caseId: string): Promise<string> {
    const response = await ccdApi.updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      CaseType.Consented,
      ConsentedEvents.solicitorUploadDocument.ccdCallback,
      PayloadPath.Consented.solicitorUploadDocument,
      [
        {
          action: 'insert',
          key: 'solUploadDocuments[0].value.DocumentDateAdded',
          value: DateHelper.getCurrentDate()
        }
      ],
      true
    );
    return response.state;
  }

  static async caseworkerCreateFlag(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.createFlag.ccdCallback , payload: PayloadPath.Consented.createFlag }
    ]);
  }
}

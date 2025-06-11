import { ReplacementAction } from "../types/replacement-action";
import { ccdApi } from "../fixtures/fixtures";
import config from "../config/config";

export class CaseDataBuilder {
  private email: string;
  private password: string;
  private payloadPath!: string;
  private caseType: string;
  private eventType: string;
  private replacements: ReplacementAction[] = [];

  constructor(caseType: string, eventType: string) {
    this.caseType = caseType;
    this.eventType = eventType;
    this.email = config.applicant_solicitor.email;
    this.password = config.applicant_solicitor.password;
  }

  withCaseWorkerUser(): CaseDataBuilder {
    this.email = config.caseWorker.email;
    this.password = config.caseWorker.password;
    return this;
  }

  withSolicitorUser(): CaseDataBuilder {
    this.email = config.applicant_solicitor.email;
    this.password = config.applicant_solicitor.password;
    return this;
  }

  withPayload(path: string): CaseDataBuilder {
    this.payloadPath = path;
    return this;
  }

  addReplacements(...replacements: ReplacementAction[]): CaseDataBuilder {
    this.replacements.push(...replacements);
    return this;
  }

  async create(): Promise<string> {
    return await ccdApi.createCaseInCcd(
      this.email,
      this.password,
      this.payloadPath,
      this.caseType,
      this.eventType,
      this.replacements
    );
  }
}

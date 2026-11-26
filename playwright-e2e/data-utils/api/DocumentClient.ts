import {readFileSync} from 'fs';
import path from 'path';
import {getServiceToken, getUserToken} from './TokenHelperApi.ts';
import {axiosRequest} from './ApiHelper.ts';
import config from '../../config/config.ts';

const TEST_PDF = './playwright-e2e/resources/file/test.pdf';

export class DocumentClient {
  constructor(
        private username: string,
        private password: string
  ) {
  }

  private async getHeaders() {
    const [userToken, serviceToken] = await Promise.all([
      getUserToken(this.username, this.password),
      getServiceToken()
    ]);

    return {
      Authorization: `Bearer ${userToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`
    };
  }

  async getDocumentCookies(documentId: string, cookieHeader: string): Promise<DocumentMetadata> {
    const response = await axiosRequest({
      method: 'get',
      url: process.env.RUNNING_ENV === 'localhost' 
        ? `http://localhost:3000/documents/${documentId}` 
        : `https://manage-case.${process.env.RUNNING_ENV}.platform.hmcts.net/documents/${documentId}`,
      headers: {
        Cookie: cookieHeader
      },
      responseType: 'json'
    });

    return response.data;
  }

  /**
   * Uploads a new copy of the test PDF through CDAM, ready to be attached to a
   * case of the given type. Each case should get its own document: CDAM links
   * a document to one case, so a document shared between cases can only be
   * read through the case it was last attached to.
   */
  async uploadCaseDocument(
    caseTypeId: string,
    fileName = 'test.pdf',
    jurisdictionId = 'DIVORCE'
  ): Promise<CaseDocument> {
    const form = new FormData();
    form.append('classification', 'PUBLIC');
    form.append('caseTypeId', caseTypeId);
    form.append('jurisdictionId', jurisdictionId);
    form.append(
      'files',
      new Blob([readFileSync(path.resolve(TEST_PDF))], { type: 'application/pdf' }),
      fileName
    );

    const response = await axiosRequest({
      method: 'post',
      url: `${config.cdamApiUrl}/cases/documents`,
      headers: await this.getHeaders(),
      data: form
    });

    const [document] = response.data.documents;
    return {
      document_url: document._links.self.href,
      document_binary_url: document._links.binary.href,
      document_filename: document.originalDocumentName,
      document_hash: document.hashToken
    };
  }
}

// A CCD Document field value.
export type CaseDocument = {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    document_hash?: string;
};

export type DocumentMetadata = {
    originalDocumentName: string;
    mimeType: string;
    size: number;
    _links: {
        self: { href: string };
        binary: { href: string };
    };
};
